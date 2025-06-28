<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RapportDette extends Model
{
    use HasFactory;

    protected $table = 'rapports_dettes';

    protected $fillable = [
        'client_id',
        'montant',
        'status',
        'date_operation',
        'remarques'
    ];

    protected $casts = [
        'montant' => 'decimal:2',
        'date_operation' => 'date',
    ];

    // Relationships
    public function client()
    {
        return $this->belongsTo(Client::class);
    }
}