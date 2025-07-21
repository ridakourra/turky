<?php

namespace App\Http\Controllers;

use App\Models\Produit;
use App\Models\Stock;
use App\Models\Fournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class ProduitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Produit::query()->with(['stocks']);

        // Basic search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('unite_mesure') && $request->unite_mesure !== 'all') {
            $query->where('unite_mesure', $request->unite_mesure);
        }

        if ($request->filled('prix_min')) {
            $query->where('prix_unitaire', '>=', $request->prix_min);
        }

        if ($request->filled('prix_max')) {
            $query->where('prix_unitaire', '<=', $request->prix_max);
        }

        if ($request->filled('stock_status') && $request->stock_status !== 'all') {
            if ($request->stock_status === 'disponible') {
                $query->whereHas('stocks', function ($q) {
                    $q->whereRaw('quantite_totale > quantite_vendue');
                });
            } elseif ($request->stock_status === 'epuise') {
                $query->whereDoesntHave('stocks', function ($q) {
                    $q->whereRaw('quantite_totale > quantite_vendue');
                });
            }
        }

        // Sorting
        $sortField = $request->get('sort', 'nom');
        $sortDirection = $request->get('direction', 'asc');
        
        if (in_array($sortField, ['nom', 'unite_mesure', 'prix_unitaire', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        }

        $produits = $query->paginate(10)->withQueryString();

        // Add stock information to each product
        $produits->getCollection()->transform(function ($produit) {
            $produit->quantite_totale = $produit->getQuantiteTotaleStock();
            $produit->quantite_disponible = $produit->getQuantiteDisponibleStock();
            return $produit;
        });

        return Inertia::render('Produits/Index', [
            'produits' => $produits,
            'filters' => $request->only(['search', 'unite_mesure', 'prix_min', 'prix_max', 'stock_status']),
            'sort' => $request->only(['sort', 'direction']),
            'unites_mesure' => [
                'kg', 'litre', 'piece', 'metre', 'metre_cube', 'tonne', 
                'gramme', 'centimetre', 'millimetre', 'carton', 'boite', 
                'sac', 'rouleau', 'unite'
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Produits/Create', [
            'unites_mesure' => [
                'kg', 'litre', 'piece', 'metre', 'metre_cube', 'tonne', 
                'gramme', 'centimetre', 'millimetre', 'carton', 'boite', 
                'sac', 'rouleau', 'unite'
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unite_mesure' => 'required|in:kg,litre,piece,metre,metre_cube,tonne,gramme,centimetre,millimetre,carton,boite,sac,rouleau,unite',
            'prix_unitaire' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'stock_initial' => 'nullable|integer|min:0'
        ]);

        try {
            DB::beginTransaction();

            $produit = Produit::create([
                'nom' => $validated['nom'],
                'unite_mesure' => $validated['unite_mesure'],
                'prix_unitaire' => $validated['prix_unitaire'],
                'description' => $validated['description']
            ]);

            // Create initial stock if provided
            if (isset($validated['stock_initial']) && $validated['stock_initial'] > 0) {
                Stock::create([
                    'produit_id' => $produit->id,
                    'fournisseur_id' => null, // Fabrication
                    'quantite_totale' => $validated['stock_initial'],
                    'quantite_vendue' => 0
                ]);
            }

            DB::commit();

            return redirect()->route('produits.index')
                ->with('success', 'Produit créé avec succès.');
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors(['error' => 'Erreur lors de la création du produit.']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Produit $produit)
    {
        $produit->load(['stocks.fournisseur']);
        
        // Calculate stock totals
        $produit->quantite_totale = $produit->getQuantiteTotaleStock();
        $produit->quantite_vendue = $produit->getQuantiteVendueStock();
        $produit->quantite_disponible = $produit->getQuantiteDisponibleStock();

        // Get fournisseurs for add stock functionality
        $fournisseurs = Fournisseur::select('id', 'nom_societe')->orderBy('nom_societe')->get();

        return Inertia::render('Produits/Show', [
            'produit' => $produit,
            'fournisseurs' => $fournisseurs
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Produit $produit)
    {
        // Calculate stock totals for display
        $produit->quantite_totale = $produit->getQuantiteTotaleStock();
        $produit->quantite_vendue = $produit->getQuantiteVendueStock();
        $produit->quantite_disponible = $produit->getQuantiteDisponibleStock();

        return Inertia::render('Produits/Edit', [
            'produit' => $produit,
            'unites_mesure' => [
                'kg', 'litre', 'piece', 'metre', 'metre_cube', 'tonne', 
                'gramme', 'centimetre', 'millimetre', 'carton', 'boite', 
                'sac', 'rouleau', 'unite'
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'unite_mesure' => 'required|in:kg,litre,piece,metre,metre_cube,tonne,gramme,centimetre,millimetre,carton,boite,sac,rouleau,unite',
            'prix_unitaire' => 'nullable|numeric|min:0',
            'description' => 'nullable|string'
        ]);

        try {
            $produit->update($validated);

            return redirect()->route('produits.index')
                ->with('success', 'Produit mis à jour avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la mise à jour du produit.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Produit $produit)
    {
        try {
            // Check if product has sales (quantite_vendue > 0)
            $hasVentes = $produit->stocks()->where('quantite_vendue', '>', 0)->exists();
            
            if ($hasVentes) {
                return back()->withErrors(['error' => 'Impossible de supprimer ce produit car il a des ventes associées.']);
            }

            // Delete associated stocks first
            $produit->stocks()->delete();
            $produit->delete();

            return redirect()->route('produits.index')
                ->with('success', 'Produit supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la suppression du produit.']);
        }
    }

    /**
     * Update stock for a product
     */
    public function updateStock(Request $request, Stock $stock)
    {
        $validated = $request->validate([
            'quantite_totale' => 'required|integer|min:0',
            'quantite_vendue' => 'required|integer|min:0'
        ]);

        // Ensure quantite_vendue doesn't exceed quantite_totale
        if ($validated['quantite_vendue'] > $validated['quantite_totale']) {
            return back()->withErrors(['error' => 'La quantité vendue ne peut pas dépasser la quantité totale.']);
        }

        try {
            $stock->update($validated);

            return back()->with('success', 'Stock mis à jour avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de la mise à jour du stock.']);
        }
    }

    /**
     * Add new stock for a product
     */
    public function addStock(Request $request, Produit $produit)
    {
        $validated = $request->validate([
            'fournisseur_id' => 'nullable|exists:fournisseurs,id',
            'quantite_totale' => 'required|integer|min:1'
        ]);

        try {
            Stock::create([
                'produit_id' => $produit->id,
                'fournisseur_id' => $validated['fournisseur_id'],
                'quantite_totale' => $validated['quantite_totale'],
                'quantite_vendue' => 0
            ]);

            return back()->with('success', 'Stock ajouté avec succès.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Erreur lors de l\'ajout du stock.']);
        }
    }
}