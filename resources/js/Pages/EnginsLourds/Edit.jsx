import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, Truck } from 'lucide-react';

export default function Edit({ enginLourd }) {
    const { data, setData, put, processing, errors } = useForm({
        reference: enginLourd.reference || '',
        marque: enginLourd.marque || '',
        modele: enginLourd.modele || '',
        type_engin: enginLourd.type_engin || '',
        capacite: enginLourd.capacite || '',
        statut: enginLourd.statut || 'actif',
        date_acquisition: enginLourd.date_acquisition || '',
        prix_acquisition: enginLourd.prix_acquisition || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('engins-lourds.update', enginLourd.id));
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${enginLourd.reference}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Truck className="h-6 w-6 text-yellow-600" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Modifier {enginLourd.reference}
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={route('engins-lourds.show', enginLourd.id)}>
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Informations de l'engin lourd</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Référence */}
                                <div className="space-y-2">
                                    <Label htmlFor="reference">Référence *</Label>
                                    <Input
                                        id="reference"
                                        type="text"
                                        value={data.reference}
                                        onChange={(e) => setData('reference', e.target.value)}
                                        placeholder="Ex: EL001"
                                        className={errors.reference ? 'border-red-500' : ''}
                                    />
                                    {errors.reference && (
                                        <p className="text-sm text-red-600">{errors.reference}</p>
                                    )}
                                </div>

                                {/* Marque */}
                                <div className="space-y-2">
                                    <Label htmlFor="marque">Marque *</Label>
                                    <Input
                                        id="marque"
                                        type="text"
                                        value={data.marque}
                                        onChange={(e) => setData('marque', e.target.value)}
                                        placeholder="Ex: Caterpillar"
                                        className={errors.marque ? 'border-red-500' : ''}
                                    />
                                    {errors.marque && (
                                        <p className="text-sm text-red-600">{errors.marque}</p>
                                    )}
                                </div>

                                {/* Modèle */}
                                <div className="space-y-2">
                                    <Label htmlFor="modele">Modèle</Label>
                                    <Input
                                        id="modele"
                                        type="text"
                                        value={data.modele}
                                        onChange={(e) => setData('modele', e.target.value)}
                                        placeholder="Ex: 320D"
                                        className={errors.modele ? 'border-red-500' : ''}
                                    />
                                    {errors.modele && (
                                        <p className="text-sm text-red-600">{errors.modele}</p>
                                    )}
                                </div>

                                {/* Type d'engin */}
                                <div className="space-y-2">
                                    <Label htmlFor="type_engin">Type d'engin *</Label>
                                    <Select value={data.type_engin} onValueChange={(value) => setData('type_engin', value)}>
                                        <SelectTrigger className={errors.type_engin ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pelleteuse">Pelleteuse</SelectItem>
                                            <SelectItem value="bulldozer">Bulldozer</SelectItem>
                                            <SelectItem value="grue">Grue</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type_engin && (
                                        <p className="text-sm text-red-600">{errors.type_engin}</p>
                                    )}
                                </div>

                                {/* Capacité */}
                                <div className="space-y-2">
                                    <Label htmlFor="capacite">Capacité (tonnes)</Label>
                                    <Input
                                        id="capacite"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.capacite}
                                        onChange={(e) => setData('capacite', e.target.value)}
                                        placeholder="Ex: 20.5"
                                        className={errors.capacite ? 'border-red-500' : ''}
                                    />
                                    {errors.capacite && (
                                        <p className="text-sm text-red-600">{errors.capacite}</p>
                                    )}
                                </div>

                                {/* Statut */}
                                <div className="space-y-2">
                                    <Label htmlFor="statut">Statut</Label>
                                    <Select value={data.statut} onValueChange={(value) => setData('statut', value)}>
                                        <SelectTrigger className={errors.statut ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner le statut" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="actif">Actif</SelectItem>
                                            <SelectItem value="en_maintenance">En maintenance</SelectItem>
                                            <SelectItem value="hors_service">Hors service</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.statut && (
                                        <p className="text-sm text-red-600">{errors.statut}</p>
                                    )}
                                </div>

                                {/* Date d'acquisition */}
                                <div className="space-y-2">
                                    <Label htmlFor="date_acquisition">Date d'acquisition</Label>
                                    <Input
                                        id="date_acquisition"
                                        type="date"
                                        value={data.date_acquisition}
                                        onChange={(e) => setData('date_acquisition', e.target.value)}
                                        className={errors.date_acquisition ? 'border-red-500' : ''}
                                    />
                                    {errors.date_acquisition && (
                                        <p className="text-sm text-red-600">{errors.date_acquisition}</p>
                                    )}
                                </div>

                                {/* Prix d'acquisition */}
                                <div className="space-y-2">
                                    <Label htmlFor="prix_acquisition">Prix d'acquisition (MAD)</Label>
                                    <Input
                                        id="prix_acquisition"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={data.prix_acquisition}
                                        onChange={(e) => setData('prix_acquisition', e.target.value)}
                                        placeholder="Ex: 500000.00"
                                        className={errors.prix_acquisition ? 'border-red-500' : ''}
                                    />
                                    {errors.prix_acquisition && (
                                        <p className="text-sm text-red-600">{errors.prix_acquisition}</p>
                                    )}
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-4">
                                <Link href={route('engins-lourds.show', enginLourd.id)}>
                                    <Button type="button" variant="outline">
                                        Annuler
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    <Save className="h-4 w-4 mr-2" />
                                    {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}