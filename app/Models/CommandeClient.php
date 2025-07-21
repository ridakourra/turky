<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class CommandeClient extends Model
{
    use HasFactory;

    protected $table = 'commandes_clients';

    protected $fillable = [
        'client_id',
        'date_commande',
        'montant_total',
        'profit_net',
        'vehicule_id',
        'chauffeur_id',
        'commentaire',
    ];

    protected $casts = [
        'date_commande' => 'date',
        'montant_total' => 'decimal:2',
        'profit_net' => 'decimal:2',
    ];

    // Relationships
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function vehicule(): BelongsTo
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'chauffeur_id');
    }

    public function lignesCommandes(): HasMany
    {
        return $this->hasMany(LigneCommandeClient::class, 'commande_id');
    }

    public function paiement(): HasOne
    {
        return $this->hasOne(Paiement::class, 'commande_id');
    }

    public function transactions(): MorphMany
    {
        return $this->morphMany(Transaction::class, 'reference');
    }

    // Helper methods
    public function calculerMontantTotal(): float
    {
        return $this->lignesCommandes()->sum('montant_total');
    }

    public function calculerProfitNet(): float
    {
        return $this->lignesCommandes()->sum('marge_beneficiaire');
    }

    public function getStatutPaiement(): string
    {
        if (!$this->paiement) {
            return 'non_paye';
        }
        return $this->paiement->statut;
    }
}