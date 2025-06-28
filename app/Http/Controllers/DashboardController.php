<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Commande;
use App\Models\Produit;
use App\Models\Employer;
use App\Models\Client;
use App\Models\Vehicule;
use App\Models\EnginLourd;
use App\Models\RapportCommande;
use App\Models\RapportStock;
use App\Models\RapportSalaire;
use App\Models\RapportDepenseVehicule;
use App\Models\RapportLocationEnginLourd;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $year = $request->get('year', date('Y'));
        $month = $request->get('month', date('n'));

        // Date filters
        $startDate = Carbon::create($year, $month, 1)->startOfMonth();
        $endDate = Carbon::create($year, $month, 1)->endOfMonth();

        // Calculate revenue and profits
        $revenueData = $this->calculateRevenue($startDate, $endDate);

        // Get counts
        $counts = $this->getCounts();

        // Get recent data
        $recentData = $this->getRecentData();

        // Get chart data for the year
        $chartData = $this->getChartData($year);

        return Inertia::render('Dashboard', [
            'metrics' => [
                'revenue_net' => $revenueData['net'],
                'revenue_gross' => $revenueData['gross'],
                'products_count' => $counts['products'],
                'orders_count' => $counts['orders'],
                'vehicles_count' => $counts['vehicles'] + $counts['engins'],
                'employees_count' => $counts['employees'],
                'clients_count' => $counts['clients'],
            ],
            'recent' => $recentData,
            'chartData' => $chartData,
            'filters' => [
                'year' => (int)$year,
                'month' => (int)$month,
                'available_years' => $this->getAvailableYears(),
                'months' => $this->getMonthsArray()
            ]
        ]);
    }

    private function calculateRevenue($startDate, $endDate)
    {
        // Gross revenue from orders
        $grossRevenue = Commande::whereBetween('created_at', [$startDate, $endDate])
            ->where('status', '!=', 'cancelled')
            ->sum('revenu');

        // Add heavy equipment rental revenue
        $rentalRevenue = RapportLocationEnginLourd::whereBetween('date_operation', [$startDate, $endDate])
            ->sum('montant_totale');

        $totalGrossRevenue = $grossRevenue + $rentalRevenue;

        // Calculate expenses
        $salaryExpenses = RapportSalaire::whereBetween('date_operation', [$startDate, $endDate])
            ->sum('montant');

        $vehicleExpenses = RapportDepenseVehicule::whereBetween('date_operation', [$startDate, $endDate])
            ->sum('montant');

        // Cost of goods sold (approximate from stock reports)
        $stockCosts = RapportStock::whereBetween('date_operation', [$startDate, $endDate])
            ->where('type_stock', 'sortie')
            ->sum(DB::raw('quantite * prix_unitaire'));

        $totalExpenses = $salaryExpenses + $vehicleExpenses + $stockCosts;

        return [
            'gross' => $totalGrossRevenue,
            'net' => $totalGrossRevenue - $totalExpenses
        ];
    }

    private function getCounts()
    {
        return [
            'products' => Produit::count(),
            'orders' => Commande::count(),
            'vehicles' => Vehicule::count(),
            'engins' => EnginLourd::count(),
            'employees' => Employer::where('actif', true)->count(),
            'clients' => Client::count()
        ];
    }

    private function getRecentData()
    {
        return [
            'clients' => Client::latest()
                ->take(5)
                ->get(['id', 'nom', 'telephone', 'dettes', 'created_at']),

            'orders' => Commande::with('client:id,nom')
                ->latest()
                ->take(5)
                ->get(['id', 'client_id', 'montant_totale', 'status', 'created_at']),

            'products' => Produit::withSum('stocks', 'quantite')
                ->latest()
                ->take(5)
                ->get(['id', 'nom', 'prix', 'unite', 'created_at'])
        ];
    }

    private function getChartData($year)
    {
        $months = collect(range(1, 12))->map(function ($month) use ($year) {
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = Carbon::create($year, $month, 1)->endOfMonth();

            $revenue = Commande::whereBetween('created_at', [$startDate, $endDate])
                ->where('status', '!=', 'cancelled')
                ->sum('revenu');

            $rentalRevenue = RapportLocationEnginLourd::whereBetween('date_operation', [$startDate, $endDate])
                ->sum('montant_totale');

            $expenses = RapportSalaire::whereBetween('date_operation', [$startDate, $endDate])
                ->sum('montant') +
                RapportDepenseVehicule::whereBetween('date_operation', [$startDate, $endDate])
                ->sum('montant');

            return [
                'month' => $this->getMonthName($month),
                'revenue' => $revenue + $rentalRevenue,
                'expenses' => $expenses,
                'profit' => ($revenue + $rentalRevenue) - $expenses
            ];
        });

        return $months;
    }

    private function getAvailableYears()
    {
        $firstOrderYear = Commande::orderBy('created_at')->value('created_at');
        $currentYear = date('Y');

        if (!$firstOrderYear) {
            return [$currentYear];
        }

        $startYear = Carbon::parse($firstOrderYear)->year;
        return range($startYear, $currentYear);
    }

    private function getMonthsArray()
    {
        return [
            1 => 'Janvier',
            2 => 'Février',
            3 => 'Mars',
            4 => 'Avril',
            5 => 'Mai',
            6 => 'Juin',
            7 => 'Juillet',
            8 => 'Août',
            9 => 'Septembre',
            10 => 'Octobre',
            11 => 'Novembre',
            12 => 'Décembre'
        ];
    }

    private function getMonthName($month)
    {
        $months = $this->getMonthsArray();
        return $months[$month];
    }
}