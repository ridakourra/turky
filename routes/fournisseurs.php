<?php

use App\Http\Controllers\FournisseurController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::resource('fournisseurs', FournisseurController::class);
});