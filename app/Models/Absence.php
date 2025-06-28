<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Absence extends Model
{
    use HasFactory;

    protected $fillable = [
        'employer_id',
        'justifie',
        'raison',
        'date'
    ];

    protected $casts = [
        'justifie' => 'boolean',
        'date' => 'date',
    ];

    // Relationships
    public function employer()
    {
        return $this->belongsTo(Employer::class);
    }
}
