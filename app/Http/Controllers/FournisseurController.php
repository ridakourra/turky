<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use App\Models\CommandeFournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class FournisseurController extends Controller
{
    /**
     * Afficher la liste des fournisseurs avec pagination, tri et filtres
     */
    public function index(Request $request): Response
    {
        $query = Fournisseur::query();

        // Recherche de base
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('nom_societe', 'like', "%{$search}%")
                  ->orWhere('contact_nom', 'like', "%{$search}%")
                  ->orWhere('telephone', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('ice', 'like', "%{$search}%");
            });
        }

        // Filtres avancés
        if ($request->filled('nom_societe')) {
            $query->where('nom_societe', 'like', '%' . $request->get('nom_societe') . '%');
        }

        if ($request->filled('contact_nom')) {
            $query->where('contact_nom', 'like', '%' . $request->get('contact_nom') . '%');
        }

        if ($request->filled('telephone')) {
            $query->where('telephone', 'like', '%' . $request->get('telephone') . '%');
        }

        if ($request->filled('email')) {
            $query->where('email', 'like', '%' . $request->get('email') . '%');
        }

        if ($request->filled('ice')) {
            $query->where('ice', 'like', '%' . $request->get('ice') . '%');
        }

        // Tri
        $sortField = $request->get('sort', 'nom_societe');
        $sortDirection = $request->get('direction', 'asc');
        
        $allowedSorts = ['nom_societe', 'contact_nom', 'telephone', 'email', 'ice', 'created_at'];
        if (in_array($sortField, $allowedSorts)) {
            $query->orderBy($sortField, $sortDirection);
        }

        $fournisseurs = $query->paginate(10)->withQueryString();

        return Inertia::render('Fournisseurs/Index', [
            'fournisseurs' => $fournisseurs,
            'filters' => $request->only(['search', 'nom_societe', 'contact_nom', 'telephone', 'email', 'ice']),
            'sort' => $sortField,
            'direction' => $sortDirection,
        ]);
    }

    /**
     * Afficher le formulaire de création d'un nouveau fournisseur
     */
    public function create(): Response
    {
        return Inertia::render('Fournisseurs/Create');
    }

    /**
     * Enregistrer un nouveau fournisseur
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom_societe' => 'required|string|max:255',
            'contact_nom' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'addresse' => 'nullable|string|max:500',
            'ice' => 'nullable|string|max:255|unique:fournisseurs,ice',
            'rc' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:255',
        ], [
            'nom_societe.required' => 'Le nom de la société est obligatoire.',
            'nom_societe.max' => 'Le nom de la société ne peut pas dépasser 255 caractères.',
            'email.email' => 'L\'adresse email doit être valide.',
            'ice.unique' => 'Ce numéro ICE existe déjà.',
        ]);

        Fournisseur::create($validated);

        return redirect()->route('fournisseurs.index')
            ->with('success', 'Fournisseur créé avec succès.');
    }

    /**
     * Afficher les détails d'un fournisseur
     */
    public function show(Fournisseur $fournisseur): Response
    {
        // Charger les commandes du fournisseur avec pagination
        $commandes = $fournisseur->commandesFournisseurs()
            ->orderBy('date_commande', 'desc')
            ->paginate(10);

        return Inertia::render('Fournisseurs/Show', [
            'fournisseur' => $fournisseur,
            'commandes' => $commandes,
        ]);
    }

    /**
     * Afficher le formulaire d'édition d'un fournisseur
     */
    public function edit(Fournisseur $fournisseur): Response
    {
        return Inertia::render('Fournisseurs/Edit', [
            'fournisseur' => $fournisseur,
        ]);
    }

    /**
     * Mettre à jour un fournisseur
     */
    public function update(Request $request, Fournisseur $fournisseur): RedirectResponse
    {
        $validated = $request->validate([
            'nom_societe' => 'required|string|max:255',
            'contact_nom' => 'nullable|string|max:255',
            'telephone' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'addresse' => 'nullable|string|max:500',
            'ice' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('fournisseurs', 'ice')->ignore($fournisseur->id)
            ],
            'rc' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:255',
        ], [
            'nom_societe.required' => 'Le nom de la société est obligatoire.',
            'nom_societe.max' => 'Le nom de la société ne peut pas dépasser 255 caractères.',
            'email.email' => 'L\'adresse email doit être valide.',
            'ice.unique' => 'Ce numéro ICE existe déjà.',
        ]);

        $fournisseur->update($validated);

        return redirect()->route('fournisseurs.index')
            ->with('success', 'Fournisseur mis à jour avec succès.');
    }

    /**
     * Supprimer un fournisseur
     */
    public function destroy(Fournisseur $fournisseur): RedirectResponse
    {
        try {
            $fournisseur->delete();
            return redirect()->route('fournisseurs.index')
                ->with('success', 'Fournisseur supprimé avec succès.');
        } catch (\Exception $e) {
            return redirect()->route('fournisseurs.index')
                ->with('error', 'Impossible de supprimer ce fournisseur car il est lié à d\'autres données.');
        }
    }
}