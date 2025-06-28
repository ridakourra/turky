<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'matricule',
        'marque',
        'modele',
        'type',
        'capacite',
        'annee',
        'kilometrage',
        'carburant_type',
        'numero_chassis',
        'numero_moteur',
        'date_assurance',
        'statut',
        'employer_id'
    ];

    protected $casts = [
        'annee' => 'integer',
        'kilometrage' => 'integer',
        'date_assurance' => 'date',
    ];

    // Relationships
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function commandesFournisseurs()
    {
        return $this->hasMany(CommandeFournisseur::class);
    }

    public function livraisons()
    {
        return $this->hasMany(Livraison::class);
    }

    public function rapportsDepenses()
    {
        return $this->hasMany(RapportDepenseVehicule::class);
    }
}
