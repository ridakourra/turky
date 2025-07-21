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
        Schema::create('depenses_machines', function (Blueprint $table) {
            $table->id();
            $table->morphs('machine');
            $table->enum('type_depense', ['carburant', 'maintenance', 'reparation', 'assurance', 'autre']);
            $table->decimal('montant', 15, 2);
            $table->date('date_depense')->nullable();
            $table->text('description')->nullable();
            $table->string('facture_reference')->nullable();
            $table->timestamps();
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('depenses_machines');
    }
};
