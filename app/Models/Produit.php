<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'image',
        'unite_mesure',
        'prix_unitaire',
        'description',
    ];

    protected $casts = [
        'prix_unitaire' => 'decimal:2',
    ];

    // Relationships
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function salaires(): HasMany
    {
        return $this->hasMany(Salaire::class);
    }

    public function lignesCommandesFournisseurs(): HasMany
    {
        return $this->hasMany(LigneCommandeFournisseur::class);
    }

    // Helper methods
    public function getQuantiteTotaleStock(): int
    {
        return $this->stocks()->sum('quantite_totale');
    }

    public function getQuantiteVendueStock(): int
    {
        return $this->stocks()->sum('quantite_vendue');
    }

    public function getQuantiteDisponibleStock(): int
    {
        return $this->getQuantiteTotaleStock() - $this->getQuantiteVendueStock();
    }
}