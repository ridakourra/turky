<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commande extends Model
{
    use HasFactory;

    protected $fillable = [
        'client_id',
        'montant_totale',
        'revenu',
        'status'
    ];

    protected $casts = [
        'montant_totale' => 'decimal:2',
        'revenu' => 'decimal:2',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function lines()
    {
        return $this->hasMany(LineCommande::class);
    }

    public function livraisons()
    {
        return $this->hasMany(Livraison::class);
    }

    public function rapports()
    {
        return $this->hasMany(RapportCommande::class);
    }
}