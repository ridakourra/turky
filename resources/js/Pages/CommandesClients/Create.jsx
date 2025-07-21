import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { ArrowLeft, Plus, Search, Trash2, ShoppingCart } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Create({ clients, vehicules, chauffeurs }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [showProductDialog, setShowProductDialog] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        client_id: '',
        vehicule_id: '',
        chauffeur_id: '',
        date_commande: new Date().toISOString().split('T')[0],
        notes: '',
        produits: []
    });

    // Search products
    const searchProducts = async () => {
        if (!searchTerm.trim()) {
            setProducts([]);
            return;
        }

        setLoadingProducts(true);
        try {
            const response = await fetch(route('commandes-clients.produits.search', { search: searchTerm }));
            const data = await response.json();
            setProducts(data.produits || []);
        } catch (error) {
            console.error('Erreur lors de la recherche de produits:', error);
            setProducts([]);
        } finally {
            setLoadingProducts(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            searchProducts();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm]);

    const addProduct = (product) => {
        const existingProduct = selectedProducts.find(p => p.id === product.id);
        if (existingProduct) {
            alert('Ce produit est déjà ajouté à la commande');
            return;
        }

        const newProduct = {
            id: product.id,
            nom: product.nom,
            unite_mesure: product.unite_mesure,
            prix_unitaire: product.prix_unitaire,
            stock_disponible: product.stock_disponible,
            quantite: 1,
            prix_total: product.prix_unitaire
        };

        const updatedProducts = [...selectedProducts, newProduct];
        setSelectedProducts(updatedProducts);
        updateFormData(updatedProducts);
        setShowProductDialog(false);
        setSearchTerm('');
        setProducts([]);
    };

    const updateProductQuantity = (productId, quantite) => {
        const updatedProducts = selectedProducts.map(product => {
            if (product.id === productId) {
                const newQuantite = Math.max(1, Math.min(quantite, product.stock_disponible));
                return {
                    ...product,
                    quantite: newQuantite,
                    prix_total: newQuantite * product.prix_unitaire
                };
            }
            return product;
        });
        
        setSelectedProducts(updatedProducts);
        updateFormData(updatedProducts);
    };

    const removeProduct = (productId) => {
        const updatedProducts = selectedProducts.filter(product => product.id !== productId);
        setSelectedProducts(updatedProducts);
        updateFormData(updatedProducts);
    };

    const updateFormData = (products) => {
        const produits = products.map(product => ({
            produit_id: product.id,
            quantite: product.quantite,
            prix_unitaire: product.prix_unitaire
        }));
        setData('produits', produits);
    };

    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => total + product.prix_total, 0);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(price || 0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (selectedProducts.length === 0) {
            alert('Veuillez ajouter au moins un produit à la commande');
            return;
        }

        post(route('commandes-clients.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouvelle Commande Client" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('commandes-clients.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Nouvelle Commande Client</h1>
                        <p className="text-gray-600 mt-1">Créez une nouvelle commande pour un client</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations de base */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations de la commande</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="client_id">Client *</Label>
                                    <Select 
                                        value={data.client_id} 
                                        onValueChange={(value) => setData('client_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {clients?.map(client => (
                                                <SelectItem key={client.id} value={client.id.toString()}>
                                                    {client.nom_complet} - {client.telephone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.client_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.client_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date_commande">Date de commande *</Label>
                                    <Input
                                        id="date_commande"
                                        type="date"
                                        value={data.date_commande}
                                        onChange={(e) => setData('date_commande', e.target.value)}
                                        required
                                    />
                                    {errors.date_commande && (
                                        <p className="text-red-500 text-sm mt-1">{errors.date_commande}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="vehicule_id">Véhicule</Label>
                                    <Select 
                                        value={data.vehicule_id} 
                                        onValueChange={(value) => setData('vehicule_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un véhicule" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehicules?.map(vehicule => (
                                                <SelectItem key={vehicule.id} value={vehicule.id.toString()}>
                                                    {vehicule.matricule} - {vehicule.marque} {vehicule.modele}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.vehicule_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.vehicule_id}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="chauffeur_id">Chauffeur</Label>
                                    <Select 
                                        value={data.chauffeur_id} 
                                        onValueChange={(value) => setData('chauffeur_id', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un chauffeur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {chauffeurs?.map(chauffeur => (
                                                <SelectItem key={chauffeur.id} value={chauffeur.id.toString()}>
                                                    {chauffeur.nom_complet}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.chauffeur_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.chauffeur_id}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="notes">Notes</Label>
                                <Textarea
                                    id="notes"
                                    placeholder="Notes additionnelles sur la commande..."
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-red-500 text-sm mt-1">{errors.notes}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Produits */}
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Produits de la commande</CardTitle>
                                <Dialog open={showProductDialog} onOpenChange={setShowProductDialog}>
                                    <DialogTrigger asChild>
                                        <Button type="button" className="bg-yellow-500 hover:bg-yellow-600">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Ajouter un produit
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-4xl">
                                        <DialogHeader>
                                            <DialogTitle>Rechercher et ajouter un produit</DialogTitle>
                                            <DialogDescription>
                                                Recherchez un produit par nom pour l'ajouter à la commande
                                            </DialogDescription>
                                        </DialogHeader>
                                        
                                        <div className="space-y-4">
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Rechercher un produit..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="flex-1"
                                                />
                                                <Button type="button" variant="outline" disabled={loadingProducts}>
                                                    <Search className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            {loadingProducts && (
                                                <div className="text-center py-4">
                                                    <p className="text-gray-500">Recherche en cours...</p>
                                                </div>
                                            )}

                                            {products.length > 0 && (
                                                <div className="border rounded-lg">
                                                    <Table>
                                                        <TableHeader>
                                                            <TableRow>
                                                                <TableHead>Produit</TableHead>
                                                                <TableHead>Unité</TableHead>
                                                                <TableHead>Prix unitaire</TableHead>
                                                                <TableHead>Stock disponible</TableHead>
                                                                <TableHead>Action</TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {products.map((product) => (
                                                                <TableRow key={product.id}>
                                                                    <TableCell>
                                                                        <div>
                                                                            <div className="font-medium">{product.nom}</div>
                                                                            {product.description && (
                                                                                <div className="text-sm text-gray-500">{product.description}</div>
                                                                            )}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>{product.unite_mesure}</TableCell>
                                                                    <TableCell>{formatPrice(product.prix_unitaire)}</TableCell>
                                                                    <TableCell>
                                                                        <span className={`font-medium ${
                                                                            product.stock_disponible > 0 ? 'text-green-600' : 'text-red-600'
                                                                        }`}>
                                                                            {product.stock_disponible}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Button
                                                                            type="button"
                                                                            size="sm"
                                                                            onClick={() => addProduct(product)}
                                                                            disabled={product.stock_disponible === 0}
                                                                            className="bg-yellow-500 hover:bg-yellow-600"
                                                                        >
                                                                            <Plus className="h-4 w-4 mr-1" />
                                                                            Ajouter
                                                                        </Button>
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))}
                                                        </TableBody>
                                                    </Table>
                                                </div>
                                            )}

                                            {searchTerm && !loadingProducts && products.length === 0 && (
                                                <div className="text-center py-8 text-gray-500">
                                                    Aucun produit trouvé pour "<strong>{searchTerm}</strong>"
                                                </div>
                                            )}
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {selectedProducts.length > 0 ? (
                                <div className="space-y-4">
                                    <div className="border rounded-lg">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Produit</TableHead>
                                                    <TableHead>Prix unitaire</TableHead>
                                                    <TableHead>Quantité</TableHead>
                                                    <TableHead>Prix total</TableHead>
                                                    <TableHead>Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {selectedProducts.map((product) => (
                                                    <TableRow key={product.id}>
                                                        <TableCell>
                                                            <div>
                                                                <div className="font-medium">{product.nom}</div>
                                                                <div className="text-sm text-gray-500">
                                                                    Unité: {product.unite_mesure} | Stock: {product.stock_disponible}
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>{formatPrice(product.prix_unitaire)}</TableCell>
                                                        <TableCell>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max={product.stock_disponible}
                                                                value={product.quantite}
                                                                onChange={(e) => updateProductQuantity(product.id, parseInt(e.target.value) || 1)}
                                                                className="w-20"
                                                            />
                                                        </TableCell>
                                                        <TableCell className="font-medium">
                                                            {formatPrice(product.prix_total)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => removeProduct(product.id)}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    <div className="flex justify-end">
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-lg font-semibold">
                                                Total: {formatPrice(calculateTotal())}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                    <p>Aucun produit ajouté à la commande</p>
                                    <p className="text-sm">Cliquez sur "Ajouter un produit" pour commencer</p>
                                </div>
                            )}
                            {errors.produits && (
                                <p className="text-red-500 text-sm mt-2">{errors.produits}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Link href={route('commandes-clients.index')}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={processing || selectedProducts.length === 0}
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