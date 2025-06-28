<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Salaire extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'type',
        'prix',
        'produit_id'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
    ];

    // Relationships
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }

    public function produit()
    {
        return $this->belongsTo(Produit::class);
    }

    public function rapports()
    {
        return $this->hasMany(RapportSalaire::class);
    }
}