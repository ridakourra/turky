<?php

namespace App\Http\Controllers;

use App\Models\Employer;
use App\Models\Produit;
use App\Models\Absence;
use App\Models\BudgetChiffeur;
use App\Models\Salaire;
use App\Models\Vehicule;
use App\Models\EnginLourd;
use App\Models\Livraison;
use App\Models\CommandeFournisseur;
use App\Models\RapportSalaire;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class EmployerController extends Controller
{
    public function index(Request $request)
    {
        $query = Employer::with(['salaires.produit', 'vehicules', 'enginsLourds']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('adresse', 'like', "%{$search}%")
                  ->orWhere('fonction', 'like', "%{$search}%")
                  ->orWhere('details', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('actif')) {
            $query->where('actif', $request->actif === 'true');
        }

        if ($request->filled('fonction')) {
            $query->where('fonction', 'like', "%{$request->fonction}%");
        }

        if ($request->filled('date_embauche_from')) {
            $query->whereDate('date_embauche', '>=', $request->date_embauche_from);
        }

        if ($request->filled('date_embauche_to')) {
            $query->whereDate('date_embauche', '<=', $request->date_embauche_to);
        }

        if ($request->filled('has_vehicule')) {
            if ($request->has_vehicule === 'true') {
                $query->whereHas('vehicules');
            } else {
                $query->whereDoesntHave('vehicules');
            }
        }

        if ($request->filled('has_engin')) {
            if ($request->has_engin === 'true') {
                $query->whereHas('enginsLourds');
            } else {
                $query->whereDoesntHave('enginsLourds');
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'nom');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $employers = $query->paginate(15)->withQueryString();

        // Get statistics
        $stats = [
            'total' => Employer::count(),
            'actifs' => Employer::where('actif', true)->count(),
            'inactifs' => Employer::where('actif', false)->count(),
            'with_vehicules' => Employer::whereHas('vehicules')->count(),
            'with_engins' => Employer::whereHas('enginsLourds')->count(),
        ];

        return Inertia::render('Employers/Index', [
            'employers' => $employers,
            'stats' => $stats,
            'filters' => $request->only(['search', 'actif', 'fonction', 'date_embauche_from', 'date_embauche_to', 'has_vehicule', 'has_engin']),
            'sort' => $request->only(['sort', 'direction'])
        ]);
    }

    public function create()
    {
        $produits = Produit::orderBy('nom')->get(['id', 'nom', 'unite', 'prix']);
        $vehicules = Vehicule::where('statut', 'available')->orderBy('nom')->get(['id', 'nom', 'matricule']);
        $enginsLourds = EnginLourd::where('statut', 'available')->orderBy('nom')->get(['id', 'nom', 'reference']);

        return Inertia::render('Employers/Create', [
            'produits' => $produits,
            'vehicules' => $vehicules,
            'enginsLourds' => $enginsLourds
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cin' => 'required|string|unique:employers,cin|max:20',
            'password' => 'required|string|min:6',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'details' => 'nullable|string|max:1000',
            'actif' => 'boolean',
            'date_embauche' => 'nullable|date',
            'fonction' => 'nullable|string|max:100',
            'salaire_type' => 'required|in:mensuel,journalier,horaire,unitaire',
            'salaire_montant' => 'required_unless:salaire_type,unitaire|numeric|min:0',
            'salaire_produits' => 'required_if:salaire_type,unitaire|array',
            'salaire_produits.*.produit_id' => 'required_with:salaire_produits|exists:produits,id',
            'salaire_produits.*.prix' => 'required_with:salaire_produits|numeric|min:0',
        ]);

        $validated['password'] = Hash::make($validated['password']);
        $validated['actif'] = $validated['actif'] ?? true;

        $employer = Employer::create($validated);

        // Create salary records
        if ($validated['salaire_type'] === 'unitaire') {
            foreach ($validated['salaire_produits'] as $salaireProduit) {
                Salaire::create([
                    'employer_id' => $employer->id,
                    'type' => 'unitaire',
                    'prix' => $salaireProduit['prix'],
                    'produit_id' => $salaireProduit['produit_id']
                ]);
            }
        } else {
            Salaire::create([
                'employer_id' => $employer->id,
                'type' => $validated['salaire_type'],
                'prix' => $validated['salaire_montant']
            ]);
        }

        return redirect()->route('employers.index')
            ->with('success', 'Employé créé avec succès.');
    }

    public function show(Employer $employer)
    {
        $employer->load([
            'salaires.produit',
            'absences' => function ($q) {
                $q->orderBy('date', 'desc');
            },
            'budgetsChiffeurs' => function ($q) {
                $q->orderBy('date', 'desc');
            },
            'vehicules',
            'enginsLourds',
            'livraisons.commande.client',
            'commandesFournisseurs.fournisseur',
            'rapportsSalaires' => function ($q) {
                $q->orderBy('date_operation', 'desc');
            }
        ]);

        // Get statistics for this employer
        $stats = [
            'total_absences' => $employer->absences->count(),
            'absences_justifiees' => $employer->absences->where('justifie', true)->count(),
            'total_livraisons' => $employer->livraisons->count(),
            'total_budget' => $employer->budgetsChiffeurs->sum('montant'),
            'budget_current_month' => $employer->budgetsChiffeurs()
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('montant'),
            'total_salaire_reports' => $employer->rapportsSalaires->sum('montant')
        ];

        return Inertia::render('Employers/Show', [
            'employer' => $employer,
            'stats' => $stats
        ]);
    }

    public function edit(Employer $employer)
    {
        $employer->load(['salaires.produit']);
        $produits = Produit::orderBy('nom')->get(['id', 'nom', 'unite', 'prix']);
        $vehicules = Vehicule::where('statut', 'available')
            ->orWhere('employer_id', $employer->id)
            ->orderBy('nom')->get(['id', 'nom', 'matricule']);
        $enginsLourds = EnginLourd::where('statut', 'available')
            ->orWhere('employer_id', $employer->id)
            ->orderBy('nom')->get(['id', 'nom', 'reference']);

        return Inertia::render('Employers/Edit', [
            'employer' => $employer,
            'produits' => $produits,
            'vehicules' => $vehicules,
            'enginsLourds' => $enginsLourds
        ]);
    }

    public function update(Request $request, Employer $employer)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'cin' => ['required', 'string', 'max:20', Rule::unique('employers')->ignore($employer->id)],
            'password' => 'nullable|string|min:6',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'details' => 'nullable|string|max:1000',
            'actif' => 'boolean',
            'date_embauche' => 'nullable|date',
            'fonction' => 'nullable|string|max:100',
            'salaire_type' => 'required|in:mensuel,journalier,horaire,unitaire',
            'salaire_montant' => 'required_unless:salaire_type,unitaire|numeric|min:0',
            'salaire_produits' => 'required_if:salaire_type,unitaire|array',
            'salaire_produits.*.produit_id' => 'required_with:salaire_produits|exists:produits,id',
            'salaire_produits.*.prix' => 'required_with:salaire_produits|numeric|min:0',
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $validated['actif'] = $validated['actif'] ?? true;

        $employer->update($validated);

        // Update salary records
        $employer->salaires()->delete();

        if ($validated['salaire_type'] === 'unitaire') {
            foreach ($validated['salaire_produits'] as $salaireProduit) {
                Salaire::create([
                    'employer_id' => $employer->id,
                    'type' => 'unitaire',
                    'prix' => $salaireProduit['prix'],
                    'produit_id' => $salaireProduit['produit_id']
                ]);
            }
        } else {
            Salaire::create([
                'employer_id' => $employer->id,
                'type' => $validated['salaire_type'],
                'prix' => $validated['salaire_montant']
            ]);
        }

        return redirect()->route('employers.index')
            ->with('success', 'Employé modifié avec succès.');
    }

    public function destroy(Employer $employer)
    {
        $employer->delete();

        return redirect()->route('employers.index')
            ->with('success', 'Employé supprimé avec succès.');
    }

    public function addAbsence(Request $request, Employer $employer)
    {
        $validated = $request->validate([
            'justifie' => 'boolean',
            'raison' => 'nullable|string|max:500',
            'date' => 'required|date'
        ]);

        $validated['employer_id'] = $employer->id;
        $validated['justifie'] = $validated['justifie'] ?? false;

        Absence::create($validated);

        return redirect()->back()
            ->with('success', 'Absence ajoutée avec succès.');
    }

    public function addBudget(Request $request, Employer $employer)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'date' => 'required|date',
            'note' => 'nullable|string|max:500'
        ]);

        $validated['employer_id'] = $employer->id;

        BudgetChiffeur::create($validated);

        return redirect()->back()
            ->with('success', 'Budget ajouté avec succès.');
    }

    public function export(Request $request)
    {
        // Implementation for export functionality
        return response()->json(['message' => 'Export functionality to be implemented']);
    }
}