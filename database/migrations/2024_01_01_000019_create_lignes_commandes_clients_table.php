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
        Schema::create('lignes_commandes_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes_clients')->onDelete('cascade');
            $table->foreignId('stock_id')->constrained('stocks')->onDelete('cascade');
            $table->decimal('quantite', 10, 2);
            $table->decimal('prix_achat', 10, 2); // Purchase price
            $table->decimal('prix_vente', 10, 2); // Selling price for this order
            $table->decimal('montant_total', 15, 2); // Total amount for the quantity
            $table->decimal('marge_beneficiaire', 15, 2); // Profit margin for this quantity
            $table->foreignId('vehicule_id')->constrained('vehicules')->onDelete('cascade');
            $table->foreignId('chauffeur_id')->constrained('employees')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lignes_commandes_clients');
    }
};
