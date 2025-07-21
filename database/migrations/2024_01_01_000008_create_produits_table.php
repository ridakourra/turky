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
        Schema::create('produits', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('image')->nullable();
            $table->enum('unite_mesure', ['kg', 'litre', 'piece', 'metre', 'metre_cube', 'tonne', 'gramme', 'centimetre', 'millimetre', 'carton', 'boite', 'sac', 'rouleau', 'unite']);
            $table->decimal('prix_unitaire', 10, 2)->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('produits');
    }
};
