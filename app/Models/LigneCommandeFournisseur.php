<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneCommandeFournisseur extends Model
{
    use HasFactory;

    protected $table = 'lignes_commandes_fournisseurs';

    protected $fillable = [
        'commande_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'montant_total',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'prix_unitaire' => 'decimal:2',
        'montant_total' => 'decimal:2',
    ];

    // Relationships
    public function commande(): BelongsTo
    {
        return $this->belongsTo(CommandeFournisseur::class, 'commande_id');
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    // Helper methods
    public function calculerMontantTotal(): float
    {
        return $this->quantite * $this->prix_unitaire;
    }
}