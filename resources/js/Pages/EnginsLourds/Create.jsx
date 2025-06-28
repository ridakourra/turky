import React, { useState } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Construction, ArrowLeft, Save } from "lucide-react";

const Create = ({ employers }) => {
    const { data, setData, post, processing, errors } = useForm({
        nom: "",
        reference: "",
        type: "",
        marque: "",
        modele: "",
        capacite: "",
        annee: "",
        numero_serie: "",
        numero_moteur: "",
        location_par_heure: "",
        carburant_type: "",
        date_assurance: "",
        statut: "available",
        employer_id: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("engins-lourds.store"));
    };

    const carburantTypes = [
        "Diesel",
        "Essence",
        "Électrique",
        "Hybride",
        "GPL",
        "GNV",
    ];

    const statutOptions = [
        { value: "available", label: "Disponible" },
        { value: "in_use", label: "En utilisation" },
        { value: "maintenance", label: "En maintenance" },
        { value: "broken", label: "En panne" },
    ];

    return (
        <AdminLayout title="Ajouter un Engin Lourd">
            <Head title="Ajouter un Engin Lourd" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <Construction className="w-6 h-6 text-yellow-600" />
                            Ajouter un Engin Lourd
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Enregistrez un nouvel engin lourd dans votre flotte
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <Link href={route("engins-lourds.index")}>
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la liste
                        </Link>
                    </Button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Informations Générales */}
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader>
                                    <CardTitle>
                                        Informations Générales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="nom">
                                                Nom de l'engin{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="nom"
                                                value={data.nom}
                                                onChange={(e) =>
                                                    setData(
                                                        "nom",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: Excavatrice Caterpillar"
                                                className={
                                                    errors.nom
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.nom && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.nom}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="reference">
                                                Référence{" "}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="reference"
                                                value={data.reference}
                                                onChange={(e) =>
                                                    setData(
                                                        "reference",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: EXC-001"
                                                className={
                                                    errors.reference
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.reference && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.reference}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="type">
                                                Type d'engin
                                            </Label>
                                            <Input
                                                id="type"
                                                value={data.type}
                                                onChange={(e) =>
                                                    setData(
                                                        "type",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: Excavatrice, Bulldozer, Grue..."
                                                className={
                                                    errors.type
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.type && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.type}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="marque">
                                                Marque
                                            </Label>
                                            <Input
                                                id="marque"
                                                value={data.marque}
                                                onChange={(e) =>
                                                    setData(
                                                        "marque",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: Caterpillar, Komatsu, Volvo..."
                                                className={
                                                    errors.marque
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.marque && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.marque}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="modele">
                                                Modèle
                                            </Label>
                                            <Input
                                                id="modele"
                                                value={data.modele}
                                                onChange={(e) =>
                                                    setData(
                                                        "modele",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: 320DL, PC210..."
                                                className={
                                                    errors.modele
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.modele && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.modele}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="capacite">
                                                Capacité (tonnes)
                                            </Label>
                                            <Input
                                                id="capacite"
                                                type="number"
                                                step="0.1"
                                                value={data.capacite}
                                                onChange={(e) =>
                                                    setData(
                                                        "capacite",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: 20"
                                                className={
                                                    errors.capacite
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.capacite && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.capacite}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="annee">
                                                Année de fabrication
                                            </Label>
                                            <Input
                                                id="annee"
                                                type="number"
                                                min="1900"
                                                max={
                                                    new Date().getFullYear() + 1
                                                }
                                                value={data.annee}
                                                onChange={(e) =>
                                                    setData(
                                                        "annee",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder={`Ex: ${new Date().getFullYear()}`}
                                                className={
                                                    errors.annee
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.annee && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.annee}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="location_par_heure">
                                                Prix de location par heure (MAD)
                                            </Label>
                                            <Input
                                                id="location_par_heure"
                                                type="number"
                                                step="0.01"
                                                value={data.location_par_heure}
                                                onChange={(e) =>
                                                    setData(
                                                        "location_par_heure",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Ex: 500"
                                                className={
                                                    errors.location_par_heure
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.location_par_heure && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.location_par_heure}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Détails Techniques */}
                            <Card>
                                <CardHeader>
                                    <CardTitle>Détails Techniques</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="numero_serie">
                                                Numéro de série
                                            </Label>
                                            <Input
                                                id="numero_serie"
                                                value={data.numero_serie}
                                                onChange={(e) =>
                                                    setData(
                                                        "numero_serie",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Numéro de série du constructeur"
                                                className={
                                                    errors.numero_serie
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.numero_serie && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.numero_serie}
                                                </p>
                                            )}
                                        </div>

                                        <div>
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
                                                placeholder="Numéro du moteur"
                                                className={
                                                    errors.numero_moteur
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.numero_moteur && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.numero_moteur}
                                                </p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="carburant_type">
                                                Type de carburant
                                            </Label>
                                            <Select
                                                value={data.carburant_type}
                                                onValueChange={(value) =>
                                                    setData(
                                                        "carburant_type",
                                                        value
                                                    )
                                                }
                                            >
                                                <SelectTrigger
                                                    className={
                                                        errors.carburant_type
                                                            ? "border-red-500"
                                                            : ""
                                                    }
                                                >
                                                    <SelectValue
                                                        placeholder="Sélectionner le type de carburant"
                                                    />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {carburantTypes.map(
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
                                            {errors.carburant_type && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.carburant_type}
                                                </p>
                                            )}
                                        </div>

                                        <div>
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
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {errors.date_assurance && (
                                                <p className="text-sm text-red-500 mt-1">
                                                    {errors.date_assurance}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Affectation et Statut */}
                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Affectation et Statut</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="statut">
                                            Statut{" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.statut}
                                            onValueChange={(value) =>
                                                setData(
                                                    "statut",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.statut
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            >
                                                <SelectValue
                                                    placeholder="Sélectionner le statut"
                                                />
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
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.statut}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <Label htmlFor="employer_id">
                                            Opérateur assigné
                                        </Label>
                                        <Select
                                            value={data.employer_id}
                                            onValueChange={(value) =>
                                                setData(
                                                    "employer_id",
                                                    value
                                                )
                                            }
                                        >
                                            <SelectTrigger
                                                className={
                                                    errors.employer_id
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            >
                                                <SelectValue
                                                    placeholder="Sélectionner un opérateur"
                                                />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="none" disabled>
                                                    Aucun opérateur
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
                                        {errors.employer_id && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {errors.employer_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Info Box */}
                                    <Alert>
                                        <Construction className="w-4 h-4" />
                                        <AlertDescription>
                                            L'opérateur peut être assigné plus
                                            tard ou modifié à tout moment.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>

                            {/* Actions */}
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full"
                                        >
                                            <Save className="w-4 h-4 mr-2" />
                                            {processing
                                                ? "Enregistrement..."
                                                : "Enregistrer l'engin"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full"
                                            asChild
                                        >
                                            <Link
                                                href={route(
                                                    "engins-lourds.index"
                                                )}
                                            >
                                                Annuler
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};


export default Create;
