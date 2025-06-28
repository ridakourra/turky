<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('livraisons', function (Blueprint $table) {
        $table->id();
        $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
        $table->foreignId('vehicule_id')->nullable()->constrained('vehicules')->nullOnDelete();
        $table->foreignId('employer_id')->nullable()->constrained('employers')->nullOnDelete();
        $table->string('adresse')->nullable();
        $table->date('date')->nullable();
        $table->string('status')->default('pending');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('livraisons');
    }
};
