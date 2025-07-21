<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TransactionController extends Controller
{
    /**
     * Afficher la liste des transactions avec filtres et pagination
     */
    public function index(Request $request): Response
    {
        $query = Transaction::with('reference')
            ->orderBy('created_at', 'desc');

        // Recherche générale
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('montant', 'like', "%{$search}%");
            });
        }

        // Filtre par type de transaction
        if ($request->filled('type_transaction') && $request->type_transaction !== 'all') {
            $query->where('type_transaction', $request->type_transaction);
        }

        // Filtre par type de référence
        if ($request->filled('reference_type') && $request->reference_type !== 'all') {
            $referenceTypeMap = [
                'salaire' => 'App\\Models\\Salaire',
                'commande_client' => 'App\\Models\\CommandeClient',
                'engin_lourd' => 'App\\Models\\EnginLourd',
                'budget_chauffeur' => 'App\\Models\\BudgetChauffeur',
                'livraison_carburant' => 'App\\Models\\LivraisonCarburant',
                'depense_machine' => 'App\\Models\\DepenseMachine',
            ];
            
            if (isset($referenceTypeMap[$request->reference_type])) {
                $query->where('reference_type', $referenceTypeMap[$request->reference_type]);
            }
        }

        // Filtre par plage de dates
        if ($request->filled('date_debut')) {
            $query->whereDate('created_at', '>=', $request->date_debut);
        }

        if ($request->filled('date_fin')) {
            $query->whereDate('created_at', '<=', $request->date_fin);
        }

        // Filtre par montant
        if ($request->filled('montant_min')) {
            $query->where('montant', '>=', $request->montant_min);
        }

        if ($request->filled('montant_max')) {
            $query->where('montant', '<=', $request->montant_max);
        }

        $transactions = $query->paginate(10)->withQueryString();

        // Calculer les totaux
        $totalEntrees = Transaction::where('type_transaction', 'entree')
            ->when($request->filled('date_debut'), function ($q) use ($request) {
                return $q->whereDate('created_at', '>=', $request->date_debut);
            })
            ->when($request->filled('date_fin'), function ($q) use ($request) {
                return $q->whereDate('created_at', '<=', $request->date_fin);
            })
            ->sum('montant');

        $totalSorties = Transaction::where('type_transaction', 'sortie')
            ->when($request->filled('date_debut'), function ($q) use ($request) {
                return $q->whereDate('created_at', '>=', $request->date_debut);
            })
            ->when($request->filled('date_fin'), function ($q) use ($request) {
                return $q->whereDate('created_at', '<=', $request->date_fin);
            })
            ->sum('montant');

        $solde = $totalEntrees - $totalSorties;

        return Inertia::render('Transactions/Index', [
            'transactions' => $transactions,
            'filters' => $request->only([
                'search', 
                'type_transaction', 
                'reference_type', 
                'date_debut', 
                'date_fin',
                'montant_min',
                'montant_max'
            ]),
            'totaux' => [
                'entrees' => $totalEntrees,
                'sorties' => $totalSorties,
                'solde' => $solde
            ]
        ]);
    }

    /**
     * Afficher les détails d'une transaction
     */
    public function show(Transaction $transaction): Response
    {
        $transaction->load('reference');
        
        return Inertia::render('Transactions/Show', [
            'transaction' => $transaction
        ]);
    }

    /**
     * Obtenir les types de référence pour les filtres
     */
    public function getReferenceTypes()
    {
        return response()->json([
            'salaire' => 'Salaire',
            'commande_client' => 'Commande Client',
            'engin_lourd' => 'Engin Lourd',
            'budget_chauffeur' => 'Budget Chauffeur',
            'livraison_carburant' => 'Livraison Carburant',
            'depense_machine' => 'Dépense Machine'
        ]);
    }
}