import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/Components/ui/collapsible';
import {
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Eye,
    Edit,
    Trash2,
    Building2,
    User,
    Phone,
    Mail,
    MapPin,
    FileText,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function FournisseursIndex({ fournisseurs, filters, sort, direction }) {
    const { flash } = usePage().props;
    const [search, setSearch] = useState(filters?.search || '');
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [advancedFilters, setAdvancedFilters] = useState({
        nom_societe: filters?.nom_societe || '',
        contact_nom: filters?.contact_nom || '',
        telephone: filters?.telephone || '',
        email: filters?.email || '',
        ice: filters?.ice || ''
    });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, fournisseur: null });

    // Fonction pour effectuer la recherche
    const handleSearch = () => {
        router.get(route('fournisseurs.index'), {
            search,
            ...advancedFilters,
            sort,
            direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setSearch('');
        setAdvancedFilters({
            nom_societe: '',
            contact_nom: '',
            telephone: '',
            email: '',
            ice: ''
        });
        router.get(route('fournisseurs.index'), { sort, direction }, {
            preserveState: true,
            replace: true
        });
    };

    // Fonction pour trier
    const handleSort = (field) => {
        const newDirection = sort === field && direction === 'asc' ? 'desc' : 'asc';
        router.get(route('fournisseurs.index'), {
            search,
            ...advancedFilters,
            sort: field,
            direction: newDirection
        }, {
            preserveState: true,
            replace: true
        });
    };

    // Fonction pour supprimer un fournisseur
    const handleDelete = () => {
        if (deleteDialog.fournisseur) {
            router.delete(route('fournisseurs.destroy', deleteDialog.fournisseur.id), {
                onSuccess: () => {
                    setDeleteDialog({ open: false, fournisseur: null });
                }
            });
        }
    };

    // Fonction pour obtenir l'icône de tri
    const getSortIcon = (field) => {
        if (sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    // Fonction pour formater la date
    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Gestion des Fournisseurs
                    </h2>
                    <Link href={route('fournisseurs.create')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouveau Fournisseur
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title="Fournisseurs" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Messages flash */}
                    {flash?.success && (
                        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            {flash.error}
                        </div>
                    )}

                    {/* Filtres */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Filter className="h-5 w-5" />
                                Filtres et Recherche
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Recherche de base */}
                            <div className="flex gap-2">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Rechercher par nom, contact, téléphone, email ou ICE..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                                <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600">
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                                <Button variant="outline" onClick={resetFilters}>
                                    Réinitialiser
                                </Button>
                            </div>

                            {/* Filtres avancés */}
                            <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                                <CollapsibleTrigger asChild>
                                    <Button variant="ghost" className="w-full justify-between">
                                        Filtres Avancés
                                        {showAdvancedFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                    </Button>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="space-y-4 pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Nom Société</label>
                                            <Input
                                                placeholder="Filtrer par nom société"
                                                value={advancedFilters.nom_societe}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, nom_societe: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Contact</label>
                                            <Input
                                                placeholder="Filtrer par contact"
                                                value={advancedFilters.contact_nom}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, contact_nom: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Téléphone</label>
                                            <Input
                                                placeholder="Filtrer par téléphone"
                                                value={advancedFilters.telephone}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, telephone: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Email</label>
                                            <Input
                                                placeholder="Filtrer par email"
                                                value={advancedFilters.email}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, email: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">ICE</label>
                                            <Input
                                                placeholder="Filtrer par ICE"
                                                value={advancedFilters.ice}
                                                onChange={(e) => setAdvancedFilters(prev => ({ ...prev, ice: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600">
                                            Appliquer les Filtres
                                        </Button>
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </CardContent>
                    </Card>

                    {/* Liste des fournisseurs */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Liste des Fournisseurs</CardTitle>
                            <CardDescription>
                                {fournisseurs?.total || 0} fournisseur(s) trouvé(s)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('nom_societe')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Société
                                                {getSortIcon('nom_societe')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('contact_nom')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Contact
                                                {getSortIcon('contact_nom')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('telephone')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Téléphone
                                                {getSortIcon('telephone')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('email')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Email
                                                {getSortIcon('email')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('ice')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                ICE
                                                {getSortIcon('ice')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('created_at')}
                                                className="h-auto p-0 font-semibold"
                                            >
                                                Créé le
                                                {getSortIcon('created_at')}
                                            </Button>
                                        </TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fournisseurs?.data?.length > 0 ? (
                                        fournisseurs.data.map((fournisseur) => (
                                            <TableRow key={fournisseur.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Building2 className="h-4 w-4 text-yellow-500" />
                                                        <span className="font-medium">{fournisseur.nom_societe}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {fournisseur.contact_nom ? (
                                                        <div className="flex items-center gap-2">
                                                            <User className="h-4 w-4 text-gray-500" />
                                                            {fournisseur.contact_nom}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {fournisseur.telephone ? (
                                                        <div className="flex items-center gap-2">
                                                            <Phone className="h-4 w-4 text-gray-500" />
                                                            {fournisseur.telephone}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {fournisseur.email ? (
                                                        <div className="flex items-center gap-2">
                                                            <Mail className="h-4 w-4 text-gray-500" />
                                                            {fournisseur.email}
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {fournisseur.ice ? (
                                                        <Badge variant="outline">
                                                            {fournisseur.ice}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-gray-400">-</span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(fournisseur.created_at)}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Link href={route('fournisseurs.show', fournisseur.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Link href={route('fournisseurs.edit', fournisseur.id)}>
                                                            <Button variant="ghost" size="sm">
                                                                <Edit className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => setDeleteDialog({ open: true, fournisseur })}
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
                                            <TableCell colSpan={7} className="text-center text-gray-500">
                                                Aucun fournisseur trouvé
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            {/* Pagination */}
                            {fournisseurs?.links && (
                                <div className="flex justify-center mt-4">
                                    <div className="flex gap-2">
                                        {fournisseurs.links.map((link, index) => (
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

                    {/* Dialog de confirmation de suppression */}
                    <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, fournisseur: null })}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Confirmer la suppression</DialogTitle>
                                <DialogDescription>
                                    Êtes-vous sûr de vouloir supprimer le fournisseur "{deleteDialog.fournisseur?.nom_societe}" ?
                                    Cette action est irréversible.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button
                                    variant="outline"
                                    onClick={() => setDeleteDialog({ open: false, fournisseur: null })}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleDelete}
                                >
                                    Supprimer
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
