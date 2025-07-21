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
        Schema::create('budget_chauffeurs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('chauffeur_id')->constrained('employees')->onDelete('cascade');
            $table->decimal('montant', 10, 2);
            $table->date('date_attribution')->default(now());
            $table->enum('statut', ['attribue', 'utilise', 'solde'])->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budget_chauffeurs');
    }
};