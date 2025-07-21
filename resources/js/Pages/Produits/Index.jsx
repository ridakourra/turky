import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Plus, Search, Filter, ArrowUpDown, Eye, Edit, Trash2, Package } from 'lucide-react';

const Index = ({ produits, filters, sort, unites_mesure }) => {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, produit: null });
    const [advancedFilters, setAdvancedFilters] = useState({
        unite_mesure: filters?.unite_mesure || 'all',
        prix_min: filters?.prix_min || '',
        prix_max: filters?.prix_max || '',
        stock_status: filters?.stock_status || 'all'
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('produits.index'), {
            search: searchTerm,
            ...advancedFilters
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const direction = sort?.sort === field && sort?.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('produits.index'), {
            ...filters,
            sort: field,
            direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleAdvancedFilter = () => {
        router.get(route('produits.index'), {
            search: searchTerm,
            ...advancedFilters
        }, {
            preserveState: true,
            replace: true
        });
        setShowAdvancedFilters(false);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setAdvancedFilters({
            unite_mesure: 'all',
            prix_min: '',
            prix_max: '',
            stock_status: 'all'
        });
        router.get(route('produits.index'));
    };

    const handleDelete = (produit) => {
        setDeleteDialog({ open: true, produit });
    };

    const confirmDelete = () => {
        if (deleteDialog.produit) {
            router.delete(route('produits.destroy', deleteDialog.produit.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, produit: null });
                }
            });
        }
    };

    const formatPrice = (price) => {
        return price ? `${parseFloat(price).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} DH` : 'N/A';
    };

    const getStockStatus = (produit) => {
        if (produit.quantite_disponible > 0) {
            return <Badge className="bg-green-100 text-green-800">Disponible</Badge>;
        } else {
            return <Badge className="bg-red-100 text-red-800">Épuisé</Badge>;
        }
    };

    const getSortIcon = (field) => {
        if (sort?.sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return sort?.direction === 'asc' ? '↑' : '↓';
    };

    return (
        <AuthenticatedLayout>
            <Head title="Gestion des Produits" />

            <div className="py-6">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-2">
                                    <Package className="h-6 w-6 text-yellow-600" />
                                    <h1 className="text-2xl font-bold text-gray-900">Gestion des Produits</h1>
                                </div>
                                <Link href={route('produits.create')}>
                                    <Button className="bg-yellow-500 hover:bg-yellow-600">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Nouveau Produit
                                    </Button>
                                </Link>
                            </div>

                            {/* Search and Filters */}
                            <Card className="mb-6">
                                <CardContent className="pt-6">
                                    <form onSubmit={handleSearch} className="space-y-4">
                                        <div className="flex gap-4">
                                            <div className="flex-1">
                                                <div className="relative">
                                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        type="text"
                                                        placeholder="Rechercher par nom ou description..."
                                                        value={searchTerm}
                                                        onChange={(e) => setSearchTerm(e.target.value)}
                                                        className="pl-10"
                                                    />
                                                </div>
                                            </div>
                                            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600">
                                                <Search className="h-4 w-4 mr-2" />
                                                Rechercher
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                            >
                                                <Filter className="h-4 w-4 mr-2" />
                                                Filtres Avancés
                                            </Button>
                                            {(filters?.search || filters?.unite_mesure !== 'all' || filters?.prix_min || filters?.prix_max || filters?.stock_status !== 'all') && (
                                                <Button type="button" variant="outline" onClick={clearFilters}>
                                                    Effacer
                                                </Button>
                                            )}
                                        </div>

                                        {showAdvancedFilters && (
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Unité de mesure
                                                    </label>
                                                    <Select
                                                        value={advancedFilters.unite_mesure}
                                                        onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, unite_mesure: value }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Toutes</SelectItem>
                                                            {unites_mesure?.map(unite => (
                                                                <SelectItem key={unite} value={unite}>
                                                                    {unite}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Prix minimum (DH)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={advancedFilters.prix_min}
                                                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, prix_min: e.target.value }))}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Prix maximum (DH)
                                                    </label>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        value={advancedFilters.prix_max}
                                                        onChange={(e) => setAdvancedFilters(prev => ({ ...prev, prix_max: e.target.value }))}
                                                        placeholder="0.00"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Statut du stock
                                                    </label>
                                                    <Select
                                                        value={advancedFilters.stock_status}
                                                        onValueChange={(value) => setAdvancedFilters(prev => ({ ...prev, stock_status: value }))}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">Tous</SelectItem>
                                                            <SelectItem value="disponible">Disponible</SelectItem>
                                                            <SelectItem value="epuise">Épuisé</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="md:col-span-4 flex justify-end">
                                                    <Button type="button" onClick={handleAdvancedFilter} className="bg-yellow-500 hover:bg-yellow-600">
                                                        Appliquer les filtres
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>

                            {/* Products Table */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Liste des Produits ({produits?.total || 0})</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSort('nom')}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>Nom</span>
                                                            {getSortIcon('nom')}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSort('unite_mesure')}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>Unité</span>
                                                            {getSortIcon('unite_mesure')}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSort('prix_unitaire')}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>Prix Unitaire</span>
                                                            {getSortIcon('prix_unitaire')}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead>Stock Total</TableHead>
                                                    <TableHead>Stock Disponible</TableHead>
                                                    <TableHead>Statut</TableHead>
                                                    <TableHead
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => handleSort('created_at')}
                                                    >
                                                        <div className="flex items-center space-x-1">
                                                            <span>Date Création</span>
                                                            {getSortIcon('created_at')}
                                                        </div>
                                                    </TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {produits?.data?.length > 0 ? (
                                                    produits.data.map((produit) => (
                                                        <TableRow key={produit.id}>
                                                            <TableCell className="font-medium">{produit.nom}</TableCell>
                                                            <TableCell>{produit.unite_mesure}</TableCell>
                                                            <TableCell>{formatPrice(produit.prix_unitaire)}</TableCell>
                                                            <TableCell>{produit.quantite_totale || 0}</TableCell>
                                                            <TableCell>{produit.quantite_disponible || 0}</TableCell>
                                                            <TableCell>{getStockStatus(produit)}</TableCell>
                                                            <TableCell>
                                                                {new Date(produit.created_at).toLocaleDateString('fr-FR')}
                                                            </TableCell>
                                                            <TableCell className="text-right">
                                                                <div className="flex justify-end space-x-2">
                                                                    <Link href={route('produits.show', produit.id)}>
                                                                        <Button variant="outline" size="sm">
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Link href={route('produits.edit', produit.id)}>
                                                                        <Button variant="outline" size="sm">
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={() => handleDelete(produit)}
                                                                        className="text-red-600 hover:text-red-700"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                                            Aucun produit trouvé
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {/* Pagination */}
                                    {produits?.links && (
                                        <div className="mt-6 flex items-center justify-between">
                                            <div className="text-sm text-gray-700">
                                                Affichage de {produits.from || 0} à {produits.to || 0} sur {produits.total || 0} résultats
                                            </div>
                                            <div className="flex space-x-2">
                                                {produits.links.map((link, index) => {
                                                    if (link.url === null) {
                                                        return (
                                                            <Button key={index} variant="outline" disabled>
                                                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                            </Button>
                                                        );
                                                    }
                                                    return (
                                                        <Button
                                                            key={index}
                                                            variant={link.active ? "default" : "outline"}
                                                            onClick={() => router.get(link.url)}
                                                            className={link.active ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                                        >
                                                            <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, produit: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le produit "{deleteDialog.produit?.nom}" ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, produit: null })}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AuthenticatedLayout>
    );
};

export default Index;
