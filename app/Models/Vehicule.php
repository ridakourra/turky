<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Vehicule extends Model
{
    use HasFactory;

    protected $fillable = [
        'nom',
        'photo',
        'matricule',
        'type',
        'chauffeur_id',
        'capacite_tonne',
        'consommation_litre_par_km',
        'actif',
        'notes',
    ];

    /**
     * If a photo is set, return its full URL; otherwise null.
     */
    public function getPhotoUrlAttribute()
    {
        return $this->photo
            ? Storage::url($this->photo)
            : null;
    }

    /**
     * Relation: each vehicule may have one chauffeur (User).
     */
    public function chauffeur()
    {
        return $this->belongsTo(User::class, 'chauffeur_id');
    }
}
