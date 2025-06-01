<?php

namespace App\Http\Controllers;

use App\Models\Vehicule;
use App\Models\User; // for chauffeurs
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class VehiculeController extends Controller
{
    public function index(Request $request)
    {
        $query = Vehicule::query();

        // 1) Search (nom, matricule, type)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('nom', 'like', "%{$search}%")
                  ->orWhere('matricule', 'like', "%{$search}%")
                  ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // 2) Filter by chauffeur
        if ($request->filled('chauffeur_id')) {
            $query->where('chauffeur_id', $request->chauffeur_id);
        }

        // 3) Filter by status
        if ($request->filled('status')) {
            $isActive = $request->status === 'active';
            $query->where('actif', $isActive);
        }

        // 4) Capacity range
        if ($request->filled('capacite_from')) {
            $query->where('capacite_tonne', '>=', $request->capacite_from);
        }
        if ($request->filled('capacite_to')) {
            $query->where('capacite_tonne', '<=', $request->capacite_to);
        }

        // 5) Sort
        $sortBy        = $request->get('sort_by', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $allowedSort   = ['nom', 'matricule', 'type', 'capacite_tonne', 'created_at'];
        if (in_array($sortBy, $allowedSort)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        // 6) Eager load chauffeur
        $query->with('chauffeur');

        // 7) Paginate
        $perPage = (int) $request->get('per_page', 10);
        $perPage = min(max($perPage, 5), 100);
        $page    = max((int) $request->get('page', 1), 1);

        $vehicules = $query
            ->paginate($perPage, ['*'], 'page', $page)
            ->withQueryString();

        // Load list of chauffeurs (role = livreur)
        $chauffeurs = User::where('role', 'livreur')
            ->select('id', 'nom', 'prenom')
            ->orderBy('nom')
            ->get();

        return Inertia::render('Vehicules/Index', [
            'vehicules'  => $vehicules,
            'filters'    => $request->only([
                'search',
                'chauffeur_id',
                'status',
                'capacite_from',
                'capacite_to',
                'sort_by',
                'sort_direction',
                'per_page',
                'page',
            ]),
            'chauffeurs' => $chauffeurs,
        ]);
    }

    public function create()
    {
        $chauffeurs = User::where('role', 'livreur')
            ->select('id', 'nom', 'prenom')
            ->orderBy('nom')
            ->get();

        return Inertia::render('Vehicules/Create', [
            'chauffeurs' => $chauffeurs,
        ]);
    }

    public function store(Request $request)
    {
        // Validation rules
        $rules = [
            'nom'                       => 'required|string|max:255',
            'photo'                     => 'nullable|image|max:2048', // صورة بحد أقصى 2MB
            'matricule'                 => 'required|string|unique:vehicules,matricule|max:50',
            'type'                      => 'nullable|string|max:100',
            'chauffeur_id'              => 'nullable|exists:users,id',
            'capacite_tonne'            => 'nullable|numeric|min:0',
            'consommation_litre_par_km' => 'nullable|numeric|min:0',
            'actif'                     => 'boolean',
            'notes'                     => 'nullable|string|max:1000',
        ];

        $validated = $request->validate($rules);

        // Handle photo upload (if present)
        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('vehicules', 'public');
        }

        Vehicule::create([
            'nom'                       => $validated['nom'],
            'photo'                     => $photoPath,
            'matricule'                 => $validated['matricule'],
            'type'                      => $validated['type'] ?? null,
            'chauffeur_id'              => $validated['chauffeur_id'] ?? null,
            'capacite_tonne'            => $validated['capacite_tonne'] ?? null,
            'consommation_litre_par_km' => $validated['consommation_litre_par_km'] ?? null,
            'actif'                     => $validated['actif'] ?? true,
            'notes'                     => $validated['notes'] ?? null,
        ]);

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule créé avec succès.');
    }

    public function show(Vehicule $vehicule)
    {
        // Eager‐load chauffeur
        $vehicule->load('chauffeur');

        return Inertia::render('Vehicules/Show', [
            'vehicule' => $vehicule,
        ]);
    }

    public function edit(Vehicule $vehicule)
    {
        $vehicule->load('chauffeur');

        $chauffeurs = User::where('role', 'livreur')
            ->select('id', 'nom', 'prenom')
            ->orderBy('nom')
            ->get();

        return Inertia::render('Vehicules/Edit', [
            'vehicule'   => $vehicule,
            'chauffeurs' => $chauffeurs,
        ]);
    }

    public function update(Request $request, Vehicule $vehicule)
    {
        // Validation (unique matricule except current)
        $rules = [
            'nom'                       => 'required|string|max:255',
            'photo'                     => 'nullable|image|max:2048', // يمكن تغيير الصورة
            'matricule'                 => 'required|string|unique:vehicules,matricule,' . $vehicule->id . '|max:50',
            'type'                      => 'nullable|string|max:100',
            'chauffeur_id'              => 'nullable|exists:users,id',
            'capacite_tonne'            => 'nullable|numeric|min:0',
            'consommation_litre_par_km' => 'nullable|numeric|min:0',
            'actif'                     => 'boolean',
            'notes'                     => 'nullable|string|max:1000',
        ];

        $validated = $request->validate($rules);

        // Handle photo: إذا رفع المستخدم صورة جديدة، نحذف القديمة (إن وجدت) ثم نخزن الجديدة
        if ($request->hasFile('photo')) {
            // حذف الصورة القديمة إن وجدت
            if ($vehicule->photo && Storage::disk('public')->exists($vehicule->photo)) {
                Storage::disk('public')->delete($vehicule->photo);
            }
            $photoPath = $request->file('photo')->store('vehicules', 'public');
        } else {
            $photoPath = $vehicule->photo; // إبقِ القديمة إذا لم يُغيّر المستخدم
        }

        $vehicule->update([
            'nom'                       => $validated['nom'],
            'photo'                     => $photoPath,
            'matricule'                 => $validated['matricule'],
            'type'                      => $validated['type'] ?? null,
            'chauffeur_id'              => $validated['chauffeur_id'] ?? null,
            'capacite_tonne'            => $validated['capacite_tonne'] ?? null,
            'consommation_litre_par_km' => $validated['consommation_litre_par_km'] ?? null,
            'actif'                     => $validated['actif'] ?? true,
            'notes'                     => $validated['notes'] ?? null,
        ]);

        return redirect()
            ->route('vehicules.index')
            ->with('success', 'Véhicule mis à jour avec succès.');
    }

    public function destroy(Vehicule $vehicule)
    {
        // حذف الصورة المرتبطة أولاً إن وجدت
        if ($vehicule->photo && Storage::disk('public')->exists($vehicule->photo)) {
            Storage::disk('public')->delete($vehicule->photo);
        }

        $vehicule->delete();
        return redirect()->route('vehicules.index');
    }
}
