import React, { useState } from 'react';
import { Head, Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ArrowLeft, Package, Edit, Plus, Save, X } from 'lucide-react';

const Show = ({ produit, fournisseurs }) => {
    const [editStockDialog, setEditStockDialog] = useState({ open: false, stock: null });
    const [addStockDialog, setAddStockDialog] = useState(false);

    const { data: editData, setData: setEditData, patch, processing: editProcessing, errors: editErrors, reset: resetEdit } = useForm({
        quantite_totale: '',
        quantite_vendue: ''
    });

    const { data: addData, setData: setAddData, post, processing: addProcessing, errors: addErrors, reset: resetAdd } = useForm({
        fournisseur_id: '',
        quantite_totale: ''
    });

    const formatPrice = (price) => {
        return price ? `${parseFloat(price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH` : 'N/A';
    };

    const getStockReference = (stock) => {
        return stock.fournisseur ? stock.fournisseur.nom_societe : 'Fabrication';
    };

    const getStockStatus = (stock) => {
        const disponible = stock.quantite_totale - stock.quantite_vendue;
        if (disponible > 0) {
            return <Badge className="bg-green-100 text-green-800">Disponible ({disponible})</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">Épuisé</Badge>;
        }
    };

    const handleEditStock = (stock) => {
        setEditData({
            quantite_totale: stock.quantite_totale,
            quantite_vendue: stock.quantite_vendue
        });
        setEditStockDialog({ open: true, stock });
    };

    const handleUpdateStock = (e) => {
        e.preventDefault();
        if (editStockDialog.stock) {
            patch(route('stocks.update', editStockDialog.stock.id), {
                onSuccess: () => {
                    setEditStockDialog({ open: false, stock: null });
                    resetEdit();
                }
            });
        }
    };

    const handleAddStock = (e) => {
        e.preventDefault();
        post(route('produits.stocks.store', produit.id), {
            onSuccess: () => {
                setAddStockDialog(false);
                resetAdd();
            }
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Produit - ${produit.nom}`} />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Package className="h-6 w-6 text-yellow-600" />
                                    <h1 className="text-2xl font-bold text-gray-900">{produit.nom}</h1>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('produits.edit', produit.id)}>
                                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                                            <Edit className="h-4 w-4 mr-2" />
                                            Modifier
                                        </Button>
                                    </Link>
                                    <Link href={route('produits.index')}>
                                        <Button variant="outline">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Retour à la liste
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Product Information */}
                                <div className="lg:col-span-1">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informations du produit</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Nom</Label>
                                                <p className="text-lg font-medium">{produit.nom}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Unité de mesure</Label>
                                                <p className="text-lg">{produit.unite_mesure}</p>
                                            </div>
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Prix unitaire</Label>
                                                <p className="text-lg font-medium text-yellow-600">
                                                    {formatPrice(produit.prix_unitaire)}
                                                </p>
                                            </div>
                                            {produit.description && (
                                                <div>
                                                    <Label className="text-sm font-medium text-gray-500">Description</Label>
                                                    <p className="text-gray-700">{produit.description}</p>
                                                </div>
                                            )}
                                            <div>
                                                <Label className="text-sm font-medium text-gray-500">Date de création</Label>
                                                <p className="text-gray-700">
                                                    {new Date(produit.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Stock Summary */}
                                    <Card className="mt-6">
                                        <CardHeader>
                                            <CardTitle>Résumé du stock</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-blue-600">
                                                        {produit.quantite_totale || 0}
                                                    </p>
                                                    <p className="text-sm text-blue-600">Total</p>
                                                </div>
                                                <div className="text-center p-4 bg-red-50 rounded-lg">
                                                    <p className="text-2xl font-bold text-red-600">
                                                        {produit.quantite_vendue || 0}
                                                    </p>
                                                    <p className="text-sm text-red-600">Vendu</p>
                                                </div>
                                            </div>
                                            <div className="text-center p-4 bg-green-50 rounded-lg">
                                                <p className="text-3xl font-bold text-green-600">
                                                    {produit.quantite_disponible || 0}
                                                </p>
                                                <p className="text-sm text-green-600">Disponible</p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Stock Details */}
                                <div className="lg:col-span-2">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle>Détails du stock</CardTitle>
                                                <Button
                                                    onClick={() => setAddStockDialog(true)}
                                                    className="bg-yellow-500 hover:bg-yellow-600"
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Ajouter du stock
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Référence</TableHead>
                                                            <TableHead>Quantité Totale</TableHead>
                                                            <TableHead>Quantité Vendue</TableHead>
                                                            <TableHead>Quantité Disponible</TableHead>
                                                            <TableHead>Statut</TableHead>
                                                            <TableHead>Date</TableHead>
                                                            <TableHead className="text-right">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {produit.stocks?.length > 0 ? (
                                                            produit.stocks.map((stock) => (
                                                                <TableRow key={stock.id}>
                                                                    <TableCell className="font-medium">
                                                                        {getStockReference(stock)}
                                                                    </TableCell>
                                                                    <TableCell>{stock.quantite_totale}</TableCell>
                                                                    <TableCell>{stock.quantite_vendue}</TableCell>
                                                                    <TableCell>
                                                                        {stock.quantite_totale - stock.quantite_vendue}
                                                                    </TableCell>
                                                                    <TableCell>{getStockStatus(stock)}</TableCell>
                                                                    <TableCell>
                                                                        {new Date(stock.created_at).toLocaleDateString('fr-FR')}
                                                                    </TableCell>
                                                                    <TableCell className="text-right">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => handleEditStock(stock)}
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                                                                    Aucun stock disponible
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Edit Stock Dialog */}
            <Dialog open={editStockDialog.open} onOpenChange={(open) => {
                if (!open) {
                    setEditStockDialog({ open: false, stock: null });
                    resetEdit();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier le stock</DialogTitle>
                        <DialogDescription>
                            Référence: {editStockDialog.stock ? getStockReference(editStockDialog.stock) : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUpdateStock} className="space-y-4">
                        <div>
                            <Label htmlFor="edit_quantite_totale">Quantité totale *</Label>
                            <Input
                                id="edit_quantite_totale"
                                type="number"
                                min="0"
                                value={editData.quantite_totale}
                                onChange={(e) => setEditData('quantite_totale', e.target.value)}
                                className={editErrors.quantite_totale ? 'border-red-500' : ''}
                            />
                            {editErrors.quantite_totale && (
                                <p className="text-red-500 text-sm mt-1">{editErrors.quantite_totale}</p>
                            )}
                        </div>
                        <div>
                            <Label htmlFor="edit_quantite_vendue">Quantité vendue *</Label>
                            <Input
                                id="edit_quantite_vendue"
                                type="number"
                                min="0"
                                value={editData.quantite_vendue}
                                onChange={(e) => setEditData('quantite_vendue', e.target.value)}
                                className={editErrors.quantite_vendue ? 'border-red-500' : ''}
                            />
                            {editErrors.quantite_vendue && (
                                <p className="text-red-500 text-sm mt-1">{editErrors.quantite_vendue}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setEditStockDialog({ open: false, stock: null });
                                    resetEdit();
                                }}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={editProcessing} className="bg-yellow-500 hover:bg-yellow-600">
                                <Save className="h-4 w-4 mr-2" />
                                {editProcessing ? 'Mise à jour...' : 'Mettre à jour'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add Stock Dialog */}
            <Dialog open={addStockDialog} onOpenChange={(open) => {
                if (!open) {
                    setAddStockDialog(false);
                    resetAdd();
                }
            }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ajouter du stock</DialogTitle>
                        <DialogDescription>
                            Ajouter une nouvelle entrée de stock pour {produit.nom}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddStock} className="space-y-4">
                        <div>
                            <Label htmlFor="add_fournisseur_id">Fournisseur</Label>
                            <Select
                                value={addData.fournisseur_id}
                                onValueChange={(value) => setAddData('fournisseur_id', value === 'null' ? null : value)}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Sélectionnez un fournisseur" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">Fabrication (interne)</SelectItem>
                                    {fournisseurs?.map(fournisseur => (
                                        <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                            {fournisseur.nom_societe}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-gray-600 mt-1">
                                Laissez "Fabrication" pour un stock produit en interne
                            </p>
                        </div>
                        <div>
                            <Label htmlFor="add_quantite_totale">Quantité *</Label>
                            <Input
                                id="add_quantite_totale"
                                type="number"
                                min="1"
                                value={addData.quantite_totale}
                                onChange={(e) => setAddData('quantite_totale', e.target.value)}
                                className={addErrors.quantite_totale ? 'border-red-500' : ''}
                                placeholder="Quantité à ajouter"
                            />
                            {addErrors.quantite_totale && (
                                <p className="text-red-500 text-sm mt-1">{addErrors.quantite_totale}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setAddStockDialog(false);
                                    resetAdd();
                                }}
                            >
                                Annuler
                            </Button>
                            <Button type="submit" disabled={addProcessing} className="bg-yellow-500 hover:bg-yellow-600">
                                <Plus className="h-4 w-4 mr-2" />
                                {addProcessing ? 'Ajout...' : 'Ajouter'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Show;
