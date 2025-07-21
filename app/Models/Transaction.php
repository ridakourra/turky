<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'type_transaction',
        'reference_type',
        'reference_id',
        'montant',
        'description',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    // Relationships
    public function reference(): MorphTo
    {
        return $this->morphTo();
    }

    // Scopes
    public function scopeEntree($query)
    {
        return $query->where('type_transaction', 'entree');
    }

    public function scopeSortie($query)
    {
        return $query->where('type_transaction', 'sortie');
    }

    public function scopeSalaire($query)
    {
        return $query->where('reference_type', 'App\\Models\\Salaire');
    }

    public function scopeCommandeClient($query)
    {
        return $query->where('reference_type', 'App\\Models\\CommandeClient');
    }

    public function scopeEnginLourd($query)
    {
        return $query->where('reference_type', 'App\\Models\\EnginLourd');
    }

    public function scopeBudgetChauffeur($query)
    {
        return $query->where('reference_type', 'App\\Models\\BudgetChauffeur');
    }

    // Helper methods
    public function isEntree(): bool
    {
        return $this->type_transaction === 'entree';
    }

    public function isSortie(): bool
    {
        return $this->type_transaction === 'sortie';
    }
}