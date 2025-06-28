<?php

namespace App\Http\Controllers;

use App\Models\EnginLourd;
use App\Models\Employer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class EnginLourdController extends Controller
{
    public function index(Request $request)
    {
        $query = EnginLourd::with('employer');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('reference', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%")
                  ->orWhere('marque', 'like', "%{$search}%")
                  ->orWhere('modele', 'like', "%{$search}%")
                  ->orWhere('statut', 'like', "%{$search}%");
            });
        }

        // Advanced filters
        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('statut')) {
            $query->where('statut', $request->statut);
        }

        if ($request->filled('marque')) {
            $query->where('marque', 'like', "%{$request->marque}%");
        }

        if ($request->filled('employer_id')) {
            $query->where('employer_id', $request->employer_id);
        }

        if ($request->filled('date_from')) {
            $query->where('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('created_at', '<=', $request->date_to . ' 23:59:59');
        }

        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $enginsLourds = $query->paginate(15)->withQueryString();
        $employers = Employer::select('id', 'nom')->get();

        return Inertia::render('EnginsLourds/Index', [
            'enginsLourds' => $enginsLourds,
            'employers' => $employers,
            'filters' => $request->only(['search', 'type', 'statut', 'marque', 'employer_id', 'date_from', 'date_to', 'sort', 'direction'])
        ]);
    }

    public function create()
    {
        $employers = Employer::select('id', 'nom')->where('actif', true)->get();

        return Inertia::render('EnginsLourds/Create', [
            'employers' => $employers
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'reference' => 'required|string|max:255|unique:engins_lourds,reference',
            'type' => 'nullable|string|max:255',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'capacite' => 'nullable|numeric',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'numero_serie' => 'nullable|string|max:255',
            'numero_moteur' => 'nullable|string|max:255',
            'location_par_heure' => 'nullable|numeric|min:0',
            'carburant_type' => 'nullable|string|max:255',
            'date_assurance' => 'nullable|date',
            'statut' => 'required|in:available,in_use,maintenance,broken',
            'employer_id' => 'nullable|exists:employers,id'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        EnginLourd::create($request->all());

        return redirect()->route('engins-lourds.index')->with('success', 'Engin lourd créé avec succès.');
    }

    public function show(EnginLourd $enginLourd)
    {
        $enginLourd->load(['employer', 'rapportsLocation.client']);

        return Inertia::render('EnginsLourds/Show', [
            'enginLourd' => $enginLourd
        ]);
    }

    public function edit(EnginLourd $enginLourd)
    {
        $employers = Employer::select('id', 'nom')->where('actif', true)->get();

        return Inertia::render('EnginsLourds/Edit', [
            'enginLourd' => $enginLourd,
            'employers' => $employers
        ]);
    }

    public function update(Request $request, EnginLourd $enginLourd)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string|max:255',
            'reference' => 'required|string|max:255|unique:engins_lourds,reference,' . $enginLourd->id,
            'type' => 'nullable|string|max:255',
            'marque' => 'nullable|string|max:255',
            'modele' => 'nullable|string|max:255',
            'capacite' => 'nullable|numeric',
            'annee' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'numero_serie' => 'nullable|string|max:255',
            'numero_moteur' => 'nullable|string|max:255',
            'location_par_heure' => 'nullable|numeric|min:0',
            'carburant_type' => 'nullable|string|max:255',
            'date_assurance' => 'nullable|date',
            'statut' => 'required|in:available,in_use,maintenance,broken',
            'employer_id' => 'nullable|exists:employers,id'
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        $enginLourd->update($request->all());

        return redirect()->route('engins-lourds.index')->with('success', 'Engin lourd mis à jour avec succès.');
    }

    public function destroy(EnginLourd $enginLourd)
    {
        try {
            $enginLourd->delete();
            return back()->with('success', 'Engin lourd supprimé avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', 'Impossible de supprimer cet engin lourd. Il est peut-être lié à d\'autres enregistrements.');
        }
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'exists:engins_lourds,id'
        ]);

        try {
            EnginLourd::whereIn('id', $request->ids)->delete();
            return back()->with('success', count($request->ids) . ' engins lourds supprimés avec succès.');
        } catch (\Exception $e) {
            return back()->with('error', 'Erreur lors de la suppression des engins lourds.');
        }
    }

    public function export(Request $request)
    {
        // Export functionality can be implemented here
        // For now, return the same data as index
        return $this->index($request);
    }
}
