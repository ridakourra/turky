import React, { useState } from "react";
import { Head, useForm, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Building2,
    Save,
    ArrowLeft,
    Upload,
    X,
    AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

export default function Edit({ entreprise }) {
    const [logoPreview, setLogoPreview] = useState(
        entreprise?.logo ? `/storage/${entreprise.logo}` : null
    );

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: entreprise?.nom || "",
        ice: entreprise?.ice || "",
        adresse: entreprise?.adresse || "",
        telephone: entreprise?.telephone || "",
        email: entreprise?.email || "",
        secteur_activite: entreprise?.secteur_activite || "",
        forme_juridique: entreprise?.forme_juridique || "",
        representant_legal: entreprise?.representant_legal || "",
        site_web: entreprise?.site_web || "",
        description: entreprise?.description || "",
        capital: entreprise?.capital || "",
        date_creation: entreprise?.date_creation
            ? entreprise.date_creation.split("T")[0]
            : "",
        logo: null,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("entreprise.update"), {
            onSuccess: () => {
                toast.success(
                    "Informations de l'entreprise mises à jour avec succès !"
                );
            },
            onError: (errors) => {
                toast.error(
                    "Erreur lors de la mise à jour. Veuillez vérifier les champs."
                );
            },
        });
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("logo", file);

            // Create preview
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogoPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData("logo", null);
        setLogoPreview(entreprise?.logo ? `/storage/${entreprise.logo}` : null);
        document.getElementById("logo-input").value = "";
    };

    return (
        <Layout title="Modifier l'Entreprise">
            <Head title="Modifier l'Entreprise" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Modifier l'Entreprise
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Modifiez les informations de votre entreprise
                        </p>
                    </div>
                    <Link href={route("entreprise.index")}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Basic Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Building2 className="w-5 h-5 mr-2 text-yellow-600" />
                                    Informations Générales
                                </CardTitle>
                                <CardDescription>
                                    Informations de base de l'entreprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nom">
                                        Nom de l'entreprise{" "}
                                        <span className="text-red-500">*</span>
                                    </Label>
                                    <Input
                                        id="nom"
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) =>
                                            setData("nom", e.target.value)
                                        }
                                        className={
                                            errors.nom ? "border-red-500" : ""
                                        }
                                        placeholder="Nom de l'entreprise"
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-500">
                                            {errors.nom}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="ice">ICE</Label>
                                    <Input
                                        id="ice"
                                        type="text"
                                        value={data.ice}
                                        onChange={(e) =>
                                            setData("ice", e.target.value)
                                        }
                                        className={
                                            errors.ice ? "border-red-500" : ""
                                        }
                                        placeholder="Identifiant Commun de l'Entreprise"
                                    />
                                    {errors.ice && (
                                        <p className="text-sm text-red-500">
                                            {errors.ice}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="secteur_activite">
                                        Secteur d'activité
                                    </Label>
                                    <Input
                                        id="secteur_activite"
                                        type="text"
                                        value={data.secteur_activite}
                                        onChange={(e) =>
                                            setData(
                                                "secteur_activite",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.secteur_activite
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="Secteur d'activité"
                                    />
                                    {errors.secteur_activite && (
                                        <p className="text-sm text-red-500">
                                            {errors.secteur_activite}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="forme_juridique">
                                        Forme juridique
                                    </Label>
                                    <Input
                                        id="forme_juridique"
                                        type="text"
                                        value={data.forme_juridique}
                                        onChange={(e) =>
                                            setData(
                                                "forme_juridique",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.forme_juridique
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="SARL, SA, SNC, etc."
                                    />
                                    {errors.forme_juridique && (
                                        <p className="text-sm text-red-500">
                                            {errors.forme_juridique}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Contact Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations de Contact</CardTitle>
                                <CardDescription>
                                    Coordonnées de l'entreprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="adresse">Adresse</Label>
                                    <Textarea
                                        id="adresse"
                                        value={data.adresse}
                                        onChange={(e) =>
                                            setData("adresse", e.target.value)
                                        }
                                        className={
                                            errors.adresse
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="Adresse complète de l'entreprise"
                                        rows={3}
                                    />
                                    {errors.adresse && (
                                        <p className="text-sm text-red-500">
                                            {errors.adresse}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="telephone">Téléphone</Label>
                                    <Input
                                        id="telephone"
                                        type="tel"
                                        value={data.telephone}
                                        onChange={(e) =>
                                            setData("telephone", e.target.value)
                                        }
                                        className={
                                            errors.telephone
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="+212 6XX XXX XXX"
                                    />
                                    {errors.telephone && (
                                        <p className="text-sm text-red-500">
                                            {errors.telephone}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        className={
                                            errors.email ? "border-red-500" : ""
                                        }
                                        placeholder="contact@entreprise.com"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-500">
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="site_web">Site web</Label>
                                    <Input
                                        id="site_web"
                                        type="url"
                                        value={data.site_web}
                                        onChange={(e) =>
                                            setData("site_web", e.target.value)
                                        }
                                        className={
                                            errors.site_web
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="https://www.entreprise.com"
                                    />
                                    {errors.site_web && (
                                        <p className="text-sm text-red-500">
                                            {errors.site_web}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Legal Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations Légales</CardTitle>
                                <CardDescription>
                                    Détails légaux et financiers
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="representant_legal">
                                        Représentant légal
                                    </Label>
                                    <Input
                                        id="representant_legal"
                                        type="text"
                                        value={data.representant_legal}
                                        onChange={(e) =>
                                            setData(
                                                "representant_legal",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.representant_legal
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="Nom du représentant légal"
                                    />
                                    {errors.representant_legal && (
                                        <p className="text-sm text-red-500">
                                            {errors.representant_legal}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="capital">
                                        Capital (MAD)
                                    </Label>
                                    <Input
                                        id="capital"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.capital}
                                        onChange={(e) =>
                                            setData("capital", e.target.value)
                                        }
                                        className={
                                            errors.capital
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="0.00"
                                    />
                                    {errors.capital && (
                                        <p className="text-sm text-red-500">
                                            {errors.capital}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="date_creation">
                                        Date de création
                                    </Label>
                                    <Input
                                        id="date_creation"
                                        type="date"
                                        value={data.date_creation}
                                        onChange={(e) =>
                                            setData(
                                                "date_creation",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.date_creation
                                                ? "border-red-500"
                                                : ""
                                        }
                                    />
                                    {errors.date_creation && (
                                        <p className="text-sm text-red-500">
                                            {errors.date_creation}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Logo Upload */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Logo de l'entreprise</CardTitle>
                                <CardDescription>
                                    Téléchargez le logo de votre entreprise
                                    (JPEG, PNG, JPG, GIF - Max 2MB)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="logo">Logo</Label>
                                    <div className="flex items-center space-x-4">
                                        <Input
                                            id="logo-input"
                                            type="file"
                                            accept="image/jpeg,image/png,image/jpg,image/gif"
                                            onChange={handleLogoChange}
                                            className={
                                                errors.logo
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {data.logo && (
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={removeLogo}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Annuler
                                            </Button>
                                        )}
                                    </div>
                                    {errors.logo && (
                                        <p className="text-sm text-red-500">
                                            {errors.logo}
                                        </p>
                                    )}
                                </div>

                                {logoPreview && (
                                    <div className="mt-4">
                                        <Label>Aperçu du logo</Label>
                                        <div className="mt-2 p-4 border border-gray-200 rounded-lg bg-gray-50">
                                            <img
                                                src={logoPreview}
                                                alt="Aperçu du logo"
                                                className="max-w-xs max-h-32 object-contain mx-auto"
                                            />
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Description - Full Width */}
                        <Card className="lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                                <CardDescription>
                                    Description détaillée de l'entreprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <Label htmlFor="description">
                                        Description
                                    </Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) =>
                                            setData(
                                                "description",
                                                e.target.value
                                            )
                                        }
                                        className={
                                            errors.description
                                                ? "border-red-500"
                                                : ""
                                        }
                                        placeholder="Description de l'entreprise, ses activités, sa mission, etc."
                                        rows={6}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-500">
                                            {errors.description}
                                        </p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end space-x-4 mt-6">
                        <Link href={route("entreprise.index")}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900"
                        >
                            {processing ? (
                                <>
                                    <AlertCircle className="w-4 h-4 mr-2 animate-spin" />
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    Enregistrer
                                </>
                            )}
                        </Button>
                    </div>
                </form>

                {/* Help Text */}
                <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        <strong>Note :</strong> Les champs marqués d'un
                        astérisque (*) sont obligatoires. Assurez-vous de
                        remplir toutes les informations importantes pour une
                        gestion optimale.
                    </AlertDescription>
                </Alert>
            </div>
        </Layout>
    );
}
