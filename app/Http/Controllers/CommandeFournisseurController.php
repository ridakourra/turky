<?php

namespace App\Http\Controllers;

use App\Models\CommandeFournisseur;
use App\Models\LigneCommandeFournisseur;
use App\Models\Fournisseur;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\BudgetChauffeur;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class CommandeFournisseurController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CommandeFournisseur::with(['fournisseur', 'lignesCommandes.produit'])
            ->select('commandes_fournisseurs.*');

        // Search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->whereHas('fournisseur', function ($fq) use ($search) {
                    $fq->where('nom_societe', 'like', "%{$search}%")
                      ->orWhere('contact_nom', 'like', "%{$search}%");
                })
                ->orWhere('commentaire', 'like', "%{$search}%")
                ->orWhere('id', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('fournisseur_id') && $request->fournisseur_id !== 'all') {
            $query->where('fournisseur_id', $request->fournisseur_id);
        }

        if ($request->filled('date_debut')) {
            $query->where('date_commande', '>=', $request->date_debut);
        }

        if ($request->filled('date_fin')) {
            $query->where('date_commande', '<=', $request->date_fin);
        }

        if ($request->filled('montant_min')) {
            $query->where('montant_total', '>=', $request->montant_min);
        }

        if ($request->filled('montant_max')) {
            $query->where('montant_total', '<=', $request->montant_max);
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        if ($sortField === 'fournisseur') {
            $query->join('fournisseurs', 'commandes_fournisseurs.fournisseur_id', '=', 'fournisseurs.id')
                  ->orderBy('fournisseurs.nom_societe', $sortDirection)
                  ->select('commandes_fournisseurs.*');
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        $commandes = $query->paginate(10)->withQueryString();

        // Get filter options
        $fournisseurs = Fournisseur::select('id', 'nom_societe', 'contact_nom')
            ->orderBy('nom_societe')
            ->get();

        return Inertia::render('CommandesFournisseurs/Index', [
            'commandes' => $commandes,
            'fournisseurs' => $fournisseurs,
            'filters' => $request->only([
                'search', 'fournisseur_id', 'date_debut', 'date_fin',
                'montant_min', 'montant_max', 'sort', 'direction'
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $fournisseurs = Fournisseur::select('id', 'nom_societe', 'contact_nom', 'telephone')
            ->orderBy('nom_societe')
            ->get();

        return Inertia::render('CommandesFournisseurs/Create', [
            'fournisseurs' => $fournisseurs
        ]);
    }

    /**
     * Get products for order creation
     */
    public function getProducts(Request $request, $search = null)
    {
        $query = Produit::select('id', 'nom', 'unite_mesure', 'prix_unitaire', 'description');

        $query->where('nom', 'like', "%{$search}%");

        $produits = $query->orderBy('nom')
            ->paginate(10)
            ->withQueryString();
        return response()->json($produits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fournisseur_id' => 'required|exists:fournisseurs,id',
            'date_commande' => 'required|date',
            'commentaire' => 'nullable|string|max:1000',
            'produits' => 'nullable|array|min:1',
            'produits.*.produit_id' => 'nullable|exists:produits,id',
            'produits.*.quantite' => 'nullable|numeric|min:1',
            'produits.*.prix_unitaire' => 'nullable|numeric|min:0'
        ]);

        // dd($request->all());

        DB::beginTransaction();

        try {
            // Create the order
            $commande = CommandeFournisseur::create([
                'fournisseur_id' => $request->fournisseur_id,
                'date_commande' => $request->date_commande,
                'commentaire' => $request->commentaire,
                'montant_total' => 0
            ]);

            $montantTotal = 0;

            // Process each product
            foreach ($request->produits as $produitData) {
                $produit = Produit::findOrFail($produitData['id']);
                $quantite = $produitData['quantite'];
                $prixUnitaire = $produitData['prix_unitaire'];
                $montantLigne = $quantite * $prixUnitaire;

                // Create order line
                LigneCommandeFournisseur::create([
                    'commande_id' => $commande->id,
                    'produit_id' => $produit->id,
                    'quantite' => $quantite,
                    'prix_unitaire' => $prixUnitaire,
                    'montant_total' => $montantLigne
                ]);

                // Update or create stock
                $stock = Stock::where('produit_id', $produit->id)
                    ->where('fournisseur_id', $request->fournisseur_id)
                    ->first();

                if ($stock) {
                    $stock->increment('quantite_totale', $quantite);
                } else {
                    Stock::create([
                        'produit_id' => $produit->id,
                        'fournisseur_id' => $request->fournisseur_id,
                        'quantite_totale' => $quantite,
                        'quantite_vendue' => 0
                    ]);
                }

                $montantTotal += $montantLigne;
            }

            // Update order total
            $commande->update(['montant_total' => $montantTotal]);

            // // Create transaction record
            // Transaction::create([
            //     'type_transaction' => 'sortie',
            //     'reference_type' => CommandeFournisseur::class,
            //     'reference_id' => $commande->id,
            //     'montant' => $montantTotal,
            //     'description' => "Commande fournisseur #{$commande->id} - {$commande->fournisseur->nom_societe}"
            // ]);

            DB::commit();

            return redirect()->route('commandes-fournisseurs.index')
                ->with('success', 'Commande créée avec succès.');

        } catch (\Exception $e) {
            DB::rollback();
            dd($e->getMessage());
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CommandeFournisseur $commandeFournisseur)
    {
        $commandeFournisseur->load([
            'fournisseur',
            'lignesCommandes.produit'
        ]);

        return Inertia::render('CommandesFournisseurs/Show', [
            'commande' => $commandeFournisseur
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CommandeFournisseur $commandeFournisseur)
    {
        // Check if order can be deleted (current date > order date)
        $currentDate = Carbon::now()->toDateString();
        $orderDate = $commandeFournisseur->date_commande->toDateString();

        if ($currentDate <= $orderDate) {
            return back()->withErrors([
                'error' => 'Impossible de supprimer une commande dont la date n\'est pas encore dépassée.'
            ]);
        }

        DB::beginTransaction();

        try {
            // Deduct stock quantities that were added by this order
            foreach ($commandeFournisseur->lignesCommandes as $ligne) {
                $stock = Stock::where('produit_id', $ligne->produit_id)
                    ->where('fournisseur_id', $commandeFournisseur->fournisseur_id)
                    ->first();

                if ($stock) {
                    // Check if we can deduct the quantity
                    $newQuantiteTotale = $stock->quantite_totale - $ligne->quantite;

                    if ($newQuantiteTotale < $stock->quantite_vendue) {
                        throw new \Exception(
                            "Impossible de supprimer la commande: le stock du produit {$ligne->produit->nom} a déjà été vendu en partie."
                        );
                    }

                    $stock->update(['quantite_totale' => $newQuantiteTotale]);

                    // Delete stock record if quantity becomes 0
                    if ($newQuantiteTotale == 0) {
                        $stock->delete();
                    }
                }
            }

            // Delete related records
            $commandeFournisseur->transactions()->delete();
            $commandeFournisseur->lignesCommandes()->delete();
            $commandeFournisseur->delete();

            DB::commit();

            return redirect()->route('commandes-fournisseurs.index')
                ->with('success', 'Commande supprimée avec succès. Les stocks ont été ajustés.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
        }
    }
}
