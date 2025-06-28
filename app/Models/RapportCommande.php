<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportCommande extends Model
{
    use HasFactory;

    protected $table = 'rapports_commandes';

    protected $fillable = [
        'commande_id',
        'type',
        'montant_totale',
        'status',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'montant_totale' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }
}