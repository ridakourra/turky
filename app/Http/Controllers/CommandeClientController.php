<?php

namespace App\Http\Controllers;

use App\Models\CommandeClient;
use App\Models\Client;
use App\Models\Produit;
use App\Models\Stock;
use App\Models\Vehicule;
use App\Models\Employee;
use App\Models\LigneCommandeClient;
use App\Models\Paiement;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;

class CommandeClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = CommandeClient::with(['client', 'vehicule', 'chauffeur', 'paiement'])
            ->orderBy('created_at', 'desc');

        // Basic search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('client', function ($q) use ($search) {
                $q->where('nom_complet', 'like', "%{$search}%");
            })
            ->orWhere('id', 'like', "%{$search}%")
            ->orWhere('commentaire', 'like', "%{$search}%");
        }

        // Advanced filters
        if ($request->filled('client_id') && $request->client_id !== 'all') {
            $query->where('client_id', $request->client_id);
        }

        if ($request->filled('vehicule_id') && $request->vehicule_id !== 'all') {
            $query->where('vehicule_id', $request->vehicule_id);
        }

        if ($request->filled('chauffeur_id') && $request->chauffeur_id !== 'all') {
            $query->where('chauffeur_id', $request->chauffeur_id);
        }

        if ($request->filled('statut_paiement') && $request->statut_paiement !== 'all') {
            $query->whereHas('paiement', function ($q) use ($request) {
                $q->where('statut', $request->statut_paiement);
            });
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
        
        if (in_array($sortField, ['date_commande', 'montant_total', 'profit_net', 'created_at'])) {
            $query->orderBy($sortField, $sortDirection);
        } elseif ($sortField === 'client') {
            $query->join('clients', 'commandes_clients.client_id', '=', 'clients.id')
                  ->orderBy('clients.nom_complet', $sortDirection)
                  ->select('commandes_clients.*');
        }

        $commandes = $query->paginate(10)->withQueryString();

        // Get filter options
        $clients = Client::select('id', 'nom_complet')->orderBy('nom_complet')->get();
        $vehicules = Vehicule::select('id', 'matricule', 'marque', 'modele')->orderBy('matricule')->get();
        $chauffeurs = Employee::where('role', 'chauffeur')
            ->select('id', 'nom_complet')
            ->orderBy('nom_complet')
            ->get();

        return Inertia::render('CommandesClients/Index', [
            'commandes' => $commandes,
            'clients' => $clients,
            'vehicules' => $vehicules,
            'chauffeurs' => $chauffeurs,
            'filters' => $request->only([
                'search', 'client_id', 'vehicule_id', 'chauffeur_id', 
                'statut_paiement', 'date_debut', 'date_fin', 
                'montant_min', 'montant_max', 'sort', 'direction'
            ])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $clients = Client::select('id', 'nom_complet', 'telephone', 'addresse')
            ->orderBy('nom_complet')
            ->get();
        
        $vehicules = Vehicule::where('statut', 'actif')
            ->select('id', 'matricule', 'marque', 'modele')
            ->orderBy('matricule')
            ->get();
        
        $chauffeurs = Employee::where('role', 'chauffeur')
            ->where('actif', true)
            ->select('id', 'nom_complet')
            ->orderBy('nom_complet')
            ->get();

        return Inertia::render('CommandesClients/Create', [
            'clients' => $clients,
            'vehicules' => $vehicules,
            'chauffeurs' => $chauffeurs
        ]);
    }

    /**
     * Get products for order creation
     */
    public function getProducts(Request $request)
    {
        $query = Produit::with(['stocks.fournisseur'])
            ->whereHas('stocks', function ($q) {
                $q->whereRaw('quantite_totale > quantite_vendue');
            });

        if ($request->filled('search')) {
            $query->where('nom', 'like', "%{$request->search}%");
        }

        $produits = $query->paginate(10)->withQueryString();

        // Calculate available quantities and organize stocks
        $produits->getCollection()->transform(function ($produit) {
            $produit->quantite_disponible = $produit->getQuantiteDisponibleStock();
            
            // Organize stocks by priority: fabrication first, then by fournisseur
            $produit->stocks_organises = $produit->stocks
                ->filter(function ($stock) {
                    return $stock->getQuantiteDisponible() > 0;
                })
                ->sortBy(function ($stock) {
                    return $stock->fournisseur_id === null ? 0 : 1;
                })
                ->values();
            
            return $produit;
        });

        return response()->json($produits);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'client_id' => 'required|exists:clients,id',
            'vehicule_id' => 'required|exists:vehicules,id',
            'chauffeur_id' => 'required|exists:employees,id',
            'date_commande' => 'required|date',
            'commentaire' => 'nullable|string|max:1000',
            'produits' => 'required|array|min:1',
            'produits.*.produit_id' => 'required|exists:produits,id',
            'produits.*.stock_id' => 'required|exists:stocks,id',
            'produits.*.quantite' => 'required|numeric|min:0.01',
            'produits.*.prix_vente' => 'required|numeric|min:0'
        ]);

        DB::beginTransaction();
        
        try {
            // Create the order
            $commande = CommandeClient::create([
                'client_id' => $request->client_id,
                'vehicule_id' => $request->vehicule_id,
                'chauffeur_id' => $request->chauffeur_id,
                'date_commande' => $request->date_commande,
                'commentaire' => $request->commentaire,
                'montant_total' => 0,
                'profit_net' => 0
            ]);

            $montantTotal = 0;
            $profitNet = 0;

            // Process each product
            foreach ($request->produits as $produitData) {
                $stock = Stock::with('produit')->findOrFail($produitData['stock_id']);
                
                // Verify stock availability
                if ($stock->getQuantiteDisponible() < $produitData['quantite']) {
                    throw new \Exception("Stock insuffisant pour le produit {$stock->produit->nom}");
                }

                // Calculate prices
                $prixAchat = $stock->produit->prix_unitaire ?? 0;
                $prixVente = $produitData['prix_vente'];
                $quantite = $produitData['quantite'];
                $montantLigne = $quantite * $prixVente;
                $margeLigne = ($prixVente - $prixAchat) * $quantite;

                // Create order line
                LigneCommandeClient::create([
                    'commande_id' => $commande->id,
                    'stock_id' => $stock->id,
                    'quantite' => $quantite,
                    'prix_achat' => $prixAchat,
                    'prix_vente' => $prixVente,
                    'montant_total' => $montantLigne,
                    'marge_beneficiaire' => $margeLigne,
                    'vehicule_id' => $request->vehicule_id,
                    'chauffeur_id' => $request->chauffeur_id
                ]);

                // Update stock
                $stock->increment('quantite_vendue', $quantite);

                $montantTotal += $montantLigne;
                $profitNet += $margeLigne;
            }

            // Update order totals
            $commande->update([
                'montant_total' => $montantTotal,
                'profit_net' => $profitNet
            ]);

            // Create payment record
            Paiement::create([
                'commande_id' => $commande->id,
                'montant' => $montantTotal,
                'montant_paye' => 0,
                'statut' => 'non_paye'
            ]);

            // Create transaction record
            Transaction::create([
                'type_transaction' => 'entree',
                'reference_type' => CommandeClient::class,
                'reference_id' => $commande->id,
                'montant' => $montantTotal,
                'description' => "Commande client #{$commande->id} - {$commande->client->nom_complet}"
            ]);

            DB::commit();

            return redirect()->route('commandes-clients.show', $commande)
                ->with('success', 'Commande créée avec succès.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(CommandeClient $commandeClient)
    {
        $commandeClient->load([
            'client',
            'vehicule',
            'chauffeur',
            'lignesCommandes.stock.produit',
            'lignesCommandes.stock.fournisseur',
            'paiement'
        ]);

        return Inertia::render('CommandesClients/Show', [
            'commande' => $commandeClient
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CommandeClient $commandeClient)
    {
        DB::beginTransaction();
        
        try {
            // Return stock quantities
            foreach ($commandeClient->lignesCommandes as $ligne) {
                $stock = $ligne->stock;
                $stock->decrement('quantite_vendue', $ligne->quantite);
            }

            // Delete related records
            $commandeClient->paiement?->delete();
            $commandeClient->transactions()->delete();
            $commandeClient->lignesCommandes()->delete();
            $commandeClient->delete();

            DB::commit();

            return redirect()->route('commandes-clients.index')
                ->with('success', 'Commande supprimée avec succès. Les stocks ont été restaurés.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Erreur lors de la suppression: ' . $e->getMessage()]);
        }
    }
}