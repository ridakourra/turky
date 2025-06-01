<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HistoriqueSalaire extends Model
{
    protected $fillable = [
        'user_id',
        'montant',
        'date'
    ];



    public function user(){
        return $this->belongsTo(User::class);
    }



}
