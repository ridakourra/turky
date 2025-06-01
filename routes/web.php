<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VehiculeController;
use Inertia\Inertia;

Route::middleware('auth')->group(function () {
    Route::get('/', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');



    // Users
    Route::resource('users', UserController::class);

    // Export/Import routes
    Route::get('users/export/csv', [UserController::class, 'export'])->name('users.export');
    Route::get('users/export/excel', [UserController::class, 'exportExcel'])->name('users.export.excel');
    Route::post('users/import', [UserController::class, 'import'])->name('users.import');


    // Vehicules
    Route::resource('vehicules', VehiculeController::class);

});


Route::middleware('guest')->group(function () {
    Route::get('login', [AuthController::class, 'showLogin'])->name('login');
    Route::post('login', [AuthController::class, 'login']);
});

Route::any('logout', [AuthController::class, 'logout'])
    ->middleware('auth')
    ->name('logout');

