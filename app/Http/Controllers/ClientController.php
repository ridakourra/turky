<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\CommandeClient;
use App\Models\LocationEnginLourd;
use App\Models\Paiement;
use App\Models\Vehicule;
use App\Models\Employee;
use App\Models\EnginLourd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom_complet', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('addresse', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('has_debts')) {
            if ($request->has_debts === 'yes') {
                $query->where('dettes_actuelle', '>', 0);
            } elseif ($request->has_debts === 'no') {
                $query->where('dettes_actuelle', '<=', 0);
            }
        }

        if ($request->filled('has_orders')) {
            if ($request->has_orders === 'yes') {
                $query->whereHas('commandesClients');
            } elseif ($request->has_orders === 'no') {
                $query->whereDoesntHave('commandesClients');
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        
        $allowedSorts = ['nom_complet', 'telephone', 'dettes_actuelle', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $clients = $query->withCount(['commandesClients', 'locationEnginsLourds'])
                        ->paginate(10)
                        ->withQueryString();

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'filters' => $request->only(['search', 'has_debts', 'has_orders', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_complet' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'addresse' => 'nullable|string|max:500',
            'dettes_actuelle' => 'nullable|numeric|min:0'
        ], [
            'nom_complet.required' => 'Le nom complet est obligatoire.',
            'nom_complet.max' => 'Le nom complet ne peut pas dépasser 255 caractères.',
            'telephone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'addresse.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            'dettes_actuelle.numeric' => 'Les dettes actuelles doivent être un nombre.',
            'dettes_actuelle.min' => 'Les dettes actuelles ne peuvent pas être négatives.'
        ]);

        Client::create($validated);

        return redirect()->route('clients.index')
                        ->with('success', 'Client créé avec succès.');
    }

    public function show(Client $client)
    {
        // Calculate actual debts from unpaid payments
        $dettesCalculees = Paiement::whereHas('commande', function ($query) use ($client) {
            $query->where('client_id', $client->id);
        })
        ->whereIn('statut', ['non_paye', 'partiellement_paye'])
        ->sum(DB::raw('montant - montant_paye'));

        // Get client's orders with pagination
        $commandes = CommandeClient::where('client_id', $client->id)
                                  ->with(['vehicule', 'chauffeur', 'paiement'])
                                  ->orderBy('date_commande', 'desc')
                                  ->paginate(10, ['*'], 'commandes_page');

        // Get current equipment rentals
        $locationsActuelles = LocationEnginLourd::where('client_id', $client->id)
                                               ->where('statut', 'en_cours')
                                               ->with('engin')
                                               ->get();

        // Get all equipment rentals with pagination
        $locations = LocationEnginLourd::where('client_id', $client->id)
                                      ->with('engin')
                                      ->orderBy('date_debut', 'desc')
                                      ->paginate(10, ['*'], 'locations_page');

        // Get available vehicles and drivers for new orders
        $vehicules = Vehicule::all();
        $chauffeurs = Employee::all();
        $enginsLourds = EnginLourd::where('statut', 'actif')->get();

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'dettesCalculees' => $dettesCalculees,
            'commandes' => $commandes,
            'locationsActuelles' => $locationsActuelles,
            'locations' => $locations,
            'vehicules' => $vehicules,
            'chauffeurs' => $chauffeurs,
            'enginsLourds' => $enginsLourds
        ]);
    }

    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client
        ]);
    }

    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'nom_complet' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'addresse' => 'nullable|string|max:500',
            'dettes_actuelle' => 'nullable|numeric|min:0'
        ], [
            'nom_complet.required' => 'Le nom complet est obligatoire.',
            'nom_complet.max' => 'Le nom complet ne peut pas dépasser 255 caractères.',
            'telephone.max' => 'Le téléphone ne peut pas dépasser 20 caractères.',
            'addresse.max' => 'L\'adresse ne peut pas dépasser 500 caractères.',
            'dettes_actuelle.numeric' => 'Les dettes actuelles doivent être un nombre.',
            'dettes_actuelle.min' => 'Les dettes actuelles ne peuvent pas être négatives.'
        ]);

        $client->update($validated);

        return redirect()->route('clients.show', $client)
                        ->with('success', 'Client mis à jour avec succès.');
    }

    public function destroy(Client $client)
    {
        try {
            $client->delete();
            return redirect()->route('clients.index')
                            ->with('success', 'Client supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->route('clients.index')
                            ->with('error', 'Impossible de supprimer ce client car il a des commandes ou locations associées.');
        }
    }

    public function storeCommande(Request $request, Client $client)
    {
        $validated = $request->validate([
            'date_commande' => 'required|date',
            'vehicule_id' => 'required|exists:vehicules,id',
            'chauffeur_id' => 'required|exists:employees,id',
            'commentaire' => 'nullable|string|max:1000'
        ], [
            'date_commande.required' => 'La date de commande est obligatoire.',
            'vehicule_id.required' => 'Le véhicule est obligatoire.',
            'vehicule_id.exists' => 'Le véhicule sélectionné n\'existe pas.',
            'chauffeur_id.required' => 'Le chauffeur est obligatoire.',
            'chauffeur_id.exists' => 'Le chauffeur sélectionné n\'existe pas.',
            'commentaire.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.'
        ]);

        $validated['client_id'] = $client->id;
        $validated['montant_total'] = 0;
        $validated['profit_net'] = 0;

        CommandeClient::create($validated);

        return redirect()->route('clients.show', $client)
                        ->with('success', 'Commande créée avec succès.');
    }

    public function storeLocation(Request $request, Client $client)
    {
        $validated = $request->validate([
            'engin_id' => 'required|exists:engins_lourds,id',
            'date_debut' => 'required|date',
            'date_fin' => 'required|date|after:date_debut',
            'prix_location' => 'required|numeric|min:0',
            'commentaire' => 'nullable|string|max:1000'
        ], [
            'engin_id.required' => 'L\'engin lourd est obligatoire.',
            'engin_id.exists' => 'L\'engin lourd sélectionné n\'existe pas.',
            'date_debut.required' => 'La date de début est obligatoire.',
            'date_fin.required' => 'La date de fin est obligatoire.',
            'date_fin.after' => 'La date de fin doit être après la date de début.',
            'prix_location.required' => 'Le prix de location est obligatoire.',
            'prix_location.numeric' => 'Le prix de location doit être un nombre.',
            'prix_location.min' => 'Le prix de location ne peut pas être négatif.',
            'commentaire.max' => 'Le commentaire ne peut pas dépasser 1000 caractères.'
        ]);

        $validated['client_id'] = $client->id;
        $validated['statut'] = 'en_cours';

        LocationEnginLourd::create($validated);

        return redirect()->route('clients.show', $client)
                        ->with('success', 'Location d\'engin lourd créée avec succès.');
    }
}