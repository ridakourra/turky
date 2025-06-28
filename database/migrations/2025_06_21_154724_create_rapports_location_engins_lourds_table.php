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
    Schema::create('rapports_location_engins_lourds', function (Blueprint $table) {
        $table->id();
        $table->foreignId('engin_lourd_id')->constrained('engins_lourds')->cascadeOnDelete();
        $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
        $table->integer('quantite');
        $table->decimal('prix_par_heure', 15, 2);
        $table->decimal('montant_totale', 15, 2);
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
        Schema::dropIfExists('rapports_location_engins_lourds');
    }
};