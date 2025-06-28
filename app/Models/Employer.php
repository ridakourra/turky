<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class Employer extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'nom',
        'cin',
        'password',
        'telephone',
        'adresse',
        'details',
        'actif',
        'date_embauche',
        'fonction'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'actif' => 'boolean',
        'date_embauche' => 'date',
    ];

    // Relationships
    public function absences()
    {
        return $this->hasMany(Absence::class);
    }

    public function budgetsChiffeurs()
    {
        return $this->hasMany(BudgetChiffeur::class);
    }

    public function salaires()
    {
        return $this->hasMany(Salaire::class);
    }

    public function vehicules()
    {
        return $this->hasMany(Vehicule::class);
    }

    public function enginsLourds()
    {
        return $this->hasMany(EnginLourd::class);
    }

    public function livraisons()
    {
        return $this->hasMany(Livraison::class);
    }

    public function commandesFournisseurs()
    {
        return $this->hasMany(CommandeFournisseur::class);
    }

    public function rapportsSalaires()
    {
        return $this->hasMany(RapportSalaire::class);
    }
}