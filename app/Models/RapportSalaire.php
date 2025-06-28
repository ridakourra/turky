<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportSalaire extends Model
{
    use HasFactory;

    protected $table = 'rapports_salaires';

    protected $fillable = [
        'salaire_id',
        'employer_id',
        'montant',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function salaire()
    {
        return $this->belongsTo(Salaire::class);
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}