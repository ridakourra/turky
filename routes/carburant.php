<?php

use App\Http\Controllers\CarburantController;
use Illuminate\Support\Facades\Route;

// Routes pour la gestion du carburant
Route::middleware(['auth', 'verified'])->group(function () {
    // Page principale du carburant
    Route::get('/carburant', [CarburantController::class, 'index'])->name('carburant.index');
    
    // Ajouter une livraison de carburant
    Route::post('/carburant/livraison', [CarburantController::class, 'ajouterLivraison'])->name('carburant.ajouter-livraison');
    
    // Mettre à jour les paramètres du carburant
    Route::put('/carburant/parametres', [CarburantController::class, 'updateParametres'])->name('carburant.update-parametres');
    
    // API pour obtenir les statistiques
    Route::get('/carburant/statistiques', [CarburantController::class, 'getStatistiques'])->name('carburant.statistiques');
});