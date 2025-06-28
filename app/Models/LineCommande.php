<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LineCommande extends Model
{
    use HasFactory;

    protected $table = 'lines_commandes';

    protected $fillable = [
        'commande_id',
        'stock_id',
        'produit_id',
        'prix',
        'quantite'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
        'quantite' => 'integer',
    ];

    // Relationships
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}
