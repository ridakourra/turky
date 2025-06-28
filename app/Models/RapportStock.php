<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportStock extends Model
{
    use HasFactory;

    protected $table = 'rapports_stocks';

    protected $fillable = [
        'stock_id',
        'produit_id',
        'type_stock',
        'quantite',
        'prix_unitaire',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_unitaire' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function stock()
    {
        return $this->belongsTo(Stock::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }
}