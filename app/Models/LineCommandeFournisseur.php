<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineCommandeFournisseur extends Model
{
    use HasFactory;

    protected $table = 'lines_commandes_fournisseurs';

    protected $fillable = [
        'commande_fournisseur_id',
        'produit_id',
        'quantite',
        'prix_unitaire',
        'totale_montant'
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_unitaire' => 'decimal:2',
        'totale_montant' => 'decimal:2',
    ];

    // Relationships
    public function commandeFournisseur()
    {
        return $this->belongsTo(CommandeFournisseur::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}