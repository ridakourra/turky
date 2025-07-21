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
        Schema::create('commandes_clients', function (Blueprint $table) {
            $table->id();
            $table->foreignId('client_id')->constrained('clients')->onDelete('cascade');
            $table->date('date_commande');
            $table->decimal('montant_total', 15, 2)->nullable();
            $table->decimal('profit_net', 15, 2)->nullable();
            $table->foreignId('vehicule_id')->constrained('vehicules')->onDelete('cascade');
            $table->foreignId('chauffeur_id')->constrained('employees')->onDelete('cascade');
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('commandes_clients');
    }
};
