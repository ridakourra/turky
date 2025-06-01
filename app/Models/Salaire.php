<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Salaire extends Model
{
    protected $fillable = [
        'user_id',
        'type_travail',
        'montant',
        // 'produit_id',
        'date_derniere_paiement'
    ];



     public function user(){
        return $this->belongsTo(User::class);
    }

    // public function produit(){
    //     return $this->belongsTo(Produit::class);
    // }

}
