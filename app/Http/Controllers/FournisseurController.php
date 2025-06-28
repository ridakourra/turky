<?php

namespace App\Http\Controllers;

use App\Models\Fournisseur;
use App\Models\Stock;
use App\Models\CommandeFournisseur;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class FournisseurController extends Controller
{
    public function index(Request $request)
    {
        $query = Fournisseur::query();

        // Search functionality
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->search . '%')
                  ->orWhere('ice_ou_cin', 'like', '%' . $request->search . '%')
                  ->orWhere('adresse', 'like', '%' . $request->search . '%')
                  ->orWhere('note', 'like', '%' . $request->search . '%');
            });
        }

        // Advanced filters
        if ($request->nom) {
            $query->where('nom', 'like', '%' . $request->nom . '%');
        }

        if ($request->ice_ou_cin) {
            $query->where('ice_ou_cin', 'like', '%' . $request->ice_ou_cin . '%');
        }

        if ($request->adresse) {
            $query->where('adresse', 'like', '%' . $request->adresse . '%');
        }

        // Sorting
        $sortField = $request->get('sort', 'nom');
        $sortDirection = $request->get('direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        $fournisseurs = $query->withCount(['stocks', 'commandesFournisseurs'])
                             ->paginate(10)
                             ->withQueryString();

        return Inertia::render('Fournisseurs/Index', [
            'fournisseurs' => $fournisseurs,
            'filters' => $request->all(['search', 'nom', 'ice_ou_cin', 'adresse', 'sort', 'direction']),
        ]);
    }

    public function create()
    {
        return Inertia::render('Fournisseurs/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ice_ou_cin' => 'required|string|unique:fournisseurs,ice_ou_cin|max:255',
            'adresse' => 'nullable|string|max:500',
            'note' => 'nullable|string|max:1000',
        ]);

        Fournisseur::create($validated);

        return redirect()->route('fournisseurs.index')
                        ->with('success', 'Fournisseur créé avec succès.');
    }

    public function show(Fournisseur $fournisseur)
    {
        $fournisseur->load([
            'stocks.produit',
            'commandesFournisseurs.employer',
            'commandesFournisseurs.vehicule',
            'commandesFournisseurs.lines.produit'
        ]);

        // Get stocks with pagination
        $stocks = $fournisseur->stocks()
                             ->with('produit')
                             ->paginate(10, ['*'], 'stocks_page');

        // Get commandes with pagination
        $commandes = $fournisseur->commandesFournisseurs()
                                ->with(['employer', 'vehicule', 'lines.produit'])
                                ->paginate(10, ['*'], 'commandes_page');

        return Inertia::render('Fournisseurs/Show', [
            'fournisseur' => $fournisseur,
            'stocks' => $stocks,
            'commandes' => $commandes,
        ]);
    }

    public function edit(Fournisseur $fournisseur)
    {
        return Inertia::render('Fournisseurs/Edit', [
            'fournisseur' => $fournisseur,
        ]);
    }

    public function update(Request $request, Fournisseur $fournisseur)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'ice_ou_cin' => [
                'required',
                'string',
                'max:255',
                Rule::unique('fournisseurs')->ignore($fournisseur->id),
            ],
            'adresse' => 'nullable|string|max:500',
            'note' => 'nullable|string|max:1000',
        ]);

        $fournisseur->update($validated);

        return redirect()->route('fournisseurs.index')
                        ->with('success', 'Fournisseur mis à jour avec succès.');
    }

    public function destroy(Fournisseur $fournisseur)
    {
        // Check if fournisseur has related records
        if ($fournisseur->stocks()->count() > 0 || $fournisseur->commandesFournisseurs()->count() > 0) {
            return redirect()->route('fournisseurs.index')
                            ->with('error', 'Impossible de supprimer ce fournisseur car il a des stocks ou des commandes associés.');
        }

        $fournisseur->delete();

        return redirect()->route('fournisseurs.index')
                        ->with('success', 'Fournisseur supprimé avec succès.');
    }

    public function export(Request $request)
    {
        $query = Fournisseur::query();

        // Apply same filters as index
        if ($request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('nom', 'like', '%' . $request->search . '%')
                  ->orWhere('ice_ou_cin', 'like', '%' . $request->search . '%')
                  ->orWhere('adresse', 'like', '%' . $request->search . '%')
                  ->orWhere('note', 'like', '%' . $request->search . '%');
            });
        }

        $fournisseurs = $query->get();

        $filename = 'fournisseurs_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($fournisseurs) {
            $file = fopen('php://output', 'w');
            fputcsv($file, ['Nom', 'ICE/CIN', 'Adresse', 'Note', 'Date de création']);

            foreach ($fournisseurs as $fournisseur) {
                fputcsv($file, [
                    $fournisseur->nom,
                    $fournisseur->ice_ou_cin,
                    $fournisseur->adresse,
                    $fournisseur->note,
                    $fournisseur->created_at->format('d/m/Y H:i'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
