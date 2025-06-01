<?php

namespace Database\Seeders;

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

        User::create([
            'nom' => 'Admin',
            'prenom' => 'Admin',
            'cin' => 'A0000',
            'password' => 'A0000',
            'role' => 'directeur'
        ]);

        $i = 3;
        while($i > 0){
            User::create([
                'nom' => "Comptable{$i}",
                'prenom' => "Comptable{$i}",
                'cin' => "C{$i}000",
                'password' => "C{$i}000",
                'role' => 'comptable'
            ]);
            $i--;
        }


        User::create([
            'nom' => 'Mister',
            'prenom' => 'Livreur',
            'cin' => 'L0000',
            'password' => 'L0000',
            'role' => 'livreur'
        ]);


        User::factory(100)->create();
    }
}
