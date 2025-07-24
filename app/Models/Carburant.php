<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Carburant extends Model
{
    use HasFactory;

    protected $table = 'carburant';

    protected $fillable = [
        'capacite_maximale',
        'niveau_actuel',
        'seuil_alerte',
    ];

    protected $casts = [
        'capacite_maximale' => 'decimal:2',
        'niveau_actuel' => 'decimal:2',
        'seuil_alerte' => 'decimal:2',
    ];

    // Relationships
    public function livraisons(): HasMany
    {
        return $this->hasMany(LivraisonCarburant::class);
    }

    public function utilisations(): HasMany
    {
        return $this->hasMany(UtilisationCarburant::class);
    }
}