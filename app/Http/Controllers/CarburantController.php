<?php

namespace App\Http\Controllers;

use App\Models\Carburant;
use App\Models\LivraisonCarburant;
use App\Models\UtilisationCarburant;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Validation\ValidationException;

class CarburantController extends Controller
{
    /**
     * Afficher la page principale du carburant
     */
    public function index(Request $request): Response
    {
        // Récupérer les données du carburant (il devrait y avoir un seul enregistrement)
        $carburant = Carburant::first();

        // Si aucun carburant n'existe, créer un enregistrement par défaut
        if (!$carburant) {
            $carburant = Carburant::create([
                'capacite_maximale' => 10000,
                'niveau_actuel' => 0,
                'seuil_alerte' => 1000,
            ]);
        }

        // Récupérer les utilisations de carburant avec pagination
        $utilisations = UtilisationCarburant::with('machine')
            ->orderBy('date_utilisation', 'desc')
            ->paginate(10, ['*'], 'utilisations_page');

        // Récupérer les livraisons de carburant avec pagination
        $livraisons = LivraisonCarburant::with('fournisseur')
            ->orderBy('date_livraison', 'desc')
            ->paginate(10, ['*'], 'livraisons_page');

        // Récupérer tous les fournisseurs pour le formulaire
        $fournisseurs = Fournisseur::orderBy('nom_societe')->get();

        return Inertia::render('Carburant/Index', [
            'carburant' => $carburant,
            'utilisations' => $utilisations,
            'livraisons' => $livraisons,
            'fournisseurs' => $fournisseurs,
        ]);
    }

    /**
     * Ajouter une nouvelle livraison de carburant
     */
    public function ajouterLivraison(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'quantite' => 'required|numeric|min:0.01',
            'montant_total' => 'nullable|numeric|min:0',
            'date_livraison' => 'required|date',
            'numero_bon' => 'nullable|string|max:255',
            'commentaire' => 'nullable|string',
        ]);

        try {
            // Créer la livraison
            LivraisonCarburant::create($validated);

            // Mettre à jour le niveau actuel du carburant
            $carburant = Carburant::first();
            if ($carburant) {
                $carburant->niveau_actuel += $validated['quantite'];
                $carburant->save();
            }

            return redirect()->back()->with('success', 'Livraison de carburant ajoutée avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de l\'ajout de la livraison: ' . $e->getMessage());
        }
    }

    /**
     * Mettre à jour les paramètres du carburant
     */
    public function updateParametres(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'capacite_maximale' => 'required|numeric|min:1',
            'seuil_alerte' => 'nullable|numeric|min:0',
        ]);

        try {
            $carburant = Carburant::first();
            if (!$carburant) {
                $carburant = new Carburant();
            }

            $carburant->capacite_maximale = $validated['capacite_maximale'];
            $carburant->seuil_alerte = $validated['seuil_alerte'];
            $carburant->save();

            return redirect()->back()->with('success', 'Paramètres du carburant mis à jour avec succès.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Erreur lors de la mise à jour: ' . $e->getMessage());
        }
    }

    /**
     * Obtenir les statistiques du carburant
     */
    public function getStatistiques(): array
    {
        $carburant = Carburant::first();

        if (!$carburant) {
            return [
                'niveau_actuel' => 0,
                'pourcentage' => 0,
                'alerte' => false,
                'total_livraisons' => 0,
                'total_utilisations' => 0,
            ];
        }

        $totalLivraisons = LivraisonCarburant::sum('quantite');
        $totalUtilisations = UtilisationCarburant::sum('quantite');

        return [
            'niveau_actuel' => $carburant->niveau_actuel,
            'pourcentage' => $carburant->capacite_maximale > 0 ?
                ($carburant->niveau_actuel / $carburant->capacite_maximale) * 100 : 0,
            'alerte' => $carburant->seuil_alerte ?
                $carburant->niveau_actuel <= $carburant->seuil_alerte : false,
            'total_livraisons' => $totalLivraisons,
            'total_utilisations' => $totalUtilisations,
        ];
    }
}
