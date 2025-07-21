import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, User, Phone, MapPin, DollarSign } from 'lucide-react';

export default function Edit({ client }) {
    const { data, setData, put, processing, errors } = useForm({
        nom_complet: client.nom_complet || '',
        telephone: client.telephone || '',
        addresse: client.addresse || '',
        dettes_actuelle: client.dettes_actuelle || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(`/clients/${client.id}`);
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${client.nom_complet}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={`/clients/${client.id}`}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Modifier le Client</h1>
                        <p className="text-gray-600 mt-1">Modifier les informations de {client.nom_complet}</p>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5" />
                                Informations du Client
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Nom Complet */}
                                <div className="space-y-2">
                                    <Label htmlFor="nom_complet" className="flex items-center gap-2">
                                        <User className="h-4 w-4" />
                                        Nom Complet *
                                    </Label>
                                    <Input
                                        id="nom_complet"
                                        type="text"
                                        value={data.nom_complet}
                                        onChange={(e) => setData('nom_complet', e.target.value)}
                                        placeholder="Entrez le nom complet du client"
                                        className={errors.nom_complet ? 'border-red-500' : ''}
                                    />
                                    {errors.nom_complet && (
                                        <p className="text-sm text-red-600">{errors.nom_complet}</p>
                                    )}
                                </div>

                                {/* Téléphone */}
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
                                        placeholder="Entrez le numéro de téléphone"
                                        className={errors.telephone ? 'border-red-500' : ''}
                                    />
                                    {errors.telephone && (
                                        <p className="text-sm text-red-600">{errors.telephone}</p>
                                    )}
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
                                        placeholder="Entrez l'adresse du client"
                                        rows={3}
                                        className={errors.addresse ? 'border-red-500' : ''}
                                    />
                                    {errors.addresse && (
                                        <p className="text-sm text-red-600">{errors.addresse}</p>
                                    )}
                                </div>

                                {/* Dettes Actuelles */}
                                <div className="space-y-2">
                                    <Label htmlFor="dettes_actuelle" className="flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" />
                                        Dettes Actuelles (MAD)
                                    </Label>
                                    <Input
                                        id="dettes_actuelle"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.dettes_actuelle}
                                        onChange={(e) => setData('dettes_actuelle', e.target.value)}
                                        placeholder="0.00"
                                        className={errors.dettes_actuelle ? 'border-red-500' : ''}
                                    />
                                    {errors.dettes_actuelle && (
                                        <p className="text-sm text-red-600">{errors.dettes_actuelle}</p>
                                    )}
                                    <p className="text-sm text-gray-500">
                                        Montant des dettes actuelles du client
                                    </p>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-4">
                                    <Button type="submit" disabled={processing} className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                        <Save className="h-4 w-4" />
                                        {processing ? 'Mise à jour...' : 'Mettre à Jour'}
                                    </Button>
                                    <Link href={`/clients/${client.id}`}>
                                        <Button type="button" variant="outline">
                                            Annuler
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                {/* Client Info */}
                <div className="max-w-2xl">
                    <Card className="bg-gray-50 border-gray-200">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-3">
                                <div className="bg-gray-100 p-2 rounded-full">
                                    <User className="h-4 w-4 text-gray-600" />
                                </div>
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-1">Informations du client</h3>
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p><strong>ID:</strong> {client.id}</p>
                                        <p><strong>Date de création:</strong> {new Date(client.created_at).toLocaleDateString('fr-FR')}</p>
                                        <p><strong>Dernière modification:</strong> {new Date(client.updated_at).toLocaleDateString('fr-FR')}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}