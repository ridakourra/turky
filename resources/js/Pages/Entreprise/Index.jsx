import React from "react";
import { Head, Link } from "@inertiajs/react";
import Layout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Calendar,
    DollarSign,
    Edit,
    User,
    Briefcase,
    FileText
} from "lucide-react";
import { toast } from "sonner";

export default function Index({ entreprise, success, error }) {
    React.useEffect(() => {
        if (success) {
            toast.success(success);
        }
        if (error) {
            toast.error(error);
        }
    }, [success, error]);

    const formatCurrency = (amount) => {
        if (!amount) return "Non spécifié";
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return "Non spécifiée";
        return new Date(date).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <Layout title="Informations de l'Entreprise">
            <Head title="Informations de l'Entreprise" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Informations de l'Entreprise
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Gérez les informations de votre entreprise
                        </p>
                    </div>
                    <Link href={route('entreprise.edit')}>
                        <Button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {/* Enterprise Information Cards */}
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
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Nom de l'entreprise
                                </label>
                                <p className="text-lg font-semibold text-gray-900">
                                    {entreprise?.nom || "Non spécifié"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    ICE
                                </label>
                                <p className="text-gray-900">
                                    {entreprise?.ice || "Non spécifié"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Secteur d'activité
                                </label>
                                <p className="text-gray-900">
                                    {entreprise?.secteur_activite || "Non spécifié"}
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Forme juridique
                                </label>
                                <p className="text-gray-900">
                                    {entreprise?.forme_juridique || "Non spécifiée"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <Phone className="w-5 h-5 mr-2 text-yellow-600" />
                                Informations de Contact
                            </CardTitle>
                            <CardDescription>
                                Coordonnées de l'entreprise
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Adresse
                                    </label>
                                    <p className="text-gray-900">
                                        {entreprise?.adresse || "Non spécifiée"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-gray-400" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Téléphone
                                    </label>
                                    <p className="text-gray-900">
                                        {entreprise?.telephone || "Non spécifié"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-gray-400" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Email
                                    </label>
                                    <p className="text-gray-900">
                                        {entreprise?.email || "Non spécifié"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Globe className="w-5 h-5 text-gray-400" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Site web
                                    </label>
                                    <p className="text-gray-900">
                                        {entreprise?.site_web ? (
                                            <a
                                                href={entreprise.site_web}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-yellow-600 hover:text-yellow-700 underline"
                                            >
                                                {entreprise.site_web}
                                            </a>
                                        ) : "Non spécifié"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Legal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <User className="w-5 h-5 mr-2 text-yellow-600" />
                                Informations Légales
                            </CardTitle>
                            <CardDescription>
                                Détails légaux et financiers
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">
                                    Représentant légal
                                </label>
                                <p className="text-gray-900">
                                    {entreprise?.representant_legal || "Non spécifié"}
                                </p>
                            </div>

                            <div className="flex items-center space-x-3">
                                <DollarSign className="w-5 h-5 text-gray-400" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Capital
                                    </label>
                                    <p className="text-gray-900">
                                        {formatCurrency(entreprise?.capital)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-3">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                <div>
                                    <label className="text-sm font-medium text-gray-500">
                                        Date de création
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(entreprise?.date_creation)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Description */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center">
                                <FileText className="w-5 h-5 mr-2 text-yellow-600" />
                                Description
                            </CardTitle>
                            <CardDescription>
                                Description de l'entreprise
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-900 whitespace-pre-wrap">
                                {entreprise?.description || "Aucune description disponible"}
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Logo Section */}
                {entreprise?.logo && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo de l'entreprise</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-center">
                                <img
                                    src={`/storage/${entreprise.logo}`}
                                    alt="Logo de l'entreprise"
                                    className="max-w-xs max-h-32 object-contain"
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Summary */}
                <Card>
                    <CardHeader>
                        <CardTitle>Résumé</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-yellow-50 rounded-lg">
                                <div className="text-2xl font-bold text-yellow-800">
                                    {entreprise?.nom ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-yellow-600">
                                    Nom défini
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-800">
                                    {entreprise?.ice ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    ICE défini
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-800">
                                    {entreprise?.telephone ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Contact défini
                                </div>
                            </div>
                            <div className="text-center p-4 bg-gray-50 rounded-lg">
                                <div className="text-2xl font-bold text-gray-800">
                                    {entreprise?.logo ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Logo défini
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Layout>
    );
}
