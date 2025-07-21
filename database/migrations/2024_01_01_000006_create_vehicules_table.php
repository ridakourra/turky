<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('matricule')->unique();
            $table->string('marque');
            $table->string('modele')->nullable();
            $table->year('annee')->nullable();
            $table->enum('type_vehicule', ['camion', 'voiture', 'autre']);
            $table->decimal('capacite', 10, 2)->nullable();
            $table->enum('statut', ['actif', 'en_maintenance', 'hors_service'])->nullable();
            $table->date('date_acquisition')->nullable();
            $table->decimal('prix_acquisition', 15, 2)->nullable();
            $table->foreignId('chauffeur_id')->nullable()->constrained('employees')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};