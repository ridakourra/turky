<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'matricule',
        'marque',
        'modele',
        'annee',
        'type_vehicule',
        'capacite',
        'statut',
        'date_acquisition',
        'prix_acquisition',
        'chauffeur_id',
    ];

    protected $casts = [
        'annee' => 'integer',
        'capacite' => 'decimal:2',
        'date_acquisition' => 'date',
        'prix_acquisition' => 'decimal:2',
    ];

    // Relationships
    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'chauffeur_id');
    }

    public function commandesClients(): HasMany
    {
        return $this->hasMany(CommandeClient::class);
    }

    public function lignesCommandesClients(): HasMany
    {
        return $this->hasMany(LigneCommandeClient::class);
    }

    public function utilisationsCarburant(): MorphMany
    {
        return $this->morphMany(UtilisationCarburant::class, 'machine');
    }

    public function depensesMachines(): MorphMany
    {
        return $this->morphMany(DepenseMachine::class, 'machine');
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