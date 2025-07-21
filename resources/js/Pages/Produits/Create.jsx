import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { ArrowLeft, Package, Save } from 'lucide-react';

const Create = ({ unites_mesure }) => {
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        unite_mesure: '',
        prix_unitaire: '',
        description: '',
        stock_initial: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('produits.store'));
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau Produit" />

            <div className="py-6">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-2">
                                    <Package className="h-6 w-6 text-yellow-600" />
                                    <h1 className="text-2xl font-bold text-gray-900">Nouveau Produit</h1>
                                </div>
                                <Link href={route('produits.index')}>
                                    <Button variant="outline">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Retour à la liste
                                    </Button>
                                </Link>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Informations générales */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Informations générales</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
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

                                    {/* Stock initial */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Stock initial</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div>
                                                <Label htmlFor="stock_initial">Quantité initiale</Label>
                                                <Input
                                                    id="stock_initial"
                                                    type="number"
                                                    min="0"
                                                    value={data.stock_initial}
                                                    onChange={(e) => setData('stock_initial', e.target.value)}
                                                    className={errors.stock_initial ? 'border-red-500' : ''}
                                                    placeholder="0"
                                                />
                                                {errors.stock_initial && (
                                                    <p className="text-red-500 text-sm mt-1">{errors.stock_initial}</p>
                                                )}
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Laissez vide ou 0 si aucun stock initial
                                                </p>
                                            </div>

                                            <div className="bg-yellow-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-yellow-800 mb-2">Information</h4>
                                                <p className="text-sm text-yellow-700">
                                                    Si vous entrez une quantité, un stock sera automatiquement créé
                                                    avec la référence "Fabrication" (produit fabriqué en interne).
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Actions */}
                                <div className="flex justify-end space-x-4 pt-6 border-t">
                                    <Link href={route('produits.index')}>
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
                                        {processing ? 'Création...' : 'Créer le produit'}
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

export default Create;
