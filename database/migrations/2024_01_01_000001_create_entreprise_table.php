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
        Schema::create('entreprise', function (Blueprint $table) {
            $table->id();
            $table->string('nom_entreprise')->default('Turky');
            $table->string('ice')->nullable(); // Identifiant Commun de l'Entreprise
            $table->string('rc')->nullable(); // Registre de Commerce
            $table->string('cnss')->nullable(); // Numéro CNSS
            $table->string('if')->nullable(); // Identifiant Fiscal
            $table->string('logo')->nullable();
            $table->text('description')->nullable();
            $table->date('date_creation')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entreprise');
    }
};