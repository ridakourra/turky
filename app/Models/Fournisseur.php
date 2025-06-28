<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Fournisseur extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'ice_ou_cin',
        'adresse',
        'note'
    ];

    // Relationships
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function commandesFournisseurs()
    {
        return $this->hasMany(CommandeFournisseur::class);
    }
}
