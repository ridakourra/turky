import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';
import { Plus, Search, Filter, ArrowUpDown, Trash2, Eye, Edit, Truck } from 'lucide-react';

export default function Index({ enginsLourds, filters, sort }) {
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [selectedTypeEngin, setSelectedTypeEngin] = useState(filters?.type_engin || 'all');
    const [selectedStatut, setSelectedStatut] = useState(filters?.statut || 'all');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, engin: null });

    const handleSearch = () => {
        router.get(route('engins-lourds.index'), {
            search: searchTerm,
            type_engin: selectedTypeEngin,
            statut: selectedStatut,
        });
    };

    const handleSort = (field) => {
        const direction = sort?.sort === field && sort?.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('engins-lourds.index'), {
            ...filters,
            sort: field,
            direction: direction,
        });
    };

    const handleDelete = (engin) => {
        router.delete(route('engins-lourds.destroy', engin.id), {
            onSuccess: () => {
                setDeleteDialog({ open: false, engin: null });
            }
        });
    };

    const getStatutBadge = (statut) => {
        const variants = {
            'actif': 'bg-green-100 text-green-800',
            'en_maintenance': 'bg-yellow-100 text-yellow-800',
            'hors_service': 'bg-red-100 text-red-800'
        };
        return variants[statut] || 'bg-gray-100 text-gray-800';
    };

    const getTypeEnginLabel = (type) => {
        const labels = {
            'pelleteuse': 'Pelleteuse',
            'bulldozer': 'Bulldozer',
            'grue': 'Grue',
            'autre': 'Autre'
        };
        return labels[type] || type;
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'actif': 'Actif',
            'en_maintenance': 'En maintenance',
            'hors_service': 'Hors service'
        };
        return labels[statut] || statut;
    };

    return (
        <AdminLayout>
            <Head title="Engins Lourds" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                        <Truck className="h-6 w-6 text-yellow-600" />
                        <h1 className="text-2xl font-bold text-gray-900">Engins Lourds</h1>
                    </div>
                    <Link href={route('engins-lourds.create')}>
                        <Button className="bg-yellow-600 hover:bg-yellow-700">
                            <Plus className="h-4 w-4 mr-2" />
                            Nouvel Engin
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <Filter className="h-5 w-5" />
                            <span>Filtres</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            <Select value={selectedTypeEngin} onValueChange={setSelectedTypeEngin}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Type d'engin" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les types</SelectItem>
                                    <SelectItem value="pelleteuse">Pelleteuse</SelectItem>
                                    <SelectItem value="bulldozer">Bulldozer</SelectItem>
                                    <SelectItem value="grue">Grue</SelectItem>
                                    <SelectItem value="autre">Autre</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={selectedStatut} onValueChange={setSelectedStatut}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="actif">Actif</SelectItem>
                                    <SelectItem value="en_maintenance">En maintenance</SelectItem>
                                    <SelectItem value="hors_service">Hors service</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={handleSearch} className="bg-yellow-600 hover:bg-yellow-700">
                                <Search className="h-4 w-4 mr-2" />
                                Rechercher
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('reference')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Référence
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('marque')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Marque
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Modèle</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Capacité</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('date_acquisition')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Date d'acquisition
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enginsLourds?.data?.map((engin) => (
                                    <TableRow key={engin.id}>
                                        <TableCell className="font-medium">{engin.reference}</TableCell>
                                        <TableCell>{engin.marque}</TableCell>
                                        <TableCell>{engin.modele || '-'}</TableCell>
                                        <TableCell>{getTypeEnginLabel(engin.type_engin)}</TableCell>
                                        <TableCell>{engin.capacite ? `${engin.capacite} T` : '-'}</TableCell>
                                        <TableCell>
                                            <Badge className={getStatutBadge(engin.statut)}>
                                                {getStatutLabel(engin.statut)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {engin.date_acquisition ? new Date(engin.date_acquisition).toLocaleDateString('fr-FR') : '-'}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end space-x-2">
                                                <Link href={route('engins-lourds.show', engin.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={route('engins-lourds.edit', engin.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setDeleteDialog({ open: true, engin })}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {enginsLourds?.links && (
                    <div className="flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                {enginsLourds.links.map((link, index) => {
                                    if (index === 0) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationPrevious
                                                    href={link.url}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    if (index === enginsLourds.links.length - 1) {
                                        return (
                                            <PaginationItem key={index}>
                                                <PaginationNext
                                                    href={link.url}
                                                    className={!link.url ? 'pointer-events-none opacity-50' : ''}
                                                />
                                            </PaginationItem>
                                        );
                                    }
                                    return (
                                        <PaginationItem key={index}>
                                            <PaginationLink
                                                href={link.url}
                                                isActive={link.active}
                                                onClick={(e) => {
                                                    if (link.url) {
                                                        e.preventDefault();
                                                        router.get(link.url);
                                                    }
                                                }}
                                            >
                                                {link.label}
                                            </PaginationLink>
                                        </PaginationItem>
                                    );
                                })}
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Delete Dialog */}
                <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, engin: null })}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Confirmer la suppression</DialogTitle>
                            <DialogDescription>
                                Êtes-vous sûr de vouloir supprimer l'engin lourd "{deleteDialog.engin?.reference}" ?
                                Cette action est irréversible.
                            </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setDeleteDialog({ open: false, engin: null })}
                            >
                                Annuler
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => handleDelete(deleteDialog.engin)}
                            >
                                Supprimer
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}