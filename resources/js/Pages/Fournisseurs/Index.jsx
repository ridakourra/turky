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
    Plus,
    Search,
    Filter,
    Download,
    Edit,
    Trash2,
    Eye,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Package,
    ShoppingCart,
    Users,
} from "lucide-react";

export default function Index({ fournisseurs, filters }) {
    const [selectedIds, setSelectedIds] = useState([]);
    const [tab, setTab] = useState("basic");
    const [basicFilters, setBasicFilters] = useState({
        search: filters.search || "",
    });
    const [advancedFilters, setAdvancedFilters] = useState({
        nom: filters.nom || "",
        ice_ou_cin: filters.ice_ou_cin || "",
        adresse: filters.adresse || "",
    });
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        fournisseur: null,
    });
    const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

    const handleSearch = (e) => {
        const value = e.target.value;
        setBasicFilters({ ...basicFilters, search: value });
        router.get(
            "/fournisseurs",
            { ...filters, search: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key, value) => {
        if (tab === "basic") {
            router.get(
                "/fournisseurs",
                { ...filters, [key]: value, page: 1 },
                { preserveState: true, replace: true }
            );
        } else {
            setAdvancedFilters({ ...advancedFilters, [key]: value });
        }
    };

    const applyAdvancedFilters = () => {
        router.get(
            "/fournisseurs",
            { ...filters, ...advancedFilters, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const clearFilters = () => {
        setBasicFilters({ search: "" });
        setAdvancedFilters({
            nom: "",
            ice_ou_cin: "",
            adresse: "",
        });
        router.get("/fournisseurs");
    };

    const handleSort = (field) => {
        const direction =
            filters.sort === field && filters.direction === "asc"
                ? "desc"
                : "asc";
        router.get(
            "/fournisseurs",
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const getSortIcon = (field) => {
        if (filters.sort !== field) return <ArrowUpDown className="h-4 w-4" />;
        return filters.direction === "asc" ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedIds(fournisseurs.data.map((f) => f.id));
        } else {
            setSelectedIds([]);
        }
    };

    const handleSelectOne = (id, checked) => {
        if (checked) {
            setSelectedIds([...selectedIds, id]);
        } else {
            setSelectedIds(
                selectedIds.filter((selectedId) => selectedId !== id)
            );
        }
    };

    const handleDelete = (fournisseur) => {
        setDeleteDialog({ open: true, fournisseur });
    };

    const confirmDelete = () => {
        if (deleteDialog.fournisseur) {
            router.delete(`/fournisseurs/${deleteDialog.fournisseur.id}`, {
                onSuccess: () =>
                    setDeleteDialog({ open: false, fournisseur: null }),
            });
        }
    };

    const handleBulkDelete = () => {
        setBulkDeleteDialog(true);
    };

    const confirmBulkDelete = () => {
        if (selectedIds.length === 0) return;
        router.delete("/fournisseurs/bulk", {
            data: { ids: selectedIds },
            onSuccess: () => {
                setSelectedIds([]);
                setBulkDeleteDialog(false);
            },
        });
    };

    const handleExport = () => {
        window.location.href = `/fournisseurs/export?${new URLSearchParams({
            search: basicFilters.search,
            ...advancedFilters,
        })}`;
    };

    // --- Render ---
    return (
        <AdminLayout title="Liste des Fournisseurs">
            <Head title="Fournisseurs" />
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Users className="h-6 w-6 text-yellow-600" />
                            Gestion des Fournisseurs
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez vos fournisseurs et leurs informations
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleExport}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exporter
                        </Button>
                        <Link href="/fournisseurs/create">
                            <Button
                                size="sm"
                                className="bg-yellow-500 hover:bg-yellow-600 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nouveau Fournisseur
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
                                            placeholder="Rechercher par nom, ICE/CIN, adresse..."
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
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Nom
                                        </label>
                                        <Input
                                            placeholder="Filtrer par nom"
                                            value={advancedFilters.nom}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "nom",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            ICE/CIN
                                        </label>
                                        <Input
                                            placeholder="Filtrer par ICE/CIN"
                                            value={advancedFilters.ice_ou_cin}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "ice_ou_cin",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">
                                            Adresse
                                        </label>
                                        <Input
                                            placeholder="Filtrer par adresse"
                                            value={advancedFilters.adresse}
                                            onChange={(e) =>
                                                handleFilter(
                                                    "adresse",
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
                {selectedIds.length > 0 && (
                    <Card className="bg-yellow-50 border-yellow-200">
                        <CardContent className="py-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-yellow-800">
                                    {selectedIds.length} élément(s)
                                    sélectionné(s)
                                </span>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleBulkDelete}
                                >
                                    <Trash2 className="h-4 w-4 mr-2" />
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
                                Liste des Fournisseurs ({fournisseurs.total}{" "}
                                fournisseurs)
                            </CardTitle>
                            {selectedIds.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedIds.length} sélectionnés
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-gray-50">
                                        <TableHead className="w-12">
                                            <Checkbox
                                                checked={
                                                    selectedIds.length ===
                                                    fournisseurs.data.length
                                                }
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
                                            />
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() => handleSort("nom")}
                                        >
                                            <div className="flex items-center gap-1">
                                                Nom
                                                {getSortIcon("nom")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer hover:bg-gray-100"
                                            onClick={() =>
                                                handleSort("ice_ou_cin")
                                            }
                                        >
                                            <div className="flex items-center gap-1">
                                                ICE/CIN
                                                {getSortIcon("ice_ou_cin")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Adresse</TableHead>
                                        <TableHead className="text-center">
                                            Stocks
                                        </TableHead>
                                        <TableHead className="text-center">
                                            Commandes
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {fournisseurs.data.map((fournisseur) => (
                                        <TableRow
                                            key={fournisseur.id}
                                            className="hover:bg-gray-50"
                                        >
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedIds.includes(
                                                        fournisseur.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelectOne(
                                                            fournisseur.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {fournisseur.nom}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">
                                                    {fournisseur.ice_ou_cin}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {fournisseur.adresse || "—"}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <Package className="h-4 w-4 text-blue-500" />
                                                    <span className="font-medium">
                                                        {
                                                            fournisseur.stocks_count
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <ShoppingCart className="h-4 w-4 text-green-500" />
                                                    <span className="font-medium">
                                                        {
                                                            fournisseur.commandes_fournisseurs_count
                                                        }
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/fournisseurs/${fournisseur.id}`}
                                                            >
                                                                <Eye className="h-4 w-4 mr-2" />
                                                                Voir
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={`/fournisseurs/${fournisseur.id}/edit`}
                                                            >
                                                                <Edit className="h-4 w-4 mr-2" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    fournisseur
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-2" />
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {fournisseurs.data.length === 0 && (
                                        <TableRow>
                                            <TableCell
                                                colSpan="7"
                                                className="text-center py-8 text-gray-500"
                                            >
                                                Aucun fournisseur trouvé
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                        {/* Pagination */}
                        {fournisseurs.links &&
                            fournisseurs.links.length > 3 && (
                                <div className="flex items-center justify-between mt-4">
                                    <div className="text-sm text-gray-700">
                                        Affichage de {fournisseurs.from} à{" "}
                                        {fournisseurs.to} sur{" "}
                                        {fournisseurs.total} résultats
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {fournisseurs.links.map(
                                            (link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={
                                                        link.active
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    disabled={!link.url}
                                                    onClick={() =>
                                                        link.url &&
                                                        router.get(link.url)
                                                    }
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            )
                                        )}
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
                    !open && setDeleteDialog({ open: false, fournisseur: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le fournisseur{" "}
                            <strong>{deleteDialog.fournisseur?.nom}</strong> ?
                            Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({
                                    open: false,
                                    fournisseur: null,
                                })
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
                            {selectedIds.length} fournisseur(s) sélectionné(s) ?
                            Cette action est irréversible.
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
}
