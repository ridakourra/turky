<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'responsable',
        'email',
        'telephone',
        'adresse',
        'ice',
        'rc',
        'patente'
    ];

    // No relationships - standalone entity
}
