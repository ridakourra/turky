<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Entreprise;
use App\Models\Employee;
use App\Models\Carburant;
use App\Models\Salaire;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create the company
        Entreprise::create([
            'nom_entreprise' => 'Turky',
            'ice' => '123456789',
            'rc' => 'RC123456',
            'cnss' => 'CNSS123456',
            'if' => 'IF123456',
            'description' => 'Entreprise de transport et logistique',
            'date_creation' => now()
        ]);

        // Create director account
        $directeur = Employee::create([
            'nom_complet' => 'Admin Directeur',
            'telephone' => '0600000000',
            'addresse' => 'Casablanca',
            'cin' => 'BE123456',
            'password' => Hash::make('password123'),
            'role' => 'directeur',
            'date_embauche' => now(),
            'actif' => true
        ]);

        Salaire::create([
            'employee_id' => $directeur->id,
            'type' => 'mensuel',
            'montant' => 20000
        ]);

        // Create accountant account
        $comptable = Employee::create([
            'nom_complet' => 'Comptable Principal',
            'telephone' => '0600000001',
            'addresse' => 'Casablanca',
            'cin' => 'BE123457',
            'password' => Hash::make('password123'),
            'role' => 'comptable',
            'date_embauche' => now(),
            'actif' => true
        ]);

        Salaire::create([
            'employee_id' => $comptable->id,
            'type' => 'mensuel',
            'montant' => 10000
        ]);

        // Create fuel storage
        Carburant::create([
            'capacite_maximale' => 10000,
            'niveau_actuel' => 5000,
            'seuil_alerte' => 1000
        ]);
    }
}
