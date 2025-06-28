import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Construction,
    ArrowLeft,
    Edit,
    Calendar,
    User,
    Fuel,
    Gauge,
    AlertTriangle,
    MapPin,
    Clock,
    DollarSign,
    FileText,
    Truck,
    Settings,
} from "lucide-react";

const Show = ({ enginLourd }) => {
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

    // Check insurance status
    const isInsuranceExpired = () => {
        if (!enginLourd.date_assurance) return false;
        const insuranceDate = new Date(enginLourd.date_assurance);
        const today = new Date();
        return insuranceDate < today;
    };

    const isInsuranceExpiringSoon = () => {
        if (!enginLourd.date_assurance) return false;
        const insuranceDate = new Date(enginLourd.date_assurance);
        const today = new Date();
        const diffTime = insuranceDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30 && diffDays >= 0;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MAD",
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
    };

    return (
        <AdminLayout title={`Engin Lourd - ${enginLourd.nom}`}>
            <Head title={`Engin Lourd - ${enginLourd.nom}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Construction className="w-6 h-6 text-yellow-600" />
                            {enginLourd.nom}
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            <span>Référence: {enginLourd.reference}</span>
                            {getStatusBadge(enginLourd.statut)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" asChild>
                            <Link href={route("engins-lourds.index")}>
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour à la liste
                            </Link>
                        </Button>
                        <Button asChild>
                            <Link
                                href={route(
                                    "engins-lourds.edit",
                                    enginLourd.id
                                )}
                            >
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </Link>
                        </Button>
                    </div>
                </div>

                {/* Alerts */}
                {isInsuranceExpired() && (
                    <Alert className="border-red-200 bg-red-50">
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                            <strong>Assurance expirée !</strong> L'assurance de
                            cet engin a expiré le{" "}
                            {formatDate(enginLourd.date_assurance)}.
                        </AlertDescription>
                    </Alert>
                )}

                {isInsuranceExpiringSoon() && !isInsuranceExpired() && (
                    <Alert className="border-yellow-200 bg-yellow-50">
                        <AlertTriangle className="w-4 h-4 text-yellow-600" />
                        <AlertDescription className="text-yellow-800">
                            <strong>Attention !</strong> L'assurance de cet
                            engin expire bientôt le{" "}
                            {formatDate(enginLourd.date_assurance)}.
                        </AlertDescription>
                    </Alert>
                )}

                <Tabs defaultValue="details" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="details">
                            Détails de l'Engin
                        </TabsTrigger>
                        <TabsTrigger value="rentals">
                            Historique des Locations
                        </TabsTrigger>
                        <TabsTrigger value="maintenance">
                            Maintenance
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Informations Générales */}
                            <div className="lg:col-span-2">
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Construction className="w-5 h-5" />
                                            Informations Générales
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">
                                                    Identification
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Nom:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.nom}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Référence:
                                                        </span>
                                                        <p className="font-medium">
                                                            {
                                                                enginLourd.reference
                                                            }
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Type:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.type ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Marque:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.marque ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Modèle:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.modele ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="font-semibold text-gray-900 mb-3">
                                                    Spécifications
                                                </h4>
                                                <div className="space-y-2">
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Capacité:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.capacite
                                                                ? `${enginLourd.capacite} T`
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Année:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.annee ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Prix/Heure:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.location_par_heure
                                                                ? formatCurrency(
                                                                      enginLourd.location_par_heure
                                                                  ) + "/h"
                                                                : "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Type de carburant:
                                                        </span>
                                                        <p className="font-medium">
                                                            {enginLourd.carburant_type ||
                                                                "-"}
                                                        </p>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm text-gray-500">
                                                            Statut:
                                                        </span>
                                                        <div className="mt-1">
                                                            {getStatusBadge(
                                                                enginLourd.statut
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Détails Techniques */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Settings className="w-5 h-5" />
                                            Détails Techniques
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Numéro de série:
                                                </span>
                                                <p className="font-medium">
                                                    {enginLourd.numero_serie ||
                                                        "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Numéro de moteur:
                                                </span>
                                                <p className="font-medium">
                                                    {enginLourd.numero_moteur ||
                                                        "-"}
                                                </p>
                                            </div>
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Date d'assurance:
                                                </span>
                                                <p
                                                    className={`font-medium ${
                                                        isInsuranceExpired()
                                                            ? "text-red-600"
                                                            : isInsuranceExpiringSoon()
                                                            ? "text-yellow-600"
                                                            : ""
                                                    }`}
                                                >
                                                    {formatDate(
                                                        enginLourd.date_assurance
                                                    )}
                                                    {isInsuranceExpired() && (
                                                        <span className="ml-2 text-red-500">
                                                            (Expirée)
                                                        </span>
                                                    )}
                                                    {isInsuranceExpiringSoon() &&
                                                        !isInsuranceExpired() && (
                                                            <span className="ml-2 text-yellow-500">
                                                                (Expire bientôt)
                                                            </span>
                                                        )}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Affectation et Statistiques */}
                            <div>
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <User className="w-5 h-5" />
                                            Affectation
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div>
                                                <span className="text-sm text-gray-500">
                                                    Opérateur assigné:
                                                </span>
                                                {enginLourd.employer ? (
                                                    <div className="mt-1">
                                                        <Link
                                                            href={route(
                                                                "employers.show",
                                                                enginLourd
                                                                    .employer.id
                                                            )}
                                                            className="font-medium text-blue-600 hover:text-blue-800"
                                                        >
                                                            {
                                                                enginLourd
                                                                    .employer
                                                                    .nom
                                                            }
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <p className="font-medium text-gray-500">
                                                        Aucun opérateur assigné
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Statistiques rapides */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <FileText className="w-5 h-5" />
                                            Statistiques
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Locations totales:
                                                </span>
                                                <span className="font-semibold">
                                                    {enginLourd
                                                        .rapports_location
                                                        ?.length || 0}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Revenus générés:
                                                </span>
                                                <span className="font-semibold text-green-600">
                                                    {formatCurrency(
                                                        enginLourd.rapports_location?.reduce(
                                                            (sum, rapport) =>
                                                                sum +
                                                                (parseFloat(
                                                                    rapport.montant_totale
                                                                ) || 0),
                                                            0
                                                        ) || 0
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-500">
                                                    Dernière location:
                                                </span>
                                                <span className="font-semibold">
                                                    {enginLourd
                                                        .rapports_location
                                                        ?.length > 0
                                                        ? formatDate(
                                                              enginLourd
                                                                  .rapports_location[0]
                                                                  .date_operation
                                                          )
                                                        : "Jamais"}
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="rentals" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Historique des Locations
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {enginLourd.rapports_location &&
                                enginLourd.rapports_location.length > 0 ? (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date</TableHead>
                                                    <TableHead>
                                                        Client
                                                    </TableHead>
                                                    <TableHead>
                                                        Quantité (heures)
                                                    </TableHead>
                                                    <TableHead>
                                                        Prix/Heure
                                                    </TableHead>
                                                    <TableHead>
                                                        Montant Total
                                                    </TableHead>
                                                    <TableHead>
                                                        Remarques
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {enginLourd.rapports_location.map(
                                                    (rapport) => (
                                                        <TableRow
                                                            key={rapport.id}
                                                        >
                                                            <TableCell>
                                                                {formatDate(
                                                                    rapport.date_operation
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {rapport.client ? (
                                                                    <Link
                                                                        href={route(
                                                                            "clients.show",
                                                                            rapport
                                                                                .client
                                                                                .id
                                                                        )}
                                                                        className="text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        {
                                                                            rapport
                                                                                .client
                                                                                .nom
                                                                        }
                                                                    </Link>
                                                                ) : (
                                                                    "-"
                                                                )}
                                                            </TableCell>
                                                            <TableCell>
                                                                {
                                                                    rapport.quantite
                                                                }
                                                                h
                                                            </TableCell>
                                                            <TableCell>
                                                                {formatCurrency(
                                                                    rapport.prix_par_heure
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="font-semibold text-green-600">
                                                                {formatCurrency(
                                                                    rapport.montant_totale
                                                                )}
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
                                ) : (
                                    <div className="text-center py-8">
                                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-500">
                                            Aucune location enregistrée pour cet
                                            engin
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="maintenance" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Settings className="w-5 h-5" />
                                    Maintenance et Entretien
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8">
                                    <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        Section en cours de développement
                                    </p>
                                    <p className="text-sm text-gray-400 mt-2">
                                        L'historique de maintenance sera
                                        disponible prochainement
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
};

export default Show;
