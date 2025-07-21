<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CommandeFournisseur extends Model
{
    use HasFactory;

    protected $table = 'commandes_fournisseurs';

    protected $fillable = [
        'fournisseur_id',
        'date_commande',
        'montant_total',
        'commentaire',
    ];

    protected $casts = [
        'date_commande' => 'date',
        'montant_total' => 'decimal:2',
    ];

    // Relationships
    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function lignesCommandes(): HasMany
    {
        return $this->hasMany(LigneCommandeFournisseur::class, 'commande_id');
    }

    // Helper methods
    public function calculerMontantTotal(): float
    {
        return $this->lignesCommandes()->sum('montant_total');
    }

    public function getNombreProduits(): int
    {
        return $this->lignesCommandes()->count();
    }

    public function getQuantiteTotale(): float
    {
        return $this->lignesCommandes()->sum('quantite');
    }
}