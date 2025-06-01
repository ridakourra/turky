<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'nom',
        'prenom',
        'telephone',
        'cin',
        'password',
        'adresse',
        'role',
        'date_debut',
        'est_actif',
        'dettes'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<string>
     */
    protected $hidden = [
        'password'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_debut' => 'date',
            'est_actif' => 'boolean',
            'password' => 'hashed',
        ];
    }


    public function historiqueDettes(){
        return $this->hasMany(HistoriqueDette::class);
    }

    public function salaire(){
        return $this->hasMany(Salaire::class);
    }

    public function historiqueTravails(){
        return $this->hasMany(HistoriqueTravail::class);
    }


    public function historiqueSalaires(){
        return $this->hasMany(HistoriqueSalaire::class);
    }

    public function absences(){
        return $this->hasMany(Absence::class);
    }


     public function vehicules()
    {
        return $this->hasMany(Vehicule::class, 'chauffeur_id');
    }

}
