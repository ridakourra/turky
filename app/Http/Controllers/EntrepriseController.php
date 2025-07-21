<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\Rule;

class EntrepriseController extends Controller
{
    /**
     * Afficher les informations de l'entreprise
     */
    public function index(): Response
    {
        $entreprise = Entreprise::first();

        return Inertia::render('Entreprise/Index', [
            'entreprise' => $entreprise
        ]);
    }

    /**
     * Afficher le formulaire d'édition de l'entreprise
     */
    public function edit(): Response
    {
        $entreprise = Entreprise::first();

        return Inertia::render('Entreprise/Edit', [
            'entreprise' => $entreprise
        ]);
    }

    /**
     * Mettre à jour les informations de l'entreprise
     */
    public function update(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom_entreprise' => 'required|string|max:255',
            'ice' => 'nullable|string|max:255',
            'rc' => 'nullable|string|max:255',
            'cnss' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date_creation' => 'nullable|date',
        ]);

        $entreprise = Entreprise::first();

        if ($entreprise) {
            $entreprise->update($validated);
            $message = 'Les informations de l\'entreprise ont été mises à jour avec succès.';
        } else {
            Entreprise::create($validated);
            $message = 'Les informations de l\'entreprise ont été créées avec succès.';
        }

        return redirect()->route('entreprise.index')
            ->with('success', $message);
    }

    /**
     * Créer une nouvelle entreprise si aucune n'existe
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'nom_entreprise' => 'required|string|max:255',
            'ice' => 'nullable|string|max:255',
            'rc' => 'nullable|string|max:255',
            'cnss' => 'nullable|string|max:255',
            'if' => 'nullable|string|max:255',
            'logo' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'date_creation' => 'nullable|date',
        ]);

        Entreprise::create($validated);

        return redirect()->route('entreprise.index')
            ->with('success', 'Les informations de l\'entreprise ont été créées avec succès.');
    }
}
