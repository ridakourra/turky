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
    Schema::create('rapports_stocks', function (Blueprint $table) {
        $table->id();
        $table->foreignId('stock_id')->constrained('stocks')->cascadeOnDelete();
        $table->foreignId('produit_id')->constrained('produits')->cascadeOnDelete();
        $table->string('type_stock'); // e.g., 'in', 'out'
        $table->integer('quantite');
        $table->decimal('prix_unitaire', 15, 2)->nullable();
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
        Schema::dropIfExists('rapports_stocks');
    }
};