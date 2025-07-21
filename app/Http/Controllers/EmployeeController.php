<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Salaire;
use App\Models\Produit;
use App\Models\Absence;
use App\Models\BudgetChauffeur;
use App\Models\HistoriqueTravail;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class EmployeeController extends Controller
{
    public function index(Request $request)
    {
        $query = Employee::with(['salaires.produit']);

        // Search
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nom_complet', 'like', '%' . $request->search . '%')
                  ->orWhere('cin', 'like', '%' . $request->search . '%')
                  ->orWhere('telephone', 'like', '%' . $request->search . '%');
            });
        }

        // Filter by role
        if ($request->role && $request->role !== 'all') {
            $query->where('role', $request->role);
        }

        // Filter by status
        if ($request->statut && $request->statut !== 'all') {
            $query->where('actif', $request->statut === 'actif');
        }

        // Sorting
        $sortField = $request->sort ?? 'nom_complet';
        $sortDirection = $request->direction ?? 'asc';
        $query->orderBy($sortField, $sortDirection);

        $employees = $query->paginate(10)->withQueryString();

        return Inertia::render('Employees/Index', [
            'employees' => $employees,
            'filters' => $request->only(['search', 'role', 'statut', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        $produits = Produit::all();
        
        return Inertia::render('Employees/Create', [
            'produits' => $produits
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom_complet' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'addresse' => 'nullable|string|max:500',
            'cin' => 'required|string|unique:employees,cin',
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:directeur,comptable,chauffeur,ouvrier',
            'date_embauche' => 'required|date',
            'actif' => 'boolean',
            'salaires' => 'required|array|min:1',
            'salaires.*.type' => 'required|in:mensuel,journalier,horaire,par_produit',
            'salaires.*.montant' => 'required|numeric|min:0',
            'salaires.*.produit_id' => 'nullable|exists:produits,id'
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $employee = Employee::create($validated);

        // Create salaires
        foreach ($request->salaires as $salaireData) {
            $employee->salaires()->create([
                'type' => $salaireData['type'],
                'montant' => $salaireData['montant'],
                'produit_id' => $salaireData['produit_id'] ?? null
            ]);
        }

        return redirect()->route('employees.index')
            ->with('success', 'Employé créé avec succès.');
    }

    public function show(Employee $employee)
    {
        $employee->load([
            'salaires.produit',
            'absences' => function ($query) {
                $query->orderBy('date_debut', 'desc')->take(10);
            },
            'budgetChauffeurs' => function ($query) {
                $query->orderBy('date_attribution', 'desc')->take(10);
            },
            'vehicules',
            'commandesClients' => function ($query) {
                $query->orderBy('created_at', 'desc')->take(10);
            }
        ]);

        // Calculate salary amounts
        $salaireCalculations = $this->calculateSalaryAmounts($employee);

        return Inertia::render('Employees/Show', [
            'employee' => $employee,
            'salaireCalculations' => $salaireCalculations,
            'produits' => Produit::all()
        ]);
    }

    public function edit(Employee $employee)
    {
        $employee->load('salaires.produit');
        $produits = Produit::all();
        
        return Inertia::render('Employees/Edit', [
            'employee' => $employee,
            'produits' => $produits
        ]);
    }

    public function update(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'nom_complet' => 'required|string|max:255',
            'telephone' => 'nullable|string|max:20',
            'addresse' => 'nullable|string|max:500',
            'cin' => ['required', 'string', Rule::unique('employees')->ignore($employee->id)],
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:directeur,comptable,chauffeur,ouvrier',
            'date_embauche' => 'required|date',
            'actif' => 'boolean',
            'salaires' => 'required|array|min:1',
            'salaires.*.type' => 'required|in:mensuel,journalier,horaire,par_produit',
            'salaires.*.montant' => 'required|numeric|min:0',
            'salaires.*.produit_id' => 'nullable|exists:produits,id'
        ]);

        if ($validated['password']) {
            $validated['password'] = Hash::make($validated['password']);
        } else {
            unset($validated['password']);
        }

        $employee->update($validated);

        // Update salaires
        $employee->salaires()->delete();
        foreach ($request->salaires as $salaireData) {
            $employee->salaires()->create([
                'type' => $salaireData['type'],
                'montant' => $salaireData['montant'],
                'produit_id' => $salaireData['produit_id'] ?? null
            ]);
        }

        return redirect()->route('employees.index')
            ->with('success', 'Employé mis à jour avec succès.');
    }

    public function destroy(Employee $employee)
    {
        $employee->delete();
        
        return redirect()->route('employees.index')
            ->with('success', 'Employé supprimé avec succès.');
    }

    public function storeAbsence(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'date_debut' => 'required|date',
            'date_fin' => 'nullable|date|after_or_equal:date_debut',
            'type_absence' => 'required|in:maladie,conge,non_justifie,autre',
            'justification' => 'nullable|string',
            'commentaire' => 'nullable|string'
        ]);

        $employee->absences()->create($validated);

        return back()->with('success', 'Absence ajoutée avec succès.');
    }

    public function storeBudget(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'date_attribution' => 'required|date'
        ]);

        $validated['statut'] = 'attribue';
        $employee->budgetChauffeurs()->create($validated);

        return back()->with('success', 'Budget ajouté avec succès.');
    }

    public function storeHistoriqueTravail(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'salaire_id' => 'required|exists:salaires,id',
            'quantite' => 'required|integer|min:1',
            'date' => 'required|date'
        ]);

        HistoriqueTravail::create($validated);

        return back()->with('success', 'Historique de travail ajouté avec succès.');
    }

    public function paySalary(Request $request, Employee $employee)
    {
        $validated = $request->validate([
            'montant' => 'required|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        // Create transaction
        Transaction::create([
            'type_transaction' => 'sortie',
            'reference_type' => 'App\\Models\\Employee',
            'reference_id' => $employee->id,
            'montant' => $validated['montant'],
            'description' => $validated['description'] ?? 'Paiement salaire pour ' . $employee->nom_complet
        ]);

        // Update last salary date
        $employee->update(['date_dernier_salaire' => now()]);

        return back()->with('success', 'Salaire payé avec succès.');
    }

    private function calculateSalaryAmounts(Employee $employee)
    {
        $calculations = [];
        
        foreach ($employee->salaires as $salaire) {
            $calculation = [
                'salaire' => $salaire,
                'montant_base' => $salaire->montant,
                'montant_a_payer' => 0
            ];

            switch ($salaire->type) {
                case 'mensuel':
                    $calculation['montant_a_payer'] = $salaire->montant;
                    break;
                    
                case 'journalier':
                case 'horaire':
                    $historique = HistoriqueTravail::where('salaire_id', $salaire->id)
                        ->where('date', '>=', $employee->date_dernier_salaire ?? $employee->date_embauche)
                        ->sum('quantite');
                    $calculation['montant_a_payer'] = $historique * $salaire->montant;
                    $calculation['quantite_travaillee'] = $historique;
                    break;
                    
                case 'par_produit':
                    $historique = HistoriqueTravail::where('salaire_id', $salaire->id)
                        ->where('date', '>=', $employee->date_dernier_salaire ?? $employee->date_embauche)
                        ->sum('quantite');
                    $calculation['montant_a_payer'] = $historique * $salaire->montant;
                    $calculation['quantite_produite'] = $historique;
                    break;
            }
            
            $calculations[] = $calculation;
        }
        
        return $calculations;
    }
}