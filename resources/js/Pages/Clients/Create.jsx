import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowLeft,
    Save,
    User,
    CreditCard,
    Phone,
    MapPin,
    Hash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import AdminLayout from "@/Layouts/Layout";

export default function ClientsCreate() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: "",
        cin: "",
        telephone: "",
        adresse: "",
        dettes: 0,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("clients.store"), {
            onSuccess: () => {
                reset();
            },
        });
    };

    return (
        <>
            <AdminLayout title="Ajouter Client">
                <div className="max-w-4xl mx-auto space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
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
                                <h1 className="text-3xl font-bold text-gray-900">
                                    Nouveau Client
                                </h1>
                                <p className="text-gray-600 mt-1">
                                    Ajoutez un nouveau client au système
                                </p>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Form */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Informations Personnelles */}
                                <Card className="bg-white border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <User className="h-5 w-5 mr-2 text-yellow-600" />
                                            Informations Personnelles
                                        </CardTitle>
                                        <CardDescription>
                                            Saisissez les informations de base
                                            du client
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Nom */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="nom"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Nom complet *
                                                </Label>
                                                <Input
                                                    id="nom"
                                                    type="text"
                                                    value={data.nom}
                                                    onChange={(e) =>
                                                        setData(
                                                            "nom",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ex: Mohammed Ben Ali"
                                                    className={`${
                                                        errors.nom
                                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }`}
                                                    required
                                                />
                                                {errors.nom && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.nom}
                                                    </p>
                                                )}
                                            </div>

                                            {/* CIN */}
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor="cin"
                                                    className="text-sm font-medium text-gray-700"
                                                >
                                                    Numéro CIN *
                                                </Label>
                                                <div className="relative">
                                                    <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                    <Input
                                                        id="cin"
                                                        type="text"
                                                        value={data.cin}
                                                        onChange={(e) =>
                                                            setData(
                                                                "cin",
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Ex: AB123456"
                                                        className={`pl-10 ${
                                                            errors.cin
                                                                ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                                : ""
                                                        }`}
                                                        required
                                                    />
                                                </div>
                                                {errors.cin && (
                                                    <p className="text-sm text-red-600">
                                                        {errors.cin}
                                                    </p>
                                                )}
                                                <p className="text-xs text-gray-500">
                                                    Le numéro CIN doit être
                                                    unique
                                                </p>
                                            </div>
                                        </div>

                                        {/* Téléphone */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="telephone"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Numéro de téléphone
                                            </Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                                <Input
                                                    id="telephone"
                                                    type="tel"
                                                    value={data.telephone}
                                                    onChange={(e) =>
                                                        setData(
                                                            "telephone",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ex: +212 6 12 34 56 78"
                                                    className={`pl-10 ${
                                                        errors.telephone
                                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }`}
                                                />
                                            </div>
                                            {errors.telephone && (
                                                <p className="text-sm text-red-600">
                                                    {errors.telephone}
                                                </p>
                                            )}
                                        </div>

                                        {/* Adresse */}
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="adresse"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Adresse complète
                                            </Label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                                                <Textarea
                                                    id="adresse"
                                                    value={data.adresse}
                                                    onChange={(e) =>
                                                        setData(
                                                            "adresse",
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Ex: 123 Avenue Mohammed V, Casablanca"
                                                    className={`pl-10 min-h-20 ${
                                                        errors.adresse
                                                            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                            : ""
                                                    }`}
                                                    rows={3}
                                                />
                                            </div>
                                            {errors.adresse && (
                                                <p className="text-sm text-red-600">
                                                    {errors.adresse}
                                                </p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Informations Financières */}
                                <Card className="bg-white border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="flex items-center">
                                            <CreditCard className="h-5 w-5 mr-2 text-yellow-600" />
                                            Informations Financières
                                        </CardTitle>
                                        <CardDescription>
                                            Définissez les informations
                                            financières initiales
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor="dettes"
                                                className="text-sm font-medium text-gray-700"
                                            >
                                                Dettes initiales (MAD)
                                            </Label>
                                            <Input
                                                id="dettes"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.dettes}
                                                onChange={(e) =>
                                                    setData(
                                                        "dettes",
                                                        parseFloat(
                                                            e.target.value
                                                        ) || 0
                                                    )
                                                }
                                                placeholder="0.00"
                                                className={`${
                                                    errors.dettes
                                                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                                                        : ""
                                                }`}
                                            />
                                            {errors.dettes && (
                                                <p className="text-sm text-red-600">
                                                    {errors.dettes}
                                                </p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                Laissez à 0 si le client n'a pas
                                                de dettes initiales
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Actions */}
                                <Card className="bg-white border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg">
                                            Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900"
                                        >
                                            <Save className="h-4 w-4 mr-2" />
                                            {processing
                                                ? "Enregistrement..."
                                                : "Enregistrer"}
                                        </Button>

                                        <Link href={route("clients.index")}>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="w-full bg-white"
                                                disabled={processing}
                                            >
                                                Annuler
                                            </Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                {/* Aide */}
                                <Card className="bg-yellow-50 border-yellow-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-yellow-800">
                                            Aide
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm text-yellow-700">
                                            <p className="font-medium mb-2">
                                                Champs obligatoires :
                                            </p>
                                            <ul className="space-y-1 text-xs">
                                                <li>• Nom complet du client</li>
                                                <li>• Numéro CIN (unique)</li>
                                            </ul>
                                        </div>

                                        <Separator className="bg-yellow-200" />

                                        <div className="text-sm text-yellow-700">
                                            <p className="font-medium mb-2">
                                                Conseils :
                                            </p>
                                            <ul className="space-y-1 text-xs">
                                                <li>
                                                    • Vérifiez le CIN avant
                                                    validation
                                                </li>
                                                <li>
                                                    • Le téléphone peut inclure
                                                    l'indicatif
                                                </li>
                                                <li>
                                                    • L'adresse peut être
                                                    modifiée plus tard
                                                </li>
                                            </ul>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Statistiques rapides */}
                                <Card className="bg-gray-50 border-gray-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-gray-800">
                                            Informations
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="text-sm text-gray-600">
                                            <div className="flex justify-between items-center">
                                                <span>Date de création :</span>
                                                <span className="font-medium">
                                                    {new Date().toLocaleDateString(
                                                        "fr-FR"
                                                    )}
                                                </span>
                                            </div>
                                            <div className="flex justify-between items-center mt-2">
                                                <span>Statut initial :</span>
                                                <span className="font-medium text-green-600">
                                                    Actif
                                                </span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </form>
                </div>
            </AdminLayout>
        </>
    );
}
