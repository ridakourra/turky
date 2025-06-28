import React from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
    ArrowLeft,
    Save,
    User,
    CreditCard,
    MapPin,
    FileText,
    Edit,
} from "lucide-react";

export default function EditFournisseur({ fournisseur }) {
    const { data, setData, put, processing, errors } = useForm({
        nom: fournisseur.nom || "",
        ice_ou_cin: fournisseur.ice_ou_cin || "",
        adresse: fournisseur.adresse || "",
        note: fournisseur.note || "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/fournisseurs/${fournisseur.id}`);
    };

    return (
        <AdminLayout title="Modifier Fournisseur">
            <Head title={`Modifier ${fournisseur.nom}`} />

            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <Link href="/fournisseurs">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Retour
                                </Button>
                            </Link>
                            <div>
                                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                    <Edit className="h-6 w-6" />
                                    Modifier Fournisseur
                                </CardTitle>
                                <p className="text-gray-600">
                                    Modifiez les informations de "{fournisseur.nom}"
                                </p>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Form */}
                <Card>
                    <CardContent className="pt-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Nom */}
                                <div className="space-y-2">
                                    <Label htmlFor="nom" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nom *
                                    </Label>
                                    <Input
                                        id="nom"
                                        type="text"
                                        value={data.nom}
                                        onChange={(e) => setData("nom", e.target.value)}
                                        placeholder="Nom du fournisseur"
                                        className={errors.nom ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.nom && (
                                        <p className="text-sm text-red-600">{errors.nom}</p>
                                    )}
                                </div>

                                {/* ICE/CIN */}
                                <div className="space-y-2">
                                    <Label htmlFor="ice_ou_cin" className="flex items-center gap-2">
                                        <CreditCard className="h-4 w-4" />
                                        ICE/CIN *
                                    </Label>
                                    <Input
                                        id="ice_ou_cin"
                                        type="text"
                                        value={data.ice_ou_cin}
                                        onChange={(e) => setData("ice_ou_cin", e.target.value)}
                                        placeholder="Numéro ICE ou CIN"
                                        className={errors.ice_ou_cin ? "border-red-500" : ""}
                                        required
                                    />
                                    {errors.ice_ou_cin && (
                                        <p className="text-sm text-red-600">{errors.ice_ou_cin}</p>
                                    )}
                                    <p className="text-xs text-gray-500">
                                        Identifiant commun de l'entreprise ou carte d'identité nationale
                                    </p>
                                </div>
                            </div>

                            {/* Adresse */}
                            <div className="space-y-2">
                                <Label htmlFor="adresse" className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4" />
                                    Adresse
                                </Label>
                                <Textarea
                                    id="adresse"
                                    value={data.adresse}
                                    onChange={(e) => setData("adresse", e.target.value)}
                                    placeholder="Adresse complète du fournisseur"
                                    className={errors.adresse ? "border-red-500" : ""}
                                    rows={3}
                                />
                                {errors.adresse && (
                                    <p className="text-sm text-red-600">{errors.adresse}</p>
                                )}
                            </div>

                            {/* Note */}
                            <div className="space-y-2">
                                <Label htmlFor="note" className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Note
                                </Label>
                                <Textarea
                                    id="note"
                                    value={data.note}
                                    onChange={(e) => setData("note", e.target.value)}
                                    placeholder="Notes ou commentaires sur le fournisseur"
                                    className={errors.note ? "border-red-500" : ""}
                                    rows={4}
                                />
                                {errors.note && (
                                    <p className="text-sm text-red-600">{errors.note}</p>
                                )}
                                <p className="text-xs text-gray-500">
                                    Informations complémentaires, conditions particulières, etc.
                                </p>
                            </div>

                            {/* Required Fields Notice */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                <p className="text-sm text-yellow-800">
                                    <span className="font-medium">Note :</span> Les champs marqués d'un
                                    astérisque (*) sont obligatoires.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-4 pt-6 border-t">
                                <Link href="/fournisseurs">
                                    <Button variant="outline" type="button">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-yellow-500 hover:bg-yellow-600"
                                >
                                    {processing ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Modification...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-4 w-4 mr-2" />
                                            Sauvegarder les Modifications
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* Information Card */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="pt-6">
                        <h3 className="font-medium text-blue-900 mb-2">
                            Informations de modification
                        </h3>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Créé le : {new Date(fournisseur.created_at).toLocaleDateString('fr-FR')}</li>
                            <li>• Dernière modification : {new Date(fournisseur.updated_at).toLocaleDateString('fr-FR')}</li>
                            <li>• Modifier l'ICE/CIN nécessite une validation d'unicité</li>
                            <li>• Les modifications sont sauvegardées immédiatement</li>
                        </ul>
                    </CardContent>
                </Card>

                {/* Quick Navigation */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-medium text-gray-900 mb-4">Actions rapides</h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/fournisseurs/${fournisseur.id}`}>
                                <Button variant="outline" size="sm">
                                    Voir les détails
                                </Button>
                            </Link>
                            <Link href="/fournisseurs">
                                <Button variant="outline" size="sm">
                                    Liste des fournisseurs
                                </Button>
                            </Link>
                            <Link href="/fournisseurs/create">
                                <Button variant="outline" size="sm">
                                    Nouveau fournisseur
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
