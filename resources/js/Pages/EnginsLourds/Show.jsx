import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { ArrowLeft, Edit, Plus, DollarSign, Fuel, Calendar, User, MapPin, Wrench, TrendingUp, Activity } from 'lucide-react';

export default function Show({ enginLourd, clients, carburant, statistiques }) {
    const [depenseDialog, setDepenseDialog] = useState(false);
    const [carburantDialog, setCarburantDialog] = useState(false);

    const { data: depenseData, setData: setDepenseData, post: postDepense, processing: processingDepense, errors: depenseErrors, reset: resetDepense } = useForm({
        type_depense: '',
        montant: '',
        date_depense: new Date().toISOString().split('T')[0],
        description: '',
        facture_reference: ''
    });

    const { data: carburantData, setData: setCarburantData, post: postCarburant, processing: processingCarburant, errors: carburantErrors, reset: resetCarburant } = useForm({
        quantite: '',
        date_utilisation: new Date().toISOString().split('T')[0],
        commentaire: ''
    });

    const handleDepenseSubmit = (e) => {
        e.preventDefault();
        postDepense(route('engins-lourds.add-depense', enginLourd.id), {
            onSuccess: () => {
                setDepenseDialog(false);
                resetDepense();
            }
        });
    };

    const handleCarburantSubmit = (e) => {
        e.preventDefault();
        postCarburant(route('engins-lourds.add-carburant', enginLourd.id), {
            onSuccess: () => {
                setCarburantDialog(false);
                resetCarburant();
            }
        });
    };

    const getStatutBadge = (statut) => {
        const variants = {
            'actif': 'bg-green-100 text-green-800',
            'en_maintenance': 'bg-yellow-100 text-yellow-800',
            'hors_service': 'bg-red-100 text-red-800'
        };
        return variants[statut] || 'bg-gray-100 text-gray-800';
    };

    const getStatutLabel = (statut) => {
        const labels = {
            'actif': 'Actif',
            'en_maintenance': 'En maintenance',
            'hors_service': 'Hors service'
        };
        return labels[statut] || statut;
    };

    const getTypeEnginLabel = (type) => {
        const labels = {
            'pelleteuse': 'Pelleteuse',
            'bulldozer': 'Bulldozer',
            'grue': 'Grue',
            'autre': 'Autre'
        };
        return labels[type] || type;
    };

    const getTypeDepenseLabel = (type) => {
        const labels = {
            'carburant': 'Carburant',
            'maintenance': 'Maintenance',
            'reparation': 'Réparation',
            'assurance': 'Assurance',
            'autre': 'Autre'
        };
        return labels[type] || type;
    };

    return (
        <AdminLayout>
            <Head title={`Engin ${enginLourd.reference}`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Activity className="h-6 w-6 text-yellow-600" />
                        <h1 className="text-2xl font-bold text-gray-900">
                            Engin {enginLourd.reference}
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={route('engins-lourds.edit', enginLourd.id)}>
                            <Button variant="outline">
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <Link href={route('engins-lourds.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Informations générales */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Activity className="h-5 w-5 text-yellow-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Référence</p>
                                    <p className="text-lg font-bold">{enginLourd.reference}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <Wrench className="h-5 w-5 text-blue-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Type</p>
                                    <p className="text-lg font-bold">{getTypeEnginLabel(enginLourd.type_engin)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Statut</p>
                                    <Badge className={getStatutBadge(enginLourd.statut)}>
                                        {getStatutLabel(enginLourd.statut)}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="h-5 w-5 text-purple-600" />
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Capacité</p>
                                    <p className="text-lg font-bold">{enginLourd.capacite ? `${enginLourd.capacite} T` : 'N/A'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-blue-600">{statistiques?.total_locations || 0}</p>
                                <p className="text-sm text-gray-600">Locations totales</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-green-600">{statistiques?.revenus_locations?.toFixed(2) || '0.00'} MAD</p>
                                <p className="text-sm text-gray-600">Revenus locations</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-red-600">{statistiques?.total_depenses?.toFixed(2) || '0.00'} MAD</p>
                                <p className="text-sm text-gray-600">Dépenses totales</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-yellow-600">{statistiques?.total_carburant?.toFixed(2) || '0.00'} L</p>
                                <p className="text-sm text-gray-600">Carburant utilisé</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Détails et Actions */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Informations détaillées */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations détaillées</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Marque</Label>
                                        <p className="text-sm">{enginLourd.marque}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Modèle</Label>
                                        <p className="text-sm">{enginLourd.modele || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Date d'acquisition</Label>
                                        <p className="text-sm">
                                            {enginLourd.date_acquisition ? new Date(enginLourd.date_acquisition).toLocaleDateString('fr-FR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-600">Prix d'acquisition</Label>
                                        <p className="text-sm">
                                            {enginLourd.prix_acquisition ? `${parseFloat(enginLourd.prix_acquisition).toFixed(2)} MAD` : 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Actions rapides */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions rapides</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Dialog open={depenseDialog} onOpenChange={setDepenseDialog}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-red-600 hover:bg-red-700">
                                            <Plus className="h-4 w-4 mr-2" />
                                            Ajouter une dépense
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ajouter une dépense</DialogTitle>
                                            <DialogDescription>
                                                Enregistrer une nouvelle dépense pour cet engin lourd.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleDepenseSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="type_depense">Type de dépense *</Label>
                                                <Select value={depenseData.type_depense} onValueChange={(value) => setDepenseData('type_depense', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner le type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="carburant">Carburant</SelectItem>
                                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                                        <SelectItem value="reparation">Réparation</SelectItem>
                                                        <SelectItem value="assurance">Assurance</SelectItem>
                                                        <SelectItem value="autre">Autre</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                {depenseErrors.type_depense && (
                                                    <p className="text-sm text-red-600">{depenseErrors.type_depense}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="montant">Montant (MAD) *</Label>
                                                <Input
                                                    id="montant"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={depenseData.montant}
                                                    onChange={(e) => setDepenseData('montant', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {depenseErrors.montant && (
                                                    <p className="text-sm text-red-600">{depenseErrors.montant}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="date_depense">Date de dépense *</Label>
                                                <Input
                                                    id="date_depense"
                                                    type="date"
                                                    value={depenseData.date_depense}
                                                    onChange={(e) => setDepenseData('date_depense', e.target.value)}
                                                />
                                                {depenseErrors.date_depense && (
                                                    <p className="text-sm text-red-600">{depenseErrors.date_depense}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Textarea
                                                    id="description"
                                                    value={depenseData.description}
                                                    onChange={(e) => setDepenseData('description', e.target.value)}
                                                    placeholder="Description de la dépense..."
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="facture_reference">Référence facture</Label>
                                                <Input
                                                    id="facture_reference"
                                                    type="text"
                                                    value={depenseData.facture_reference}
                                                    onChange={(e) => setDepenseData('facture_reference', e.target.value)}
                                                    placeholder="Numéro de facture"
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setDepenseDialog(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" disabled={processingDepense} className="bg-red-600 hover:bg-red-700">
                                                    {processingDepense ? 'Ajout...' : 'Ajouter'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>

                                <Dialog open={carburantDialog} onOpenChange={setCarburantDialog}>
                                    <DialogTrigger asChild>
                                        <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                                            <Fuel className="h-4 w-4 mr-2" />
                                            Ajouter du carburant
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Ajouter du carburant</DialogTitle>
                                            <DialogDescription>
                                                Enregistrer l'utilisation de carburant pour cet engin lourd.
                                                <br />
                                                <span className="text-sm text-gray-600">
                                                    Niveau actuel: {carburant?.niveau_actuel || 0} L / {carburant?.capacite_maximale || 0} L
                                                </span>
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleCarburantSubmit} className="space-y-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="quantite">Quantité (litres) *</Label>
                                                <Input
                                                    id="quantite"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    max={carburant?.niveau_actuel || 0}
                                                    value={carburantData.quantite}
                                                    onChange={(e) => setCarburantData('quantite', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {carburantErrors.quantite && (
                                                    <p className="text-sm text-red-600">{carburantErrors.quantite}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="date_utilisation">Date d'utilisation *</Label>
                                                <Input
                                                    id="date_utilisation"
                                                    type="date"
                                                    value={carburantData.date_utilisation}
                                                    onChange={(e) => setCarburantData('date_utilisation', e.target.value)}
                                                />
                                                {carburantErrors.date_utilisation && (
                                                    <p className="text-sm text-red-600">{carburantErrors.date_utilisation}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="commentaire">Commentaire</Label>
                                                <Textarea
                                                    id="commentaire"
                                                    value={carburantData.commentaire}
                                                    onChange={(e) => setCarburantData('commentaire', e.target.value)}
                                                    placeholder="Commentaire sur l'utilisation..."
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button type="button" variant="outline" onClick={() => setCarburantDialog(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" disabled={processingCarburant} className="bg-yellow-600 hover:bg-yellow-700">
                                                    {processingCarburant ? 'Ajout...' : 'Ajouter'}
                                                </Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Historique */}
                <Tabs defaultValue="locations" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="locations">Locations</TabsTrigger>
                        <TabsTrigger value="depenses">Dépenses</TabsTrigger>
                        <TabsTrigger value="carburant">Carburant</TabsTrigger>
                    </TabsList>

                    <TabsContent value="locations">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historique des locations</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {enginLourd.locations_engins_lourds?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Client</TableHead>
                                                <TableHead>Date début</TableHead>
                                                <TableHead>Date fin</TableHead>
                                                <TableHead>Prix</TableHead>
                                                <TableHead>Statut</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enginLourd.locations_engins_lourds.map((location) => (
                                                <TableRow key={location.id}>
                                                    <TableCell>{location.client?.nom_complet}</TableCell>
                                                    <TableCell>{new Date(location.date_debut).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell>{location.date_fin ? new Date(location.date_fin).toLocaleDateString('fr-FR') : 'En cours'}</TableCell>
                                                    <TableCell>{parseFloat(location.prix_location).toFixed(2)} MAD</TableCell>
                                                    <TableCell>
                                                        <Badge className={location.statut === 'en_cours' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                                            {location.statut === 'en_cours' ? 'En cours' : location.statut}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Aucune location enregistrée</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="depenses">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historique des dépenses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {enginLourd.depenses_machines?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Montant</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Facture</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enginLourd.depenses_machines.map((depense) => (
                                                <TableRow key={depense.id}>
                                                    <TableCell>
                                                        <Badge>{getTypeDepenseLabel(depense.type_depense)}</Badge>
                                                    </TableCell>
                                                    <TableCell>{parseFloat(depense.montant).toFixed(2)} MAD</TableCell>
                                                    <TableCell>{new Date(depense.date_depense).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell>{depense.description || '-'}</TableCell>
                                                    <TableCell>{depense.facture_reference || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Aucune dépense enregistrée</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="carburant">
                        <Card>
                            <CardHeader>
                                <CardTitle>Historique du carburant</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {enginLourd.utilisations_carburant?.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Commentaire</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {enginLourd.utilisations_carburant.map((utilisation) => (
                                                <TableRow key={utilisation.id}>
                                                    <TableCell>{parseFloat(utilisation.quantite).toFixed(2)} L</TableCell>
                                                    <TableCell>{new Date(utilisation.date_utilisation).toLocaleDateString('fr-FR')}</TableCell>
                                                    <TableCell>{utilisation.commentaire || '-'}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <p className="text-center text-gray-500 py-4">Aucune utilisation de carburant enregistrée</p>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}