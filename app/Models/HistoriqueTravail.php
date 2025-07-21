<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HistoriqueTravail extends Model
{
    use HasFactory;

    protected $table = 'historique_travail';

    protected $fillable = [
        'salaire_id',
        'quantite',
        'date',
    ];

    protected $casts = [
        'quantite' => 'integer',
        'date' => 'date',
    ];

    // Relationships
    public function salaire(): BelongsTo
    {
        return $this->belongsTo(Salaire::class);
    }

    // Helper methods
    public function calculerMontantGagne(): float
    {
        if (!$this->salaire) {
            return 0;
        }

        return $this->quantite * $this->salaire->montant;
    }

    public function getEmployee()
    {
        return $this->salaire?->employee;
    }

    public function getProduit()
    {
        return $this->salaire?->produit;
    }
}