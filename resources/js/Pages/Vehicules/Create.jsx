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
} from "lucide-react";

const VehiculesCreate = ({ employers }) => {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: "",
        matricule: "",
        marque: "",
        modele: "",
        type: "",
        capacite: "",
        annee: "",
        kilometrage: "",
        carburant_type: "",
        numero_chassis: "",
        numero_moteur: "",
        date_assurance: "",
        statut: "available",
        employer_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("vehicules.store"));
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

    return (
        <AdminLayout title="Nouveau Véhicule">
            <Head title="Nouveau Véhicule" />

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
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Truck className="h-6 w-6 text-yellow-600" />
                            Nouveau Véhicule
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Ajoutez un nouveau véhicule à votre flotte
                        </p>
                    </div>
                </div>

                {/* Info Alert */}
                <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                        Les champs marqués d'un astérisque (*) sont
                        obligatoires. Le matricule doit être unique dans le
                        système.
                    </AlertDescription>
                </Alert>

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
                                    <Label htmlFor="statut">Statut</Label>
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
                                                <SelectItem
                                                    value="none"
                                                    disabled
                                                >
                                                    Aucun employé assigné
                                                </SelectItem>
                                            )}
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
                                        className={
                                            errors.date_assurance
                                                ? "border-red-300"
                                                : ""
                                        }
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
                                    Création...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    Créer le véhicule
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default VehiculesCreate;
