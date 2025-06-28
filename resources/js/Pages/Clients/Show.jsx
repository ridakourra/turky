import React, { useState } from "react";
import { Head, Link, router, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Edit,
    User,
    Phone,
    MapPin,
    Hash,
    CreditCard,
    ShoppingCart,
    FileText,
    Construction,
    Plus,
    Download,
    RotateCcw,
    Filter,
    Search,
    Eye,
    Calendar,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Clock,
    MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import AdminLayout from "@/Layouts/Layout";

export default function ClientsShow({
    client,
    commandes,
    rapportsDettes,
    rapportsLocation,
    stats,
}) {
    const [resetDebtDialog, setResetDebtDialog] = useState(false);
    const [rentEngineDialog, setRentEngineDialog] = useState(false);
    const [availableEngines, setAvailableEngines] = useState([]);
    const [commandesFilter, setCommandesFilter] = useState("");
    const [dettesFilter, setDettesFilter] = useState("");
    const [locationFilter, setLocationFilter] = useState("");

    // Form for renting engines
    const {
        data: rentData,
        setData: setRentData,
        post: postRent,
        processing: rentProcessing,
        errors: rentErrors,
        reset: resetRent,
    } = useForm({
        engin_lourd_id: "",
        quantite: 1,
        prix_par_heure: "",
        date_operation: new Date().toISOString().split("T")[0],
        remarques: "",
    });

    // Load available engines when dialog opens
    const loadAvailableEngines = async () => {
        try {
            const response = await fetch(route("clients.available-engines"));
            const engines = await response.json();
            setAvailableEngines(engines);
        } catch (error) {
            console.error("Erreur lors du chargement des engins:", error);
        }
    };

    // Handle debt reset
    const handleResetDettes = () => {
        router.post(
            route("clients.reset-dettes", client.id),
            {},
            {
                onSuccess: () => {
                    setResetDebtDialog(false);
                },
            }
        );
    };

    // Handle engine rental
    const handleRentEngine = (e) => {
        e.preventDefault();
        postRent(route("clients.rent-engine", client.id), {
            onSuccess: () => {
                setRentEngineDialog(false);
                resetRent();
            },
        });
    };

    // Filter commandes
    const filteredCommandes = commandes.data.filter(
        (commande) =>
            commande.id.toString().includes(commandesFilter) ||
            commande.status
                .toLowerCase()
                .includes(commandesFilter.toLowerCase()) ||
            commande.montant_totale.toString().includes(commandesFilter)
    );

    // Filter debt reports
    const filteredDettes = rapportsDettes.data.filter(
        (rapport) =>
            rapport.montant.toString().includes(dettesFilter) ||
            (rapport.status &&
                rapport.status
                    .toLowerCase()
                    .includes(dettesFilter.toLowerCase())) ||
            (rapport.remarques &&
                rapport.remarques
                    .toLowerCase()
                    .includes(dettesFilter.toLowerCase()))
    );

    // Filter location reports
    const filteredLocation = rapportsLocation.data.filter(
        (rapport) =>
            rapport.engin_lourd?.nom
                ?.toLowerCase()
                .includes(locationFilter.toLowerCase()) ||
            rapport.montant_totale.toString().includes(locationFilter) ||
            (rapport.remarques &&
                rapport.remarques
                    .toLowerCase()
                    .includes(locationFilter.toLowerCase()))
    );

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
        }).format(amount);
    };

    // Get status badge for commandes
    const getStatusBadge = (status) => {
        const statusConfig = {
            pending: {
                color: "bg-yellow-100 text-yellow-800",
                text: "En attente",
            },
            processing: {
                color: "bg-blue-100 text-blue-800",
                text: "En cours",
            },
            completed: {
                color: "bg-green-100 text-green-800",
                text: "Terminé",
            },
            cancelled: { color: "bg-red-100 text-red-800", text: "Annulé" },
        };

        const config = statusConfig[status] || statusConfig["pending"];
        return <Badge className={config.color}>{config.text}</Badge>;
    };

    return (
        <>
            <AdminLayout title={`Client - ${client.nom}`}>
                <div className="max-w-7xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <Link href={route("clients.index")}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <User className="h-8 w-8 mr-3 text-yellow-600" />
                                    {client.nom}
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Profil client et historique des transactions
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => setRentEngineDialog(true)}
                                onMouseEnter={loadAvailableEngines}
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                            >
                                <Construction className="h-4 w-4 mr-2" />
                                Louer Engin
                            </Button>
                            <Link href={route("clients.edit", client.id)}>
                                <Button className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Client Information Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Basic Info */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="p-6">
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <Hash className="h-4 w-4 text-gray-400 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            CIN:
                                        </span>
                                        <span className="ml-2 font-mono font-medium">
                                            {client.cin}
                                        </span>
                                    </div>

                                    {client.telephone && (
                                        <div className="flex items-center">
                                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                                            <span className="text-sm text-gray-600">
                                                Tél:
                                            </span>
                                            <span className="ml-2 font-medium">
                                                {client.telephone}
                                            </span>
                                        </div>
                                    )}

                                    {client.adresse && (
                                        <div className="flex items-start">
                                            <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                                            <div>
                                                <span className="text-sm text-gray-600">
                                                    Adresse:
                                                </span>
                                                <p className="text-sm font-medium mt-1">
                                                    {client.adresse}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Financial Info */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <CreditCard className="h-8 w-8 text-red-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Dettes Actuelles
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(client.dettes)}
                                        </p>
                                        {client.dettes > 0 && (
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                                                onClick={() =>
                                                    setResetDebtDialog(true)
                                                }
                                            >
                                                <RotateCcw className="h-3 w-3 mr-1" />
                                                Remettre à zéro
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Orders Stats */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <ShoppingCart className="h-8 w-8 text-blue-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Commandes
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {stats.total_commandes}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {stats.commandes_en_cours} en cours
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Total Purchases */}
                        <Card className="bg-white border-gray-200">
                            <CardContent className="p-6">
                                <div className="flex items-center">
                                    <TrendingUp className="h-8 w-8 text-green-500" />
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-600">
                                            Total Achats
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {formatCurrency(stats.total_achats)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Locations:{" "}
                                            {formatCurrency(
                                                stats.total_locations
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs for different sections */}
                    <Tabs defaultValue="commandes" className="space-y-4">
                        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
                            <TabsTrigger
                                value="commandes"
                                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-yellow-900"
                            >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Commandes ({commandes.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="dettes"
                                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-yellow-900"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Rapports Dettes ({rapportsDettes.total})
                            </TabsTrigger>
                            <TabsTrigger
                                value="locations"
                                className="data-[state=active]:bg-yellow-400 data-[state=active]:text-yellow-900"
                            >
                                <Construction className="h-4 w-4 mr-2" />
                                Locations Engins ({rapportsLocation.total})
                            </TabsTrigger>
                        </TabsList>

                        {/* Commandes Tab */}
                        <TabsContent value="commandes" className="space-y-4">
                            <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle>Commandes du Client</CardTitle>
                                    <CardDescription>
                                        Historique de toutes les commandes
                                        passées par ce client
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Filter */}
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Filtrer par ID, statut, montant..."
                                                value={commandesFilter}
                                                onChange={(e) =>
                                                    setCommandesFilter(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold text-gray-900">
                                                        ID
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Statut
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Montant Total
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Revenu
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Date
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredCommandes.map(
                                                    (commande) => (
                                                        <TableRow
                                                            key={commande.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell className="font-medium">
                                                                #{commande.id}
                                                            </TableCell>
                                                            <TableCell>
                                                                {getStatusBadge(
                                                                    commande.status
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-medium">
                                                                {formatCurrency(
                                                                    commande.montant_totale
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-green-600">
                                                                {formatCurrency(
                                                                    commande.revenu
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {new Date(
                                                                    commande.created_at
                                                                ).toLocaleDateString(
                                                                    "fr-FR"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                <Link
                                                                    href={route(
                                                                        "commandes.show",
                                                                        commande.id
                                                                    )}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                    >
                                                                        <Eye className="h-3 w-3 mr-1" />
                                                                        Voir
                                                                    </Button>
                                                                </Link>
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {filteredCommandes.length === 0 && (
                                        <div className="text-center py-8">
                                            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">
                                                {commandesFilter
                                                    ? "Aucune commande ne correspond au filtre"
                                                    : "Aucune commande trouvée"}
                                            </p>
                                        </div>
                                    )}

                                    {/* Pagination for commandes */}
                                    {commandes.links && (
                                        <div className="flex justify-center mt-4">
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
                                                        className={
                                                            link.active
                                                                ? "bg-yellow-400 text-yellow-900 hover:bg-yellow-500"
                                                                : ""
                                                        }
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(
                                                                    link.url
                                                                );
                                                            }
                                                        }}
                                                        disabled={!link.url}
                                                    >
                                                        <span
                                                            dangerouslySetInnerHTML={{
                                                                __html: link.label,
                                                            }}
                                                        />
                                                    </Button>
                                                )
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Debt Reports Tab */}
                        <TabsContent value="dettes" className="space-y-4">
                            <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle>Rapports de Dettes</CardTitle>
                                    <CardDescription>
                                        Historique des paiements et ajustements
                                        de dettes
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Filter */}
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Filtrer par montant, statut, remarques..."
                                                value={dettesFilter}
                                                onChange={(e) =>
                                                    setDettesFilter(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Montant
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Statut
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Date Opération
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Remarques
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredDettes.map(
                                                    (rapport) => (
                                                        <TableRow
                                                            key={rapport.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell>
                                                                <span
                                                                    className={`font-medium ${
                                                                        rapport.montant >=
                                                                        0
                                                                            ? "text-red-600"
                                                                            : "text-green-600"
                                                                    }`}
                                                                >
                                                                    {rapport.montant >=
                                                                    0
                                                                        ? "+"
                                                                        : ""}
                                                                    {formatCurrency(
                                                                        rapport.montant
                                                                    )}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                {rapport.status && (
                                                                    <Badge
                                                                        variant={
                                                                            rapport.status ===
                                                                            "payé"
                                                                                ? "default"
                                                                                : "secondary"
                                                                        }
                                                                    >
                                                                        {
                                                                            rapport.status
                                                                        }
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {rapport.date_operation
                                                                    ? new Date(
                                                                          rapport.date_operation
                                                                      ).toLocaleDateString(
                                                                          "fr-FR"
                                                                      )
                                                                    : new Date(
                                                                          rapport.created_at
                                                                      ).toLocaleDateString(
                                                                          "fr-FR"
                                                                      )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                                                {rapport.remarques ||
                                                                    "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {filteredDettes.length === 0 && (
                                        <div className="text-center py-8">
                                            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">
                                                {dettesFilter
                                                    ? "Aucun rapport ne correspond au filtre"
                                                    : "Aucun rapport de dette trouvé"}
                                            </p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Engine Rental Tab */}
                        <TabsContent value="locations" className="space-y-4">
                            <Card className="bg-white border-gray-200">
                                <CardHeader>
                                    <CardTitle>
                                        Locations d'Engins Lourds
                                    </CardTitle>
                                    <CardDescription>
                                        Historique des locations d'engins par ce
                                        client
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {/* Filter */}
                                    <div className="mb-4">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Filtrer par nom d'engin, montant, remarques..."
                                                value={locationFilter}
                                                onChange={(e) =>
                                                    setLocationFilter(
                                                        e.target.value
                                                    )
                                                }
                                                className="pl-10"
                                            />
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-gray-50">
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Engin
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Quantité
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Prix/Heure
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Montant Total
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Date
                                                    </TableHead>
                                                    <TableHead className="font-semibold text-gray-900">
                                                        Remarques
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filteredLocation.map(
                                                    (rapport) => (
                                                        <TableRow
                                                            key={rapport.id}
                                                            className="hover:bg-gray-50"
                                                        >
                                                            <TableCell className="font-medium">
                                                                {rapport
                                                                    .engin_lourd
                                                                    ?.nom ||
                                                                    "Engin supprimé"}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    rapport.quantite
                                                                }
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrency(
                                                                    rapport.prix_par_heure
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-medium text-green-600">
                                                                {formatCurrency(
                                                                    rapport.montant_totale
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600">
                                                                {rapport.date_operation
                                                                    ? new Date(
                                                                          rapport.date_operation
                                                                      ).toLocaleDateString(
                                                                          "fr-FR"
                                                                      )
                                                                    : new Date(
                                                                          rapport.created_at
                                                                      ).toLocaleDateString(
                                                                          "fr-FR"
                                                                      )}
                                                            </TableCell>
                                                            <TableCell className="text-sm text-gray-600 max-w-xs truncate">
                                                                {rapport.remarques ||
                                                                    "-"}
                                                            </TableCell>
                                                        </TableRow>
                                                    )
                                                )}
                                            </TableBody>
                                        </Table>
                                    </div>

                                    {filteredLocation.length === 0 && (
                                        <div className="text-center py-8">
                                            <Construction className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">
                                                {locationFilter
                                                    ? "Aucune location ne correspond au filtre"
                                                    : "Aucune location d'engin trouvée"}
                                            </p>
                                            <Button
                                                className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
                                                onClick={() =>
                                                    setRentEngineDialog(true)
                                                }
                                                onMouseEnter={
                                                    loadAvailableEngines
                                                }
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Première Location
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Reset Debt Confirmation Dialog */}
                <AlertDialog
                    open={resetDebtDialog}
                    onOpenChange={setResetDebtDialog}
                >
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Remettre les dettes à zéro
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Êtes-vous sûr de vouloir remettre les dettes de
                                "{client.nom}" à zéro ? Le montant actuel de{" "}
                                {formatCurrency(client.dettes)} sera effacé et
                                un rapport sera créé.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleResetDettes}
                                className="bg-red-600 hover:bg-red-700"
                            >
                                Confirmer la remise à zéro
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {/* Rent Engine Dialog */}
                <Dialog
                    open={rentEngineDialog}
                    onOpenChange={setRentEngineDialog}
                >
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Louer un Engin Lourd</DialogTitle>
                            <DialogDescription>
                                Enregistrer une nouvelle location d'engin pour{" "}
                                {client.nom}
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleRentEngine} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="engin_lourd_id">
                                    Engin disponible *
                                </Label>
                                <Select
                                    value={rentData.engin_lourd_id}
                                    onValueChange={(value) =>
                                        setRentData("engin_lourd_id", value)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Sélectionner un engin" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableEngines.map((engin) => (
                                            <SelectItem
                                                key={engin.id}
                                                value={engin.id.toString()}
                                            >
                                                {engin.nom} - {engin.reference}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {rentErrors.engin_lourd_id && (
                                    <p className="text-sm text-red-600">
                                        {rentErrors.engin_lourd_id}
                                    </p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="quantite">
                                        Quantité (heures) *
                                    </Label>
                                    <Input
                                        id="quantite"
                                        type="number"
                                        min="1"
                                        value={rentData.quantite}
                                        onChange={(e) =>
                                            setRentData(
                                                "quantite",
                                                parseInt(e.target.value) || 1
                                            )
                                        }
                                        placeholder="1"
                                    />
                                    {rentErrors.quantite && (
                                        <p className="text-sm text-red-600">
                                            {rentErrors.quantite}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="prix_par_heure">
                                        Prix/Heure (MAD) *
                                    </Label>
                                    <Input
                                        id="prix_par_heure"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={rentData.prix_par_heure}
                                        onChange={(e) =>
                                            setRentData(
                                                "prix_par_heure",
                                                e.target.value
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                    {rentErrors.prix_par_heure && (
                                        <p className="text-sm text-red-600">
                                            {rentErrors.prix_par_heure}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="date_operation">
                                    Date de location *
                                </Label>
                                <Input
                                    id="date_operation"
                                    type="date"
                                    value={rentData.date_operation}
                                    onChange={(e) =>
                                        setRentData(
                                            "date_operation",
                                            e.target.value
                                        )
                                    }
                                />
                                {rentErrors.date_operation && (
                                    <p className="text-sm text-red-600">
                                        {rentErrors.date_operation}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="remarques">Remarques</Label>
                                <Textarea
                                    id="remarques"
                                    value={rentData.remarques}
                                    onChange={(e) =>
                                        setRentData("remarques", e.target.value)
                                    }
                                    placeholder="Notes supplémentaires..."
                                    rows={3}
                                />
                            </div>

                            {rentData.quantite && rentData.prix_par_heure && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                    <p className="text-sm text-green-700">
                                        <strong>Montant total: </strong>
                                        {formatCurrency(
                                            rentData.quantite *
                                                parseFloat(
                                                    rentData.prix_par_heure || 0
                                                )
                                        )}
                                    </p>
                                </div>
                            )}

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setRentEngineDialog(false)}
                                >
                                    Annuler
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={rentProcessing}
                                    className="bg-blue-500 hover:bg-blue-600 text-white"
                                >
                                    {rentProcessing
                                        ? "Enregistrement..."
                                        : "Enregistrer Location"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </AdminLayout>
        </>
    );
}
