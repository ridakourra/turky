<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class EnginLourd extends Model
{
    use HasFactory;

    protected $table = 'engins_lourds';

    protected $fillable = [
        'reference',
        'marque',
        'modele',
        'type_engin',
        'capacite',
        'statut',
        'date_acquisition',
        'prix_acquisition',
    ];

    protected $casts = [
        'capacite' => 'decimal:2',
        'date_acquisition' => 'date',
        'prix_acquisition' => 'decimal:2',
    ];

    // Relationships
    public function locationsEnginsLourds(): HasMany
    {
        return $this->hasMany(LocationEnginLourd::class, 'engin_id');
    }

    public function utilisationsCarburant(): MorphMany
    {
        return $this->morphMany(UtilisationCarburant::class, 'machine');
    }

    public function depensesMachines(): MorphMany
    {
        return $this->morphMany(DepenseMachine::class, 'machine');
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'reference');
    }

    // Scopes
    public function scopeActif($query)
    {
        return $query->where('statut', 'actif');
    }

    public function scopeEnMaintenance($query)
    {
        return $query->where('statut', 'en_maintenance');
    }

    public function scopeHorsService($query)
    {
        return $query->where('statut', 'hors_service');
    }
}