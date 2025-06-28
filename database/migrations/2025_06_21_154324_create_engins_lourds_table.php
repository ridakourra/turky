<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('engins_lourds', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('reference')->unique();
            $table->string('type')->nullable();
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->string('capacite')->nullable();
            $table->year('annee')->nullable();
            $table->string('numero_serie')->nullable();
            $table->string('numero_moteur')->nullable();
            $table->decimal('location_par_heure', 10, 2)->nullable();
            $table->string('carburant_type')->nullable();
            $table->date('date_assurance')->nullable();
            $table->string('statut')->default('available');
            $table->foreignId('employer_id')->nullable()->constrained('employers')->nullOnDelete();
            $table->timestamps();
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('engins_lourds');
    }
};