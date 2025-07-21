<?php

use App\Http\Controllers\ProduitController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('produits', ProduitController::class);
    
    // Additional stock management routes
    Route::patch('stocks/{stock}', [ProduitController::class, 'updateStock'])->name('stocks.update');
    Route::post('produits/{produit}/stocks', [ProduitController::class, 'addStock'])->name('produits.stocks.store');
});