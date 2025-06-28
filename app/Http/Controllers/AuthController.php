<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\Employer;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Afficher le formulaire de connexion
     */
    public function create()
    {
        return Inertia::render('Login');
    }

    /**
     * Traiter la tentative de connexion
     */
    public function store(Request $request)
    {
        $request->validate([
            'cin' => 'required|string',
            'password' => 'required|string',
        ], [
            'cin.required' => 'Le CIN est obligatoire.',
            'password.required' => 'Le mot de passe est obligatoire.',
        ]);

        // Rechercher l'employé par CIN
        $employer = Employer::where('cin', $request->cin)->first();

        // Vérifier si l'employé existe et si le mot de passe est correct
        if (!$employer || !Hash::check($request->password, $employer->password)) {
            throw ValidationException::withMessages([
                'cin' => 'Ces identifiants ne correspondent à aucun de nos enregistrements.',
            ]);
        }

        // Vérifier si l'employé est actif
        if (!$employer->actif) {
            throw ValidationException::withMessages([
                'cin' => 'Votre compte n\'est pas actif. Veuillez contacter l\'administrateur.',
            ]);
        }

        // Connecter l'employé
        Auth::login($employer, $request->boolean('remember'));

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard'))->with('success', 'Connexion réussie !');
    }

    /**
     * Déconnecter l'utilisateur
     */
    public function destroy(Request $request)
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('login')->with('success', 'Déconnexion réussie !');
    }
}
