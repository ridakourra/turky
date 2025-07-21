<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Fournisseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_societe',
        'contact_nom',
        'telephone',
        'email',
        'addresse',
        'ice',
        'rc',
        'if',
    ];

    // Relationships
    public function stocks(): HasMany
    {
        return $this->hasMany(Stock::class);
    }

    public function commandesFournisseurs(): HasMany
    {
        return $this->hasMany(CommandeFournisseur::class);
    }

    public function livraisonsCarburant(): HasMany
    {
        return $this->hasMany(LivraisonCarburant::class);
    }
}