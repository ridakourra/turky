<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class Salaire extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'employee_id',
        'type',
        'montant',
        'produit_id',
    ];

    protected $casts = [
        'montant' => 'decimal:2',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function produit(): BelongsTo
    {
        return $this->belongsTo(Produit::class);
    }

    public function historiqueTravail(): HasMany
    {
        return $this->hasMany(HistoriqueTravail::class);
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'reference');
    }

    // Scopes
    public function scopeMensuel($query)
    {
        return $query->where('type', 'mensuel');
    }

    public function scopeJournalier($query)
    {
        return $query->where('type', 'journalier');
    }

    public function scopeHoraire($query)
    {
        return $query->where('type', 'horaire');
    }

    public function scopeParProduit($query)
    {
        return $query->where('type', 'par_produit');
    }
}