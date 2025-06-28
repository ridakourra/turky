<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EnginLourd extends Model
{
    use HasFactory;

    protected $table = 'engins_lourds';

    protected $fillable = [
        'nom',
        'reference',
        'type',
        'marque',
        'modele',
        'capacite',
        'annee',
        'numero_serie',
        'numero_moteur',
        'location_par_heure',
        'carburant_type',
        'date_assurance',
        'statut',
        'employer_id'
    ];

    protected $casts = [
        'annee' => 'integer',
        'location_par_heure' => 'decimal:2',
        'date_assurance' => 'date',
    ];

    // Relationships
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function rapportsLocation()
    {
        return $this->hasMany(RapportLocationEnginLourd::class);
    }
}