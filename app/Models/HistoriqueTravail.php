<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueTravail extends Model
{
    protected $fillable = [
        'user_id',
        'quatite',
        // 'produit_id'
    ];


     public function user(){
        return $this->belongsTo(User::class);
    }

    // public function produit(){
    //     return $this->belongsTo(Produit::class);
    // }
}
