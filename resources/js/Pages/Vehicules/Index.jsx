import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    Plus,
    Search,
    Filter,
    Download,
    Trash2,
    Edit,
    Eye,
    MoreHorizontal,
    ChevronUp,
    ChevronDown,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Truck,
    Settings,
    AlertCircle,
} from "lucide-react";

const VehiculesIndex = ({ vehicules, filters, sort, filterOptions }) => {
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [selectedVehicules, setSelectedVehicules] = useState([]);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [vehiculeToDelete, setVehiculeToDelete] = useState(null);
    const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
    const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
    const [localFilters, setLocalFilters] = useState({
        statut: filters.statut || "",
        type: filters.type || "",
        marque: filters.marque || "",
        employer_id: filters.employer_id || "",
        annee_min: filters.annee_min || "",
        annee_max: filters.annee_max || "",
        kilometrage_max: filters.kilometrage_max || "",
        date_assurance_from: filters.date_assurance_from || "",
        date_assurance_to: filters.date_assurance_to || "",
    });

    const getStatusBadge = (statut) => {
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
                label: "Maintenance",
                className: "bg-yellow-100 text-yellow-800",
            },
            out_of_service: {
                label: "Hors service",
                className: "bg-red-100 text-red-800",
            },
        };

        const config = statusConfig[statut] || {
            label: statut,
            className: "bg-gray-100 text-gray-800",
        };
        return <Badge className={config.className}>{config.label}</Badge>;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        applyFilters({ ...localFilters, search: searchTerm });
    };

    const applyFilters = (newFilters) => {
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value !== "")
        );

        router.get(route("vehicules.index"), cleanFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleSort = (field) => {
        const direction =
            sort.field === field && sort.direction === "asc" ? "desc" : "asc";
        router.get(
            route("vehicules.index"),
            { ...filters, sort: field, direction },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const getSortIcon = (field) => {
        if (sort.field !== field) return <ArrowUpDown className="h-4 w-4" />;
        return sort.direction === "asc" ? (
            <ArrowUp className="h-4 w-4" />
        ) : (
            <ArrowDown className="h-4 w-4" />
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedVehicules(vehicules.data.map((v) => v.id));
        } else {
            setSelectedVehicules([]);
        }
    };

    const handleSelectVehicule = (vehiculeId, checked) => {
        if (checked) {
            setSelectedVehicules((prev) => [...prev, vehiculeId]);
        } else {
            setSelectedVehicules((prev) =>
                prev.filter((id) => id !== vehiculeId)
            );
        }
    };

    const handleDelete = (vehicule) => {
        setVehiculeToDelete(vehicule);
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        if (vehiculeToDelete) {
            router.delete(route("vehicules.destroy", vehiculeToDelete.id), {
                onSuccess: () => {
                    setDeleteDialogOpen(false);
                    setVehiculeToDelete(null);
                },
            });
        }
    };

    const handleBulkDelete = () => {
        setBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = () => {
        router.post(
            route("vehicules.bulk-delete"),
            {
                ids: selectedVehicules,
            },
            {
                onSuccess: () => {
                    setBulkDeleteDialogOpen(false);
                    setSelectedVehicules([]);
                },
            }
        );
    };

    const handleExport = () => {
        window.location.href = route("vehicules.export", filters);
    };

    const clearFilters = () => {
        setSearchTerm("");
        setLocalFilters({
            statut: "",
            type: "",
            marque: "",
            employer_id: "",
            annee_min: "",
            annee_max: "",
            kilometrage_max: "",
            date_assurance_from: "",
            date_assurance_to: "",
        });
        router.get(route("vehicules.index"));
    };

    return (
        <AdminLayout title="Gestion des Véhicules">
            <Head title="Véhicules" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="h-6 w-6 text-yellow-600" />
                            Gestion des Véhicules
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez votre flotte de véhicules et suivez leur
                            statut
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {selectedVehicules.length > 0 && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={handleBulkDelete}
                                className="flex items-center gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                Supprimer ({selectedVehicules.length})
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exporter
                        </Button>

                        <Link href={route("vehicules.create")}>
                            <Button
                                size="sm"
                                className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Nouveau Véhicule
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">
                                Filtres et Recherche
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={clearFilters}
                                    className="text-gray-500"
                                >
                                    Effacer
                                </Button>
                                <Collapsible
                                    open={advancedFiltersOpen}
                                    onOpenChange={setAdvancedFiltersOpen}
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                            <Filter className="h-4 w-4 mr-2" />
                                            Filtres avancés
                                            {advancedFiltersOpen ? (
                                                <ChevronUp className="h-4 w-4 ml-2" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4 ml-2" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                </Collapsible>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {/* Basic Search */}
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <div className="flex-1">
                                <Input
                                    placeholder="Rechercher par nom, matricule, marque, modèle..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full"
                                />
                            </div>
                            <Button type="submit" size="sm">
                                <Search className="h-4 w-4 mr-2" />
                                Rechercher
                            </Button>
                        </form>

                        {/* Advanced Filters */}
                        <Collapsible
                            open={advancedFiltersOpen}
                            onOpenChange={setAdvancedFiltersOpen}
                        >
                            <CollapsibleContent className="space-y-4 pt-4 border-t">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label>Statut</Label>
                                        <Select
                                            value={localFilters.statut}
                                            onValueChange={(value) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    statut: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les statuts" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.statuts.map(
                                                    (statut) => (
                                                        <SelectItem
                                                            key={statut}
                                                            value={statut}
                                                        >
                                                            {statut ===
                                                                "available" &&
                                                                "Disponible"}
                                                            {statut ===
                                                                "in_use" &&
                                                                "En utilisation"}
                                                            {statut ===
                                                                "maintenance" &&
                                                                "Maintenance"}
                                                            {statut ===
                                                                "out_of_service" &&
                                                                "Hors service"}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Type</Label>
                                        <Select
                                            value={localFilters.type}
                                            onValueChange={(value) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    type: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les types" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.types.map(
                                                    (type) => (
                                                        <SelectItem
                                                            key={type}
                                                            value={type}
                                                        >
                                                            {type}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Marque</Label>
                                        <Select
                                            value={localFilters.marque}
                                            onValueChange={(value) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    marque: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Toutes les marques" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.marques.map(
                                                    (marque) => (
                                                        <SelectItem
                                                            key={marque}
                                                            value={marque}
                                                        >
                                                            {marque}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Employé Assigné</Label>
                                        <Select
                                            value={localFilters.employer_id}
                                            onValueChange={(value) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    employer_id: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous les employés" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {filterOptions.employers.map(
                                                    (employer) => (
                                                        <SelectItem
                                                            key={employer.id}
                                                            value={employer.id.toString()}
                                                        >
                                                            {employer.nom}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Année Min</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 2010"
                                            value={localFilters.annee_min}
                                            onChange={(e) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    annee_min: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Année Max</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 2024"
                                            value={localFilters.annee_max}
                                            onChange={(e) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    annee_max: e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Kilométrage Max</Label>
                                        <Input
                                            type="number"
                                            placeholder="Ex: 200000"
                                            value={localFilters.kilometrage_max}
                                            onChange={(e) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    kilometrage_max:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Assurance Du</Label>
                                        <Input
                                            type="date"
                                            value={
                                                localFilters.date_assurance_from
                                            }
                                            onChange={(e) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    date_assurance_from:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Assurance Au</Label>
                                        <Input
                                            type="date"
                                            value={
                                                localFilters.date_assurance_to
                                            }
                                            onChange={(e) =>
                                                setLocalFilters((prev) => ({
                                                    ...prev,
                                                    date_assurance_to:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4">
                                    <Button
                                        onClick={() =>
                                            applyFilters({
                                                ...localFilters,
                                                search: searchTerm,
                                            })
                                        }
                                        className="bg-yellow-600 hover:bg-yellow-700"
                                    >
                                        Appliquer les filtres
                                    </Button>
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                    </CardContent>
                </Card>

                {/* Results */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Véhicules ({vehicules.total} résultat
                                {vehicules.total > 1 ? "s" : ""})
                            </CardTitle>

                            {vehicules.total > 0 && (
                                <div className="text-sm text-gray-500">
                                    Affichage de {vehicules.from} à{" "}
                                    {vehicules.to} sur {vehicules.total}{" "}
                                    véhicules
                                </div>
                            )}
                        </div>
                    </CardHeader>

                    <CardContent>
                        {vehicules.data.length > 0 ? (
                            <>
                                <div className="rounded-md border overflow-hidden">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead className="w-12">
                                                    <Checkbox
                                                        checked={
                                                            selectedVehicules.length ===
                                                            vehicules.data
                                                                .length
                                                        }
                                                        onCheckedChange={
                                                            handleSelectAll
                                                        }
                                                    />
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort("nom")
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Nom
                                                        {getSortIcon("nom")}
                                                    </div>
                                                </TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort("matricule")
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Matricule
                                                        {getSortIcon(
                                                            "matricule"
                                                        )}
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    Marque/Modèle
                                                </TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead
                                                    className="cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                        handleSort("statut")
                                                    }
                                                >
                                                    <div className="flex items-center gap-2">
                                                        Statut
                                                        {getSortIcon("statut")}
                                                    </div>
                                                </TableHead>
                                                <TableHead>
                                                    Employé Assigné
                                                </TableHead>
                                                <TableHead>Année</TableHead>
                                                <TableHead>
                                                    Kilométrage
                                                </TableHead>
                                                <TableHead className="w-24">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {vehicules.data.map((vehicule) => (
                                                <TableRow key={vehicule.id}>
                                                    <TableCell>
                                                        <Checkbox
                                                            checked={selectedVehicules.includes(
                                                                vehicule.id
                                                            )}
                                                            onCheckedChange={(
                                                                checked
                                                            ) =>
                                                                handleSelectVehicule(
                                                                    vehicule.id,
                                                                    checked
                                                                )
                                                            }
                                                        />
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {vehicule.nom}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-sm">
                                                        {vehicule.matricule}
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicule.marque &&
                                                        vehicule.modele
                                                            ? `${vehicule.marque} ${vehicule.modele}`
                                                            : vehicule.marque ||
                                                              vehicule.modele ||
                                                              "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicule.type || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getStatusBadge(
                                                            vehicule.statut
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicule.employer ? (
                                                            <span className="text-blue-600">
                                                                {
                                                                    vehicule
                                                                        .employer
                                                                        .nom
                                                                }
                                                            </span>
                                                        ) : (
                                                            <span className="text-gray-400">
                                                                Non assigné
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicule.annee || "-"}
                                                    </TableCell>
                                                    <TableCell>
                                                        {vehicule.kilometrage
                                                            ? `${vehicule.kilometrage.toLocaleString()} km`
                                                            : "-"}
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
                                                                    <MoreHorizontal className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "vehicules.show",
                                                                            vehicule.id
                                                                        )}
                                                                    >
                                                                        <Eye className="h-4 w-4 mr-2" />
                                                                        Voir
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    asChild
                                                                >
                                                                    <Link
                                                                        href={route(
                                                                            "vehicules.edit",
                                                                            vehicule.id
                                                                        )}
                                                                    >
                                                                        <Edit className="h-4 w-4 mr-2" />
                                                                        Modifier
                                                                    </Link>
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() =>
                                                                        handleDelete(
                                                                            vehicule
                                                                        )
                                                                    }
                                                                    className="text-red-600"
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
                                {vehicules.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="text-sm text-gray-500">
                                            Page {vehicules.current_page} sur{" "}
                                            {vehicules.last_page}
                                        </div>
                                        <div className="flex gap-2">
                                            {vehicules.links.map(
                                                (link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={
                                                            link.active
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(
                                                                    link.url
                                                                );
                                                            }
                                                        }}
                                                        disabled={!link.url}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    Aucun véhicule trouvé
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    {Object.values(filters).some((v) => v)
                                        ? "Aucun véhicule ne correspond à vos critères de recherche."
                                        : "Commencez par ajouter votre premier véhicule."}
                                </p>
                                <Link href={route("vehicules.create")}>
                                    <Button className="bg-yellow-600 hover:bg-yellow-700">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Ajouter un véhicule
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            Confirmer la suppression
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer le véhicule "
                            <span className="font-medium">
                                {vehiculeToDelete?.nom}
                            </span>
                            " ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Supprimer
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Bulk Delete Confirmation Dialog */}
            <Dialog
                open={bulkDeleteDialogOpen}
                onOpenChange={setBulkDeleteDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5 text-red-600" />
                            Confirmer la suppression en lot
                        </DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer{" "}
                            {selectedVehicules.length} véhicule(s)
                            sélectionné(s) ? Cette action est irréversible.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setBulkDeleteDialogOpen(false)}
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

export default VehiculesIndex;
