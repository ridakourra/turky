<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Employee extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nom_complet',
        'telephone',
        'addresse',
        'cin',
        'password',
        'role',
        'date_embauche',
        'actif',
        'date_dernier_salaire',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'date_embauche' => 'date',
        'date_dernier_salaire' => 'date',
        'actif' => 'boolean',
        'password' => 'hashed',
    ];

    // Relationships
    public function salaires(): HasMany
    {
        return $this->hasMany(Salaire::class);
    }

    public function absences(): HasMany
    {
        return $this->hasMany(Absence::class);
    }

    public function budgetChauffeur(): HasOne
    {
        return $this->hasOne(BudgetChauffeur::class, 'chauffeur_id');
    }

    public function vehicules(): HasMany
    {
        return $this->hasMany(Vehicule::class, 'chauffeur_id');
    }

    public function commandesClients(): HasMany
    {
        return $this->hasMany(CommandeClient::class, 'chauffeur_id');
    }

    public function lignesCommandesClients(): HasMany
    {
        return $this->hasMany(LigneCommandeClient::class, 'chauffeur_id');
    }

    // Scopes
    public function scopeActif($query)
    {
        return $query->where('actif', true);
    }

    public function scopeChauffeurs($query)
    {
        return $query->where('role', 'chauffeur');
    }

    public function scopeOuvriers($query)
    {
        return $query->where('role', 'ouvrier');
    }
}
