<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class BudgetChauffeur extends Model
{
    use HasFactory;

    protected $table = 'budget_chauffeurs';

    protected $fillable = [
        'chauffeur_id',
        'montant',
        'date_attribution',
        'statut',
        'description',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_attribution' => 'date',
    ];

    // Relationships
    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'chauffeur_id');
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'reference');
    }

    // Scopes
    public function scopeAttribue($query)
    {
        return $query->where('statut', 'attribue');
    }

    public function scopeUtilise($query)
    {
        return $query->where('statut', 'utilise');
    }

    public function scopeSolde($query)
    {
        return $query->where('statut', 'solde');
    }
}