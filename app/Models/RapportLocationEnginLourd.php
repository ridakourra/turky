<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportLocationEnginLourd extends Model
{
    use HasFactory;

    protected $table = 'rapports_location_engins_lourds';

    protected $fillable = [
        'engin_lourd_id',
        'client_id',
        'quantite',
        'prix_par_heure',
        'montant_totale',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'quantite' => 'integer',
        'prix_par_heure' => 'decimal:2',
        'montant_totale' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function enginLourd()
    {
        return $this->belongsTo(EnginLourd::class);
    }

    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}