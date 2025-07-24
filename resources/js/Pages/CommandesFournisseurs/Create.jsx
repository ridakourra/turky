import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import {
    ArrowLeft,
    Plus,
    Search,
    Trash2,
    Package,
    Building2,
    Calendar,
    DollarSign,
    ShoppingCart,
    AlertCircle
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Create({ fournisseurs }) {
    const [searchDialog, setSearchDialog] = useState(false);
    const [productSearch, setProductSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        fournisseur_id: '',
        date_commande: new Date().toISOString().split('T')[0],
        commentaire: '',
        produits: []
    });

    // Search products
    const searchProducts = async (searchTerm = '') => {
        setSearchLoading(true);
        try {
            const response = await fetch(`/commandes-fournisseurs/produits/${searchTerm}`);
            const result = await response.json();
            setSearchResults(result.data || []);
        } catch (error) {
            console.error('Erreur lors de la recherche:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    };

    // Load products when dialog opens
    useEffect(() => {
        if (searchDialog) {
            searchProducts(productSearch);
        }
    }, [searchDialog]);

    // Handle product search
    const handleProductSearch = () => {
        searchProducts(productSearch);
    };

    // Add product to order
    const addProduct = (product) => {
        const existingIndex = data.produits.findIndex(p => p.id === product.id);

        if (existingIndex >= 0) {
            // Update quantity if product already exists
            const updatedProducts = [...data.produits];
            updatedProducts[existingIndex].quantite += 1;
            setData('produits', updatedProducts);
        } else {
            // Add new product
            const newProduct = {
                ...product,
                quantite: 1,
                prix_unitaire: product.prix_unitaire || 0
            };
            setData('produits', [...data.produits, newProduct]);
        }

        setSearchDialog(false);
        setProductSearch('');
    };

    // Update product quantity
    const updateProductQuantity = (productId, quantite) => {
        if (quantite <= 0) {
            removeProduct(productId);
            return;
        }

        const updatedProducts = data.produits.map(product =>
            product.id === productId
                ? { ...product, quantite: parseFloat(quantite) }
                : product
        );
        setData('produits', updatedProducts);
    };

    // Update product price
    const updateProductPrice = (productId, prix) => {
        const updatedProducts = data.produits.map(product =>
            product.id === productId
                ? { ...product, prix_unitaire: parseFloat(prix) || 0 }
                : product
        );
        setData('produits', updatedProducts);
    };

    // Remove product
    const removeProduct = (productId) => {
        setData('produits', data.produits.filter(product => product.id !== productId));
    };

    // Calculate total
    const calculateTotal = () => {
        return data.produits.reduce((total, product) => {
            return total + (product.quantite * product.prix_unitaire);
        }, 0);
    };

    // Format price
    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(price || 0);
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();

        if (data.produits.length === 0) {
            alert('Veuillez ajouter au moins un produit à la commande.');
            return;
        }

        post(route('commandes-fournisseurs.store'), {
            onFinish: () => {
                console.log(errors)
            }
        });
    };

    const onSuccess = () => {
        router.push(route('commandes-fournisseurs.index'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouvelle Commande Fournisseur" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('commandes-fournisseurs.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>

                    <div className="flex items-center gap-3">
                        <ShoppingCart className="h-8 w-8 text-yellow-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Nouvelle Commande Fournisseur</h1>
                            <p className="text-gray-600 mt-1">Créer une nouvelle commande auprès d'un fournisseur</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Order Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5" />
                                Informations de la commande
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="fournisseur_id">Fournisseur *</Label>
                                    <Select
                                        value={data.fournisseur_id}
                                        onValueChange={(value) => setData('fournisseur_id', value)}
                                    >
                                        <SelectTrigger className={errors.fournisseur_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner un fournisseur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {fournisseurs?.map(fournisseur => (
                                                <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                                    <div>
                                                        <div className="font-medium">{fournisseur.nom_societe}</div>
                                                        {fournisseur.contact_nom && (
                                                            <div className="text-sm text-gray-500">{fournisseur.contact_nom}</div>
                                                        )}
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.fournisseur_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.fournisseur_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date_commande">Date de commande *</Label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            id="date_commande"
                                            type="date"
                                            value={data.date_commande}
                                            onChange={(e) => setData('date_commande', e.target.value)}
                                            className={`pl-10 ${errors.date_commande ? 'border-red-500' : ''}`}
                                        />
                                    </div>
                                    {errors.date_commande && (
                                        <p className="text-red-500 text-sm mt-1">{errors.date_commande}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="commentaire">Commentaire</Label>
                                <Textarea
                                    id="commentaire"
                                    placeholder="Commentaire ou notes sur la commande..."
                                    value={data.commentaire}
                                    onChange={(e) => setData('commentaire', e.target.value)}
                                    className={errors.commentaire ? 'border-red-500' : ''}
                                    rows={3}
                                />
                                {errors.commentaire && (
                                    <p className="text-red-500 text-sm mt-1">{errors.commentaire}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Produits commandés
                                </div>

                                <Dialog open={searchDialog} onOpenChange={setSearchDialog}>
                                    <DialogTrigger asChild>
                                        <Button type="button" className="bg-yellow-500 hover:bg-yellow-600">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Ajouter un produit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Rechercher un produit</DialogTitle>
                                            <DialogDescription>
                                                Recherchez et sélectionnez les produits à ajouter à la commande.
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <div className="flex-1">
                                                    <div className="relative">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                        <Input
                                                            placeholder="Rechercher par nom de produit..."
                                                            value={productSearch}
                                                            onChange={(e) => setProductSearch(e.target.value)}
                                                            onKeyPress={(e) => e.key === 'Enter' && handleProductSearch()}
                                                            className="pl-10"
                                                        />
                                                    </div>
                                                </div>
                                                <Button onClick={handleProductSearch} disabled={searchLoading}>
                                                    {searchLoading ? 'Recherche...' : 'Rechercher'}
                                                </Button>
                                            </div>

                                            <div className="max-h-96 overflow-y-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow>
                                                            <TableHead>Produit</TableHead>
                                                            <TableHead>Unité</TableHead>
                                                            <TableHead>Prix unitaire</TableHead>
                                                            <TableHead>Action</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {searchResults.length > 0 ? (
                                                            searchResults.map((product) => (
                                                                <TableRow key={product.id}>
                                                                    <TableCell>
                                                                        <div>
                                                                            <div className="font-medium">{product.nom}</div>
                                                                            {product.description && (
                                                                                <div className="text-sm text-gray-500">{product.description}</div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge variant="outline">{product.unite_mesure}</Badge>
                                                                    </TableCell>
                                                                    <TableCell>{formatPrice(product.prix_unitaire)}</TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            size="sm"
                                                                            onClick={() => addProduct(product)}
                                                                            disabled={data.produits.some(p => p.id === product.id)}
                                                                        >
                                                                            {data.produits.some(p => p.id === product.id) ? 'Ajouté' : 'Ajouter'}
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} className="text-center py-8">
                                                                    <div className="flex flex-col items-center gap-2">
                                                                        <Package className="h-12 w-12 text-gray-300" />
                                                                        <p className="text-gray-500">
                                                                            {searchLoading ? 'Recherche en cours...' : 'Aucun produit trouvé'}
                                                                        </p>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data.produits.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Produit</TableHead>
                                                    <TableHead>Quantité</TableHead>
                                                    <TableHead>Prix unitaire</TableHead>
                                                    <TableHead>Total</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data.produits.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{product.nom}</div>
                                                                <Badge variant="outline" className="mt-1">{product.unite_mesure}</Badge>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0.01"
                                                                value={product.quantite}
                                                                onChange={(e) => updateProductQuantity(product.id, e.target.value)}
                                                                className="w-24"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={product.prix_unitaire}
                                                                onChange={(e) => updateProductPrice(product.id, e.target.value)}
                                                                className="w-32"
                                                            />
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className="font-medium">
                                                                {formatPrice(product.quantite * product.prix_unitaire)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeProduct(product.id)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Total */}
                                    <div className="flex justify-end">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <DollarSign className="h-5 w-5 text-green-500" />
                                                <span className="text-lg font-semibold">Total: {formatPrice(calculateTotal())}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit sélectionné</h3>
                                    <p className="text-gray-500 mb-4">Cliquez sur "Ajouter un produit" pour commencer</p>
                                </div>
                            )}

                            {errors.produits && (
                                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
                                    <AlertCircle className="h-4 w-4" />
                                    <span className="text-sm">{errors.produits}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex items-center justify-end gap-4">
                        <Link href={route('commandes-fournisseurs.index')}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing || data.produits.length === 0}
                            className="bg-yellow-500 hover:bg-yellow-600"
                        >
                            {processing ? 'Création...' : 'Créer la commande'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
