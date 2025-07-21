<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LivraisonCarburant extends Model
{
    use HasFactory;

    protected $table = 'livraisons_carburant';

    protected $fillable = [
        'fournisseur_id',
        'quantite',
        'montant_total',
        'date_livraison',
        'numero_bon',
        'commentaire',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'date_livraison' => 'date',
    ];

    // Relationships
    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    // Helper methods
    public function getPrixUnitaire(): float
    {
        if ($this->quantite == 0) {
            return 0;
        }
        return $this->montant_total / $this->quantite;
    }
}