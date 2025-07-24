<?php

namespace App\Http\Controllers;

use App\Models\EnginLourd;
use App\Models\Client;
use App\Models\Carburant;
use App\Models\DepenseMachine;
use App\Models\UtilisationCarburant;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class EnginLourdController extends Controller
{
    public function index(Request $request)
    {
        $query = EnginLourd::query();

        // Filtrage
        if ($request->filled('search')) {
            $query->where(function ($q) use ($request) {
                $q->where('reference', 'like', '%' . $request->search . '%')
                  ->orWhere('marque', 'like', '%' . $request->search . '%')
                  ->orWhere('modele', 'like', '%' . $request->search . '%');
            });
        }

        if ($request->filled('type_engin') && $request->type_engin !== 'all') {
            $query->where('type_engin', $request->type_engin);
        }

        if ($request->filled('statut') && $request->statut !== 'all') {
            $query->where('statut', $request->statut);
        }

        // Tri
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $enginsLourds = $query->paginate(10)->withQueryString();

        return Inertia::render('EnginsLourds/Index', [
            'enginsLourds' => $enginsLourds,
            'filters' => $request->only(['search', 'type_engin', 'statut']),
            'sort' => $request->only(['sort', 'direction'])
        ]);
    }

    public function create()
    {
        return Inertia::render('EnginsLourds/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'reference' => 'required|string|unique:engins_lourds,reference',
            'marque' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'type_engin' => 'required|in:pelleteuse,bulldozer,grue,autre',
            'capacite' => 'nullable|numeric|min:0',
            'statut' => 'nullable|in:actif,en_maintenance,hors_service',
            'date_acquisition' => 'nullable|date',
            'prix_acquisition' => 'nullable|numeric|min:0'
        ]);

        EnginLourd::create($validated);

        return redirect()->route('engins-lourds.index')
            ->with('success', 'Engin lourd créé avec succès.');
    }

    public function show(EnginLourd $enginLourd)
    {
        $enginLourd->load([
            'locationsEnginsLourds.client',
            'utilisationsCarburant',
            'depensesMachines',
            'transactions'
        ]);

        // Statistiques
        $totalLocations = $enginLourd->locationsEnginsLourds->count();
        $totalDepenses = $enginLourd->depensesMachines->sum('montant');
        $totalCarburant = $enginLourd->utilisationsCarburant->sum('quantite');
        $revenusLocations = $enginLourd->locationsEnginsLourds->sum('prix_location');

        // Récupérer les clients pour le formulaire
        $clients = Client::select('id', 'nom_complet')->get();

        // Récupérer les informations du carburant
        $carburant = Carburant::first();

        return Inertia::render('EnginsLourds/Show', [
            'enginLourd' => $enginLourd,
            'clients' => $clients,
            'carburant' => $carburant,
            'statistiques' => [
                'total_locations' => $totalLocations,
                'total_depenses' => $totalDepenses,
                'total_carburant' => $totalCarburant,
                'revenus_locations' => $revenusLocations
            ]
        ]);
    }

    public function edit(EnginLourd $enginLourd)
    {
        return Inertia::render('EnginsLourds/Edit', [
            'enginLourd' => $enginLourd
        ]);
    }

    public function update(Request $request, EnginLourd $enginLourd)
    {
        $validated = $request->validate([
            'reference' => 'required|string|unique:engins_lourds,reference,' . $enginLourd->id,
            'marque' => 'required|string|max:255',
            'modele' => 'nullable|string|max:255',
            'type_engin' => 'required|in:pelleteuse,bulldozer,grue,autre',
            'capacite' => 'nullable|numeric|min:0',
            'statut' => 'nullable|in:actif,en_maintenance,hors_service',
            'date_acquisition' => 'nullable|date',
            'prix_acquisition' => 'nullable|numeric|min:0'
        ]);

        $enginLourd->update($validated);

        return redirect()->route('engins-lourds.show', $enginLourd)
            ->with('success', 'Engin lourd mis à jour avec succès.');
    }

    public function destroy(EnginLourd $enginLourd)
    {
        $enginLourd->delete();

        return redirect()->route('engins-lourds.index')
            ->with('success', 'Engin lourd supprimé avec succès.');
    }

    public function addDepense(Request $request, EnginLourd $enginLourd)
    {
        $validated = $request->validate([
            'type_depense' => 'required|in:carburant,maintenance,reparation,assurance,autre',
            'montant' => 'required|numeric|min:0',
            'date_depense' => 'required|date',
            'description' => 'nullable|string',
            'facture_reference' => 'nullable|string'
        ]);

        DB::transaction(function () use ($validated, $enginLourd) {
            // Créer la dépense
            $depense = $enginLourd->depensesMachines()->create($validated);

            // Créer la transaction
            Transaction::create([
                'type_transaction' => 'sortie',
                'reference_type' => EnginLourd::class,
                'reference_id' => $enginLourd->id,
                'montant' => $validated['montant'],
                'description' => 'Dépense ' . $validated['type_depense'] . ' - ' . ($validated['description'] ?? '')
            ]);
        });

        return redirect()->route('engins-lourds.show', $enginLourd)
            ->with('success', 'Dépense ajoutée avec succès.');
    }

    public function addCarburant(Request $request, EnginLourd $enginLourd)
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
            return redirect()->route('engins-lourds.show', $enginLourd)
                ->with('error', 'Stock de carburant insuffisant.');
        }

        DB::transaction(function () use ($validated, $enginLourd, $carburant) {


            $enginLourd->utilisationsCarburant()->create([
                'machine_type' => EnginLourd::class,
                'machine_id' => $enginLourd->id,
                'quantite' => $validated['quantite'],
                'date_utilisation' => $validated['date_utilisation'],
                'commentaire' => "Ajouter {$validated['quantite']}L de carburant pour engin lourd {$enginLourd->matricule}"
            ]);

            // Mettre à jour le stock de carburant
            $carburant->update([
                'niveau_actuel' => $carburant->niveau_actuel - $validated['quantite']
            ]);
        });

        return redirect()->route('enginLourds.show', $enginLourd)
            ->with('success', 'Ravitaillement effectué avec succès.');
    }
}
