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
        Schema::create('utilisations_carburant', function (Blueprint $table) {
            $table->id();
            $table->morphs('machine'); // vehicule or engin lourd
            $table->decimal('quantite', 10, 2);
            $table->date('date_utilisation')->default(now());
            $table->text('commentaire')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('utilisations_carburant');
    }
};
