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
        $user->load(['absences', 'salaire', 'historiqueDettes', 'historiqueSalaires']);

        return Inertia::render('Users/Show', [
            'user' => $user
        ]);
    }

    public function edit(User $user)
    {
        $user->load('salaire');

        return Inertia::render('Users/Edit', [
            'user' => $user
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'nullable|string',
            'cin' => 'required|string|unique:users,cin,' . $user->id,
            'password' => 'nullable|string|min:6',
            'adresse' => 'nullable|string',
            'role' => 'required|in:client,directeur,comptable,livreur',
            'date_debut' => 'required|date',
            'est_actif' => 'boolean'
        ]);

        $user->update($validated);

        return redirect()->route('users.index');
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('users.index');
    }

}
