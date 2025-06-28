<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Livraison extends Model
{
    use HasFactory;

    protected $fillable = [
        'commande_id',
        'vehicule_id',
        'employer_id',
        'adresse',
        'date',
        'status'
    ];

    protected $casts = [
        'date' => 'date',
    ];

    // Relationships
    public function commande()
    {
        return $this->belongsTo(Commande::class);
    }

    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}
