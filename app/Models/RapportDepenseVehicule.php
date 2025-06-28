<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportDepenseVehicule extends Model
{
    use HasFactory;

    protected $table = 'rapports_depense_vehicules';

    protected $fillable = [
        'vehicule_id',
        'type_depense',
        'montant',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function vehicule()
    {
        return $this->belongsTo(Vehicule::class);
    }
}