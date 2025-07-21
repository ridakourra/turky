import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Eye, ArrowUpDown, ArrowUp, ArrowDown, Users, ShoppingCart, Truck } from 'lucide-react';

export default function Index({ clients, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [hasDebts, setHasDebts] = useState(filters.has_debts || '');
    const [hasOrders, setHasOrders] = useState(filters.has_orders || '');
    const [deleteClient, setDeleteClient] = useState(null);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/clients', {
            search,
            has_debts: hasDebts,
            has_orders: hasOrders,
            sort: filters.sort,
            direction: filters.direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const direction = filters.sort === field && filters.direction === 'asc' ? 'desc' : 'asc';
        router.get('/clients', {
            ...filters,
            sort: field,
            direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = () => {
        if (deleteClient) {
            router.delete(`/clients/${deleteClient.id}`, {
                onSuccess: () => setDeleteClient(null)
            });
        }
    };

    const getSortIcon = (field) => {
        if (filters.sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return filters.direction === 'asc' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount || 0);
    };

    return (
        <AdminLayout>
            <Head title="Gestion des Clients" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Gestion des Clients</h1>
                        <p className="text-gray-600 mt-1">Gérez vos clients et leurs informations</p>
                    </div>
                    <Link href="/clients/create">
                        <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="h-4 w-4" />
                            Nouveau Client
                        </Button>
                    </Link>
            </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clients.total}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clients avec Commandes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {clients.data.filter(client => client.commandes_clients_count > 0).length}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clients avec Locations</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {clients.data.filter(client => client.location_engins_lourds_count > 0).length}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                    <Input
                                        type="text"
                                        placeholder="Rechercher par nom, téléphone..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={hasDebts} onValueChange={(value) => setHasDebts(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrer par dettes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les clients</SelectItem>
                                        <SelectItem value="yes">Avec dettes</SelectItem>
                                        <SelectItem value="no">Sans dettes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={hasOrders} onValueChange={(value) => setHasOrders(value === 'all' ? '' : value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filtrer par commandes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les clients</SelectItem>
                                        <SelectItem value="yes">Avec commandes</SelectItem>
                                        <SelectItem value="no">Sans commandes</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Button type="submit" className="w-full bg-yellow-500 hover:bg-yellow-600">
                                    <Search className="h-4 w-4 mr-2" />
                                    Rechercher
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Clients Table */}
                <Card>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('nom_complet')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Nom Complet
                                            {getSortIcon('nom_complet')}
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
                                    <TableHead>Adresse</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('dettes_actuelle')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Dettes
                                            {getSortIcon('dettes_actuelle')}
                                        </Button>
                                    </TableHead>
                                    <TableHead>Commandes</TableHead>
                                    <TableHead>Locations</TableHead>
                                    <TableHead>
                                        <Button
                                            variant="ghost"
                                            onClick={() => handleSort('created_at')}
                                            className="h-auto p-0 font-semibold"
                                        >
                                            Date Création
                                            {getSortIcon('created_at')}
                                        </Button>
                                    </TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clients.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                            Aucun client trouvé
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    clients.data.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.nom_complet}</TableCell>
                                            <TableCell>{client.telephone || '-'}</TableCell>
                                            <TableCell className="max-w-xs truncate">{client.addresse || '-'}</TableCell>
                                            <TableCell>
                                                {client.dettes_actuelle > 0 ? (
                                                    <Badge variant="destructive">
                                                        {formatCurrency(client.dettes_actuelle)}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="secondary">Aucune dette</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {client.commandes_clients_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {client.location_engins_lourds_count}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {new Date(client.created_at).toLocaleDateString('fr-FR')}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/clients/${client.id}`}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/clients/${client.id}/edit`}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => setDeleteClient(client)}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Êtes-vous sûr de vouloir supprimer le client "{client.nom_complet}" ?
                                                                    Cette action est irréversible.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Annuler</AlertDialogCancel>
                                                                <AlertDialogAction onClick={handleDelete} className="bg-yellow-500 hover:bg-yellow-600">
                                                                    Supprimer
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                {/* Pagination */}
                {clients.last_page > 1 && (
                    <div className="flex justify-center">
                        <div className="flex items-center space-x-2">
                            {clients.links.map((link, index) => {
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
            </div>
        </AdminLayout>
    );
}
