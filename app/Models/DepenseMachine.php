<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class DepenseMachine extends Model
{
    use HasFactory;

    protected $table = 'depenses_machines';

    protected $fillable = [
        'machine_type',
        'machine_id',
        'type_depense',
        'montant',
        'date_depense',
        'description',
        'facture_reference',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_depense' => 'date',
    ];

    // Relationships
    public function machine(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeCarburant($query)
    {
        return $query->where('type_depense', 'carburant');
    }

    public function scopeMaintenance($query)
    {
        return $query->where('type_depense', 'maintenance');
    }

    public function scopeReparation($query)
    {
        return $query->where('type_depense', 'reparation');
    }

    public function scopeAssurance($query)
    {
        return $query->where('type_depense', 'assurance');
    }

    public function scopeAutre($query)
    {
        return $query->where('type_depense', 'autre');
    }
}