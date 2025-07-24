import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    Trash2,
    Package,
    Calendar,
    DollarSign,
    Building2
} from 'lucide-react';
import { router } from '@inertiajs/react';

export default function Index({ commandes, fournisseurs, filters }) {
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, commande: null });

    const { data, setData, get, delete: destroy, processing } = useForm({
        search: filters?.search || '',
        fournisseur_id: filters?.fournisseur_id || 'all',
        date_debut: filters?.date_debut || '',
        date_fin: filters?.date_fin || '',
        montant_min: filters?.montant_min || '',
        montant_max: filters?.montant_max || '',
        sort: filters?.sort || 'created_at',
        direction: filters?.direction || 'desc'
    });

    const handleSearch = () => {
        get(route('commandes-fournisseurs.index'), {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSort = (field) => {
        const newDirection = data.sort === field && data.direction === 'asc' ? 'desc' : 'asc';
        setData(prevData => ({ ...prevData, sort: field, direction: newDirection }));

        get(route('commandes-fournisseurs.index'), {
            data: { ...data, sort: field, direction: newDirection },
            preserveState: true,
            preserveScroll: true
        });
    };

    const getSortIcon = (field) => {
        if (data.sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return data.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const handleAdvancedFilter = () => {
        get(route('commandes-fournisseurs.index'), {
            preserveState: true,
            preserveScroll: true
        });
        setShowAdvancedFilters(false);
    };

    const resetFilters = () => {
        setData({
            search: '',
            fournisseur_id: 'all',
            date_debut: '',
            date_fin: '',
            montant_min: '',
            montant_max: '',
            sort: 'created_at',
            direction: 'desc'
        });

        get(route('commandes-fournisseurs.index'));
    };

    const handleDelete = (commande) => {
        setDeleteDialog({ open: true, commande });
    };

    const confirmDelete = () => {
        if (deleteDialog.commande) {
            destroy(route('commandes-fournisseurs.destroy', deleteDialog.commande.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, commande: null });
                }
            });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(price || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const canDelete = (commande) => {
        const currentDate = new Date().toISOString().split('T')[0];
        const orderDate = new Date(commande.date_commande).toISOString().split('T')[0];
        return currentDate > orderDate;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Commandes Fournisseurs" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Package className="h-8 w-8 text-yellow-600" />
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Commandes Fournisseurs</h1>
                            <p className="text-gray-600 mt-1">Gérez vos commandes auprès des fournisseurs</p>
                        </div>
                    </div>

                    <Link href={route('commandes-fournisseurs.create')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Commande
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            {/* Basic Search */}
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                        <Input
                                            placeholder="Rechercher par fournisseur, commentaire ou ID..."
                                            value={data.search}
                                            onChange={(e) => setData('search', e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                                <Button onClick={handleSearch} disabled={processing}>
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtres avancés
                                </Button>
                                <Button variant="outline" onClick={resetFilters}>
                                    Réinitialiser
                                </Button>
                            </div>

                            {/* Advanced Filters */}
                            {showAdvancedFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                                    <div>
                                        <Label htmlFor="fournisseur_id">Fournisseur</Label>
                                        <Select
                                            value={data.fournisseur_id}
                                            onValueChange={(value) => setData('fournisseur_id', value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les fournisseurs" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">Tous les fournisseurs</SelectItem>
                                                {fournisseurs?.map(fournisseur => (
                                                    <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                                        {fournisseur.nom_societe}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div>
                                        <Label htmlFor="date_debut">Date début</Label>
                                        <Input
                                            id="date_debut"
                                            type="date"
                                            value={data.date_debut}
                                            onChange={(e) => setData('date_debut', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="date_fin">Date fin</Label>
                                        <Input
                                            id="date_fin"
                                            type="date"
                                            value={data.date_fin}
                                            onChange={(e) => setData('date_fin', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="montant_min">Montant minimum</Label>
                                        <Input
                                            id="montant_min"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={data.montant_min}
                                            onChange={(e) => setData('montant_min', e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="montant_max">Montant maximum</Label>
                                        <Input
                                            id="montant_max"
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00"
                                            value={data.montant_max}
                                            onChange={(e) => setData('montant_max', e.target.value)}
                                        />
                                    </div>

                                    <div className="flex items-end">
                                        <Button onClick={handleAdvancedFilter} className="w-full">
                                            Appliquer les filtres
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Liste des commandes ({commandes?.total || 0})</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('id')}
                                        >
                                            <div className="flex items-center gap-2">
                                                ID
                                                {getSortIcon('id')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('fournisseur')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Fournisseur
                                                {getSortIcon('fournisseur')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('date_commande')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Date
                                                {getSortIcon('date_commande')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('montant_total')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Montant
                                                {getSortIcon('montant_total')}
                                            </div>
                                        </TableHead>
                                        <TableHead>Produits</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandes?.data?.length > 0 ? (
                                        commandes.data.map((commande) => (
                                            <TableRow key={commande.id}>
                                                <TableCell className="font-medium">#{commande.id}</TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{commande.fournisseur?.nom_societe}</div>
                                                        {commande.fournisseur?.contact_nom && (
                                                            <div className="text-sm text-gray-500">
                                                                {commande.fournisseur.contact_nom}
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        {formatDate(commande.date_commande)}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <DollarSign className="h-4 w-4 text-green-500" />
                                                        <span className="font-medium">{formatPrice(commande.montant_total)}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {commande.lignes_commandes?.length || 0} produit(s)
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {canDelete(commande) ? (
                                                        <Badge variant="secondary">Modifiable</Badge>
                                                    ) : (
                                                        <Badge variant="default" className="bg-yellow-500">En cours</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link href={route('commandes-fournisseurs.show', commande.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        {canDelete(commande) && (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => handleDelete(commande)}
                                                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-8">
                                                <div className="flex flex-col items-center gap-2">
                                                    <Package className="h-12 w-12 text-gray-300" />
                                                    <p className="text-gray-500">Aucune commande trouvée</p>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {commandes?.links && (
                            <div className="mt-6 flex items-center justify-between">
                                <div className="text-sm text-gray-700">
                                    Affichage de {commandes.from || 0} à {commandes.to || 0} sur {commandes.total || 0} résultats
                                </div>
                                <div className="flex gap-2">
                                    {commandes.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <Button key={index} variant="outline" disabled>
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Link key={index} href={link.url}>
                                                <Button
                                                    variant={link.active ? "default" : "outline"}
                                                    className={link.active ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, commande: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer la commande #{deleteDialog.commande?.id} ?
                            Cette action est irréversible et les stocks seront ajustés en conséquence.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialog({ open: false, commande: null })}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
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
