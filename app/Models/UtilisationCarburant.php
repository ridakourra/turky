<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class UtilisationCarburant extends Model
{
    use HasFactory;

    protected $table = 'utilisations_carburant';

    protected $fillable = [
        'machine_type',
        'machine_id',
        'quantite',
        'date_utilisation',
        'commentaire',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'date_utilisation' => 'date',
    ];

    // Relationships
    public function machine(): MorphTo
    {
        return $this->morphTo();
    }
}