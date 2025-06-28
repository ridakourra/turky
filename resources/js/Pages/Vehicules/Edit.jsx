import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    Save,
    Truck,
    AlertCircle,
    Info,
    Calendar,
    Gauge,
    Settings,
    FileText,
    Eye,
} from "lucide-react";

const VehiculesEdit = ({ vehicule, employers }) => {
    const { data, setData, put, processing, errors, reset } = useForm({
        nom: vehicule.nom || "",
        matricule: vehicule.matricule || "",
        marque: vehicule.marque || "",
        modele: vehicule.modele || "",
        type: vehicule.type || "",
        capacite: vehicule.capacite || "",
        annee: vehicule.annee || "",
        kilometrage: vehicule.kilometrage || "",
        carburant_type: vehicule.carburant_type || "",
        numero_chassis: vehicule.numero_chassis || "",
        numero_moteur: vehicule.numero_moteur || "",
        date_assurance: vehicule.date_assurance || "",
        statut: vehicule.statut || "available",
        employer_id: vehicule.employer_id || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route("vehicules.update", vehicule.id));
    };

    const carburantTypes = [
        "Essence",
        "Diesel",
        "Hybride",
        "Électrique",
        "GPL",
        "GNV",
    ];

    const vehiculeTypes = [
        "Camion",
        "Camionnette",
        "Voiture",
        "Utilitaire",
        "Poids lourd",
        "Semi-remorque",
        "Tracteur",
        "Autre",
    ];

    const statutOptions = [
        { value: "available", label: "Disponible" },
        { value: "in_use", label: "En utilisation" },
        { value: "maintenance", label: "Maintenance" },
        { value: "out_of_service", label: "Hors service" },
    ];

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

    // Check if insurance is expiring soon (within 30 days)
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

    return (
        <AdminLayout title={`Modifier - ${vehicule.nom}`}>
            <Head title={`Modifier - ${vehicule.nom}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route("vehicules.index")}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Retour
                        </Button>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="h-6 w-6 text-yellow-600" />
                            Modifier le véhicule
                        </h1>
                        <p className="text-gray-600 mt-1 flex items-center gap-2">
                            {vehicule.nom} - {vehicule.matricule}
                            {getStatusBadge(vehicule.statut)}
                        </p>
                    </div>
                    <Link href={route("vehicules.show", vehicule.id)}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                        >
                            <Eye className="h-4 w-4" />
                            Voir détails
                        </Button>
                    </Link>
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

                    <Alert>
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                            Les champs marqués d'un astérisque (*) sont
                            obligatoires. Le matricule doit rester unique dans
                            le système.
                        </AlertDescription>
                    </Alert>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Informations Générales
                            </CardTitle>
                            <CardDescription>
                                Informations de base du véhicule
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">
                                        Nom du véhicule *
                                    </Label>
                                    <Input
                                        id="nom"
                                        value={data.nom}
                                        onChange={(e) =>
                                            setData("nom", e.target.value)
                                        }
                                        placeholder="Ex: Camion de livraison 1"
                                        className={
                                            errors.nom ? "border-red-300" : ""
                                        }
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.nom}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="matricule">
                                        Matricule *
                                    </Label>
                                    <Input
                                        id="matricule"
                                        value={data.matricule}
                                        onChange={(e) =>
                                            setData("matricule", e.target.value)
                                        }
                                        placeholder="Ex: 123456-أ-7"
                                        className={
                                            errors.matricule
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.matricule && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.matricule}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="marque">Marque</Label>
                                    <Input
                                        id="marque"
                                        value={data.marque}
                                        onChange={(e) =>
                                            setData("marque", e.target.value)
                                        }
                                        placeholder="Ex: Mercedes, Volvo, Renault"
                                        className={
                                            errors.marque
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.marque && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.marque}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="modele">Modèle</Label>
                                    <Input
                                        id="modele"
                                        value={data.modele}
                                        onChange={(e) =>
                                            setData("modele", e.target.value)
                                        }
                                        placeholder="Ex: Actros, FH, Master"
                                        className={
                                            errors.modele
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.modele && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.modele}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="type">Type</Label>
                                    <Select
                                        value={data.type}
                                        onValueChange={(value) =>
                                            setData("type", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.type
                                                    ? "border-red-300"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Choisir le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {vehiculeTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.type && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.type}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capacite">Capacité</Label>
                                    <Input
                                        id="capacite"
                                        value={data.capacite}
                                        onChange={(e) =>
                                            setData("capacite", e.target.value)
                                        }
                                        placeholder="Ex: 20 tonnes, 1000 kg"
                                        className={
                                            errors.capacite
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.capacite && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.capacite}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Caractéristiques techniques */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Settings className="h-5 w-5" />
                                Caractéristiques Techniques
                            </CardTitle>
                            <CardDescription>
                                Détails techniques du véhicule
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="annee">Année</Label>
                                    <Input
                                        id="annee"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={data.annee}
                                        onChange={(e) =>
                                            setData("annee", e.target.value)
                                        }
                                        placeholder="Ex: 2020"
                                        className={
                                            errors.annee ? "border-red-300" : ""
                                        }
                                    />
                                    {errors.annee && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.annee}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="kilometrage">
                                        Kilométrage{" "}
                                        <Gauge className="h-4 w-4 inline ml-1" />
                                    </Label>
                                    <Input
                                        id="kilometrage"
                                        type="number"
                                        min="0"
                                        value={data.kilometrage}
                                        onChange={(e) =>
                                            setData(
                                                "kilometrage",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: 150000"
                                        className={
                                            errors.kilometrage
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.kilometrage && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.kilometrage}
                                        </p>
                                    )}
                                    {vehicule.kilometrage &&
                                        data.kilometrage <
                                            vehicule.kilometrage && (
                                            <p className="text-sm text-amber-600 flex items-center gap-1">
                                                <AlertCircle className="h-4 w-4" />
                                                Attention: Le nouveau
                                                kilométrage est inférieur à
                                                l'ancien (
                                                {vehicule.kilometrage?.toLocaleString()}{" "}
                                                km)
                                            </p>
                                        )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="carburant_type">
                                        Type de carburant
                                    </Label>
                                    <Select
                                        value={data.carburant_type}
                                        onValueChange={(value) =>
                                            setData("carburant_type", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.carburant_type
                                                    ? "border-red-300"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Choisir le carburant" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {carburantTypes.map((type) => (
                                                <SelectItem
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.carburant_type && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.carburant_type}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="numero_chassis">
                                        Numéro de châssis
                                    </Label>
                                    <Input
                                        id="numero_chassis"
                                        value={data.numero_chassis}
                                        onChange={(e) =>
                                            setData(
                                                "numero_chassis",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: WME9063651A123456"
                                        className={
                                            errors.numero_chassis
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.numero_chassis && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.numero_chassis}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="numero_moteur">
                                        Numéro de moteur
                                    </Label>
                                    <Input
                                        id="numero_moteur"
                                        value={data.numero_moteur}
                                        onChange={(e) =>
                                            setData(
                                                "numero_moteur",
                                                e.target.value
                                            )
                                        }
                                        placeholder="Ex: OM471LA.6/2E"
                                        className={
                                            errors.numero_moteur
                                                ? "border-red-300"
                                                : ""
                                        }
                                    />
                                    {errors.numero_moteur && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.numero_moteur}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statut et assignation */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Statut et Assignation
                            </CardTitle>
                            <CardDescription>
                                Statut actuel et assignation d'employé
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="statut">
                                        Statut *
                                        {vehicule.statut !== data.statut && (
                                            <Badge
                                                variant="outline"
                                                className="ml-2"
                                            >
                                                Changement: {vehicule.statut} →{" "}
                                                {data.statut}
                                            </Badge>
                                        )}
                                    </Label>
                                    <Select
                                        value={data.statut}
                                        onValueChange={(value) =>
                                            setData("statut", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.statut
                                                    ? "border-red-300"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Choisir le statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statutOptions.map((option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.statut}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="employer_id">
                                        Employé assigné
                                        {vehicule.employer_id !==
                                            data.employer_id && (
                                            <Badge
                                                variant="outline"
                                                className="ml-2"
                                            >
                                                Changement d'assignation
                                            </Badge>
                                        )}
                                    </Label>
                                    <Select
                                        value={data.employer_id}
                                        onValueChange={(value) =>
                                            setData("employer_id", value)
                                        }
                                    >
                                        <SelectTrigger
                                            className={
                                                errors.employer_id
                                                    ? "border-red-300"
                                                    : ""
                                            }
                                        >
                                            <SelectValue placeholder="Choisir un employé (optionnel)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {employers.length === 0 && (
                                                <SelectItem value="none" disabled>
                                                    Aucun employé assigné
                                                </SelectItem>
                                            )}
                                            {employers.map((employer) => (
                                                <SelectItem
                                                    key={employer.id}
                                                    value={employer.id.toString()}
                                                >
                                                    {employer.nom}
                                                    {employer.id ===
                                                        vehicule.employer_id && (
                                                        <Badge
                                                            variant="outline"
                                                            className="ml-2"
                                                        >
                                                            Actuel
                                                        </Badge>
                                                    )}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.employer_id && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.employer_id}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="date_assurance">
                                        Date d'expiration assurance
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
                                    </Label>
                                    <Input
                                        id="date_assurance"
                                        type="date"
                                        value={data.date_assurance}
                                        onChange={(e) =>
                                            setData(
                                                "date_assurance",
                                                e.target.value
                                            )
                                        }
                                        className={`${
                                            errors.date_assurance
                                                ? "border-red-300"
                                                : ""
                                        } ${
                                            isInsuranceExpired()
                                                ? "border-red-300 bg-red-50"
                                                : isInsuranceExpiringSoon()
                                                ? "border-amber-300 bg-amber-50"
                                                : ""
                                        }`}
                                    />
                                    {errors.date_assurance && (
                                        <p className="text-sm text-red-600 flex items-center gap-1">
                                            <AlertCircle className="h-4 w-4" />
                                            {errors.date_assurance}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-4 pt-6 border-t">
                        <Link href={route("vehicules.index")}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-600 hover:bg-yellow-700 flex items-center gap-2"
                        >
                            {processing ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Mise à jour...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Mettre à jour
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default VehiculesEdit;
