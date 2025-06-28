<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $fillable = [
        'produit_id',
        'fabrique',
        'prix_unitaire',
        'fournisseur_id',
        'quantite'
    ];

    protected $casts = [
        'fabrique' => 'boolean',
        'prix_unitaire' => 'decimal:2',
        'quantite' => 'integer',
    ];

    // Relationships
    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function linesCommandes()
    {
        return $this->hasMany(LineCommande::class);
    }

    public function rapportsStocks()
    {
        return $this->hasMany(RapportStock::class);
    }
}