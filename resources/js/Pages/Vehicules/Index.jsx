import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Plus, Search, ArrowUpDown, Eye, Edit, Trash2, Truck } from 'lucide-react';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/Components/ui/pagination';

export default function Index({ vehicules, filters }) {
    const [deleteVehicule, setDeleteVehicule] = useState(null);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [typeFilter, setTypeFilter] = useState(filters?.type || 'all');
    const [statutFilter, setStatutFilter] = useState(filters?.statut || 'all');
    const [chauffeurFilter, setChauffeurFilter] = useState(filters?.chauffeur || 'all');

    const handleSearch = () => {
        router.get(route('vehicules.index'), {
            search: searchTerm,
            type: typeFilter,
            statut: statutFilter,
            chauffeur: chauffeurFilter,
            sort: filters?.sort,
            direction: filters?.direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const direction = filters?.sort === field && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('vehicules.index'), {
            ...filters,
            sort: field,
            direction: direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = () => {
        if (deleteVehicule) {
            router.delete(route('vehicules.destroy', deleteVehicule.id), {
                onSuccess: () => setDeleteVehicule(null)
            });
        }
    };

    const getStatutBadgeColor = (statut) => {
        const colors = {
            actif: 'bg-green-500',
            en_maintenance: 'bg-yellow-500',
            hors_service: 'bg-red-500'
        };
        return colors[statut] || 'bg-gray-500';
    };

    const getTypeBadgeColor = (type) => {
        const colors = {
            camion: 'bg-blue-500',
            voiture: 'bg-purple-500',
            autre: 'bg-gray-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    return (
        <AdminLayout>
            <Head title="Véhicules" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Truck className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-3xl font-bold text-gray-900">Véhicules</h1>
                    </div>
                    <Link href={route('vehicules.create')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouveau véhicule
                        </Button>
                    </Link>
                </div>

                {/* Filtres */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <div className="md:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <Input
                                        placeholder="Rechercher par matricule, marque, modèle ou chauffeur..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            <div>
                                <Select value={typeFilter} onValueChange={setTypeFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les types</SelectItem>
                                        <SelectItem value="camion">Camion</SelectItem>
                                        <SelectItem value="voiture">Voiture</SelectItem>
                                        <SelectItem value="autre">Autre</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Select value={statutFilter} onValueChange={setStatutFilter}>
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
                            </div>
                            <div>
                                <Select value={chauffeurFilter} onValueChange={setChauffeurFilter}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Chauffeur" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous</SelectItem>
                                        <SelectItem value="avec_chauffeur">Avec chauffeur</SelectItem>
                                        <SelectItem value="sans_chauffeur">Sans chauffeur</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="flex justify-end mt-4">
                            <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600">
                                <Search className="w-4 h-4 mr-2" />
                                Rechercher
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Tableau des véhicules */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('matricule')}
                                            className="font-semibold"
                                        >
                                            Matricule
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('marque')}
                                            className="font-semibold"
                                        >
                                            Marque/Modèle
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Capacité</TableHead>
                                    <TableHead>Statut</TableHead>
                                    <TableHead>Chauffeur</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('created_at')}
                                            className="font-semibold"
                                        >
                                            Date création
                                            <ArrowUpDown className="ml-2 h-4 w-4" />
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vehicules?.data?.length > 0 ? (
                                    vehicules.data.map((vehicule) => (
                                        <TableRow key={vehicule.id}>
                                            <TableCell className="font-medium">{vehicule.matricule}</TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium">{vehicule.marque}</p>
                                                    {vehicule.modele && (
                                                        <p className="text-sm text-gray-500">{vehicule.modele}</p>
                                                    )}
                                                    {vehicule.annee && (
                                                        <p className="text-sm text-gray-500">({vehicule.annee})</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getTypeBadgeColor(vehicule.type_vehicule)} text-white`}>
                                                    {vehicule.type_vehicule}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {vehicule.capacite ? `${vehicule.capacite} T` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className={`${getStatutBadgeColor(vehicule.statut)} text-white`}>
                                                    {vehicule.statut?.replace('_', ' ')}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {vehicule.chauffeur ? (
                                                    <div>
                                                        <p className="font-medium">{vehicule.chauffeur.nom_complet}</p>
                                                        <p className="text-sm text-gray-500">{vehicule.chauffeur.telephone}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500">Non assigné</span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {new Date(vehicule.created_at).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end space-x-2">
                                                    <Link href={route('vehicules.show', vehicule.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('vehicules.edit', vehicule.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDeleteVehicule(vehicule)}
                                                                className="text-red-500 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Êtes-vous sûr de vouloir supprimer le véhicule {vehicule.matricule} ?
                                                                    Cette action est irréversible.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel onClick={() => setDeleteVehicule(null)}>
                                                                    Annuler
                                                                </AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={handleDelete}
                                                                    className="bg-red-500 hover:bg-red-600"
                                                                >
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            Aucun véhicule trouvé
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {vehicules?.data?.length > 0 && (
                    <div className="flex justify-center">
                        <Pagination>
                            <PaginationContent>
                                <PaginationPrevious
                                    href={vehicules.prev_page_url}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(vehicules.prev_page_url, {}, { preserveState: true, replace: true });
                                    }}
                                    className={!vehicules.prev_page_url ? 'pointer-events-none opacity-50' : undefined}
                                />
                                {vehicules.links.map((link, index) => (
                                    <PaginationItem key={index}>
                                        <PaginationLink
                                            href={link.url}
                                            isActive={link.active}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                router.get(link.url, {}, { preserveState: true, replace: true });
                                            }}
                                            className={!link.url ? 'pointer-events-none opacity-50' : undefined}
                                        >
                                            {link.label}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}
                                <PaginationNext
                                    href={vehicules.next_page_url}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        router.get(vehicules.next_page_url, {}, { preserveState: true, replace: true });
                                    }}
                                    className={!vehicules.next_page_url ? 'pointer-events-none opacity-50' : undefined}
                                />
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}