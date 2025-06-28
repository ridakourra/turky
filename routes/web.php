<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\EntrepriseController;
use App\Http\Controllers\EmployerController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\FournisseurController;
use App\Http\Controllers\VehiculeController;
use App\Http\Controllers\EnginLourdController;
use App\Http\Controllers\ProduitController;
use App\Http\Controllers\CommandeController;
use App\Http\Controllers\CommandeFournisseurController;
use App\Http\Controllers\RapportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
});


Route::middleware('auth')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'destroy'])->name('logout');

    // Dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    // Entreprise Routes
    Route::prefix('entreprise')->name('entreprise.')->group(function () {
        Route::get('/', [EntrepriseController::class, 'index'])->name('index');
        Route::get('/edit', [EntrepriseController::class, 'edit'])->name('edit');
        Route::post('/update', [EntrepriseController::class, 'update'])->name('update');
    });

    // Employer Routes
    Route::middleware(['auth'])->group(function () {
        // Standard CRUD routes for employers
        Route::resource('employers', EmployerController::class);

        // Special routes for employer management
        Route::post('/employers/{employer}/add-absence', [EmployerController::class, 'addAbsence'])
            ->name('employers.add-absence');

        Route::post('/employers/{employer}/add-budget', [EmployerController::class, 'addBudget'])
            ->name('employers.add-budget');

        // Export route for employers
        Route::get('/employers/export/data', [EmployerController::class, 'export'])
            ->name('employers.export');
    });

    // Clients Routes
    Route::prefix('clients')->name('clients.')->group(function () {
        Route::get('/', [ClientController::class, 'index'])->name('index');
        Route::get('/create', [ClientController::class, 'create'])->name('create');
        Route::post('/', [ClientController::class, 'store'])->name('store');
        Route::get('/{client}', [ClientController::class, 'show'])->name('show');
        Route::get('/{client}/edit', [ClientController::class, 'edit'])->name('edit');
        Route::put('/{client}', [ClientController::class, 'update'])->name('update');
        Route::delete('/{client}', [ClientController::class, 'destroy'])->name('destroy');
        Route::get('/export', [ClientController::class, 'export'])->name('export');

        // Debt management
        Route::post('/{client}/clear-debt', [ClientController::class, 'clearDebt'])->name('clear-debt');

        // Route::get('/', function(){} )->name('clients.bulk-delete');
    });
    // Dans votre fichier routes/web.php, ajoutez ces routes :
    Route::post('/clients/{client}/louer-engin', [ClientController::class, 'louerEnginLourd'])->name('clients.louer-engin');
    Route::get('/api/engins-disponibles', [ClientController::class, 'getEnginsDisponibles'])->name('api.engins-disponibles');

    // Fournisseurs Routes
    Route::prefix('fournisseurs')->name('fournisseurs.')->group(function () {
        Route::get('/', [FournisseurController::class, 'index'])->name('index');
        Route::get('/create', [FournisseurController::class, 'create'])->name('create');
        Route::post('/', [FournisseurController::class, 'store'])->name('store');
        Route::get('/{fournisseur}', [FournisseurController::class, 'show'])->name('show');
        Route::get('/{fournisseur}/edit', [FournisseurController::class, 'edit'])->name('edit');
        Route::put('/{fournisseur}', [FournisseurController::class, 'update'])->name('update');
        Route::delete('/{fournisseur}', [FournisseurController::class, 'destroy'])->name('destroy');
        Route::get('/export', [FournisseurController::class, 'export'])->name('export');
    });

    // Vehicules Routes
    Route::prefix('vehicules')->name('vehicules.')->group(function () {
        Route::get('/', [VehiculeController::class, 'index'])->name('index');
        Route::get('/create', [VehiculeController::class, 'create'])->name('create');
        Route::post('/', [VehiculeController::class, 'store'])->name('store');
        Route::get('/{vehicule}', [VehiculeController::class, 'show'])->name('show');
        Route::get('/{vehicule}/edit', [VehiculeController::class, 'edit'])->name('edit');
        Route::put('/{vehicule}', [VehiculeController::class, 'update'])->name('update');
        Route::delete('/{vehicule}', [VehiculeController::class, 'destroy'])->name('destroy');
        Route::get('/export', [VehiculeController::class, 'export'])->name('export');
    });

    // Engins Lourds Routes
    Route::prefix('engins-lourds')->name('engins-lourds.')->group(function () {
        Route::get('/', [EnginLourdController::class, 'index'])->name('index');
        Route::get('/create', [EnginLourdController::class, 'create'])->name('create');
        Route::post('/', [EnginLourdController::class, 'store'])->name('store');
        Route::get('/{enginLourd}', [EnginLourdController::class, 'show'])->name('show');
        Route::get('/{enginLourd}/edit', [EnginLourdController::class, 'edit'])->name('edit');
        Route::put('/{enginLourd}', [EnginLourdController::class, 'update'])->name('update');
        Route::delete('/{enginLourd}', [EnginLourdController::class, 'destroy'])->name('destroy');

        // Additional routes
        Route::post('/bulk-delete', [EnginLourdController::class, 'bulkDelete'])->name('bulk-delete');
        Route::get('/export', [EnginLourdController::class, 'export'])->name('export');
    });



    // Produits Routes
    Route::prefix('produits')->name('produits.')->group(function () {
        Route::get('/', [ProduitController::class, 'index'])->name('index');
        Route::get('/create', [ProduitController::class, 'create'])->name('create');
        Route::post('/', [ProduitController::class, 'store'])->name('store');
        Route::get('/{produit}', [ProduitController::class, 'show'])->name('show');
        Route::get('/{produit}/edit', [ProduitController::class, 'edit'])->name('edit');
        Route::put('/{produit}', [ProduitController::class, 'update'])->name('update');
        Route::delete('/{produit}', [ProduitController::class, 'destroy'])->name('destroy');
        Route::get('/export', [ProduitController::class, 'export'])->name('export');

        // Stock management
        Route::post('/{produit}/stock/add', [ProduitController::class, 'addStock'])->name('add-stock');
        Route::put('/{produit}/stock/{stock}', [ProduitController::class, 'updateStock'])->name('update-stock');
    });

    // Commandes Routes
    Route::prefix('commandes')->name('commandes.')->group(function () {
        Route::get('/', [CommandeController::class, 'index'])->name('index');
        Route::get('/create', [CommandeController::class, 'create'])->name('create');
        Route::post('/', [CommandeController::class, 'store'])->name('store');
        Route::get('/{commande}', [CommandeController::class, 'show'])->name('show');
        Route::get('/{commande}/edit', [CommandeController::class, 'edit'])->name('edit');
        Route::put('/{commande}', [CommandeController::class, 'update'])->name('update');
        Route::delete('/{commande}', [CommandeController::class, 'destroy'])->name('destroy');
        Route::get('/export', [CommandeController::class, 'export'])->name('export');

        // Order line management
        Route::post('/{commande}/lines', [CommandeController::class, 'addLine'])->name('add-line');
        Route::put('/{commande}/lines/{line}', [CommandeController::class, 'updateLine'])->name('update-line');
        Route::delete('/{commande}/lines/{line}', [CommandeController::class, 'removeLine'])->name('remove-line');
    });

    // Commandes Fournisseurs Routes
    Route::prefix('commandes-fournisseurs')->name('commandes-fournisseurs.')->group(function () {
        Route::get('/', [CommandeFournisseurController::class, 'index'])->name('index');
        Route::get('/create', [CommandeFournisseurController::class, 'create'])->name('create');
        Route::post('/', [CommandeFournisseurController::class, 'store'])->name('store');
        Route::get('/{commandeFournisseur}', [CommandeFournisseurController::class, 'show'])->name('show');
        Route::get('/{commandeFournisseur}/edit', [CommandeFournisseurController::class, 'edit'])->name('edit');
        Route::put('/{commandeFournisseur}', [CommandeFournisseurController::class, 'update'])->name('update');
        Route::delete('/{commandeFournisseur}', [CommandeFournisseurController::class, 'destroy'])->name('destroy');
        Route::get('/export', [CommandeFournisseurController::class, 'export'])->name('export');
    });

    // Rapports Routes
    Route::prefix('rapports')->name('rapports.')->group(function () {
        Route::get('/', [RapportController::class, 'index'])->name('index');
        Route::get('/{rapport}', [RapportController::class, 'show'])->name('show');
        Route::get('/export', [RapportController::class, 'export'])->name('export');

        // Specific report types
        Route::get('/type/commandes', [RapportController::class, 'commandesReport'])->name('commandes');
        Route::get('/type/stocks', [RapportController::class, 'stocksReport'])->name('stocks');
        Route::get('/type/salaires', [RapportController::class, 'salairesReport'])->name('salaires');
        Route::get('/type/dettes', [RapportController::class, 'dettesReport'])->name('dettes');
        Route::get('/type/vehicules', [RapportController::class, 'vehiculesReport'])->name('vehicules');
        Route::get('/type/engins-lourds', [RapportController::class, 'enginsLourdsReport'])->name('engins-lourds');

        // Report filtering
        Route::get('/filter/today', [RapportController::class, 'todayReports'])->name('today');
        Route::get('/filter/this-month', [RapportController::class, 'thisMonthReports'])->name('this-month');
        Route::get('/filter/this-year', [RapportController::class, 'thisYearReports'])->name('this-year');
    });

    // API Routes for AJAX requests
    Route::prefix('api')->name('api.')->group(function () {
        // Dashboard API
        Route::get('/dashboard/metrics', [DashboardController::class, 'getMetrics'])->name('dashboard.metrics');
        Route::get('/dashboard/chart-data', [DashboardController::class, 'getChartData'])->name('dashboard.chart-data');

        // Search endpoints
        Route::get('/search/clients', [ClientController::class, 'search'])->name('search.clients');
        Route::get('/search/produits', [ProduitController::class, 'search'])->name('search.produits');
        Route::get('/search/employers', [EmployerController::class, 'search'])->name('search.employers');
        Route::get('/search/vehicules', [VehiculeController::class, 'search'])->name('search.vehicules');
        Route::get('/search/fournisseurs', [FournisseurController::class, 'search'])->name('search.fournisseurs');

        // Stock availability check
        Route::get('/stock/availability/{produit}', [ProduitController::class, 'checkAvailability'])->name('stock.availability');

        // Price calculation
        Route::post('/commande/calculate-total', [CommandeController::class, 'calculateTotal'])->name('commande.calculate-total');
    });
});
