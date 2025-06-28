<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'cin',
        'telephone',
        'adresse',
        'dettes'
    ];

    protected $casts = [
        'dettes' => 'decimal:2',
    ];

    // Relationships
    public function commandes()
    {
        return $this->hasMany(Commande::class);
    }

    public function rapportsDettes()
    {
        return $this->hasMany(RapportDette::class);
    }

    public function rapportsLocationEnginsLourds()
    {
        return $this->hasMany(RapportLocationEnginLourd::class);
    }
}
