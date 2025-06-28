<?php

namespace App\Http\Controllers;

use App\Models\Entreprise;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class EntrepriseController extends Controller
{
    /**
     * Display the enterprise information.
     */
    public function index()
    {
        try {
            // Get the single enterprise record (assuming there's only one)
            $entreprise = Entreprise::first();

            // If no enterprise exists, create a default one
            if (!$entreprise) {
                $entreprise = new Entreprise([
                    'nom' => '',
                    'ice' => '',
                    'adresse' => '',
                    'telephone' => '',
                    'email' => '',
                    'secteur_activite' => '',
                    'forme_juridique' => '',
                    'representant_legal' => '',
                    'site_web' => '',
                    'description' => '',
                    'capital' => 0,
                    'date_creation' => now(),
                ]);
            }

            return Inertia::render('Entreprise/Index', [
                'entreprise' => $entreprise,
                'success' => session('success'),
                'error' => session('error'),
            ]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors du chargement des informations de l\'entreprise.');
        }
    }

    /**
     * Show the form for editing the enterprise.
     */
    public function edit()
    {
        try {
            $entreprise = Entreprise::first();

            // If no enterprise exists, create a default one
            if (!$entreprise) {
                $entreprise = new Entreprise([
                    'nom' => '',
                    'ice' => '',
                    'adresse' => '',
                    'telephone' => '',
                    'email' => '',
                    'secteur_activite' => '',
                    'forme_juridique' => '',
                    'representant_legal' => '',
                    'site_web' => '',
                    'description' => '',
                    'capital' => 0,
                    'date_creation' => now(),
                ]);
            }

            return Inertia::render('Entreprise/Edit', [
                'entreprise' => $entreprise,
            ]);
        } catch (\Exception $e) {
            return redirect()->route('entreprise.index')
                ->with('error', 'Erreur lors du chargement des informations de l\'entreprise.');
        }
    }

    /**
     * Update the enterprise information.
     */
    public function update(Request $request): RedirectResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'nom' => 'required|string|max:255',
                'ice' => 'nullable|string|max:255',
                'adresse' => 'nullable|string|max:500',
                'telephone' => 'nullable|string|max:20',
                'email' => 'nullable|email|max:255',
                'secteur_activite' => 'nullable|string|max:255',
                'forme_juridique' => 'nullable|string|max:255',
                'representant_legal' => 'nullable|string|max:255',
                'site_web' => 'nullable|url|max:255',
                'description' => 'nullable|string|max:1000',
                'capital' => 'nullable|numeric|min:0',
                'date_creation' => 'nullable|date',
                'logo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            ], [
                'nom.required' => 'Le nom de l\'entreprise est obligatoire.',
                'nom.max' => 'Le nom de l\'entreprise ne doit pas dépasser 255 caractères.',
                'ice.max' => 'L\'ICE ne doit pas dépasser 255 caractères.',
                'adresse.max' => 'L\'adresse ne doit pas dépasser 500 caractères.',
                'telephone.max' => 'Le téléphone ne doit pas dépasser 20 caractères.',
                'email.email' => 'L\'email doit être valide.',
                'email.max' => 'L\'email ne doit pas dépasser 255 caractères.',
                'secteur_activite.max' => 'Le secteur d\'activité ne doit pas dépasser 255 caractères.',
                'forme_juridique.max' => 'La forme juridique ne doit pas dépasser 255 caractères.',
                'representant_legal.max' => 'Le représentant légal ne doit pas dépasser 255 caractères.',
                'site_web.url' => 'Le site web doit être une URL valide.',
                'site_web.max' => 'Le site web ne doit pas dépasser 255 caractères.',
                'description.max' => 'La description ne doit pas dépasser 1000 caractères.',
                'capital.numeric' => 'Le capital doit être un nombre.',
                'capital.min' => 'Le capital doit être positif.',
                'date_creation.date' => 'La date de création doit être une date valide.',
                'logo.image' => 'Le logo doit être une image.',
                'logo.mimes' => 'Le logo doit être au format jpeg, png, jpg ou gif.',
                'logo.max' => 'Le logo ne doit pas dépasser 2MB.',
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $data = $request->except(['logo']);

            // Handle logo upload
            if ($request->hasFile('logo')) {
                $logoPath = $request->file('logo')->store('logos', 'public');
                $data['logo'] = $logoPath;
            }

            $entreprise = Entreprise::first();

            if ($entreprise) {
                // Update existing enterprise
                $entreprise->update($data);
                $message = 'Informations de l\'entreprise mises à jour avec succès.';
            } else {
                // Create new enterprise
                Entreprise::create($data);
                $message = 'Informations de l\'entreprise créées avec succès.';
            }

            return redirect()->route('entreprise.index')
                ->with('success', $message);

        } catch (ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->validator)
                ->withInput()
                ->with('error', 'Veuillez corriger les erreurs dans le formulaire.');
        } catch (\Exception $e) {
            return redirect()->back()
                ->withInput()
                ->with('error', 'Erreur lors de la mise à jour des informations de l\'entreprise.');
        }
    }
}