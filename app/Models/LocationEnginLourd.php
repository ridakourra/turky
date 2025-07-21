<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LocationEnginLourd extends Model
{
    use HasFactory;

    protected $table = 'location_engins_lourds';

    protected $fillable = [
        'engin_id',
        'client_id',
        'date_debut',
        'date_fin',
        'prix_location',
        'statut',
        'commentaire',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
        'prix_location' => 'decimal:2',
    ];

    // Relationships
    public function engin(): BelongsTo
    {
        return $this->belongsTo(EnginLourd::class, 'engin_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    // Helper methods
    public function getDureeEnJours(): int
    {
        if (!$this->date_fin) {
            return now()->diffInDays($this->date_debut) + 1;
        }
        return $this->date_debut->diffInDays($this->date_fin) + 1;
    }

    public function getMontantTotal(): float
    {
        return $this->prix_location * $this->getDureeEnJours();
    }

    public function isEnCours(): bool
    {
        $today = now()->toDateString();
        return $this->date_debut <= $today && (!$this->date_fin || $this->date_fin >= $today);
    }

    // Scopes
    public function scopeEnCours($query)
    {
        return $query->where('statut', 'en_cours');
    }

    public function scopeTermine($query)
    {
        return $query->where('statut', 'termine');
    }

    public function scopeAnnule($query)
    {
        return $query->where('statut', 'annule');
    }
}