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
        Schema::create('vehicules', function (Blueprint $table) {
            $table->id();
            $table->string('nom'); // اسم الشاحنة أو رمزها الداخلي
            $table->string('photo')->nullable();
            $table->string('matricule')->unique(); // رقم التسجيل
            $table->string('type')->nullable(); // نوع الشاحنة
            $table->foreignId('chauffeur_id')->nullable()->constrained('users')->nullOnDelete(); // السائق
            $table->decimal('capacite_tonne', 8, 2)->nullable(); // السعة بالطن
            $table->decimal('consommation_litre_par_km', 8, 4)->nullable(); // استهلاك البنزين
            $table->boolean('actif')->default(true); // حالة الشاحنة
            $table->text('notes')->nullable(); // ملاحظات إضافية
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicules');
    }
};
