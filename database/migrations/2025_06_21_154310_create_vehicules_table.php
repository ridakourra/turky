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
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('matricule')->unique();
            $table->string('marque')->nullable();
            $table->string('modele')->nullable();
            $table->string('type')->nullable();
            $table->string('capacite')->nullable();
            $table->year('annee')->nullable();
            $table->integer('kilometrage')->nullable();
            $table->string('carburant_type')->nullable();
            $table->string('numero_chassis')->nullable();
            $table->string('numero_moteur')->nullable();
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
        Schema::dropIfExists('vehicules');
    }
};