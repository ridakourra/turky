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
        Schema::create('lignes_commandes_fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes_fournisseurs')->onDelete('cascade');
            $table->foreignId('produit_id')->constrained('produits')->onDelete('cascade');
            $table->decimal('quantite', 10, 2);
            $table->decimal('prix_unitaire', 10, 2);
            $table->decimal('montant_total', 15, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lignes_commandes_fournisseurs');
    }
};