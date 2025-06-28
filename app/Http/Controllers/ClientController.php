<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Commande;
use App\Models\RapportDette;
use App\Models\RapportLocationEnginLourd;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Client::query()
            ->withCount(['commandes', 'rapportsDettes', 'rapportsLocationEnginsLourds'])
            ->withSum('rapportsDettes', 'montant');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('adresse', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('dettes_min')) {
            $query->where('dettes', '>=', $request->dettes_min);
        }

        if ($request->filled('dettes_max')) {
            $query->where('dettes', '<=', $request->dettes_max);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to);
        }

        // Sorting
        $sortField = $request->get('sort_field', 'nom');
        $sortDirection = $request->get('sort_direction', 'asc');

        $allowedSortFields = ['nom', 'cin', 'telephone', 'dettes', 'created_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $clients = $query->paginate(10)->withQueryString();

        // Statistics
        $stats = [
            'total_clients' => Client::count(),
            'total_dettes' => Client::sum('dettes'),
            'clients_avec_dettes' => Client::where('dettes', '>', 0)->count(),
            'moyenne_dettes' => Client::avg('dettes'),
        ];

        return Inertia::render('Clients/Index', [
            'clients' => $clients,
            'stats' => $stats,
            'filters' => $request->only(['search', 'dettes_min', 'dettes_max', 'date_from', 'date_to']),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Clients/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cin' => 'required|string|unique:clients,cin|max:20',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'dettes' => 'nullable|numeric|min:0',
        ], [
            'nom.required' => 'Le nom est obligatoire.',
            'cin.required' => 'Le CIN est obligatoire.',
            'cin.unique' => 'Ce CIN existe déjà.',
            'dettes.min' => 'Les dettes ne peuvent pas être négatives.',
        ]);

        $validated['dettes'] = $validated['dettes'] ?? 0;

        $client = Client::create($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load([
            'commandes' => function ($query) {
                $query->latest()->with(['lines.produit', 'livraisons']);
            },
            'rapportsDettes' => function ($query) {
                $query->latest();
            },
            'rapportsLocationEnginsLourds' => function ($query) {
                $query->latest()->with('enginLourd');
            }
        ]);

        // Paginate related data for better performance
        $commandes = $client->commandes()->latest()
            ->with(['lines.produit', 'livraisons'])
            ->paginate(5, ['*'], 'commandes_page');

        $rapportsDettes = $client->rapportsDettes()->latest()
            ->paginate(5, ['*'], 'dettes_page');

        $rapportsLocation = $client->rapportsLocationEnginsLourds()->latest()
            ->with('enginLourd')
            ->paginate(5, ['*'], 'location_page');

        // Statistics for this client
        $stats = [
            'total_commandes' => $client->commandes()->count(),
            'commandes_en_cours' => $client->commandes()->where('status', 'pending')->count(),
            'total_achats' => $client->commandes()->sum('montant_totale'),
            'total_locations' => $client->rapportsLocationEnginsLourds()->sum('montant_totale'),
        ];

        return Inertia::render('Clients/Show', [
            'client' => $client,
            'commandes' => $commandes,
            'rapportsDettes' => $rapportsDettes,
            'rapportsLocation' => $rapportsLocation,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Client $client)
    {
        return Inertia::render('Clients/Edit', [
            'client' => $client,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Client $client)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cin' => ['required', 'string', 'max:20', Rule::unique('clients', 'cin')->ignore($client->id)],
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'dettes' => 'nullable|numeric|min:0',
        ], [
            'nom.required' => 'Le nom est obligatoire.',
            'cin.required' => 'Le CIN est obligatoire.',
            'cin.unique' => 'Ce CIN existe déjà.',
            'dettes.min' => 'Les dettes ne peuvent pas être négatives.',
        ]);

        $validated['dettes'] = $validated['dettes'] ?? 0;

        $client->update($validated);

        return redirect()->route('clients.index')
            ->with('success', 'Client modifié avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Client $client)
    {
        try {
            // Check if client has related records
            if ($client->commandes()->exists()) {
                return back()->with('error', 'Impossible de supprimer ce client car il a des commandes associées.');
            }

            $client->delete();

            return redirect()->route('clients.index')
                ->with('success', 'Client supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la suppression du client.');
        }
    }

    /**
     * Reset client debts to zero
     */
    public function resetDettes(Client $client)
    {
        DB::transaction(function () use ($client) {
            // Create a debt report for the reset
            RapportDette::create([
                'client_id' => $client->id,
                'montant' => -$client->dettes,
                'status' => 'payé',
                'date_operation' => now(),
                'remarques' => 'Remise à zéro des dettes',
            ]);

            // Reset client debts
            $client->update(['dettes' => 0]);
        });

        return back()->with('success', 'Dettes du client remises à zéro.');
    }

    /**
     * Export clients data
     */
    public function export(Request $request)
    {
        $query = Client::query();

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('adresse', 'like', "%{$search}%");
            });
        }

        $clients = $query->get();

        $csvData = "Nom,CIN,Téléphone,Adresse,Dettes,Date de création\n";

        foreach ($clients as $client) {
            $csvData .= sprintf(
                '"%s","%s","%s","%s","%s","%s"' . "\n",
                $client->nom,
                $client->cin,
                $client->telephone ?? '',
                $client->adresse ?? '',
                $client->dettes,
                $client->created_at->format('d/m/Y')
            );
        }

        return response($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="clients_' . date('Y-m-d') . '.csv"',
        ]);
    }

    /**
     * Get available engines for rental
     */
    public function getAvailableEngines()
    {
        $engines = \App\Models\EnginLourd::where('statut', 'available')->get();

        return response()->json($engines);
    }

    /**
     * Rent an engine to a client
     */
    public function rentEngine(Request $request, Client $client)
    {
        $validated = $request->validate([
            'engin_lourd_id' => 'required|exists:engins_lourds,id',
            'quantite' => 'required|integer|min:1',
            'prix_par_heure' => 'required|numeric|min:0',
            'date_operation' => 'required|date',
            'remarques' => 'nullable|string|max:500',
        ]);

        $engin = \App\Models\EnginLourd::find($validated['engin_lourd_id']);

        if ($engin->statut !== 'available') {
            return back()->with('error', 'Cet engin n\'est pas disponible.');
        }

        $montantTotal = $validated['quantite'] * $validated['prix_par_heure'];

        DB::transaction(function () use ($client, $engin, $validated, $montantTotal) {
            // Create rental report
            RapportLocationEnginLourd::create([
                'engin_lourd_id' => $validated['engin_lourd_id'],
                'client_id' => $client->id,
                'quantite' => $validated['quantite'],
                'prix_par_heure' => $validated['prix_par_heure'],
                'montant_totale' => $montantTotal,
                'date_operation' => $validated['date_operation'],
                'remarques' => $validated['remarques'],
            ]);

            // Update engine status
            $engin->update(['statut' => 'rented']);
        });

        return back()->with('success', 'Location d\'engin enregistrée avec succès.');
    }
}