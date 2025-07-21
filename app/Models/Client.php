<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom_complet',
        'telephone',
        'addresse',
        'dettes_actuelle',
    ];

    protected $casts = [
        'dettes_actuelle' => 'decimal:2',
    ];

    // Relationships
    public function commandesClients(): HasMany
    {
        return $this->hasMany(CommandeClient::class);
    }

    public function locationEnginsLourds(): HasMany
    {
        return $this->hasMany(LocationEnginLourd::class);
    }

    public function paiements(): HasMany
    {
        return $this->hasMany(Paiement::class);
    }
}
