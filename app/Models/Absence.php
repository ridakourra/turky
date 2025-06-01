<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    protected $fillable = [
        'user_id',
        'raison',
        'justifie',
        'preuve',
        'note'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
