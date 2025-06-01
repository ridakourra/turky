<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salaire extends Model
{
    protected $fillable = [
        'user_id',
        'type_travail',
        'montant',
        'date_derniere_paiement'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_derniere_paiement' => 'datetime',
    ];

    // Define the allowed values for type_travail
    public static $typeTravailOptions = [
        'par_jour' => 'Par Jour',
        'par_mois' => 'Par Mois',
        'par_produit' => 'Par Produit'
    ];

    // Accessor to get human readable type_travail
    public function getTypeTravailLabelAttribute()
    {
        return self::$typeTravailOptions[$this->type_travail] ?? $this->type_travail;
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
