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
        Schema::create('paiements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('commande_id')->constrained('commandes_clients')->nullOnDelete();
            $table->decimal('montant', 15, 2);
            $table->decimal('montant_paye', 15, 2)->default(0);
            $table->date('date_paiement')->nullable();
            $table->enum('mode_paiement', ['especes', 'cheque', 'virement', 'autre'])->nullable();
            $table->string('reference_transaction')->nullable();
            $table->enum('statut', ['non_paye', 'partiellement_paye','paye'])->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('paiements');
    }
};
