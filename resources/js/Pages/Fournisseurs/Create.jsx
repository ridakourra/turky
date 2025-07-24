import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Building2, User, Phone, Mail, MapPin, FileText, Hash } from 'lucide-react';

export default function FournisseursCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nom_societe: '',
        contact_nom: '',
        telephone: '',
        email: '',
        addresse: '',
        ice: '',
        rc: '',
        if: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('fournisseurs.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau Fournisseur" />

            <div className="py-12">
                <div className=" mx-auto sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4">
                        <Link href={route('fournisseurs.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Nouveau Fournisseur
                        </h2>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-yellow-500" />
                                Informations du Fournisseur
                            </CardTitle>
                            <CardDescription>
                                Remplissez les informations du nouveau fournisseur
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Informations principales */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="nom_societe" className="flex items-center gap-2">
                                            <Building2 className="h-4 w-4" />
                                            Nom de la Société *
                                        </Label>
                                        <Input
                                            id="nom_societe"
                                            type="text"
                                            value={data.nom_societe}
                                            onChange={(e) => setData('nom_societe', e.target.value)}
                                            placeholder="Nom de la société"
                                            className={errors.nom_societe ? 'border-red-500' : ''}
                                        />
                                        {errors.nom_societe && (
                                            <p className="text-sm text-red-600">{errors.nom_societe}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="contact_nom" className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            Nom du Contact
                                        </Label>
                                        <Input
                                            id="contact_nom"
                                            type="text"
                                            value={data.contact_nom}
                                            onChange={(e) => setData('contact_nom', e.target.value)}
                                            placeholder="Nom du contact"
                                            className={errors.contact_nom ? 'border-red-500' : ''}
                                        />
                                        {errors.contact_nom && (
                                            <p className="text-sm text-red-600">{errors.contact_nom}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Informations de contact */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="telephone" className="flex items-center gap-2">
                                            <Phone className="h-4 w-4" />
                                            Téléphone
                                        </Label>
                                        <Input
                                            id="telephone"
                                            type="tel"
                                            value={data.telephone}
                                            onChange={(e) => setData('telephone', e.target.value)}
                                            placeholder="Numéro de téléphone"
                                            className={errors.telephone ? 'border-red-500' : ''}
                                        />
                                        {errors.telephone && (
                                            <p className="text-sm text-red-600">{errors.telephone}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="flex items-center gap-2">
                                            <Mail className="h-4 w-4" />
                                            Email
                                        </Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Adresse email"
                                            className={errors.email ? 'border-red-500' : ''}
                                        />
                                        {errors.email && (
                                            <p className="text-sm text-red-600">{errors.email}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Adresse */}
                                <div className="space-y-2">
                                    <Label htmlFor="addresse" className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4" />
                                        Adresse
                                    </Label>
                                    <Textarea
                                        id="addresse"
                                        value={data.addresse}
                                        onChange={(e) => setData('addresse', e.target.value)}
                                        placeholder="Adresse complète"
                                        rows={3}
                                        className={errors.addresse ? 'border-red-500' : ''}
                                    />
                                    {errors.addresse && (
                                        <p className="text-sm text-red-600">{errors.addresse}</p>
                                    )}
                                </div>

                                {/* Informations légales */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="ice" className="flex items-center gap-2">
                                            <Hash className="h-4 w-4" />
                                            ICE
                                        </Label>
                                        <Input
                                            id="ice"
                                            type="text"
                                            value={data.ice}
                                            onChange={(e) => setData('ice', e.target.value)}
                                            placeholder="Numéro ICE"
                                            className={errors.ice ? 'border-red-500' : ''}
                                        />
                                        {errors.ice && (
                                            <p className="text-sm text-red-600">{errors.ice}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="rc" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            RC
                                        </Label>
                                        <Input
                                            id="rc"
                                            type="text"
                                            value={data.rc}
                                            onChange={(e) => setData('rc', e.target.value)}
                                            placeholder="Registre de commerce"
                                            className={errors.rc ? 'border-red-500' : ''}
                                        />
                                        {errors.rc && (
                                            <p className="text-sm text-red-600">{errors.rc}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="if" className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            IF
                                        </Label>
                                        <Input
                                            id="if"
                                            type="text"
                                            value={data.if}
                                            onChange={(e) => setData('if', e.target.value)}
                                            placeholder="Identifiant fiscal"
                                            className={errors.if ? 'border-red-500' : ''}
                                        />
                                        {errors.if && (
                                            <p className="text-sm text-red-600">{errors.if}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Boutons d'action */}
                                <div className="flex items-center justify-end gap-4 pt-6">
                                    <Link href={route('fournisseurs.index')}>
                                        <Button variant="outline" type="button">
                                            Annuler
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        {processing ? 'Création...' : 'Créer le Fournisseur'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
