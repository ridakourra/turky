import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { 
    ArrowLeft, 
    Building2, 
    Calendar, 
    DollarSign, 
    Package, 
    FileText, 
    Trash2, 
    Phone, 
    Mail,
    MapPin,
    AlertTriangle
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Show({ commande }) {
    const [deleteDialog, setDeleteDialog] = useState(false);
    
    const { delete: destroy, processing } = useForm();

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA', {
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

    const formatDateTime = (datetime) => {
        return new Date(datetime).toLocaleString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const canDelete = () => {
        const currentDate = new Date().toISOString().split('T')[0];
        const orderDate = new Date(commande.date_commande).toISOString().split('T')[0];
        return currentDate > orderDate;
    };

    const handleDelete = () => {
        destroy(route('commandes-fournisseurs.destroy', commande.id), {
            onSuccess: () => {
                router.visit(route('commandes-fournisseurs.index'));
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Commande #${commande.id}`} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('commandes-fournisseurs.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        
                        <div className="flex items-center gap-3">
                            <Package className="h-8 w-8 text-yellow-600" />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">Commande #{commande.id}</h1>
                                <p className="text-gray-600 mt-1">Détails de la commande fournisseur</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                        {canDelete() ? (
                            <Badge variant="secondary">Modifiable</Badge>
                        ) : (
                            <Badge variant="default" className="bg-yellow-500">En cours</Badge>
                        )}
                        
                        {canDelete() && (
                            <Button 
                                variant="outline"
                                onClick={() => setDeleteDialog(true)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Order Information */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5" />
                                    Informations de la commande
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date de commande</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{formatDate(commande.date_commande)}</span>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Date de création</label>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Calendar className="h-4 w-4 text-gray-400" />
                                            <span className="font-medium">{formatDateTime(commande.created_at)}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                {commande.commentaire && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Commentaire</label>
                                        <p className="mt-1 text-gray-900 bg-gray-50 p-3 rounded-lg">{commande.commentaire}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Produits commandés ({commande.lignes_commandes?.length || 0})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Produit</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>Prix unitaire</TableHead>
                                                <TableHead>Total</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {commande.lignes_commandes?.map((ligne) => (
                                                <TableRow key={ligne.id}>
                                                    <TableCell>
                                                        <div>
                                                            <div className="font-medium">{ligne.produit?.nom}</div>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <Badge variant="outline">{ligne.produit?.unite_mesure}</Badge>
                                                                {ligne.produit?.description && (
                                                                    <span className="text-sm text-gray-500">{ligne.produit.description}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="font-medium">{ligne.quantite}</span>
                                                    </TableCell>
                                                    <TableCell>{formatPrice(ligne.prix_unitaire)}</TableCell>
                                                    <TableCell>
                                                        <span className="font-medium">{formatPrice(ligne.montant_total)}</span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Supplier Info */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5" />
                                    Fournisseur
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <h3 className="font-semibold text-lg">{commande.fournisseur?.nom_societe}</h3>
                                    {commande.fournisseur?.contact_nom && (
                                        <p className="text-gray-600">{commande.fournisseur.contact_nom}</p>
                                    )}
                                </div>
                                
                                {commande.fournisseur?.telephone && (
                                    <div className="flex items-center gap-2">
                                        <Phone className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{commande.fournisseur.telephone}</span>
                                    </div>
                                )}
                                
                                {commande.fournisseur?.email && (
                                    <div className="flex items-center gap-2">
                                        <Mail className="h-4 w-4 text-gray-400" />
                                        <span className="text-sm">{commande.fournisseur.email}</span>
                                    </div>
                                )}
                                
                                {commande.fournisseur?.adresse && (
                                    <div className="flex items-start gap-2">
                                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                                        <span className="text-sm">{commande.fournisseur.adresse}</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Financial Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <DollarSign className="h-5 w-5" />
                                    Résumé financier
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b">
                                        <span className="text-gray-600">Montant total</span>
                                        <span className="font-semibold text-lg">{formatPrice(commande.montant_total)}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Nombre de produits</span>
                                        <span className="font-medium">{commande.lignes_commandes?.length || 0}</span>
                                    </div>
                                    
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Quantité totale</span>
                                        <span className="font-medium">
                                            {commande.lignes_commandes?.reduce((total, ligne) => total + parseFloat(ligne.quantite), 0) || 0}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Warning for deletion */}
                        {!canDelete() && (
                            <Card className="border-yellow-200 bg-yellow-50">
                                <CardContent className="pt-6">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                                        <div>
                                            <h4 className="font-medium text-yellow-800">Commande en cours</h4>
                                            <p className="text-sm text-yellow-700 mt-1">
                                                Cette commande ne peut pas être supprimée car elle est datée d'aujourd'hui ou du futur.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la commande #{commande.id} ?
                            Cette action est irréversible et les stocks seront ajustés en conséquence.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog(false)}>
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