<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Entreprise extends Model
{
    use HasFactory;

    protected $table = 'entreprise';

    protected $fillable = [
        'nom_entreprise',
        'ice',
        'rc',
        'cnss',
        'if',
        'logo',
        'description',
        'date_creation',
    ];

    protected $casts = [
        'date_creation' => 'date',
    ];
}