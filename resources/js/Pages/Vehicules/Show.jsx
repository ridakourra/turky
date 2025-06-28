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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    ArrowLeft,
    Edit,
    Truck,
    AlertCircle,
    Info,
    Calendar,
    Gauge,
    Settings,
    FileText,
    Eye,
    Filter,
    ChevronDown,
    ChevronUp,
    User,
    Package,
    DollarSign,
    TrendingUp,
    MapPin,
    Clock,
    Wrench,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Search,
} from "lucide-react";

const VehiculesShow = ({
    vehicule,
    commandes,
    livraisons,
    rapports,
    stats,
    filters,
}) => {
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [filtersOpen, setFiltersOpen] = useState({
        commandes: false,
        livraisons: false,
        rapports: false,
    });

    const [localFilters, setLocalFilters] = useState({
        commandes_date_from: filters.commandes_date_from || "",
        commandes_date_to: filters.commandes_date_to || "",
        livraisons_status: filters.livraisons_status || "",
        livraisons_date_from: filters.livraisons_date_from || "",
        livraisons_date_to: filters.livraisons_date_to || "",
        rapports_type: filters.rapports_type || "",
        rapports_date_from: filters.rapports_date_from || "",
        rapports_date_to: filters.rapports_date_to || "",
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

    const getLivraisonStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                label: "En attente",
                className: "bg-yellow-100 text-yellow-800",
                icon: Clock,
            },
            in_progress: {
                label: "En cours",
                className: "bg-blue-100 text-blue-800",
                icon: Truck,
            },
            delivered: {
                label: "Livrée",
                className: "bg-green-100 text-green-800",
                icon: CheckCircle,
            },
            cancelled: {
                label: "Annulée",
                className: "bg-red-100 text-red-800",
                icon: XCircle,
            },
        };

        const config = statusConfig[status] || {
            label: status,
            className: "bg-gray-100 text-gray-800",
            icon: AlertCircle,
        };
        const Icon = config.icon;
        return (
            <Badge className={`${config.className} flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    // Check if insurance is expiring soon or expired
    const isInsuranceExpiringSoon = () => {
        if (!vehicule.date_assurance) return false;
        const expiryDate = new Date(vehicule.date_assurance);
        const today = new Date();
        const thirtyDaysFromNow = new Date(
            today.getTime() + 30 * 24 * 60 * 60 * 1000
        );
        return expiryDate <= thirtyDaysFromNow && expiryDate >= today;
    };

    const isInsuranceExpired = () => {
        if (!vehicule.date_assurance) return false;
        const expiryDate = new Date(vehicule.date_assurance);
        const today = new Date();
        return expiryDate < today;
    };

    const applyFilters = (newFilters) => {
        const cleanFilters = Object.fromEntries(
            Object.entries(newFilters).filter(([_, value]) => value !== "")
        );

        router.get(route("vehicules.show", vehicule.id), cleanFilters, {
            preserveState: true,
            replace: true,
        });
    };

    const handleDelete = () => {
        router.delete(route("vehicules.destroy", vehicule.id), {
            onSuccess: () => {
                router.visit(route("vehicules.index"));
            },
        });
    };

    return (
        <AdminLayout title={`${vehicule.nom} - Détails`}>
            <Head title={`${vehicule.nom} - Détails`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route("vehicules.index")}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour à la liste
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="h-6 w-6 text-yellow-600" />
                            {vehicule.nom}
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            Matricule: {vehicule.matricule}
                            {getStatusBadge(vehicule.statut)}
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href={route("vehicules.edit", vehicule.id)}>
                            <Button
                                size="sm"
                                className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
                            >
                                <Edit className="h-4 w-4" />
                                Modifier
                            </Button>
                        </Link>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setDeleteDialogOpen(true)}
                            className="flex items-center gap-2"
                        >
                            <AlertTriangle className="h-4 w-4" />
                            Supprimer
                        </Button>
                    </div>
                </div>

                {/* Alerts */}
                <div className="space-y-2">
                    {isInsuranceExpired() && (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                ⚠️ L'assurance de ce véhicule a expiré le{" "}
                                {new Date(
                                    vehicule.date_assurance
                                ).toLocaleDateString("fr-FR")}
                                . Veuillez la renouveler immédiatement.
                            </AlertDescription>
                        </Alert>
                    )}

                    {isInsuranceExpiringSoon() && !isInsuranceExpired() && (
                        <Alert>
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                🔔 L'assurance de ce véhicule expire bientôt le{" "}
                                {new Date(
                                    vehicule.date_assurance
                                ).toLocaleDateString("fr-FR")}
                                . Pensez à la renouveler.
                            </AlertDescription>
                        </Alert>
                    )}
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Commandes Fournisseurs
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total_commandes}
                                    </p>
                                </div>
                                <Package className="h-8 w-8 text-blue-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Livraisons
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total_livraisons}
                                    </p>
                                </div>
                                <Truck className="h-8 w-8 text-green-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Dépenses Totales
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.total_depenses?.toLocaleString() ||
                                            "0"}{" "}
                                        DH
                                    </p>
                                </div>
                                <DollarSign className="h-8 w-8 text-red-600" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Livraisons en Cours
                                    </p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {stats.livraisons_en_cours}
                                    </p>
                                </div>
                                <Clock className="h-8 w-8 text-yellow-600" />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Vehicle Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* General Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informations Générales
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Nom
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.nom}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Matricule
                                    </Label>
                                    <p className="text-sm text-gray-900 font-mono">
                                        {vehicule.matricule}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Marque
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.marque || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Modèle
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.modele || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Type
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.type || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Capacité
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.capacite || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Statut
                                    </Label>
                                    <div className="pt-1">
                                        {getStatusBadge(vehicule.statut)}
                                    </div>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Employé Assigné
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.employer ? (
                                            <Link
                                                href={route(
                                                    "employers.show",
                                                    vehicule.employer.id
                                                )}
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                            >
                                                <User className="h-3 w-3" />
                                                {vehicule.employer.nom}
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400">
                                                Non assigné
                                            </span>
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Technical Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Caractéristiques Techniques
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Année
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.annee || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Kilométrage
                                    </Label>
                                    <p className="text-sm text-gray-900 flex items-center gap-1">
                                        <Gauge className="h-3 w-3" />
                                        {vehicule.kilometrage
                                            ? `${vehicule.kilometrage.toLocaleString()} km`
                                            : "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Type de carburant
                                    </Label>
                                    <p className="text-sm text-gray-900">
                                        {vehicule.carburant_type || "-"}
                                    </p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-600">
                                        Numéro de châssis
                                    </Label>
                                    <p className="text-sm text-gray-900 font-mono">
                                        {vehicule.numero_chassis || "-"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-medium text-gray-600">
                                        Numéro de moteur
                                    </Label>
                                    <p className="text-sm text-gray-900 font-mono">
                                        {vehicule.numero_moteur || "-"}
                                    </p>
                                </div>
                                <div className="col-span-2">
                                    <Label className="text-sm font-medium text-gray-600">
                                        Date d'expiration assurance
                                    </Label>
                                    <p
                                        className={`text-sm flex items-center gap-1 ${
                                            isInsuranceExpired()
                                                ? "text-red-600"
                                                : isInsuranceExpiringSoon()
                                                ? "text-amber-600"
                                                : "text-gray-900"
                                        }`}
                                    >
                                        <Calendar className="h-3 w-3" />
                                        {vehicule.date_assurance ? (
                                            <>
                                                {new Date(
                                                    vehicule.date_assurance
                                                ).toLocaleDateString("fr-FR")}
                                                {isInsuranceExpired() && (
                                                    <Badge
                                                        variant="destructive"
                                                        className="ml-2"
                                                    >
                                                        Expirée
                                                    </Badge>
                                                )}
                                                {isInsuranceExpiringSoon() &&
                                                    !isInsuranceExpired() && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2 border-amber-300 text-amber-700"
                                                        >
                                                            Expire bientôt
                                                        </Badge>
                                                    )}
                                            </>
                                        ) : (
                                            "-"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Related Data Tabs */}
                <Card>
                    <CardHeader>
                        <CardTitle>Données Associées</CardTitle>
                        <CardDescription>
                            Historique des commandes, livraisons et dépenses
                            liées à ce véhicule
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="commandes" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger
                                    value="commandes"
                                    className="flex items-center gap-2"
                                >
                                    <Package className="h-4 w-4" />
                                    Commandes Fournisseurs ({commandes.total})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="livraisons"
                                    className="flex items-center gap-2"
                                >
                                    <Truck className="h-4 w-4" />
                                    Livraisons ({livraisons.total})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="rapports"
                                    className="flex items-center gap-2"
                                >
                                    <Wrench className="h-4 w-4" />
                                    Dépenses ({rapports.total})
                                </TabsTrigger>
                            </TabsList>

                            {/* Commandes Fournisseurs Tab */}
                            <TabsContent
                                value="commandes"
                                className="space-y-4"
                            >
                                {/* Filters for Commandes */}
                                <Collapsible
                                    open={filtersOpen.commandes}
                                    onOpenChange={(open) =>
                                        setFiltersOpen((prev) => ({
                                            ...prev,
                                            commandes: open,
                                        }))
                                    }
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Filter className="h-4 w-4" />
                                            Filtres
                                            {filtersOpen.commandes ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            <div>
                                                <Label>Date de</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.commandes_date_from
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                commandes_date_from:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Date à</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.commandes_date_to
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                commandes_date_to:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                applyFilters(localFilters)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            Appliquer
                                        </Button>
                                    </CollapsibleContent>
                                </Collapsible>

                                {commandes.data.length > 0 ? (
                                    <>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Fournisseur
                                                        </TableHead>
                                                        <TableHead>
                                                            Employé
                                                        </TableHead>
                                                        <TableHead>
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {commandes.data.map(
                                                        (commande) => (
                                                            <TableRow
                                                                key={
                                                                    commande.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {commande.date
                                                                        ? new Date(
                                                                              commande.date
                                                                          ).toLocaleDateString(
                                                                              "fr-FR"
                                                                          )
                                                                        : "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {commande.fournisseur ? (
                                                                        <Link
                                                                            href={route(
                                                                                "fournisseurs.show",
                                                                                commande
                                                                                    .fournisseur
                                                                                    .id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            {
                                                                                commande
                                                                                    .fournisseur
                                                                                    .nom
                                                                            }
                                                                        </Link>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {commande.employer ? (
                                                                        <Link
                                                                            href={route(
                                                                                "employers.show",
                                                                                commande
                                                                                    .employer
                                                                                    .id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            {
                                                                                commande
                                                                                    .employer
                                                                                    .nom
                                                                            }
                                                                        </Link>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link
                                                                        href={route(
                                                                            "commandes-fournisseurs.show",
                                                                            commande.id
                                                                        )}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {commandes.last_page > 1 && (
                                            <div className="flex justify-center">
                                                <div className="flex gap-2">
                                                    {commandes.links.map(
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
                                                                    if (
                                                                        link.url
                                                                    ) {
                                                                        router.get(
                                                                            link.url
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={
                                                                    !link.url
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
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            Aucune commande fournisseur trouvée
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Livraisons Tab */}
                            <TabsContent
                                value="livraisons"
                                className="space-y-4"
                            >
                                {/* Filters for Livraisons */}
                                <Collapsible
                                    open={filtersOpen.livraisons}
                                    onOpenChange={(open) =>
                                        setFiltersOpen((prev) => ({
                                            ...prev,
                                            livraisons: open,
                                        }))
                                    }
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Filter className="h-4 w-4" />
                                            Filtres
                                            {filtersOpen.livraisons ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div>
                                                <Label>Statut</Label>
                                                <Select
                                                    value={
                                                        localFilters.livraisons_status
                                                    }
                                                    onValueChange={(value) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                livraisons_status:
                                                                    value,
                                                            })
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Tous les statuts" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="">
                                                            Tous les statuts
                                                        </SelectItem>
                                                        <SelectItem value="pending">
                                                            En attente
                                                        </SelectItem>
                                                        <SelectItem value="in_progress">
                                                            En cours
                                                        </SelectItem>
                                                        <SelectItem value="delivered">
                                                            Livrée
                                                        </SelectItem>
                                                        <SelectItem value="cancelled">
                                                            Annulée
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Date de</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.livraisons_date_from
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                livraisons_date_from:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Date à</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.livraisons_date_to
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                livraisons_date_to:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                applyFilters(localFilters)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            Appliquer
                                        </Button>
                                    </CollapsibleContent>
                                </Collapsible>

                                {livraisons.data.length > 0 ? (
                                    <>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Client
                                                        </TableHead>
                                                        <TableHead>
                                                            Adresse
                                                        </TableHead>
                                                        <TableHead>
                                                            Statut
                                                        </TableHead>
                                                        <TableHead>
                                                            Employé
                                                        </TableHead>
                                                        <TableHead>
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {livraisons.data.map(
                                                        (livraison) => (
                                                            <TableRow
                                                                key={
                                                                    livraison.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {livraison.date
                                                                        ? new Date(
                                                                              livraison.date
                                                                          ).toLocaleDateString(
                                                                              "fr-FR"
                                                                          )
                                                                        : "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {livraison
                                                                        .commande
                                                                        ?.client ? (
                                                                        <Link
                                                                            href={route(
                                                                                "clients.show",
                                                                                livraison
                                                                                    .commande
                                                                                    .client
                                                                                    .id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            {
                                                                                livraison
                                                                                    .commande
                                                                                    .client
                                                                                    .nom
                                                                            }
                                                                        </Link>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="h-3 w-3 text-gray-400" />
                                                                        {livraison.adresse ||
                                                                            "-"}
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    {getLivraisonStatusBadge(
                                                                        livraison.status
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    {livraison.employer ? (
                                                                        <Link
                                                                            href={route(
                                                                                "employers.show",
                                                                                livraison
                                                                                    .employer
                                                                                    .id
                                                                            )}
                                                                            className="text-blue-600 hover:text-blue-800"
                                                                        >
                                                                            {
                                                                                livraison
                                                                                    .employer
                                                                                    .nom
                                                                            }
                                                                        </Link>
                                                                    ) : (
                                                                        "-"
                                                                    )}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Link
                                                                        href={route(
                                                                            "livraisons.show",
                                                                            livraison.id
                                                                        )}
                                                                    >
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="sm"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>
                                                                    </Link>
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {livraisons.last_page > 1 && (
                                            <div className="flex justify-center">
                                                <div className="flex gap-2">
                                                    {livraisons.links.map(
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
                                                                    if (
                                                                        link.url
                                                                    ) {
                                                                        router.get(
                                                                            link.url
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={
                                                                    !link.url
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
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            Aucune livraison trouvée
                                        </p>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Rapports Dépenses Tab */}
                            <TabsContent value="rapports" className="space-y-4">
                                {/* Filters for Rapports */}
                                <Collapsible
                                    open={filtersOpen.rapports}
                                    onOpenChange={(open) =>
                                        setFiltersOpen((prev) => ({
                                            ...prev,
                                            rapports: open,
                                        }))
                                    }
                                >
                                    <CollapsibleTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex items-center gap-2"
                                        >
                                            <Filter className="h-4 w-4" />
                                            Filtres
                                            {filtersOpen.rapports ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-2 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                            <div>
                                                <Label>Type de dépense</Label>
                                                <Input
                                                    placeholder="Ex: Carburant, Maintenance..."
                                                    value={
                                                        localFilters.rapports_type
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                rapports_type:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Date de</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.rapports_date_from
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                rapports_date_from:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                            <div>
                                                <Label>Date à</Label>
                                                <Input
                                                    type="date"
                                                    value={
                                                        localFilters.rapports_date_to
                                                    }
                                                    onChange={(e) =>
                                                        setLocalFilters(
                                                            (prev) => ({
                                                                ...prev,
                                                                rapports_date_to:
                                                                    e.target
                                                                        .value,
                                                            })
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                applyFilters(localFilters)
                                            }
                                            className="bg-yellow-600 hover:bg-yellow-700"
                                        >
                                            Appliquer
                                        </Button>
                                    </CollapsibleContent>
                                </Collapsible>

                                {rapports.data.length > 0 ? (
                                    <>
                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Type de dépense
                                                        </TableHead>
                                                        <TableHead>
                                                            Montant
                                                        </TableHead>
                                                        <TableHead>
                                                            Remarques
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {rapports.data.map(
                                                        (rapport) => (
                                                            <TableRow
                                                                key={rapport.id}
                                                            >
                                                                <TableCell>
                                                                    {rapport.date_operation
                                                                        ? new Date(
                                                                              rapport.date_operation
                                                                          ).toLocaleDateString(
                                                                              "fr-FR"
                                                                          )
                                                                        : "-"}
                                                                </TableCell>
                                                                <TableCell>
                                                                    <Badge variant="outline">
                                                                        {rapport.type_depense ||
                                                                            "Non spécifié"}
                                                                    </Badge>
                                                                </TableCell>
                                                                <TableCell className="font-medium">
                                                                    {rapport.montant?.toLocaleString()}{" "}
                                                                    DH
                                                                </TableCell>
                                                                <TableCell className="max-w-xs truncate">
                                                                    {rapport.remarques ||
                                                                        "-"}
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {rapports.last_page > 1 && (
                                            <div className="flex justify-center">
                                                <div className="flex gap-2">
                                                    {rapports.links.map(
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
                                                                    if (
                                                                        link.url
                                                                    ) {
                                                                        router.get(
                                                                            link.url
                                                                        );
                                                                    }
                                                                }}
                                                                disabled={
                                                                    !link.url
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
                                    </>
                                ) : (
                                    <div className="text-center py-8">
                                        <Wrench className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            Aucune dépense trouvée
                                        </p>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
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
                            <span className="font-medium">{vehicule.nom}</span>"
                            ? Cette action est irréversible et supprimera
                            également tous les enregistrements associés.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteDialogOpen(false)}
                        >
                            Annuler
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Supprimer définitivement
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default VehiculesShow;
