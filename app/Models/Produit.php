<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Produit extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'photo',
        'unite',
        'prix'
    ];

    protected $casts = [
        'prix' => 'decimal:2',
    ];

    // Relationships
    public function stocks()
    {
        return $this->hasMany(Stock::class);
    }

    public function salaires()
    {
        return $this->hasMany(Salaire::class);
    }

    public function rapportsStocks()
    {
        return $this->hasMany(RapportStock::class);
    }

    public function linesCommandesFournisseurs()
    {
        return $this->hasMany(LineCommandeFournisseur::class);
    }

    public function linesCommandes()
    {
        return $this->hasMany(LineCommande::class);
    }
}