<?php

use App\Http\Controllers\CommandeClientController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('commandes-clients', CommandeClientController::class)
        ->except(['edit', 'update']);

    Route::get('commandes-clients/produits/search', [CommandeClientController::class, 'getProducts'])
        ->name('commandes-clients.produits.search');
});
