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
    Schema::create('rapports_dettes', function (Blueprint $table) {
        $table->id();
        $table->foreignId('client_id')->constrained('clients')->cascadeOnDelete();
        $table->decimal('montant', 15, 2);
        $table->string('status')->nullable(); // e.g., 'paid', 'unpaid', etc.
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
        Schema::dropIfExists('rapports_dettes');
    }
};
