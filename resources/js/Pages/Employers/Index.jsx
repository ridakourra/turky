import React, { useState } from "react";
import { Head, Link, router, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Users,
    Plus,
    Search,
    Filter,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Download,
    Eye,
    Edit,
    Trash2,
    UserCheck,
    UserX,
    Truck,
    Construction,
    Calendar,
    Phone,
    MapPin,
    Briefcase,
    CreditCard,
    MoreHorizontal,
} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
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

const EmployersIndex = () => {
    const { employers, stats, filters, sort } = usePage().props;
    const [selectedEmployers, setSelectedEmployers] = useState([]);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        employer: null,
    });

    const handleSearch = (e) => {
        const value = e.target.value;
        router.get(
            route("employers.index"),
            { ...filters, search: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleFilter = (key, value) => {
        router.get(
            route("employers.index"),
            { ...filters, [key]: value, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleSort = (field) => {
        const direction =
            sort.sort === field && sort.direction === "asc" ? "desc" : "asc";
        router.get(
            route("employers.index"),
            { ...filters, sort: field, direction, page: 1 },
            { preserveState: true, replace: true }
        );
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            setSelectedEmployers(employers.data.map((emp) => emp.id));
        } else {
            setSelectedEmployers([]);
        }
    };

    const handleSelectEmployer = (employerId, checked) => {
        if (checked) {
            setSelectedEmployers([...selectedEmployers, employerId]);
        } else {
            setSelectedEmployers(
                selectedEmployers.filter((id) => id !== employerId)
            );
        }
    };

    const handleDelete = (employer) => {
        setDeleteDialog({ open: true, employer });
    };

    const confirmDelete = () => {
        if (deleteDialog.employer) {
            router.delete(
                route("employers.destroy", deleteDialog.employer.id),
                {
                    onSuccess: () => {
                        setDeleteDialog({ open: false, employer: null });
                    },
                }
            );
        }
    };

    const handleExport = () => {
        router.get(route("employers.export"), filters);
    };

    const clearFilters = () => {
        router.get(route("employers.index"));
    };

    const getSortIcon = (field) => {
        if (sort.sort !== field)
            return <ArrowUpDown className="ml-2 h-4 w-4" />;
        return sort.direction === "asc" ? (
            <ArrowUp className="ml-2 h-4 w-4" />
        ) : (
            <ArrowDown className="ml-2 h-4 w-4" />
        );
    };

    const formatSalaryType = (salaires) => {
        if (!salaires || salaires.length === 0) return "Non défini";
        const types = [...new Set(salaires.map((s) => s.type))];
        return types.join(", ");
    };

    return (
        <AdminLayout title="Gestion des Employés">
            <Head title="Employés" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Gestion des Employés
                        </h1>
                        <p className="text-sm text-gray-600">
                            Gérez tous vos employés, leurs informations et leurs
                            salaires
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            onClick={handleExport}
                            className="flex items-center gap-2"
                        >
                            <Download className="h-4 w-4" />
                            Exporter
                        </Button>
                        <Link href={route("employers.create")}>
                            <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                <Plus className="h-4 w-4" />
                                Ajouter Employé
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Employés
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-yellow-600">
                                {stats.total}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Actifs
                            </CardTitle>
                            <UserCheck className="h-4 w-4 text-green-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.actifs}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Inactifs
                            </CardTitle>
                            <UserX className="h-4 w-4 text-red-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.inactifs}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avec Véhicules
                            </CardTitle>
                            <Truck className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.with_vehicules}
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Avec Engins
                            </CardTitle>
                            <Construction className="h-4 w-4 text-purple-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {stats.with_engins}
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
                        <Tabs defaultValue="basic" className="w-full">
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
                                            placeholder="Rechercher employés..."
                                            value={filters.search || ""}
                                            onChange={handleSearch}
                                            className="pl-10"
                                        />
                                    </div>
                                    <Select
                                        value={filters.actif || "all"}
                                        onValueChange={(value) =>
                                            handleFilter(
                                                "actif",
                                                value === "all" ? "" : value
                                            )
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">
                                                Tous les statuts
                                            </SelectItem>
                                            <SelectItem value="true">
                                                Actifs
                                            </SelectItem>
                                            <SelectItem value="false">
                                                Inactifs
                                            </SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Input
                                        placeholder="Fonction"
                                        value={filters.fonction || ""}
                                        onChange={(e) =>
                                            handleFilter(
                                                "fonction",
                                                e.target.value
                                            )
                                        }
                                    />
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
                                        <label className="text-sm font-medium mb-2 block">
                                            Date d'embauche (De)
                                        </label>
                                        <Input
                                            type="date"
                                            value={
                                                filters.date_embauche_from || ""
                                            }
                                            onChange={(e) =>
                                                handleFilter(
                                                    "date_embauche_from",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Date d'embauche (À)
                                        </label>
                                        <Input
                                            type="date"
                                            value={
                                                filters.date_embauche_to || ""
                                            }
                                            onChange={(e) =>
                                                handleFilter(
                                                    "date_embauche_to",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Véhicule assigné
                                        </label>
                                        <Select
                                            value={
                                                filters.has_vehicule || "all"
                                            }
                                            onValueChange={(value) =>
                                                handleFilter(
                                                    "has_vehicule",
                                                    value === "all" ? "" : value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tous
                                                </SelectItem>
                                                <SelectItem value="true">
                                                    Avec véhicule
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    Sans véhicule
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium mb-2 block">
                                            Engin assigné
                                        </label>
                                        <Select
                                            value={filters.has_engin || "all"}
                                            onValueChange={(value) =>
                                                handleFilter(
                                                    "has_engin",
                                                    value === "all" ? "" : value
                                                )
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Tous" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">
                                                    Tous
                                                </SelectItem>
                                                <SelectItem value="true">
                                                    Avec engin
                                                </SelectItem>
                                                <SelectItem value="false">
                                                    Sans engin
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
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
                                Liste des Employés ({employers.total} employés)
                            </CardTitle>
                            {selectedEmployers.length > 0 && (
                                <Badge variant="secondary">
                                    {selectedEmployers.length} sélectionnés
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
                                                    selectedEmployers.length ===
                                                    employers.data.length
                                                }
                                                onCheckedChange={
                                                    handleSelectAll
                                                }
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
                                        <TableHead>Contact</TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() =>
                                                handleSort("fonction")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Fonction
                                                {getSortIcon("fonction")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Type Salaire</TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() =>
                                                handleSort("date_embauche")
                                            }
                                        >
                                            <div className="flex items-center">
                                                Date Embauche
                                                {getSortIcon("date_embauche")}
                                            </div>
                                        </TableHead>
                                        <TableHead
                                            className="cursor-pointer select-none"
                                            onClick={() => handleSort("actif")}
                                        >
                                            <div className="flex items-center">
                                                Statut
                                                {getSortIcon("actif")}
                                            </div>
                                        </TableHead>
                                        <TableHead>Véhicules/Engins</TableHead>
                                        <TableHead className="w-24">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {employers.data.map((employer) => (
                                        <TableRow key={employer.id}>
                                            <TableCell>
                                                <Checkbox
                                                    checked={selectedEmployers.includes(
                                                        employer.id
                                                    )}
                                                    onCheckedChange={(
                                                        checked
                                                    ) =>
                                                        handleSelectEmployer(
                                                            employer.id,
                                                            checked
                                                        )
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                <div>
                                                    <div className="font-semibold">
                                                        {employer.nom}
                                                    </div>
                                                    {employer.details && (
                                                        <div className="text-sm text-gray-500 truncate max-w-32">
                                                            {employer.details}
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                                    {employer.cin}
                                                </code>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {employer.telephone && (
                                                        <div className="flex items-center gap-1 text-sm">
                                                            <Phone className="h-3 w-3" />
                                                            {employer.telephone}
                                                        </div>
                                                    )}
                                                    {employer.adresse && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <MapPin className="h-3 w-3" />
                                                            <span className="truncate max-w-24">
                                                                {
                                                                    employer.adresse
                                                                }
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {employer.fonction ? (
                                                    <div className="flex items-center gap-1">
                                                        <Briefcase className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            {employer.fonction}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">
                                                        Non défini
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <CreditCard className="h-4 w-4 text-gray-400" />
                                                    <span className="text-sm">
                                                        {formatSalaryType(
                                                            employer.salaires
                                                        )}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {employer.date_embauche ? (
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm">
                                                            {new Date(
                                                                employer.date_embauche
                                                            ).toLocaleDateString(
                                                                "fr-FR"
                                                            )}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">
                                                        Non défini
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        employer.actif
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                >
                                                    {employer.actif
                                                        ? "Actif"
                                                        : "Inactif"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {employer.vehicules.length >
                                                        0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Truck className="h-3 w-3 mr-1" />
                                                            {
                                                                employer
                                                                    .vehicules
                                                                    .length
                                                            }
                                                        </Badge>
                                                    )}
                                                    {employer.engins_lourds
                                                        .length > 0 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            <Construction className="h-3 w-3 mr-1" />
                                                            {
                                                                employer
                                                                    .engins_lourds
                                                                    .length
                                                            }
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger
                                                        asChild
                                                    >
                                                        <Button
                                                            variant="ghost"
                                                            className="h-8 w-8 p-0"
                                                        >
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>
                                                            Actions
                                                        </DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "employers.show",
                                                                    employer.id
                                                                )}
                                                                className="flex items-center"
                                                            >
                                                                <Eye className="mr-2 h-4 w-4" />
                                                                Voir détails
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            asChild
                                                        >
                                                            <Link
                                                                href={route(
                                                                    "employers.edit",
                                                                    employer.id
                                                                )}
                                                                className="flex items-center"
                                                            >
                                                                <Edit className="mr-2 h-4 w-4" />
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600 focus:text-red-600"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    employer
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="mr-2 h-4 w-4" />
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
                        {employers.links && employers.links.length > 3 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-gray-700">
                                    Affichage de {employers.from} à{" "}
                                    {employers.to} sur {employers.total}{" "}
                                    résultats
                                </div>
                                <div className="flex items-center gap-2">
                                    {employers.links.map((link, index) => (
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
                                                link.url && router.get(link.url)
                                            }
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
                    !open && setDeleteDialog({ open: false, employer: null })
                }
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Confirmer la suppression</DialogTitle>
                        <DialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'employé{" "}
                            <strong>{deleteDialog.employer?.nom}</strong> ?
                            Cette action est irréversible et supprimera toutes
                            les données associées.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() =>
                                setDeleteDialog({ open: false, employer: null })
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
};

export default EmployersIndex;
