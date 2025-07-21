<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'fournisseur_id',
        'quantite_totale',
        'quantite_vendue',
    ];

    protected $casts = [
        'quantite_totale' => 'integer',
        'quantite_vendue' => 'integer',
    ];

    // Relationships
    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function fournisseur(): BelongsTo
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function lignesCommandesClients(): HasMany
    {
        return $this->hasMany(LigneCommandeClient::class);
    }

    // Helper methods
    public function getQuantiteDisponible(): int
    {
        return $this->quantite_totale - $this->quantite_vendue;
    }

    public function isProduitDisponible(int $quantiteDemandee = 1): bool
    {
        return $this->getQuantiteDisponible() >= $quantiteDemandee;
    }

    public function getPourcentageVendu(): float
    {
        if ($this->quantite_totale == 0) {
            return 0;
        }
        return ($this->quantite_vendue / $this->quantite_totale) * 100;
    }

    // Scopes
    public function scopeDisponible($query)
    {
        return $query->whereRaw('quantite_totale > quantite_vendue');
    }

    public function scopeEpuise($query)
    {
        return $query->whereRaw('quantite_totale <= quantite_vendue');
    }
}