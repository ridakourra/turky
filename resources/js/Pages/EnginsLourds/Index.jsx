import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Construction,
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
} from "lucide-react";

const Index = ({ enginsLourds, employers, filters, sort }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        item: null,
    });
    const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
    const [tab, setTab] = useState("basic");
    const [basicFilters, setBasicFilters] = useState({
        search: filters.search || "",
    });
    const [advancedFilters, setAdvancedFilters] = useState({
        type: filters.type || "",
        statut: filters.statut || "",
        marque: filters.marque || "",
        employer_id: filters.employer_id || "",
        date_from: filters.date_from || "",
        date_to: filters.date_to || "",
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        setBasicFilters({ ...basicFilters, search: value });
        router.get(
            route("engins-lourds.index"),
            { ...filters, search: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key, value) => {
        if (tab === "basic") {
            router.get(
                route("engins-lourds.index"),
                { ...filters, [key]: value, page: 1 },
                { preserveState: true, replace: true }
            );
        } else {
            setAdvancedFilters({ ...advancedFilters, [key]: value });
        }
    };

    const applyAdvancedFilters = () => {
        router.get(
            route("engins-lourds.index"),
            { ...filters, ...advancedFilters, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        setBasicFilters({ search: "" });
        setAdvancedFilters({
            type: "",
            statut: "",
            marque: "",
            employer_id: "",
            date_from: "",
            date_to: "",
        });
        router.get(route("engins-lourds.index"));
    };

    const handleSort = (field) => {
        const direction =
            filters.sort === field && filters.direction === "asc"
                ? "desc"
                : "asc";
        router.get(
            route("engins-lourds.index"),
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const getSortIcon = (field) => {
        if (filters.sort !== field) return <ArrowUpDown className="w-4 h-4" />;
        return filters.direction === "asc" ? (
            <ArrowUp className="w-4 h-4" />
        ) : (
            <ArrowDown className="w-4 h-4" />
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedItems(enginsLourds.data.map((item) => item.id));
        } else {
            setSelectedItems([]);
        }
    };

    const handleSelectItem = (itemId, checked) => {
        if (checked) {
            setSelectedItems([...selectedItems, itemId]);
        } else {
            setSelectedItems(selectedItems.filter((id) => id !== itemId));
        }
    };

    const handleDelete = (item) => {
        setDeleteDialog({ open: true, item });
    };

    const confirmDelete = () => {
        if (deleteDialog.item) {
            router.delete(
                route("engins-lourds.destroy", deleteDialog.item.id),
                {
                    onSuccess: () =>
                        setDeleteDialog({ open: false, item: null }),
                }
            );
        }
    };

    const handleBulkDelete = () => {
        setBulkDeleteDialog(true);
    };

    const confirmBulkDelete = () => {
        router.post(
            route("engins-lourds.bulk-delete"),
            { ids: selectedItems },
            {
                onSuccess: () => {
                    setBulkDeleteDialog(false);
                    setSelectedItems([]);
                },
            }
        );
    };

    const handleExport = () => {
        router.get(route("engins-lourds.export"), filters);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            available: {
                label: "Disponible",
                className: "bg-green-100 text-green-800",
            },
            in_use: {
                label: "En utilisation",
                className: "bg-blue-100 text-blue-800",
            },
            maintenance: {
                label: "En maintenance",
                className: "bg-yellow-100 text-yellow-800",
            },
            broken: { label: "En panne", className: "bg-red-100 text-red-800" },
        };
        const config = statusConfig[status] || statusConfig.available;
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    // --- Render ---
    return (
        <AdminLayout title="Engins Lourds">
            <Head title="Engins Lourds" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Construction className="w-6 h-6 text-yellow-600" />
                            Gestion des Engins Lourds
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez et suivez tous vos engins lourds et
                            équipements
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="w-4 h-4" />
                            Exporter
                        </Button>
                        <Link href={route("engins-lourds.create")}>
                            <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                <Plus className="w-4 h-4" />
                                Nouvel Engin
                            </Button>
                        </Link>
                    </div>
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
                        <Tabs
                            value={tab}
                            onValueChange={setTab}
                            className="w-full"
                        >
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
                                            placeholder="Rechercher par nom, référence, type, marque..."
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
                                            Type
                                        </label>
                                        <Input
                                            placeholder="Type d'engin"
                                            value={advancedFilters.type}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "type",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Statut
                                        </label>
                                        <Select
                                            value={advancedFilters.statut}
                                            onValueChange={(value) =>
                                                handleFilter("statut", value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un statut" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    Tous
                                                </SelectItem>
                                                <SelectItem value="available">
                                                    Disponible
                                                </SelectItem>
                                                <SelectItem value="in_use">
                                                    En utilisation
                                                </SelectItem>
                                                <SelectItem value="maintenance">
                                                    En maintenance
                                                </SelectItem>
                                                <SelectItem value="broken">
                                                    En panne
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Marque
                                        </label>
                                        <Input
                                            placeholder="Marque"
                                            value={advancedFilters.marque}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "marque",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Opérateur
                                        </label>
                                        <Select
                                            value={advancedFilters.employer_id}
                                            onValueChange={(value) =>
                                                handleFilter(
                                                    "employer_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionner un opérateur" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">
                                                    Tous
                                                </SelectItem>
                                                {employers.map((employer) => (
                                                    <SelectItem
                                                        key={employer.id}
                                                        value={employer.id.toString()}
                                                    >
                                                        {employer.nom}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date de début
                                        </label>
                                        <Input
                                            type="date"
                                            value={advancedFilters.date_from}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "date_from",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date de fin
                                        </label>
                                        <Input
                                            type="date"
                                            value={advancedFilters.date_to}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "date_to",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 gap-2">
                                    <Button
                                        onClick={applyAdvancedFilters}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        Appliquer les filtres
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={clearFilters}
                                    >
                                        Réinitialiser
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Bulk Actions */}
                {selectedItems.length > 0 && (
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-yellow-800">
                                    {selectedItems.length} élément(s)
                                    sélectionné(s)
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer la sélection
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Liste des Engins Lourds ({enginsLourds.total}{" "}
                                engins)
                            </CardTitle>
                            {selectedItems.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedItems.length} sélectionnés
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto p-3">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    selectedItems.length ===
                                                    enginsLourds.data.length
                                                }
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
                                            />
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort("nom")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Nom {getSortIcon("nom")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() =>
                                                handleSort("reference")
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                Référence{" "}
                                                {getSortIcon("reference")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Marque/Modèle</TableHead>
                                        <TableHead>Capacité</TableHead>
                                        <TableHead>Prix/Heure</TableHead>
                                        <TableHead>Opérateur</TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-50"
                                            onClick={() => handleSort("statut")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Statut {getSortIcon("statut")}
                                            </div>
                                        </TableHead>
                                        <TableHead className="w-20">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {enginsLourds.data.map((engin) => (
                                        <TableRow key={engin.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedItems.includes(
                                                        engin.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelectItem(
                                                            engin.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {engin.nom}
                                            </TableCell>
                                            <TableCell>
                                                {engin.reference}
                                            </TableCell>
                                            <TableCell>
                                                {engin.type || "-"}
                                            </TableCell>
                                            <TableCell>
                                                {engin.marque && engin.modele
                                                    ? `${engin.marque} ${engin.modele}`
                                                    : engin.marque ||
                                                      engin.modele ||
                                                      "-"}
                                            </TableCell>
                                            <TableCell>
                                                {engin.capacite
                                                    ? `${engin.capacite} T`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {engin.location_par_heure
                                                    ? `${engin.location_par_heure} MAD/h`
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {engin.employer
                                                    ? engin.employer.nom
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {getStatusBadge(engin.statut)}
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <MoreHorizontal className="w-4 h-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "engins-lourds.show",
                                                                    engin.id
                                                                )}
                                                            >
                                                                <Eye className="w-4 h-4 mr-2" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "engins-lourds.edit",
                                                                    engin.id
                                                                )}
                                                            >
                                                                <Edit className="w-4 h-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    engin
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" />
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
                        {enginsLourds.links && (
                            <div className="flex items-center justify-between p-3">
                                <div className="text-sm text-gray-700">
                                    Affichage de {enginsLourds.from} à{" "}
                                    {enginsLourds.to} sur {enginsLourds.total}{" "}
                                    résultats
                                </div>
                                <div className="flex items-center gap-2">
                                    {enginsLourds.links.map((link, index) => (
                                        <Button
                                            key={index}
                                            variant={
                                                link.active
                                                    ? "default"
                                                    : "outline"
                                            }
                                            size="sm"
                                            onClick={() =>
                                                link.url && router.get(link.url)
                                            }
                                            disabled={!link.url}
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
            {/* Delete Dialog */}
            <Dialog
                open={deleteDialog.open}
                onOpenChange={(open) =>
                    !open && setDeleteDialog({ open: false, item: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'engin lourd{" "}
                            <strong>{deleteDialog.item?.nom}</strong> ? Cette
                            action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, item: null })
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
            {/* Bulk Delete Dialog */}
            <Dialog open={bulkDeleteDialog} onOpenChange={setBulkDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Confirmer la suppression multiple
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            {selectedItems.length} engin(s) lourd(s)
                            sélectionné(s) ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteDialog(false)}
                        >
                            Annuler
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmBulkDelete}
                        >
                            Supprimer tout
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default Index;
