import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Plus,
    Search,
    Filter,
    Download,
    Edit,
    Eye,
    Trash2,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Users,
    CreditCard,
    TrendingUp,
    UserX,
} from "lucide-react";

export default function ClientsIndex({ clients, stats, filters, sort }) {
    const [selectedClients, setSelectedClients] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, client: null });
    const [tab, setTab] = useState("basic");
    const [basicFilters, setBasicFilters] = useState({
        search: filters.search || "",
    });
    const [advancedFilters, setAdvancedFilters] = useState({
        dettes_min: filters.dettes_min || "",
        dettes_max: filters.dettes_max || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    // --- Actions ---
    const handleSearch = (e) => {
        const value = e.target.value;
        setBasicFilters({ ...basicFilters, search: value });
        router.get(
            route("clients.index"),
            { ...filters, search: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key, value) => {
        if (tab === "basic") {
            router.get(
                route("clients.index"),
                { ...filters, [key]: value, page: 1 },
                { preserveState: true, replace: true }
            );
        } else {
            setAdvancedFilters({ ...advancedFilters, [key]: value });
        }
    };

    const applyAdvancedFilters = () => {
        router.get(
            route("clients.index"),
            { ...filters, ...advancedFilters, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        setBasicFilters({ search: "" });
        setAdvancedFilters({
            dettes_min: "",
            dettes_max: "",
            date_from: "",
            date_to: "",
        });
        router.get(route("clients.index"));
    };

    const handleSort = (field) => {
        const direction =
            sort.sort === field && sort.direction === "asc" ? "desc" : "asc";
        router.get(
            route("clients.index"),
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const getSortIcon = (field) => {
        if (sort.sort !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return sort.direction === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedClients(clients.data.map((c) => c.id));
        } else {
            setSelectedClients([]);
        }
    };

    const handleSelectClient = (clientId, checked) => {
        if (checked) {
            setSelectedClients([...selectedClients, clientId]);
        } else {
            setSelectedClients(selectedClients.filter((id) => id !== clientId));
        }
    };

    const handleDelete = (client) => {
        setDeleteDialog({ open: true, client });
    };

    const confirmDelete = () => {
        if (deleteDialog.client) {
            router.delete(route("clients.destroy", deleteDialog.client.id), {
                onSuccess: () => setDeleteDialog({ open: false, client: null }),
            });
        }
    };

    const handleExport = () => {
        router.get(route("clients.export"), filters);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
        }).format(amount);
    };

    // --- Render ---
    return (
        <AdminLayout title="Gestion des Clients">
            <Head title="Clients" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-yellow-600" />
                            Gestion des Clients
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez vos clients, leurs informations et leurs dettes
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exporter
                        </Button>
                        <Link href={route("clients.create")}>
                            <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                <Plus className="h-4 w-4" />
                                Ajouter Client
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Clients
                            </CardTitle>
                            <Users className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.total_clients}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Dettes
                            </CardTitle>
                            <CreditCard className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {formatCurrency(stats.total_dettes)}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Clients Endettés
                            </CardTitle>
                            <UserX className="h-4 w-4 text-orange-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-orange-600">
                                {stats.clients_avec_dettes}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Moyenne Dettes
                            </CardTitle>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.moyenne_dettes || 0)}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Filter className="h-5 w-5" />
                            Filtres et Recherche
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={tab} onValueChange={setTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="basic">
                                    Filtres de Base
                                </TabsTrigger>
                                <TabsTrigger value="advanced">
                                    Filtres Avancés
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="basic" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Rechercher clients..."
                                            value={basicFilters.search}
                                            onChange={handleSearch}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                        className="w-full"
                                    >
                                        Effacer les filtres
                                    </Button>
                                </div>
                            </TabsContent>
                            <TabsContent value="advanced" className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Dettes minimum
                                        </label>
                                        <Input
                                            type="number"
                                            value={advancedFilters.dettes_min}
                                            onChange={(e) =>
                                                handleFilter("dettes_min", e.target.value)
                                            }
                                            placeholder="0"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Dettes maximum
                                        </label>
                                        <Input
                                            type="number"
                                            value={advancedFilters.dettes_max}
                                            onChange={(e) =>
                                                handleFilter("dettes_max", e.target.value)
                                            }
                                            placeholder="10000"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date création (du)
                                        </label>
                                        <Input
                                            type="date"
                                            value={advancedFilters.date_from}
                                            onChange={(e) =>
                                                handleFilter("date_from", e.target.value)
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date création (au)
                                        </label>
                                        <Input
                                            type="date"
                                            value={advancedFilters.date_to}
                                            onChange={(e) =>
                                                handleFilter("date_to", e.target.value)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={applyAdvancedFilters}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        Appliquer les filtres
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Liste des Clients ({clients.total} clients)
                            </CardTitle>
                            {selectedClients.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedClients.length} sélectionnés
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    selectedClients.length === clients.data.length
                                                }
                                                onCheckedChange={handleSelectAll}
                                            />
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("nom")}
                                        >
                                            <div className="flex items-center">
                                                Nom
                                                {getSortIcon("nom")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("cin")}
                                        >
                                            <div className="flex items-center">
                                                CIN
                                                {getSortIcon("cin")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Téléphone</TableHead>
                                        <TableHead>Adresse</TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("dettes")}
                                        >
                                            <div className="flex items-center">
                                                Dettes
                                                {getSortIcon("dettes")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Commandes</TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("created_at")}
                                        >
                                            <div className="flex items-center">
                                                Date création
                                                {getSortIcon("created_at")}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-24">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.data.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedClients.includes(client.id)}
                                                    onCheckedChange={(checked) =>
                                                        handleSelectClient(client.id, checked)
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {client.nom}
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {client.cin}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                {client.telephone || "-"}
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate" title={client.adresse}>
                                                {client.adresse || "-"}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        client.dettes > 0
                                                            ? "destructive"
                                                            : "secondary"
                                                    }
                                                    className={
                                                        client.dettes > 0
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-green-100 text-green-800"
                                                    }
                                                >
                                                    {formatCurrency(client.dettes)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant="outline"
                                                    className="bg-blue-50 text-blue-700"
                                                >
                                                    {client.commandes_count} commande(s)
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-sm text-gray-500">
                                                {new Date(client.created_at).toLocaleDateString("fr-FR")}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route("clients.show", client.id)}>
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link href={route("clients.edit", client.id)}>
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() => handleDelete(client)}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination */}
                        {clients.links && clients.links.length > 3 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-700">
                                    Affichage de {clients.from} à {clients.to} sur {clients.total} résultats
                                </div>
                                <div className="flex items-center gap-2">
                                    {clients.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={link.active ? "default" : "outline"}
                                            size="sm"
                                            disabled={!link.url}
                                            onClick={() => link.url && router.get(link.url)}
                                            dangerouslySetInnerHTML={{
                                                __html: link.label,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, client: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le client{" "}
                            <strong>{deleteDialog.client?.nom}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, client: null })
                            }
                        >
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}

