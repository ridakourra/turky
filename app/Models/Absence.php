<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'date_debut',
        'date_fin',
        'justification',
        'type_absence',
        'commentaire',
    ];

    protected $casts = [
        'date_debut' => 'date',
        'date_fin' => 'date',
    ];

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    // Helper methods
    public function getDureeEnJours(): int
    {
        if (!$this->date_fin) {
            return 1;
        }
        return $this->date_debut->diffInDays($this->date_fin) + 1;
    }

    public function isEnCours(): bool
    {
        $today = now()->toDateString();
        return $this->date_debut <= $today && (!$this->date_fin || $this->date_fin >= $today);
    }

    // Scopes
    public function scopeMaladie($query)
    {
        return $query->where('type_absence', 'maladie');
    }

    public function scopeConge($query)
    {
        return $query->where('type_absence', 'conge');
    }

    public function scopeNonJustifie($query)
    {
        return $query->where('type_absence', 'non_justifie');
    }
}