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
        Schema::create('employees', function (Blueprint $table) {
            $table->id();
            $table->string('nom_complet');
            $table->string('telephone')->nullable();
            $table->string('addresse')->nullable();
            $table->string('cin')->unique();
            $table->string('password')->nullable();
            $table->enum('role', ['directeur', 'comptable', 'chauffeur', 'ouvrier']);
            $table->date('date_embauche')->default(now());
            $table->boolean('actif')->default(1);
            $table->date('date_dernier_salaire')->nullable()->default(now());
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employees');
    }
};
