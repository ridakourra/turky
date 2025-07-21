import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { ArrowLeft, CreditCard, Truck, User, Calendar, DollarSign, Package, FileText, Edit, Trash2 } from 'lucide-react';

export default function Show({ commande }) {
    const [showPaymentDialog, setShowPaymentDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    
    const { data, setData, post, delete: destroy, processing, errors } = useForm({
        montant: '',
        mode_paiement: 'especes',
        date_paiement: new Date().toISOString().split('T')[0],
        notes: ''
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatutPaiementBadge = (paiement) => {
        if (!paiement) {
            return <Badge variant="destructive">Non payé</Badge>;
        }
        
        switch (paiement.statut) {
            case 'paye':
                return <Badge variant="default" className="bg-green-500">Payé</Badge>;
            case 'partiellement_paye':
                return <Badge variant="secondary">Partiellement payé</Badge>;
            case 'non_paye':
            default:
                return <Badge variant="destructive">Non payé</Badge>;
        }
    };

    const handlePayment = (e) => {
        e.preventDefault();
        post(route('paiements.store'), {
            data: {
                ...data,
                commande_client_id: commande.id
            },
            onSuccess: () => {
                setShowPaymentDialog(false);
                setData({
                    montant: '',
                    mode_paiement: 'especes',
                    date_paiement: new Date().toISOString().split('T')[0],
                    notes: ''
                });
            }
        });
    };

    const handleDelete = () => {
        destroy(route('commandes-clients.destroy', commande.id), {
            onSuccess: () => {
                // Redirection will be handled by the controller
            }
        });
    };

    const getMontantRestant = () => {
        if (!commande.paiement) {
            return commande.montant_total;
        }
        return commande.montant_total - (commande.paiement.montant_paye || 0);
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Commande #${commande.id}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('commandes-clients.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Commande #{commande.id}</h1>
                            <p className="text-gray-600 mt-1">Détails de la commande client</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {getMontantRestant() > 0 && (
                            <Button 
                                onClick={() => setShowPaymentDialog(true)}
                                className="bg-green-500 hover:bg-green-600"
                            >
                                <CreditCard className="h-4 w-4 mr-2" />
                                Ajouter un paiement
                            </Button>
                        )}
                        <Button 
                            variant="destructive"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations principales */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Informations de la commande */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <FileText className="h-5 w-5 mr-2" />
                                    Informations de la commande
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Date de commande</Label>
                                        <div className="flex items-center mt-1">
                                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-medium">{formatDate(commande.date_commande)}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Montant total</Label>
                                        <div className="flex items-center mt-1">
                                            <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                                            <span className="font-bold text-lg">{formatPrice(commande.montant_total)}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Profit net</Label>
                                        <div className="flex items-center mt-1">
                                            <DollarSign className="h-4 w-4 mr-2 text-green-500" />
                                            <span className="font-bold text-lg text-green-600">{formatPrice(commande.profit_net)}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Statut paiement</Label>
                                        <div className="mt-1">
                                            {getStatutPaiementBadge(commande.paiement)}
                                        </div>
                                    </div>
                                </div>
                                
                                {commande.notes && (
                                    <div className="mt-4">
                                        <Label className="text-sm font-medium text-gray-500">Notes</Label>
                                        <p className="mt-1 text-gray-700">{commande.notes}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Client */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    Informations client
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Nom complet</Label>
                                        <p className="mt-1 font-medium">{commande.client?.nom_complet}</p>
                                    </div>
                                    
                                    {commande.client?.telephone && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                                            <p className="mt-1">{commande.client.telephone}</p>
                                        </div>
                                    )}
                                    
                                    {commande.client?.email && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Email</Label>
                                            <p className="mt-1">{commande.client.email}</p>
                                        </div>
                                    )}
                                    
                                    {commande.client?.adresse && (
                                        <div>
                                            <Label className="text-sm font-medium text-gray-500">Adresse</Label>
                                            <p className="mt-1">{commande.client.adresse}</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Véhicule et Chauffeur */}
                        {(commande.vehicule || commande.chauffeur) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center">
                                        <Truck className="h-5 w-5 mr-2" />
                                        Transport
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {commande.vehicule && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Véhicule</Label>
                                                <div className="mt-1">
                                                    <p className="font-medium">{commande.vehicule.matricule}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {commande.vehicule.marque} {commande.vehicule.modele}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                        
                                        {commande.chauffeur && (
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Chauffeur</Label>
                                                <p className="mt-1 font-medium">{commande.chauffeur.nom_complet}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Produits */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Package className="h-5 w-5 mr-2" />
                                    Produits commandés
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produit</TableHead>
                                                <TableHead>Prix unitaire</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>Prix total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {commande.lignes?.map((ligne) => (
                                                <TableRow key={ligne.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{ligne.produit?.nom}</div>
                                                            <div className="text-sm text-gray-500">
                                                                Unité: {ligne.produit?.unite_mesure}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>{formatPrice(ligne.prix_unitaire)}</TableCell>
                                                    <TableCell className="font-medium">{ligne.quantite}</TableCell>
                                                    <TableCell className="font-medium">{formatPrice(ligne.prix_total)}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - Paiements */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <CreditCard className="h-5 w-5 mr-2" />
                                    Informations de paiement
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Montant total:</span>
                                        <span className="font-medium">{formatPrice(commande.montant_total)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-500">Montant payé:</span>
                                        <span className="font-medium text-green-600">
                                            {formatPrice(commande.paiement?.montant_paye || 0)}
                                        </span>
                                    </div>
                                    
                                    <div className="flex justify-between border-t pt-2">
                                        <span className="text-sm font-medium">Montant restant:</span>
                                        <span className={`font-bold ${
                                            getMontantRestant() > 0 ? 'text-red-600' : 'text-green-600'
                                        }`}>
                                            {formatPrice(getMontantRestant())}
                                        </span>
                                    </div>
                                </div>

                                {commande.paiement && (
                                    <div className="border-t pt-4">
                                        <h4 className="font-medium mb-2">Détails du paiement</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Mode:</span>
                                                <span className="capitalize">{commande.paiement.mode_paiement}</span>
                                            </div>
                                            
                                            {commande.paiement.date_paiement && (
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">Date:</span>
                                                    <span>{formatDate(commande.paiement.date_paiement)}</span>
                                                </div>
                                            )}
                                            
                                            {commande.paiement.notes && (
                                                <div>
                                                    <span className="text-gray-500">Notes:</span>
                                                    <p className="mt-1">{commande.paiement.notes}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Transaction */}
                        {commande.transaction && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Transaction</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Type:</span>
                                            <span className="capitalize">{commande.transaction.type}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Montant:</span>
                                            <span className="font-medium">{formatPrice(commande.transaction.montant)}</span>
                                        </div>
                                        
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Date:</span>
                                            <span>{formatDate(commande.transaction.date_transaction)}</span>
                                        </div>
                                        
                                        {commande.transaction.description && (
                                            <div>
                                                <span className="text-gray-500">Description:</span>
                                                <p className="mt-1">{commande.transaction.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Payment Dialog */}
            <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter un paiement</DialogTitle>
                        <DialogDescription>
                            Enregistrer un nouveau paiement pour cette commande
                        </DialogDescription>
                    </DialogHeader>
                    
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div>
                            <Label htmlFor="montant">Montant à payer *</Label>
                            <Input
                                id="montant"
                                type="number"
                                step="0.01"
                                max={getMontantRestant()}
                                value={data.montant}
                                onChange={(e) => setData('montant', e.target.value)}
                                placeholder={`Maximum: ${formatPrice(getMontantRestant())}`}
                                required
                            />
                            {errors.montant && (
                                <p className="text-red-500 text-sm mt-1">{errors.montant}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="mode_paiement">Mode de paiement *</Label>
                            <Select value={data.mode_paiement} onValueChange={(value) => setData('mode_paiement', value)}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="especes">Espèces</SelectItem>
                                    <SelectItem value="cheque">Chèque</SelectItem>
                                    <SelectItem value="virement">Virement</SelectItem>
                                    <SelectItem value="carte">Carte bancaire</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.mode_paiement && (
                                <p className="text-red-500 text-sm mt-1">{errors.mode_paiement}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="date_paiement">Date de paiement *</Label>
                            <Input
                                id="date_paiement"
                                type="date"
                                value={data.date_paiement}
                                onChange={(e) => setData('date_paiement', e.target.value)}
                                required
                            />
                            {errors.date_paiement && (
                                <p className="text-red-500 text-sm mt-1">{errors.date_paiement}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="notes">Notes</Label>
                            <Input
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Notes sur le paiement..."
                            />
                            {errors.notes && (
                                <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setShowPaymentDialog(false)}>
                                Annuler
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Enregistrement...' : 'Enregistrer le paiement'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer cette commande ?
                            <br />
                            <strong>Cette action est irréversible et restaurera les stocks des produits.</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={processing}
                        >
                            {processing ? 'Suppression...' : 'Supprimer'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
}