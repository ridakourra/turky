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
        $query = User::query()
            ->with(['salaire', 'historiqueDettes' => function($q) {
                $q->where('status', 'non_payé');
            }]);

        // Search
        if ($request->search) {
            $query->where(function($q) use ($request) {
                $q->where('nom', 'like', "%{$request->search}%")
                  ->orWhere('prenom', 'like', "%{$request->search}%")
                  ->orWhere('cin', 'like', "%{$request->search}%");
            });
        }

        // Role filter
        if ($request->role) {
            $query->where('role', $request->role);
        }

        // Status filter
        if ($request->has('est_actif')) {
            $query->where('est_actif', $request->est_actif);
        }

        $users = $query->latest()->paginate(10);

        return Inertia::render('Users/Index', [
            'users' => $users,
            'filters' => $request->only(['search', 'role', 'est_actif'])
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

    // public function store(Request $request)
    // {
    //     $validated = $request->validate([
    //         'nom' => 'required|string|max:255',
    //         'prenom' => 'required|string|max:255',
    //         'telephone' => 'nullable|string|max:255',
    //         'cin' => 'required|string|unique:users,cin',
    //         'adresse' => 'nullable|string|max:500',
    //         'role' => ['required', Rule::in(['client', 'directeur', 'comptable', 'livreur'])],
    //         'date_debut' => 'nullable|date',
    //         'est_actif' => 'boolean',

    //         // Password fields (only for directeur and comptable)
    //         'password' => 'nullable|string|min:6|confirmed',
    //         'password_confirmation' => 'nullable|string|min:6',

    //         // Salary fields (for directeur, comptable, livreur)
    //         'type_travail' => ['nullable', Rule::in(['par_jour', 'par_heure', 'par_unite'])],
    //         'montant_salaire' => 'nullable|numeric|min:0',
    //     ]);

    //     // Handle password based on role
    //     if (in_array($validated['role'], ['directeur', 'comptable'])) {
    //         if (empty($validated['password'])) {
    //             return back()->withErrors(['password' => 'Le mot de passe est requis pour ce rôle.']);
    //         }
    //         $validated['password'] = Hash::make($validated['password']);
    //     } else {
    //         // Remove password for roles that don't need accounts
    //         unset($validated['password']);
    //     }

    //     // Remove salary confirmation field
    //     unset($validated['password_confirmation']);

    //     // Create user
    //     $user = User::create([
    //         'nom' => $validated['nom'],
    //         'prenom' => $validated['prenom'],
    //         'telephone' => $validated['telephone'],
    //         'cin' => $validated['cin'],
    //         'adresse' => $validated['adresse'],
    //         'role' => $validated['role'],
    //         'date_debut' => $validated['date_debut'],
    //         'est_actif' => $validated['est_actif'] ?? true,
    //         'password' => $validated['password'] ?? null,
    //     ]);

    //     // Create salary record if applicable (not for clients)
    //     if ($validated['role'] !== 'client' && !empty($validated['type_travail']) && !empty($validated['montant_salaire'])) {
    //         Salaire::create([
    //             'user_id' => $user->id,
    //             'type_travail' => $validated['type_travail'],
    //             'montant' => $validated['montant_salaire'],
    //             'date_derniere_paiement' => null,
    //         ]);
    //     }

    //     return redirect()->route('users.index')->with('success', 'Utilisateur créé avec succès.');
    // }

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
