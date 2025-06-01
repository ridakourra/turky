<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Absence;
use App\Models\HistoriqueDette;
use App\Models\HistoriqueSalaire;
use App\Models\HistoriqueTravail;
use App\Models\Salaire;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserController extends Controller
{
    /**
     * Afficher la liste des utilisateurs avec statistiques et filtres
     */
    public function index(Request $request)
    {
        $query = User::with(['salaire', 'historiqueDettes', 'absences'])
            ->withCount(['historiqueDettes', 'historiqueSalaires', 'historiqueTravails', 'absences']);

        // Recherche
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nom', 'LIKE', "%{$search}%")
                  ->orWhere('prenom', 'LIKE', "%{$search}%")
                  ->orWhere('telephone', 'LIKE', "%{$search}%")
                  ->orWhere('cin', 'LIKE', "%{$search}%");
            });
        }

        // Filtrage par rôle
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Filtrage par statut
        if ($request->filled('status')) {
            $query->where('est_actif', $request->status === 'active');
        }

        // Filtrage par dettes
        if ($request->filled('has_debt')) {
            if ($request->has_debt === 'yes') {
                $query->where('dettes', '>', 0);
            } else {
                $query->where('dettes', '<=', 0);
            }
        }

        // Tri
        $sortBy = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');

        $validSortColumns = ['nom', 'prenom', 'created_at', 'date_debut', 'dettes'];
        if (in_array($sortBy, $validSortColumns)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $users = $query->paginate(15)->withQueryString();

        // Statistiques générales
        $statistics = [
            'total_users' => User::count(),
            'active_users' => User::where('est_actif', true)->count(),
            'inactive_users' => User::where('est_actif', false)->count(),
            'total_debt' => User::sum('dettes'),
            'users_with_debt' => User::where('dettes', '>', 0)->count(),
            'this_month_registrations' => User::whereMonth('created_at', now()->month)
                                            ->whereYear('created_at', now()->year)
                                            ->count(),
            'employees_count' => User::whereIn('role', ['directeur', 'comptable', 'livreur'])->count(),
            'clients_count' => User::where('role', 'client')->count(),
        ];

        return Inertia::render('Users/Index', [
            'users' => $users,
            'statistics' => $statistics,
            'filters' => $request->only(['search', 'role', 'status', 'has_debt', 'sort_by', 'sort_direction']),
            'roles' => ['client', 'directeur', 'comptable', 'livreur'],
        ]);
    }

    /**
     * Afficher la page de création d'un nouvel utilisateur
     */
    public function create()
    {
        return Inertia::render('Users/Create', [
            'roles' => [
                'client' => 'Client',
                'directeur' => 'Directeur',
                'comptable' => 'Comptable',
                'livreur' => 'Livreur'
            ],
            'salary_types' => [
                'journalier' => 'Par jour',
                'horaire' => 'Par heure',
                'unite' => 'Par unité',
                'mensuel' => 'Mensuel'
            ]
        ]);
    }

    /**
     * Enregistrer un nouvel utilisateur
     */
    public function store(Request $request)
    {
        // تحديد قواعد التحقق حسب نوع المستخدم
        $rules = [
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'required|string|max:20|unique:users,telephone',
            'cin' => 'required|string|max:20|unique:users,cin',
            'adresse' => 'nullable|string|max:500',
            'role' => 'required|string|in:employe,directeur,comptable,livreur',
            'date_debut' => 'required|date',
            'est_actif' => 'boolean',

            // الراتب مطلوب لجميع الموظفين
            'salaire_montant' => 'required|numeric|min:0',
            'salaire_type' => 'required|string|in:journalier,horaire,unite,mensuel',
        ];

        // كلمة المرور مطلوبة فقط للمديرين والمحاسبين
        if (in_array($request->role, ['directeur', 'comptable'])) {
            $rules['password'] = 'required|string|min:8|confirmed';
        }

        $validated = $request->validate($rules, [
            'nom.required' => 'Le nom est requis',
            'prenom.required' => 'Le prénom est requis',
            'telephone.required' => 'Le téléphone est requis',
            'telephone.unique' => 'Ce numéro de téléphone est déjà utilisé',
            'cin.required' => 'Le CIN est requis',
            'cin.unique' => 'Ce CIN est déjà utilisé',
            'password.required' => 'Le mot de passe est requis pour ce rôle',
            'password.min' => 'Le mot de passe doit avoir au moins 8 caractères',
            'password.confirmed' => 'La confirmation du mot de passe ne correspond pas',
            'role.required' => 'Le rôle est requis',
            'date_debut.required' => 'La date de début est requise',
            'salaire_montant.required' => 'Le montant du salaire est requis',
            'salaire_type.required' => 'Le type de salaire est requis',
        ]);

        DB::transaction(function () use ($validated) {
            // إنشاء بيانات المستخدم الأساسية
            $userData = [
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'telephone' => $validated['telephone'],
                'cin' => $validated['cin'],
                'adresse' => $validated['adresse'] ?? null,
                'role' => $validated['role'],
                'date_debut' => $validated['date_debut'],
                'est_actif' => $validated['est_actif'] ?? true,
                'dettes' => 0, // الموظفين لا يبدأون بديون
            ];

            // إضافة كلمة المرور فقط للمديرين والمحاسبين
            if (in_array($validated['role'], ['directeur', 'comptable'])) {
                $userData['password'] = Hash::make($validated['password']);
            }

            $user = User::create($userData);

            // إنشاء راتب لجميع الموظفين (مطلوب)
            Salaire::create([
                'user_id' => $user->id,
                'type_travail' => $validated['salaire_type'],
                'montant' => $validated['salaire_montant'],
                'date_derniere_paiement' => now(),
            ]);
        });

        return redirect()->route('users.index')
                        ->with('success', 'Employé créé avec succès');
    }

    /**
     * Afficher les détails d'un utilisateur
     */
    public function show(User $user)
    {
        $user->load([
            'historiqueDettes' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            },
            'historiqueSalaires' => function($query) {
                $query->orderBy('date', 'desc')->limit(10);
            },
            'historiqueTravails' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            },
            'absences' => function($query) {
                $query->orderBy('created_at', 'desc')->limit(10);
            },
            'salaire'
        ]);

        // Statistiques de l'utilisateur
        $userStats = [
            'total_salaire_received' => $user->historiqueSalaires()->sum('montant'),
            'total_work_quantity' => $user->historiqueTravails()->sum('quatite'),
            'total_absences' => $user->absences()->count(),
            'justified_absences' => $user->absences()->where('justifie', true)->count(),
            'unjustified_absences' => $user->absences()->where('justifie', false)->count(),
            'last_salary_date' => $user->historiqueSalaires()->latest('date')->first()?->date,
            'months_worked' => $user->date_debut ?
                now()->diffInMonths(Carbon::parse($user->date_debut)) : 0,
            'current_month_absences' => $user->absences()->whereMonth('created_at', now()->month)->count(),
        ];

        return Inertia::render('Users/Show', [
            'user' => $user,
            'userStats' => $userStats,
        ]);
    }

    /**
     * Afficher la page d'édition
     */
    public function edit(User $user)
    {
        $user->load('salaire');

        return Inertia::render('Users/Edit', [
            'user' => $user,
            'roles' => [
                'client' => 'Client',
                'directeur' => 'Directeur',
                'comptable' => 'Comptable',
                'livreur' => 'Livreur'
            ],
            'salary_types' => [
                'journalier' => 'Par jour',
                'horaire' => 'Par heure',
                'unite' => 'Par unité',
                'mensuel' => 'Mensuel'
            ]
        ]);
    }

    /**
     * Mettre à jour un utilisateur
     */
    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'cin' => ['required', 'string', 'max:20', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:8|confirmed',
            'adresse' => 'nullable|string|max:500',
            'role' => 'required|string|in:client,directeur,comptable,livreur',
            'date_debut' => 'required|date',
            'est_actif' => 'boolean',
            'dettes' => 'nullable|numeric|min:0',

            // Champs salaire
            'salaire_montant' => 'nullable|numeric|min:0',
            'salaire_type' => 'nullable|string|in:journalier,horaire,unite,mensuel',
        ]);

        DB::transaction(function () use ($validated, $user) {
            $updateData = [
                'nom' => $validated['nom'],
                'prenom' => $validated['prenom'],
                'telephone' => $validated['telephone'],
                'cin' => $validated['cin'],
                'adresse' => $validated['adresse'] ?? null,
                'role' => $validated['role'],
                'date_debut' => $validated['date_debut'],
                'est_actif' => $validated['est_actif'] ?? true,
                'dettes' => $validated['dettes'] ?? 0,
            ];

            if (!empty($validated['password'])) {
                $updateData['password'] = Hash::make($validated['password']);
            }

            $user->update($updateData);

            // Mettre à jour ou créer le salaire pour les employés
            if (in_array($validated['role'], ['directeur', 'comptable', 'livreur'])) {
                if (isset($validated['salaire_montant']) && $validated['salaire_montant'] > 0) {
                    $user->salaire()->updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'type_travail' => $validated['salaire_type'],
                            'montant' => $validated['salaire_montant'],
                        ]
                    );
                }
            } else {
                // Supprimer le salaire si l'utilisateur devient client
                $user->salaire()->delete();
            }
        });

        return redirect()->route('users.show', $user)
                        ->with('success', 'Utilisateur mis à jour avec succès');
    }

    /**
     * Supprimer un utilisateur
     */
    public function destroy(User $user)
    {
        // Vérifier s'il n'y a pas de dépendances importantes
        if ($user->historiqueDettes()->count() > 0 ||
            $user->historiqueSalaires()->count() > 0 ||
            $user->historiqueTravails()->count() > 0) {

            return redirect()->route('users.index')
                           ->with('error', 'Impossible de supprimer cet utilisateur car il a des enregistrements associés');
        }

        DB::transaction(function () use ($user) {
            $user->absences()->delete();
            $user->salaire()->delete();
            $user->delete();
        });

        return redirect()->route('users.index')
                        ->with('success', 'Utilisateur supprimé avec succès');
    }

    /**
     * Basculer le statut de l'utilisateur
     */
    public function toggleStatus(User $user)
    {
        $user->update([
            'est_actif' => !$user->est_actif
        ]);

        $status = $user->est_actif ? 'activé' : 'désactivé';

        return redirect()->back()
                        ->with('success', "Utilisateur {$status} avec succès");
    }

    /**
     * Enregistrer une absence
     */
    public function recordAbsence(Request $request, User $user)
    {
        // Vérifier que c'est un employé
        if ($user->role === 'client') {
            return redirect()->back()
                           ->with('error', 'Impossible d\'enregistrer une absence pour un client');
        }

        $validated = $request->validate([
            'raison' => 'required|string|max:500',
            'justifie' => 'boolean',
            'preuve' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'note' => 'nullable|string|max:1000',
        ]);

        $absenceData = [
            'user_id' => $user->id,
            'raison' => $validated['raison'],
            'justifie' => $validated['justifie'] ?? false,
            'note' => $validated['note'] ?? null,
        ];

        // Gérer le fichier de preuve
        if ($request->hasFile('preuve')) {
            $path = $request->file('preuve')->store('absences', 'public');
            $absenceData['preuve'] = $path;
        }

        Absence::create($absenceData);

        return redirect()->back()
                        ->with('success', 'Absence enregistrée avec succès');
    }

    /**
     * Obtenir les absences d'un utilisateur
     */
    public function getAbsences(User $user)
    {
        $absences = $user->absences()
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return response()->json($absences);
    }

    /**
     * Recherche rapide d'utilisateurs
     */
    public function search(Request $request)
    {
        $search = $request->get('q', '');
        $role = $request->get('role', '');

        $query = User::where('nom', 'LIKE', "%{$search}%")
            ->orWhere('prenom', 'LIKE', "%{$search}%")
            ->orWhere('telephone', 'LIKE', "%{$search}%")
            ->orWhere('cin', 'LIKE', "%{$search}%");

        if ($role) {
            $query->where('role', $role);
        }

        $users = $query->select('id', 'nom', 'prenom', 'telephone', 'cin', 'role', 'est_actif')
            ->limit(10)
            ->get();

        return response()->json($users);
    }

    /**
     * Tableau de bord utilisateur
     */
    public function dashboard(User $user)
    {
        // Statistiques mensuelles des salaires
        $monthlySalaries = $user->historiqueSalaires()
            ->selectRaw('MONTH(date) as month, YEAR(date) as year, SUM(montant) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Statistiques mensuelles du travail
        $monthlyWork = $user->historiqueTravails()
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, SUM(quatite) as total')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(12)
            ->get();

        // Absences récentes
        $recentAbsences = $user->absences()
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        // Statistiques d'absence par mois
        $monthlyAbsences = $user->absences()
            ->selectRaw('MONTH(created_at) as month, YEAR(created_at) as year, COUNT(*) as total, SUM(justifie) as justified')
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->limit(6)
            ->get();

        return Inertia::render('Users/Dashboard', [
            'user' => $user->load('salaire'),
            'monthlySalaries' => $monthlySalaries,
            'monthlyWork' => $monthlyWork,
            'recentAbsences' => $recentAbsences,
            'monthlyAbsences' => $monthlyAbsences,
        ]);
    }

    /**
     * Exporter les utilisateurs
     */
    public function export(Request $request)
    {
        $users = User::with(['salaire'])
            ->when($request->filled('search'), function($query) use ($request) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('nom', 'LIKE', "%{$search}%")
                      ->orWhere('prenom', 'LIKE', "%{$search}%")
                      ->orWhere('telephone', 'LIKE', "%{$search}%");
                });
            })
            ->when($request->filled('role'), function($query) use ($request) {
                $query->where('role', $request->role);
            })
            ->get();

        $filename = 'utilisateurs_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response()->streamDownload(function () use ($users) {
            $file = fopen('php://output', 'w');

            // En-têtes
            fputcsv($file, [
                'Prénom', 'Nom', 'Téléphone', 'CIN', 'Adresse',
                'Rôle', 'Date début', 'Statut', 'Dettes', 'Salaire', 'Type salaire'
            ]);

            // Données
            foreach ($users as $user) {
                fputcsv($file, [
                    $user->prenom,
                    $user->nom,
                    $user->telephone,
                    $user->cin,
                    $user->adresse,
                    $user->role,
                    $user->date_debut->format('Y-m-d'),
                    $user->est_actif ? 'Actif' : 'Inactif',
                    $user->dettes,
                    $user->salaire?->montant ?? 'N/A',
                    $user->salaire?->type_travail ?? 'N/A'
                ]);
            }

            fclose($file);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ]);
    }
}
