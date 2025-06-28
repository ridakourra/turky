<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use App\Models\Employer;
use App\Models\CommandeFournisseur;
use App\Models\Livraison;
use App\Models\RapportDepenseVehicule;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class VehiculeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Vehicule::with('employer');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%")
                  ->orWhere('modele', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%")
                  ->orWhereHas('employer', function ($employerQuery) use ($search) {
                      $employerQuery->where('nom', 'like', "%{$search}%");
                  });
            });
        }

        // Advanced filtering
        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('marque')) {
            $query->where('marque', 'like', "%{$request->marque}%");
        }

        if ($request->filled('employer_id')) {
            $query->where('employer_id', $request->employer_id);
        }

        if ($request->filled('annee_min')) {
            $query->where('annee', '>=', $request->annee_min);
        }

        if ($request->filled('annee_max')) {
            $query->where('annee', '<=', $request->annee_max);
        }

        if ($request->filled('kilometrage_max')) {
            $query->where('kilometrage', '<=', $request->kilometrage_max);
        }

        // Date range filtering
        if ($request->filled('date_assurance_from')) {
            $query->where('date_assurance', '>=', $request->date_assurance_from);
        }

        if ($request->filled('date_assurance_to')) {
            $query->where('date_assurance', '<=', $request->date_assurance_to);
        }

        // Sorting
        $sortField = $request->get('sort', 'nom');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $vehicules = $query->paginate(10)->withQueryString();

        // Get filter options
        $employers = Employer::select('id', 'nom')->where('actif', true)->get();
        $statuts = ['available', 'in_use', 'maintenance', 'out_of_service'];
        $types = Vehicule::distinct()->whereNotNull('type')->pluck('type');
        $marques = Vehicule::distinct()->whereNotNull('marque')->pluck('marque');

        return Inertia::render('Vehicules/Index', [
            'vehicules' => $vehicules,
            'filters' => $request->only([
                'search', 'statut', 'type', 'marque', 'employer_id',
                'annee_min', 'annee_max', 'kilometrage_max',
                'date_assurance_from', 'date_assurance_to'
            ]),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection
            ],
            'filterOptions' => [
                'employers' => $employers,
                'statuts' => $statuts,
                'types' => $types,
                'marques' => $marques,
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $employers = Employer::select('id', 'nom')->where('actif', true)->get();

        return Inertia::render('Vehicules/Create', [
            'employers' => $employers
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'matricule' => 'required|string|max:255|unique:vehicules,matricule',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'capacite' => 'nullable|string|max:255',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'kilometrage' => 'nullable|integer|min:0',
            'carburant_type' => 'nullable|string|max:255',
            'numero_chassis' => 'nullable|string|max:255',
            'numero_moteur' => 'nullable|string|max:255',
            'date_assurance' => 'nullable|date',
            'statut' => 'nullable|string|in:available,in_use,maintenance,out_of_service',
            'employer_id' => 'nullable|exists:employers,id'
        ]);

        if (!isset($validated['statut'])) {
            $validated['statut'] = 'available';
        }

        Vehicule::create($validated);

        return redirect()->route('vehicules.index')
            ->with('success', 'Véhicule créé avec succès.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Vehicule $vehicule)
    {
        $vehicule->load('employer');

        // Get related data with pagination and filtering
        $commandesQuery = $vehicule->commandesFournisseurs()->with(['fournisseur', 'employer']);
        $livraisonsQuery = $vehicule->livraisons()->with(['commande.client', 'employer']);
        $rapportsQuery = $vehicule->rapportsDepenses();

        // Apply filters for commandes fournisseurs
        if ($request->filled('commandes_date_from')) {
            $commandesQuery->where('date', '>=', $request->commandes_date_from);
        }
        if ($request->filled('commandes_date_to')) {
            $commandesQuery->where('date', '<=', $request->commandes_date_to);
        }

        // Apply filters for livraisons
        if ($request->filled('livraisons_status')) {
            $livraisonsQuery->where('status', $request->livraisons_status);
        }
        if ($request->filled('livraisons_date_from')) {
            $livraisonsQuery->where('date', '>=', $request->livraisons_date_from);
        }
        if ($request->filled('livraisons_date_to')) {
            $livraisonsQuery->where('date', '<=', $request->livraisons_date_to);
        }

        // Apply filters for rapports depenses
        if ($request->filled('rapports_type')) {
            $rapportsQuery->where('type_depense', $request->rapports_type);
        }
        if ($request->filled('rapports_date_from')) {
            $rapportsQuery->where('date_operation', '>=', $request->rapports_date_from);
        }
        if ($request->filled('rapports_date_to')) {
            $rapportsQuery->where('date_operation', '<=', $request->rapports_date_to);
        }

        $commandes = $commandesQuery->orderBy('date', 'desc')->paginate(5, ['*'], 'commandes_page');
        $livraisons = $livraisonsQuery->orderBy('date', 'desc')->paginate(5, ['*'], 'livraisons_page');
        $rapports = $rapportsQuery->orderBy('date_operation', 'desc')->paginate(5, ['*'], 'rapports_page');

        // Calculate statistics
        $stats = [
            'total_commandes' => $vehicule->commandesFournisseurs()->count(),
            'total_livraisons' => $vehicule->livraisons()->count(),
            'total_depenses' => $vehicule->rapportsDepenses()->sum('montant'),
            'livraisons_en_cours' => $vehicule->livraisons()->where('status', 'pending')->count(),
        ];

        return Inertia::render('Vehicules/Show', [
            'vehicule' => $vehicule,
            'commandes' => $commandes,
            'livraisons' => $livraisons,
            'rapports' => $rapports,
            'stats' => $stats,
            'filters' => $request->only([
                'commandes_date_from', 'commandes_date_to',
                'livraisons_status', 'livraisons_date_from', 'livraisons_date_to',
                'rapports_type', 'rapports_date_from', 'rapports_date_to'
            ])
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vehicule $vehicule)
    {
        $employers = Employer::select('id', 'nom')->where('actif', true)->get();

        return Inertia::render('Vehicules/Edit', [
            'vehicule' => $vehicule,
            'employers' => $employers
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vehicule $vehicule)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'matricule' => [
                'required',
                'string',
                'max:255',
                Rule::unique('vehicules')->ignore($vehicule->id)
            ],
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'type' => 'nullable|string|max:255',
            'capacite' => 'nullable|string|max:255',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'kilometrage' => 'nullable|integer|min:0',
            'carburant_type' => 'nullable|string|max:255',
            'numero_chassis' => 'nullable|string|max:255',
            'numero_moteur' => 'nullable|string|max:255',
            'date_assurance' => 'nullable|date',
            'statut' => 'required|string|in:available,in_use,maintenance,out_of_service',
            'employer_id' => 'nullable|exists:employers,id'
        ]);

        $vehicule->update($validated);

        return redirect()->route('vehicules.index')
            ->with('success', 'Véhicule mis à jour avec succès.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vehicule $vehicule)
    {
        // Check if vehicule has related records
        if ($vehicule->commandesFournisseurs()->exists() ||
            $vehicule->livraisons()->exists() ||
            $vehicule->rapportsDepenses()->exists()) {
            return redirect()->route('vehicules.index')
                ->with('error', 'Impossible de supprimer ce véhicule car il a des enregistrements associés.');
        }

        $vehicule->delete();

        return redirect()->route('vehicules.index')
            ->with('success', 'Véhicule supprimé avec succès.');
    }

    /**
     * Export vehicules data
     */
    public function export(Request $request)
    {
        $query = Vehicule::with('employer');

        // Apply same filters as index
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%")
                  ->orWhere('modele', 'like', "%{$search}%");
            });
        }

        // Add other filters...

        $vehicules = $query->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="vehicules_' . date('Y-m-d') . '.csv"',
        ];

        $callback = function() use ($vehicules) {
            $file = fopen('php://output', 'w');

            // CSV headers
            fputcsv($file, [
                'Nom', 'Matricule', 'Marque', 'Modèle', 'Type', 'Capacité',
                'Année', 'Kilométrage', 'Type Carburant', 'Statut', 'Employé Assigné'
            ]);

            foreach ($vehicules as $vehicule) {
                fputcsv($file, [
                    $vehicule->nom,
                    $vehicule->matricule,
                    $vehicule->marque,
                    $vehicule->modele,
                    $vehicule->type,
                    $vehicule->capacite,
                    $vehicule->annee,
                    $vehicule->kilometrage,
                    $vehicule->carburant_type,
                    $vehicule->statut,
                    $vehicule->employer ? $vehicule->employer->nom : 'Non assigné'
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Bulk delete vehicules
     */
    public function bulkDelete(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:vehicules,id'
        ]);

        $vehicules = Vehicule::whereIn('id', $validated['ids'])->get();

        foreach ($vehicules as $vehicule) {
            if ($vehicule->commandesFournisseurs()->exists() ||
                $vehicule->livraisons()->exists() ||
                $vehicule->rapportsDepenses()->exists()) {
                return response()->json([
                    'error' => 'Certains véhicules ne peuvent pas être supprimés car ils ont des enregistrements associés.'
                ], 400);
            }
        }

        Vehicule::whereIn('id', $validated['ids'])->delete();

        return response()->json([
            'message' => count($validated['ids']) . ' véhicule(s) supprimé(s) avec succès.'
        ]);
    }
}