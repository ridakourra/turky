<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BudgetChiffeur extends Model
{
    use HasFactory;

    protected $table = 'budgets_chiffeurs';

    protected $fillable = [
        'employer_id',
        'montant',
        'date',
        'note'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date' => 'date',
    ];

    // Relationships
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}
