<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Paiement extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'montant',
        'montant_paye',
        'date_paiement',
        'mode_paiement',
        'reference_transaction',
        'statut',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'montant_paye' => 'decimal:2',
        'date_paiement' => 'date',
    ];

    // Relationships
    public function commande(): BelongsTo
    {
        return $this->belongsTo(CommandeClient::class, 'commande_id');
    }

    // Helper methods
    public function getMontantRestant(): float
    {
        return $this->montant - $this->montant_paye;
    }

    public function getPourcentagePaye(): float
    {
        if ($this->montant == 0) {
            return 0;
        }
        return ($this->montant_paye / $this->montant) * 100;
    }

    public function isCompletementPaye(): bool
    {
        return $this->montant_paye >= $this->montant;
    }

    public function isPartiellementPaye(): bool
    {
        return $this->montant_paye > 0 && $this->montant_paye < $this->montant;
    }

    public function isNonPaye(): bool
    {
        return $this->montant_paye == 0;
    }

    // Scopes
    public function scopeNonPaye($query)
    {
        return $query->where('statut', 'non_paye');
    }

    public function scopePartiellementPaye($query)
    {
        return $query->where('statut', 'partiellement_paye');
    }

    public function scopePaye($query)
    {
        return $query->where('statut', 'paye');
    }

    public function scopeEspeces($query)
    {
        return $query->where('mode_paiement', 'especes');
    }

    public function scopeCheque($query)
    {
        return $query->where('mode_paiement', 'cheque');
    }

    public function scopeVirement($query)
    {
        return $query->where('mode_paiement', 'virement');
    }
}