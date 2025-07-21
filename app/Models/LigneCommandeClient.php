<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LigneCommandeClient extends Model
{
    use HasFactory;

    protected $table = 'lignes_commandes_clients';

    protected $fillable = [
        'commande_id',
        'stock_id',
        'quantite',
        'prix_achat',
        'prix_vente',
        'montant_total',
        'marge_beneficiaire',
        'vehicule_id',
        'chauffeur_id',
    ];

    protected $casts = [
        'quantite' => 'decimal:2',
        'prix_achat' => 'decimal:2',
        'prix_vente' => 'decimal:2',
        'montant_total' => 'decimal:2',
        'marge_beneficiaire' => 'decimal:2',
    ];

    // Relationships
    public function commande(): BelongsTo
    {
        return $this->belongsTo(CommandeClient::class, 'commande_id');
    }

    public function stock(): BelongsTo
    {
        return $this->belongsTo(Stock::class);
    }

    public function vehicule(): BelongsTo
    {
        return $this->belongsTo(Vehicule::class);
    }

    public function chauffeur(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'chauffeur_id');
    }

    // Helper methods
    public function calculerMontantTotal(): float
    {
        return $this->quantite * $this->prix_vente;
    }

    public function calculerMargeBeneficiaire(): float
    {
        return ($this->prix_vente - $this->prix_achat) * $this->quantite;
    }

    public function getPourcentageMarge(): float
    {
        if ($this->prix_achat == 0) {
            return 0;
        }
        return (($this->prix_vente - $this->prix_achat) / $this->prix_achat) * 100;
    }
}