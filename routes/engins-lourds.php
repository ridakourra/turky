<?php

use App\Http\Controllers\EnginLourdController;
use Illuminate\Support\Facades\Route;

// Routes pour les engins lourds
Route::prefix('engins-lourds')->name('engins-lourds.')->group(function () {
    Route::get('/', [EnginLourdController::class, 'index'])->name('index');
    Route::get('/create', [EnginLourdController::class, 'create'])->name('create');
    Route::post('/', [EnginLourdController::class, 'store'])->name('store');
    Route::get('/{enginLourd}', [EnginLourdController::class, 'show'])->name('show');
    Route::get('/{enginLourd}/edit', [EnginLourdController::class, 'edit'])->name('edit');
    Route::put('/{enginLourd}', [EnginLourdController::class, 'update'])->name('update');
    Route::delete('/{enginLourd}', [EnginLourdController::class, 'destroy'])->name('destroy');
    
    // Routes pour les actions spéciales
    Route::post('/{enginLourd}/depense', [EnginLourdController::class, 'addDepense'])->name('add-depense');
    Route::post('/{enginLourd}/carburant', [EnginLourdController::class, 'addCarburant'])->name('add-carburant');
});