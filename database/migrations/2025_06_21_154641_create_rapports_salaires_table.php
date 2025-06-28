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
    Schema::create('rapports_salaires', function (Blueprint $table) {
        $table->id();
        $table->foreignId('salaire_id')->constrained('salaires')->cascadeOnDelete();
        $table->foreignId('employer_id')->constrained('employers')->cascadeOnDelete();
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
        Schema::dropIfExists('rapports_salaires');
    }
};