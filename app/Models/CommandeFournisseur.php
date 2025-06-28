<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommandeFournisseur extends Model
{
    use HasFactory;

    protected $table = 'commandes_fournisseurs';

    protected $fillable = [
        'fournisseur_id',
        'employer_id',
        'vehicule_id',
        'date'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships
    public function fournisseur()
    {
        return $this->belongsTo(Fournisseur::class);
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function lines()
    {
        return $this->hasMany(LineCommandeFournisseur::class);
    }
}
