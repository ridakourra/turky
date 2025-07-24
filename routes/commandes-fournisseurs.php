<?php

use App\Http\Controllers\CommandeFournisseurController;
use Illuminate\Support\Facades\Route;

// Routes for CommandeFournisseur management
Route::middleware(['auth', 'verified'])->group(function () {
    // Resource routes (excluding edit and update as per requirements)
    Route::resource('commandes-fournisseurs', CommandeFournisseurController::class)
        ->except(['edit', 'update']);

    // Additional route for product search
    Route::get('commandes-fournisseurs/produits/{search?}', [CommandeFournisseurController::class, 'getProducts'])
        ->name('commandes-fournisseurs.produits.search');
});
