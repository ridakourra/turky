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
import { Plus, Search, Filter, Eye, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ commandes, clients, vehicules, chauffeurs, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, commande: null });
    const [advancedFilters, setAdvancedFilters] = useState({
        client_id: filters.client_id || 'all',
        vehicule_id: filters.vehicule_id || 'all',
        chauffeur_id: filters.chauffeur_id || 'all',
        statut_paiement: filters.statut_paiement || 'all',
        date_debut: filters.date_debut || '',
        date_fin: filters.date_fin || '',
        montant_min: filters.montant_min || '',
        montant_max: filters.montant_max || ''
    });

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('commandes-clients.index'), { search }, {
            preserveState: true,
            replace: true
        });
    };

    const handleAdvancedFilter = () => {
        const filterData = { ...advancedFilters };
        Object.keys(filterData).forEach(key => {
            if (filterData[key] === 'all' || filterData[key] === '') {
                delete filterData[key];
            }
        });

        router.get(route('commandes-clients.index'), filterData, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const currentSort = filters.sort;
        const currentDirection = filters.direction;

        let newDirection = 'asc';
        if (currentSort === field && currentDirection === 'asc') {
            newDirection = 'desc';
        }

        router.get(route('commandes-clients.index'), {
            ...filters,
            sort: field,
            direction: newDirection
        }, {
            preserveState: true,
            replace: true
        });
    };

    const getSortIcon = (field) => {
        if (filters.sort !== field) {
            return <ArrowUpDown className="h-4 w-4" />;
        }
        return filters.direction === 'asc' ?
            <ArrowUp className="h-4 w-4" /> :
            <ArrowDown className="h-4 w-4" />;
    };

    const handleDelete = (commande) => {
        setDeleteDialog({ open: true, commande });
    };

    const confirmDelete = () => {
        if (deleteDialog.commande) {
            router.delete(route('commandes-clients.destroy', deleteDialog.commande.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, commande: null });
                }
            });
        }
    };

    const getStatutPaiementBadge = (commande) => {
        const statut = commande.paiement?.statut || 'non_paye';
        const variants = {
            'non_paye': 'destructive',
            'partiellement_paye': 'secondary',
            'paye': 'default'
        };
        const labels = {
            'non_paye': 'Non payé',
            'partiellement_paye': 'Partiellement payé',
            'paye': 'Payé'
        };

        return (
            <Badge variant={variants[statut]}>
                {labels[statut]}
            </Badge>
        );
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(price || 0);
    };

    const clearFilters = () => {
        router.get(route('commandes-clients.index'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Commandes Clients" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Commandes Clients</h1>
                        <p className="text-gray-600 mt-1">Gérez les commandes de vos clients</p>
                    </div>
                    <Link href={route('commandes-clients.create')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvelle Commande
                        </Button>
                    </Link>
                </div>

                {/* Search and Filters */}
                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            {/* Basic Search */}
                            <form onSubmit={handleSearch} className="flex gap-4">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par client, numéro de commande..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                <Button type="submit" variant="outline">
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                                >
                                    <Filter className="h-4 w-4 mr-2" />
                                    Filtres avancés
                                </Button>
                            </form>

                            {/* Advanced Filters */}
                            {showAdvancedFilters && (
                                <div className="border-t pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Client</label>
                                            <Select
                                                value={advancedFilters.client_id}
                                                onValueChange={(value) => setAdvancedFilters({...advancedFilters, client_id: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tous les clients" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les clients</SelectItem>
                                                    {clients?.map(client => (
                                                        <SelectItem key={client.id} value={client.id.toString()}>
                                                            {client.nom_complet}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Véhicule</label>
                                            <Select
                                                value={advancedFilters.vehicule_id}
                                                onValueChange={(value) => setAdvancedFilters({...advancedFilters, vehicule_id: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tous les véhicules" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les véhicules</SelectItem>
                                                    {vehicules?.map(vehicule => (
                                                        <SelectItem key={vehicule.id} value={vehicule.id.toString()}>
                                                            {vehicule.matricule} - {vehicule.marque}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Chauffeur</label>
                                            <Select
                                                value={advancedFilters.chauffeur_id}
                                                onValueChange={(value) => setAdvancedFilters({...advancedFilters, chauffeur_id: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tous les chauffeurs" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les chauffeurs</SelectItem>
                                                    {chauffeurs?.map(chauffeur => (
                                                        <SelectItem key={chauffeur.id} value={chauffeur.id.toString()}>
                                                            {chauffeur.nom_complet}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Statut Paiement</label>
                                            <Select
                                                value={advancedFilters.statut_paiement}
                                                onValueChange={(value) => setAdvancedFilters({...advancedFilters, statut_paiement: value})}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Tous les statuts" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                                    <SelectItem value="non_paye">Non payé</SelectItem>
                                                    <SelectItem value="partiellement_paye">Partiellement payé</SelectItem>
                                                    <SelectItem value="paye">Payé</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Date début</label>
                                            <Input
                                                type="date"
                                                value={advancedFilters.date_debut}
                                                onChange={(e) => setAdvancedFilters({...advancedFilters, date_debut: e.target.value})}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Date fin</label>
                                            <Input
                                                type="date"
                                                value={advancedFilters.date_fin}
                                                onChange={(e) => setAdvancedFilters({...advancedFilters, date_fin: e.target.value})}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Montant min</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={advancedFilters.montant_min}
                                                onChange={(e) => setAdvancedFilters({...advancedFilters, montant_min: e.target.value})}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-2">Montant max</label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                placeholder="0.00"
                                                value={advancedFilters.montant_max}
                                                onChange={(e) => setAdvancedFilters({...advancedFilters, montant_max: e.target.value})}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex gap-2 mt-4">
                                        <Button onClick={handleAdvancedFilter} className="bg-yellow-500 hover:bg-yellow-600">
                                            Appliquer les filtres
                                        </Button>
                                        <Button variant="outline" onClick={clearFilters}>
                                            Effacer les filtres
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Commandes Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Liste des Commandes ({commandes.total})</CardTitle>
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
                                                N° Commande
                                                {getSortIcon('id')}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort('client')}
                                        >
                                            <div className="flex items-center gap-2">
                                                Client
                                                {getSortIcon('client')}
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
                                                Montant Total
                                                {getSortIcon('montant_total')}
                                            </div>
                                        </TableHead>
                                        <TableHead>Véhicule</TableHead>
                                        <TableHead>Chauffeur</TableHead>
                                        <TableHead>Statut Paiement</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandes.data?.length > 0 ? (
                                        commandes.data.map((commande) => (
                                            <TableRow key={commande.id}>
                                                <TableCell className="font-medium">
                                                    #{commande.id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium">{commande.client?.nom_complet}</div>
                                                        <div className="text-sm text-gray-500">{commande.client?.telephone}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {commande.date_commande && format(new Date(commande.date_commande), 'dd/MM/yyyy', { locale: fr })}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {formatPrice(commande.montant_total)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="text-sm">
                                                        <div>{commande.vehicule?.matricule}</div>
                                                        <div className="text-gray-500">{commande.vehicule?.marque} {commande.vehicule?.modele}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {commande.chauffeur?.nom_complet}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatutPaiementBadge(commande)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Link href={route('commandes-clients.show', commande.id)}>
                                                            <Button variant="outline" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleDelete(commande)}
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
                                                Aucune commande trouvée
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {commandes.links && (
                            <div className="flex justify-center mt-6">
                                <div className="flex gap-2">
                                    {commandes.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => {
                                                if (link.url) {
                                                    router.get(link.url);
                                                }
                                            }}
                                            disabled={!link.url}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Delete Confirmation Dialog */}
                <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer la commande #{deleteDialog.commande?.id} ?
                                Cette action est irréversible et les stocks seront restaurés.
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
                            >
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AuthenticatedLayout>
    );
}
