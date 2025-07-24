<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use App\Models\Employee;
use App\Models\CommandeClient;
use App\Models\CommandeFournisseur;
use App\Models\DepenseMachine;
use App\Models\UtilisationCarburant;
use App\Models\Carburant;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VehiculeController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicule::with(['chauffeur']);

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('matricule', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%")
                  ->orWhere('modele', 'like', "%{$search}%")
                  ->orWhereHas('chauffeur', function ($q) use ($search) {
                      $q->where('nom_complet', 'like', "%{$search}%");
                  });
            });
        }

        // Filtres
        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type_vehicule', $request->type);
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('chauffeur') && $request->chauffeur !== 'all') {
            if ($request->chauffeur === 'avec_chauffeur') {
                $query->whereNotNull('chauffeur_id');
            } else {
                $query->whereNull('chauffeur_id');
            }
        }

        // Tri
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $vehicules = $query->paginate(10)->withQueryString();

        return Inertia::render('Vehicules/Index', [
            'vehicules' => $vehicules,
            'filters' => $request->only(['search', 'type', 'statut', 'chauffeur', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        $chauffeurs = Employee::where('role', 'chauffeur')
            ->orderBy('nom_complet')
            ->get();

        return Inertia::render('Vehicules/Create', [
            'chauffeurs' => $chauffeurs
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'matricule' => 'required|string|unique:vehicules,matricule',
            'marque' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'type_vehicule' => 'required|in:camion,voiture,autre',
            'capacite' => 'nullable|numeric|min:0',
            'statut' => 'required|in:actif,en_maintenance,hors_service',
            'date_acquisition' => 'nullable|date',
            'prix_acquisition' => 'nullable|numeric|min:0',
            'chauffeur_id' => 'nullable|exists:employees,id'
        ], [
            'matricule.required' => 'Le matricule est obligatoire.',
            'matricule.unique' => 'Ce matricule existe déjà.',
            'marque.required' => 'La marque est obligatoire.',
            'type_vehicule.required' => 'Le type de véhicule est obligatoire.',
            'statut.required' => 'Le statut est obligatoire.',
            'chauffeur_id.exists' => 'Le chauffeur sélectionné n\'existe pas.'
        ]);

        Vehicule::create($validated);

        return redirect()->route('vehicules.index')
            ->with('success', 'Véhicule créé avec succès.');
    }

    public function show(Vehicule $vehicule)
    {
        $vehicule->load([
            'chauffeur',
            'commandesClients' => function ($query) {
                $query->with(['client', 'paiement'])
                      ->orderBy('created_at', 'desc')
                      ->take(10);
            },
            'depensesMachines' => function ($query) {
                $query->orderBy('date_depense', 'desc')
                      ->take(10);
            },
            'utilisationsCarburant' => function ($query) {
                $query->orderBy('date_utilisation', 'desc')
                      ->take(10);
            }
        ]);

        // return response()->json($vehicule);

        // Commandes clients paginées
        $commandesClients = CommandeClient::where('vehicule_id', $vehicule->id)
            ->with(['client', 'paiement'])
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'commandes_page');

        // Commandes fournisseurs paginées
        $commandesFournisseurs = CommandeFournisseur::whereHas('lignesCommandes', function ($query) use ($vehicule) {
            $query->where('vehicule_id', $vehicule->id);
        })
            ->with(['fournisseur', 'lignesCommandes'])
            ->orderBy('created_at', 'desc')
            ->paginate(10, ['*'], 'fournisseurs_page');

        // Statistiques des dépenses
        $totalDepenses = $vehicule->depensesMachines()->sum('montant');
        $depensesParType = $vehicule->depensesMachines()
            ->select('type_depense', DB::raw('SUM(montant) as total'))
            ->groupBy('type_depense')
            ->get();

        // Consommation carburant
        $consommationCarburant = $vehicule->utilisationsCarburant()->sum('quantite');

        // Stock carburant disponible
        $carburant = Carburant::first();

        return Inertia::render('Vehicules/Show', [
            'vehicule' => $vehicule,
            'commandesClients' => $commandesClients,
            'depensesMachines' => $vehicule->depensesMachines,
            'utilisationsCarburant' => $vehicule->utilisationsCarburant,
            'carburants' => [$carburant],
            'stats' => [
                'total_commandes' => $commandesClients->total(),
                'total_depenses' => $totalDepenses,
                'total_carburant' => $consommationCarburant
            ]
        ]);
    }

    public function edit(Vehicule $vehicule)
    {
        $chauffeurs = Employee::where('role', 'chauffeur')
            ->orderBy('nom_complet')
            ->get();

        // dd($chauffeurs);

        return Inertia::render('Vehicules/Edit', [
            'vehicule' => $vehicule,
            'chauffeurs' => $chauffeurs
        ]);
    }

    public function update(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'matricule' => 'required|string|unique:vehicules,matricule,' . $vehicule->id,
            'marque' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'type_vehicule' => 'required|in:camion,voiture,autre',
            'capacite' => 'nullable|numeric|min:0',
            'statut' => 'required|in:actif,en_maintenance,hors_service',
            'date_acquisition' => 'nullable|date',
            'prix_acquisition' => 'nullable|numeric|min:0',
            'chauffeur_id' => 'nullable|exists:employees,id'
        ], [
            'matricule.required' => 'Le matricule est obligatoire.',
            'matricule.unique' => 'Ce matricule existe déjà.',
            'marque.required' => 'La marque est obligatoire.',
            'type_vehicule.required' => 'Le type de véhicule est obligatoire.',
            'statut.required' => 'Le statut est obligatoire.',
            'chauffeur_id.exists' => 'Le chauffeur sélectionné n\'existe pas.'
        ]);

        $vehicule->update($validated);

        return redirect()->route('vehicules.show', $vehicule)
            ->with('success', 'Véhicule mis à jour avec succès.');
    }

    public function destroy(Vehicule $vehicule)
    {
        try {
            $vehicule->delete();
            return redirect()->route('vehicules.index')
                ->with('success', 'Véhicule supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->route('vehicules.index')
                ->with('error', 'Impossible de supprimer ce véhicule car il est lié à des commandes.');
        }
    }

    public function storeDepense(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'type_depense' => 'required|in:carburant,maintenance,reparation,assurance,autre',
            'montant' => 'required|numeric|min:0',
            'date_depense' => 'required|date',
            'description' => 'nullable|string',
            'facture_reference' => 'nullable|string|max:255'
        ], [
            'type_depense.required' => 'Le type de dépense est obligatoire.',
            'montant.required' => 'Le montant est obligatoire.',
            'montant.min' => 'Le montant doit être positif.',
            'date_depense.required' => 'La date de dépense est obligatoire.'
        ]);

        DB::transaction(function () use ($validated, $vehicule) {
            // Créer la dépense
            DepenseMachine::create([
                'machine_type' => Vehicule::class,
                'machine_id' => $vehicule->id,
                'type_depense' => $validated['type_depense'],
                'montant' => $validated['montant'],
                'date_depense' => $validated['date_depense'],
                'description' => "Dépense {$validated['type_depense']} pour véhicule {$vehicule->matricule}",
                'facture_reference' => ''
            ]);

            Transaction::create([
                'type_transaction' => 'sortie',
                'reference_type' => Vehicule::class,
                'reference_id' => $vehicule->id,
                'montant' => $validated['montant'],
                'date_transaction' => $validated['date_depense'],
                'description' => "Dépense {$validated['type_depense']} pour véhicule {$vehicule->matricule}"
            ]);
        });

        return redirect()->route('vehicules.show', $vehicule)
            ->with('success', 'Dépense ajoutée avec succès.');
    }

    public function refillCarburant(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'quantite' => 'required|numeric|min:0.1',
            'date_utilisation' => 'nullable'
        ], [
            'quantite.required' => 'La quantité est obligatoire.',
            'quantite.min' => 'La quantité doit être supérieure à 0.',
        ]);

        $carburant = Carburant::first();

        if (!$carburant || $carburant->niveau_actuel < $validated['quantite']) {
            return redirect()->route('vehicules.show', $vehicule)
                ->with('error', 'Stock de carburant insuffisant.');
        }

        DB::transaction(function () use ($validated, $vehicule, $carburant) {


            $vehicule->utilisationsCarburant()->create([
                'machine_type' => Vehicule::class,
                'machine_id' => $vehicule->id,
                'quantite' => $validated['quantite'],
                'date_utilisation' => $validated['date_utilisation'],
                'commentaire' => "Ajouter {$validated['quantite']}L de carburant pour véhicule {$vehicule->matricule}"
            ]);

            // Mettre à jour le stock de carburant
            $carburant->update([
                'niveau_actuel' => $carburant->niveau_actuel - $validated['quantite']
            ]);
        });

        return redirect()->route('vehicules.show', $vehicule)
            ->with('success', 'Ravitaillement effectué avec succès.');
    }
}
