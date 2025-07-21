import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ArrowLeft, Package, Save } from 'lucide-react';

const Edit = ({ produit, unites_mesure }) => {
    const { data, setData, put, processing, errors } = useForm({
        nom: produit.nom || '',
        unite_mesure: produit.unite_mesure || '',
        prix_unitaire: produit.prix_unitaire || '',
        description: produit.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('produits.update', produit.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Modifier - ${produit.nom}`} />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Package className="h-6 w-6 text-yellow-600" />
                                    <h1 className="text-2xl font-bold text-gray-900">Modifier le produit</h1>
                                </div>
                                <div className="flex space-x-2">
                                    <Link href={route('produits.show', produit.id)}>
                                        <Button variant="outline">
                                            Voir le produit
                                        </Button>
                                    </Link>
                                    <Link href={route('produits.index')}>
                                        <Button variant="outline">
                                            <ArrowLeft className="h-4 w-4 mr-2" />
                                            Retour à la liste
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations du produit</CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor="nom">Nom du produit *</Label>
                                                <Input
                                                    id="nom"
                                                    type="text"
                                                    value={data.nom}
                                                    onChange={(e) => setData('nom', e.target.value)}
                                                    className={errors.nom ? 'border-red-500' : ''}
                                                    placeholder="Entrez le nom du produit"
                                                />
                                                {errors.nom && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor="unite_mesure">Unité de mesure *</Label>
                                                <Select
                                                    value={data.unite_mesure}
                                                    onValueChange={(value) => setData('unite_mesure', value)}
                                                >
                                                    <SelectTrigger className={errors.unite_mesure ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Sélectionnez une unité" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {unites_mesure?.map(unite => (
                                                            <SelectItem key={unite} value={unite}>
                                                                {unite}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.unite_mesure && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.unite_mesure}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <Label htmlFor="prix_unitaire">Prix unitaire (DH)</Label>
                                            <Input
                                                id="prix_unitaire"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={data.prix_unitaire}
                                                onChange={(e) => setData('prix_unitaire', e.target.value)}
                                                className={errors.prix_unitaire ? 'border-red-500' : ''}
                                                placeholder="0.00"
                                            />
                                            {errors.prix_unitaire && (
                                                <p className="text-red-500 text-sm mt-1">{errors.prix_unitaire}</p>
                                            )}
                                        </div>

                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={data.description}
                                                onChange={(e) => setData('description', e.target.value)}
                                                className={errors.description ? 'border-red-500' : ''}
                                                placeholder="Description du produit (optionnel)"
                                                rows={4}
                                            />
                                            {errors.description && (
                                                <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Current Stock Information */}
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Informations du stock actuel</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="grid grid-cols-3 gap-4 text-center">
                                            <div className="p-4 bg-blue-50 rounded-lg">
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {produit.quantite_totale || 0}
                                                </p>
                                                <p className="text-sm text-blue-600">Stock Total</p>
                                            </div>
                                            <div className="p-4 bg-red-50 rounded-lg">
                                                <p className="text-2xl font-bold text-red-600">
                                                    {produit.quantite_vendue || 0}
                                                </p>
                                                <p className="text-sm text-red-600">Quantité Vendue</p>
                                            </div>
                                            <div className="p-4 bg-green-50 rounded-lg">
                                                <p className="text-2xl font-bold text-green-600">
                                                    {produit.quantite_disponible || 0}
                                                </p>
                                                <p className="text-sm text-green-600">Stock Disponible</p>
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                                            <p className="text-sm text-yellow-700">
                                                <strong>Note:</strong> Pour modifier les quantités de stock,
                                                utilisez la page de détail du produit où vous pouvez gérer
                                                chaque entrée de stock individuellement.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('produits.show', produit.id)}>
                                        <Button type="button" variant="outline">
                                            Annuler
                                        </Button>
                                    </Link>
                                    <Button
                                        type="submit"
                                        disabled={processing}
                                        className="bg-yellow-500 hover:bg-yellow-600"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        {processing ? 'Mise à jour...' : 'Mettre à jour'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit;
