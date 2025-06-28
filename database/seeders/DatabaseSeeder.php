<?php

namespace Database\Seeders;

use App\Models\Employer;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        Employer::create([
            'nom' => 'Admin',
            'cin' => 'D0000',
            'password' => bcrypt('D0000'),
            'actif' => true,
            'date_embauche' => now(),
            'fonction' => 'directeur'
        ]);
    }
}