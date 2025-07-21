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
        Schema::create('fournisseurs', function (Blueprint $table) {
            $table->id();
            $table->string('nom_societe');
            $table->string('contact_nom')->nullable();
            $table->string('telephone')->nullable();
            $table->string('email')->nullable();
            $table->string('addresse')->nullable();
            $table->string('ice')->unique()->nullable();
            $table->string('rc')->nullable();
            $table->string('if')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fournisseurs');
    }
};
