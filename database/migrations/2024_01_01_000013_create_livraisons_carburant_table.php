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
        Schema::create('livraisons_carburant', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fournisseur_id')->constrained('fournisseurs')->onDelete('cascade');
            $table->decimal('quantite', 10, 2);
            $table->decimal('montant_total', 15, 2)->nullable();
            $table->date('date_livraison')->default(now());
            $table->string('numero_bon')->nullable();
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraisons_carburant');
    }
};