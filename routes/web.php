<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmployeeController;
use Inertia\Inertia;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CarburantController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\EnginLourdController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeClientController;
use App\Http\Controllers\CommandeFournisseurController;

// Redirect root to dashboard
Route::redirect('/', '/dashboard');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});

// Protected routes
Route::middleware(['auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Entreprise routes
    Route::get('/entreprise', [EntrepriseController::class, 'index'])->name('entreprise.index');
    Route::get('/entreprise/edit', [EntrepriseController::class, 'edit'])->name('entreprise.edit');
    Route::put('/entreprise', [EntrepriseController::class, 'update'])->name('entreprise.update');
    Route::post('/entreprise', [EntrepriseController::class, 'store'])->name('entreprise.store');

    // Client routes
    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');
    Route::get('/clients/create', [ClientController::class, 'create'])->name('clients.create');
    Route::post('/clients', [ClientController::class, 'store'])->name('clients.store');
    Route::get('/clients/{client}', [ClientController::class, 'show'])->name('clients.show');
    Route::get('/clients/{client}/edit', [ClientController::class, 'edit'])->name('clients.edit');
    Route::put('/clients/{client}', [ClientController::class, 'update'])->name('clients.update');
    Route::delete('/clients/{client}', [ClientController::class, 'destroy'])->name('clients.destroy');
    Route::post('/clients/{client}/commandes', [ClientController::class, 'storeCommande'])->name('clients.commandes.store');
    Route::post('/clients/{client}/locations', [ClientController::class, 'storeLocation'])->name('clients.locations.store');

    // Employee routes
    Route::get('/employees', [EmployeeController::class, 'index'])->name('employees.index');
    Route::get('/employees/create', [EmployeeController::class, 'create'])->name('employees.create');
    Route::post('/employees', [EmployeeController::class, 'store'])->name('employees.store');
    Route::get('/employees/{employee}', [EmployeeController::class, 'show'])->name('employees.show');
    Route::get('/employees/{employee}/edit', [EmployeeController::class, 'edit'])->name('employees.edit');
    Route::put('/employees/{employee}', [EmployeeController::class, 'update'])->name('employees.update');
    Route::delete('/employees/{employee}', [EmployeeController::class, 'destroy'])->name('employees.destroy');
    Route::post('/employees/{employee}/absences', [EmployeeController::class, 'storeAbsence'])->name('employees.absences.store');
    Route::post('/employees/{employee}/budgets', [EmployeeController::class, 'storeBudget'])->name('employees.budgets.store');
    Route::put('/employees/{employee}/budgets/{budget}', [EmployeeController::class, 'updateBudget'])->name('employees.budgets.update');
    Route::post('/employees/{employee}/historique', [EmployeeController::class, 'storeHistoriqueTravail'])->name('employees.historique.store');
    Route::post('/employees/{employee}/pay-salary', [EmployeeController::class, 'paySalary'])->name('employees.pay-salary');

    // Vehicle routes
    Route::get('/vehicules', [VehiculeController::class, 'index'])->name('vehicules.index');
    Route::get('/vehicules/create', [VehiculeController::class, 'create'])->name('vehicules.create');
    Route::post('/vehicules', [VehiculeController::class, 'store'])->name('vehicules.store');
    Route::get('/vehicules/{vehicule}', [VehiculeController::class, 'show'])->name('vehicules.show');
    Route::get('/vehicules/{vehicule}/edit', [VehiculeController::class, 'edit'])->name('vehicules.edit');
    Route::put('/vehicules/{vehicule}', [VehiculeController::class, 'update'])->name('vehicules.update');
    Route::delete('/vehicules/{vehicule}', [VehiculeController::class, 'destroy'])->name('vehicules.destroy');
    Route::post('/vehicules/{vehicule}/depenses', [VehiculeController::class, 'storeDepense'])->name('vehicules.depenses.store');
    Route::post('/vehicules/{vehicule}/refill-carburant', [VehiculeController::class, 'refillCarburant'])->name('vehicules.refill-carburant');
    
    // Include engins lourds routes
    require __DIR__ . '/engins-lourds.php';
    
    // Include carburant routes
    require __DIR__ . '/carburant.php';
    
    // Include fournisseurs routes
    require __DIR__ . '/fournisseurs.php';
    
    // Include produits routes
    require __DIR__ . '/produits.php';
    
    // Include commandes clients routes
    require __DIR__ . '/commandes-clients.php';
    
    // Include commandes fournisseurs routes
    require __DIR__ . '/commandes-fournisseurs.php';
    
    // Include transactions routes
    require __DIR__ . '/transactions.php';
});
