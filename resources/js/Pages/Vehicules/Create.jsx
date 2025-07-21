import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { ArrowLeft, Save, Truck } from 'lucide-react';

export default function Create({ employees }) {
    const { data, setData, post, processing, errors } = useForm({
        matricule: '',
        marque: '',
        modele: '',
        annee: '',
        type_vehicule: '',
        capacite: '',
        statut: 'actif',
        chauffeur_id: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('vehicules.store'));
    };

    const chauffeurs = employees?.filter(emp => emp.role === 'chauffeur') || [];

    return (
        <AdminLayout>
            <Head title="Nouveau véhicule" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Truck className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-3xl font-bold text-gray-900">Nouveau véhicule</h1>
                    </div>
                    <Button
                        variant="outline"
                        onClick={() => router.get(route('vehicules.index'))}
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Retour à la liste
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations générales */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations générales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="matricule">Matricule *</Label>
                                    <Input
                                        id="matricule"
                                        type="text"
                                        value={data.matricule}
                                        onChange={(e) => setData('matricule', e.target.value)}
                                        placeholder="Ex: ABC-123-TN"
                                        className={errors.matricule ? 'border-red-500' : ''}
                                    />
                                    {errors.matricule && (
                                        <p className="text-red-500 text-sm mt-1">{errors.matricule}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="type_vehicule">Type de véhicule *</Label>
                                    <Select value={data.type_vehicule} onValueChange={(value) => setData('type_vehicule', value)}>
                                        <SelectTrigger className={errors.type_vehicule ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="camion">Camion</SelectItem>
                                            <SelectItem value="voiture">Voiture</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.type_vehicule && (
                                        <p className="text-red-500 text-sm mt-1">{errors.type_vehicule}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="marque">Marque *</Label>
                                    <Input
                                        id="marque"
                                        type="text"
                                        value={data.marque}
                                        onChange={(e) => setData('marque', e.target.value)}
                                        placeholder="Ex: Mercedes, Volvo, Toyota"
                                        className={errors.marque ? 'border-red-500' : ''}
                                    />
                                    {errors.marque && (
                                        <p className="text-red-500 text-sm mt-1">{errors.marque}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="modele">Modèle</Label>
                                    <Input
                                        id="modele"
                                        type="text"
                                        value={data.modele}
                                        onChange={(e) => setData('modele', e.target.value)}
                                        placeholder="Ex: Actros, FH, Corolla"
                                        className={errors.modele ? 'border-red-500' : ''}
                                    />
                                    {errors.modele && (
                                        <p className="text-red-500 text-sm mt-1">{errors.modele}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="annee">Année</Label>
                                    <Input
                                        id="annee"
                                        type="number"
                                        min="1900"
                                        max={new Date().getFullYear() + 1}
                                        value={data.annee}
                                        onChange={(e) => setData('annee', e.target.value)}
                                        placeholder="Ex: 2020"
                                        className={errors.annee ? 'border-red-500' : ''}
                                    />
                                    {errors.annee && (
                                        <p className="text-red-500 text-sm mt-1">{errors.annee}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="capacite">Capacité (tonnes)</Label>
                                    <Input
                                        id="capacite"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={data.capacite}
                                        onChange={(e) => setData('capacite', e.target.value)}
                                        placeholder="Ex: 3.5"
                                        className={errors.capacite ? 'border-red-500' : ''}
                                    />
                                    {errors.capacite && (
                                        <p className="text-red-500 text-sm mt-1">{errors.capacite}</p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Description du véhicule, équipements spéciaux, etc."
                                    rows={3}
                                    className={errors.description ? 'border-red-500' : ''}
                                />
                                {errors.description && (
                                    <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Statut et assignation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Statut et assignation</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="statut">Statut *</Label>
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
                                        <p className="text-red-500 text-sm mt-1">{errors.statut}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="chauffeur_id">Chauffeur assigné</Label>
                                    <Select value={data.chauffeur_id} onValueChange={(value) => setData('chauffeur_id', value === 'none' ? '' : value)}>
                                        <SelectTrigger className={errors.chauffeur_id ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner un chauffeur" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">Aucun chauffeur</SelectItem>
                                            {chauffeurs.map((chauffeur) => (
                                                <SelectItem key={chauffeur.id} value={chauffeur.id.toString()}>
                                                    {chauffeur.nom_complet} - {chauffeur.telephone}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.chauffeur_id && (
                                        <p className="text-red-500 text-sm mt-1">{errors.chauffeur_id}</p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route('vehicules.index'))}
                            disabled={processing}
                        >
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-yellow-500 hover:bg-yellow-600"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Enregistrement...' : 'Enregistrer'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
