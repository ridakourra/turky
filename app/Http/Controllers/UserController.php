<?php

namespace App\Http\Controllers;

use App\Models\Salaire;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        // Search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('prenom', 'like', "%{$search}%")
                  ->orWhere('cin', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('est_actif', $request->status === 'active');
        }

        // Date range filter
        if ($request->filled('date_from')) {
            $query->whereDate('date_debut', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('date_debut', '<=', $request->date_to);
        }

        // Debt filter
        if ($request->filled('debt_status')) {
            switch ($request->debt_status) {
                case 'with_debt':
                    $query->where('dettes', '>', 0);
                    break;
                case 'no_debt':
                    $query->where('dettes', '=', 0);
                    break;
            }
        }

        // Sort by
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        $allowedSortFields = ['nom', 'prenom', 'role', 'date_debut', 'dettes', 'created_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        // Load relationships for better performance
        $query->withCount(['absences', 'historiqueDettes', 'historiqueSalaires']);

        // Get per_page from request, default to 10, max 100
        $perPage = $request->get('per_page', 10);
        $perPage = min(max((int)$perPage, 5), 100);

        // Get page from request, default to 1
        $page = max((int)$request->get('page', 1), 1);

        // Paginate
        $users = $query->paginate($perPage, ['*'], 'page', $page)->withQueryString();

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only([
                'search', 'role', 'status', 'date_from', 'date_to',
                'debt_status', 'sort_by', 'sort_direction', 'per_page', 'page'
            ]),
            'roles' => [
                'client' => 'Client',
                'directeur' => 'Directeur',
                'comptable' => 'Comptable',
                'livreur' => 'Livreur'
            ]
        ]);
    }




    public function create()
    {

        return Inertia::render('Users/Create');
    }


    public function store(Request $request)
    {
        // Validation rules
        $rules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|unique:users,cin|max:20',
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'role' => 'required|in:client,directeur,comptable,livreur',
            'date_debut' => 'nullable|date',
            'est_actif' => 'boolean'
        ];

        // Add password validation for roles that need accounts
        if (in_array($request->role, ['directeur', 'comptable'])) {
            $rules['password'] = ['required', 'string', Password::min(6), 'confirmed'];
        }

        // Add salary validation for roles that need salary
        if ($request->role !== 'client') {
            $rules['type_travail'] = 'required|in:par_jour,par_mois,par_produit';
            $rules['montant_salaire'] = 'required|numeric|min:0';
        }

        $validated = $request->validate($rules);

        // Create user
        $userData = [
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'cin' => $validated['cin'],
            'telephone' => $validated['telephone'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
            'role' => $validated['role'],
            'date_debut' => $validated['date_debut'] ?? now(),
            'est_actif' => $validated['est_actif'] ?? true
        ];

        // Add password for roles that need accounts
        if (in_array($validated['role'], ['directeur', 'comptable'])) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user = User::create($userData);

        // Create salary record for roles that need salary
        if ($validated['role'] !== 'client') {
            Salaire::create([
                'user_id' => $user->id,
                'type_travail' => $validated['type_travail'],
                'montant' => $validated['montant_salaire'],
                'date_derniere_paiement' => null
            ]);
        }

        return redirect()->route('users.index')
            ->with('success', 'Utilisateur créé avec succès!');
    }





    public function show(User $user)
    {
        // Load all relationships with counts and latest records
        $user->load([
            'absences' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'salaire',
            'historiqueDettes' => function ($query) {
                $query->orderBy('created_at', 'desc');
            },
            'historiqueSalaires' => function ($query) {
                $query->orderBy('date', 'desc');
            },
            'historiqueTravails' => function ($query) {
                $query->orderBy('created_at', 'desc');
            }
        ]);

        // Load counts for statistics
        $user->loadCount([
            'absences',
            'historiqueDettes',
            'historiqueSalaires',
            'historiqueTravails'
        ]);

        // Calculate statistics based on user role
        $statistics = $this->calculateUserStatistics($user);

        // Get recent activities
        $recentActivities = $this->getRecentActivities($user);

        return Inertia::render('Users/Show', [
            'user' => $user,
            'statistics' => $statistics,
            'recentActivities' => $recentActivities,
            'canEdit' => true, // You can add permission logic here
            'canDelete' => true, // You can add permission logic here
        ]);
    }

    private function calculateUserStatistics(User $user)
    {
        $statistics = [
            'totalAbsences' => $user->absences_count,
            'justifiedAbsences' => $user->absences()->where('justifie', true)->count(),
            'unjustifiedAbsences' => $user->absences()->where('justifie', false)->count(),
        ];

        // Role-specific statistics
        switch ($user->role) {
            case 'client':
                $statistics = array_merge($statistics, [
                    'totalDettes' => $user->dettes ?? 0,
                    'totalDetteHistory' => $user->historique_dettes_count,
                    'paidDettes' => $user->historiqueDettes()->where('status', 'paid')->sum('montant'),
                    'pendingDettes' => $user->historiqueDettes()->where('status', 'pending')->sum('montant'),
                ]);
                break;

            case 'livreur':
            case 'directeur':
            case 'comptable':
                $currentSalary = $user->salaire->first();
                $totalSalaryPaid = $user->historiqueSalaires()->sum('montant');
                $lastSalaryDate = $user->historiqueSalaires()->max('date');

                $statistics = array_merge($statistics, [
                    'currentSalary' => $currentSalary ? $currentSalary->montant : 0,
                    'salaryType' => $currentSalary ? $currentSalary->type_travail : null,
                    'totalSalaryPaid' => $totalSalaryPaid,
                    'lastSalaryDate' => $lastSalaryDate,
                    'totalSalaryPayments' => $user->historique_salaires_count,
                ]);

                // Additional stats for workers with production tracking
                if (in_array($user->role, ['livreur'])) {
                    $statistics = array_merge($statistics, [
                        'totalWorkHistory' => $user->historique_travails_count,
                        'totalQuantityProduced' => $user->historiqueTravails()->sum('quatite'),
                        'averageDaily' => $user->historique_travails_count > 0
                            ? round($user->historiqueTravails()->sum('quatite') / max($user->historique_travails_count, 1), 2)
                            : 0,
                    ]);
                }
                break;
        }

        return $statistics;
    }

    private function getRecentActivities(User $user)
    {
        $activities = collect();

        // Recent absences
        $user->absences()->take(3)->get()->each(function ($absence) use ($activities) {
            $activities->push([
                'type' => 'absence',
                'title' => 'Absence enregistrée',
                'description' => $absence->raison,
                'date' => $absence->created_at,
                'status' => $absence->justifie ? 'justified' : 'unjustified',
                'icon' => 'user-x'
            ]);
        });

        // Role-specific recent activities
        switch ($user->role) {
            case 'client':
                // Recent debt history
                $user->historiqueDettes()->take(3)->get()->each(function ($dette) use ($activities) {
                    $activities->push([
                        'type' => 'dette',
                        'title' => 'Dette ' . ($dette->status === 'paid' ? 'payée' : 'ajoutée'),
                        'description' => number_format($dette->montant, 2) . ' MAD',
                        'date' => $dette->created_at,
                        'status' => $dette->status,
                        'icon' => $dette->status === 'paid' ? 'check-circle' : 'credit-card'
                    ]);
                });
                break;

            default:
                // Recent salary payments
                $user->historiqueSalaires()->take(3)->get()->each(function ($salaire) use ($activities) {
                    $activities->push([
                        'type' => 'salaire',
                        'title' => 'Salaire payé',
                        'description' => number_format($salaire->montant, 2) . ' MAD',
                        'date' => $salaire->date,
                        'status' => 'paid',
                        'icon' => 'banknote'
                    ]);
                });

                // Recent work history (for workers)
                if (in_array($user->role, ['livreur'])) {
                    $user->historiqueTravails()->take(3)->get()->each(function ($travail) use ($activities) {
                        $activities->push([
                            'type' => 'travail',
                            'title' => 'Travail enregistré',
                            'description' => $travail->quatite . ' unités produites',
                            'date' => $travail->created_at,
                            'status' => 'completed',
                            'icon' => 'package'
                        ]);
                    });
                }
                break;
        }

        return $activities->sortByDesc('date')->take(10)->values();
    }






    public function edit(User $user)
    {
        // Load the necessary relationships
        $user->load([
            'salaire' => function($query) {
                $query->latest();
            },
            'absences',
            'historiqueSalaires',
            'historiqueDettes'
        ]);

        // Get current salary info
        $currentSalary = $user->salaire()->latest()->first();

        // Get statistics for the user
        $statistics = [
            'total_absences' => $user->absences()->count(),
            'absences_justified' => $user->absences()->where('justifie', true)->count(),
            'total_dette' => $user->historiqueDettes()->where('status', 'non_payé')->sum('montant'),
            'derniere_paie' => $user->historiqueSalaires()->latest()->first()?->date,
            'salaire_actuel' => $currentSalary?->montant ?? 0,
        ];

        // Get recent activities
        $recentActivities = collect();

        // Add absences to activities
        $user->absences()
            ->latest()
            ->take(5)
            ->get()
            ->each(function ($absence) use ($recentActivities) {
                $recentActivities->push([
                    'type' => 'absence',
                    'title' => 'Absence enregistrée',
                    'description' => $absence->raison,
                    'date' => $absence->created_at,
                    'status' => $absence->justifie ? 'justified' : 'unjustified'
                ]);
            });

        // Add salary payments to activities
        $user->historiqueSalaires()
            ->latest()
            ->take(5)
            ->get()
            ->each(function ($paiement) use ($recentActivities) {
                $recentActivities->push([
                    'type' => 'salaire',
                    'title' => 'Paiement de salaire',
                    'description' => "Montant: " . number_format($paiement->montant, 2) . ' DH',
                    'date' => $paiement->date,
                    'status' => 'completed'
                ]);
            });

        // Add debt history to activities
        $user->historiqueDettes()
            ->latest()
            ->take(5)
            ->get()
            ->each(function ($dette) use ($recentActivities) {
                $recentActivities->push([
                    'type' => 'dette',
                    'title' => 'Dette enregistrée',
                    'description' => "Montant: " . number_format($dette->montant, 2) . ' DH',
                    'date' => $dette->created_at,
                    'status' => $dette->status === 'payé' ? 'paid' : 'pending'
                ]);
            });

        // Sort activities by date
        $recentActivities = $recentActivities
            ->sortByDesc('date')
            ->take(10)
            ->values();

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'statistics' => $statistics,
            'recentActivities' => $recentActivities,
            'roles' => [
                'client' => 'Client',
                'directeur' => 'Directeur',
                'comptable' => 'Comptable',
                'livreur' => 'Livreur'
            ],
            'salary_types' => [
                'par_jour' => 'Par Jour',
                'par_mois' => 'Par Mois',
                'par_produit' => 'Par Produit'
            ]
        ]);
    }

     public function update(Request $request, User $user)
    {
        $rules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'cin' => 'required|string|unique:users,cin,' . $user->id,
            'telephone' => 'nullable|string|max:20',
            'adresse' => 'nullable|string|max:500',
            'role' => 'required|in:client,directeur,comptable,livreur',
            'date_debut' => 'required|date',
            'est_actif' => 'boolean'
        ];

        // Add password validation if provided
        if ($request->filled('password')) {
            $rules['password'] = ['required', 'string', 'min:4', 'confirmed'];
        }

        // Add salary validation for roles that need salary
        if ($request->role !== 'client') {
            $rules['type_travail'] = 'required|in:par_jour,par_mois,par_produit';
            $rules['montant_salaire'] = 'required|numeric|min:0';
        }

        $validated = $request->validate($rules);

        // Update user data
        $userData = [
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'cin' => $validated['cin'],
            'telephone' => $validated['telephone'] ?? null,
            'adresse' => $validated['adresse'] ?? null,
            'role' => $validated['role'],
            'date_debut' => $validated['date_debut'],
            'est_actif' => $validated['est_actif'] ?? true
        ];

        // Add password if provided
        if ($request->filled('password')) {
            $userData['password'] = Hash::make($validated['password']);
        }

        $user->update($userData);

        // Handle salary updates
        if ($validated['role'] !== 'client') {
            // Validate that type_travail is one of the allowed values
            $allowedTypes = ['par_jour', 'par_mois', 'par_produit'];
            if (!in_array($validated['type_travail'], $allowedTypes)) {
                return back()->withErrors(['type_travail' => 'Type de travail invalide.']);
            }

            // Check if user already has a salary record
            $existingSalary = $user->salaire()->latest()->first();

            $salaryData = [
                'type_travail' => $validated['type_travail'],
                'montant' => number_format((float) $validated['montant_salaire'], 2, '.', ''),
            ];

            if ($existingSalary) {
                // Update existing salary record
                $existingSalary->update($salaryData);
            } else {
                // Create new salary record
                $salaryData['user_id'] = $user->id;
                $salaryData['date_derniere_paiement'] = null;

                try {
                    Salaire::create($salaryData);
                } catch (\Exception $e) {
                    \Log::error('Salary creation error: ' . $e->getMessage());
                    return back()->withErrors(['montant_salaire' => 'Erreur lors de la création du salaire.']);
                }
            }
        } else {
            // If role changed to client, you might want to handle existing salary records
            // Option 1: Delete salary records (uncomment if needed)
            // $user->salaire()->delete();

            // Option 2: Keep them for historical purposes (current implementation)
            // Do nothing - keep existing salary records
        }

        return redirect()
            ->route('users.index')
            ->with('success', 'Utilisateur mis à jour avec succès.');
    }



    public function destroy(User $user){
        $user->delete();
        return redirect()->route('users.index');
    }

}
