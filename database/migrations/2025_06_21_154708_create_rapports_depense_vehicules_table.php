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
    Schema::create('rapports_depense_vehicules', function (Blueprint $table) {
        $table->id();
        $table->foreignId('vehicule_id')->constrained('vehicules')->cascadeOnDelete();
        $table->string('type_depense')->nullable();
        $table->decimal('montant', 15, 2);
        $table->date('date_operation')->nullable();
        $table->text('remarques')->nullable();
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rapports_depense_vehicules');
    }
};