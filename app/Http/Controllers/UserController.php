<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
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
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'telephone' => 'nullable|string',
            'cin' => 'required|string|unique:users',
            'password' => 'required_if:role,directeur,comptable|string|min:6',
            'adresse' => 'nullable|string',
            'role' => 'required|in:client,directeur,comptable,livreur',
            'date_debut' => 'required|date',
            'est_actif' => 'boolean',
            'salaire_montant' => 'required_if:role,directeur,comptable,livreur|numeric|min:0',
            'salaire_type' => 'required_if:role,directeur,comptable,livreur|in:mensuel,journalier,par_piece'
        ]);

        $user = User::create($validated);

        if (in_array($validated['role'], ['directeur', 'comptable', 'livreur'])) {
            $user->salaire()->create([
                'montant' => $validated['salaire_montant'],
                'type_travail' => $validated['salaire_type']
            ]);
        }

        return redirect()->route('users.index');
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
