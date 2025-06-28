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
    Schema::create('rapports_commandes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('commande_id')->constrained('commandes')->cascadeOnDelete();
        $table->string('type'); // e.g., 'payment', 'update', etc.
        $table->decimal('montant_totale', 15, 2);
        $table->string('status')->nullable();
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
        Schema::dropIfExists('rapports_commandes');
    }
};