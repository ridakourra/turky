<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueDette extends Model
{
    protected $fillable = [
        'user_id',
        // 'commande_id',
        'montant',
        'status'
    ];


    public function user(){
        return $this->belongsTo(User::class);
    }

    // public function commande(){
    //     return $this->belongsTo(Commande::class);
    // }

}
