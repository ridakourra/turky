import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { ArrowLeft, Edit, Plus, Fuel, Receipt, Calendar, DollarSign, Truck, User, Wrench } from 'lucide-react';

export default function Show({ vehicule, commandesClients, depensesMachines, utilisationsCarburant, carburants, stats }) {
    const [showDepenseDialog, setShowDepenseDialog] = useState(false);
    const [showCarburantDialog, setShowCarburantDialog] = useState(false);

    const { data: depenseData, setData: setDepenseData, post: postDepense, processing: processingDepense, errors: depenseErrors, reset: resetDepense } = useForm({
        type_depense: '',
        montant: '',
        description: '',
        date_depense: new Date().toISOString().split('T')[0]
    });

    const { data: carburantData, setData: setCarburantData, post: postCarburant, processing: processingCarburant, errors: carburantErrors, reset: resetCarburant } = useForm({
        carburant_id: '',
        quantite: '',
        prix_unitaire: '',
        date_utilisation: new Date().toISOString().split('T')[0]
    });

    const handleDepenseSubmit = (e) => {
        e.preventDefault();
        postDepense(route('vehicules.depenses.store', vehicule.id), {
            onSuccess: () => {
                setShowDepenseDialog(false);
                resetDepense();
            }
        });
    };

    const handleCarburantSubmit = (e) => {
        e.preventDefault();
        postCarburant(route('vehicules.refill-carburant', vehicule.id), {
            onSuccess: () => {
                setShowCarburantDialog(false);
                resetCarburant();
            }
        });
    };

    const getStatutBadgeColor = (statut) => {
        const colors = {
            actif: 'bg-green-500',
            en_maintenance: 'bg-yellow-500',
            hors_service: 'bg-red-500'
        };
        return colors[statut] || 'bg-gray-500';
    };

    const getTypeBadgeColor = (type) => {
        const colors = {
            camion: 'bg-blue-500',
            voiture: 'bg-purple-500',
            autre: 'bg-gray-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    return (
        <AdminLayout>
            <Head title={`Véhicule ${vehicule.matricule}`} />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Truck className="w-8 h-8 text-yellow-500" />
                        <h1 className="text-3xl font-bold text-gray-900">
                            Véhicule {vehicule.matricule}
                        </h1>
                    </div>
                    <div className="flex space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('vehicules.edit', vehicule.id))}
                        >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.get(route('vehicules.index'))}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour à la liste
                        </Button>
                    </div>
                </div>

                {/* Informations du véhicule */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations générales</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Matricule</Label>
                                        <p className="text-lg font-semibold">{vehicule.matricule}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Type</Label>
                                        <div className="mt-1">
                                            <Badge className={`${getTypeBadgeColor(vehicule.type_vehicule)} text-white`}>
                                                {vehicule.type_vehicule}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Marque</Label>
                                        <p className="text-lg">{vehicule.marque}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Modèle</Label>
                                        <p className="text-lg">{vehicule.modele || 'Non spécifié'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Année</Label>
                                        <p className="text-lg">{vehicule.annee || 'Non spécifiée'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Capacité</Label>
                                        <p className="text-lg">{vehicule.capacite ? `${vehicule.capacite} T` : 'Non spécifiée'}</p>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Statut</Label>
                                        <div className="mt-1">
                                            <Badge className={`${getStatutBadgeColor(vehicule.statut)} text-white`}>
                                                {vehicule.statut?.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium text-gray-500">Chauffeur</Label>
                                        <div className="flex items-center mt-1">
                                            {vehicule.chauffeur ? (
                                                <div className="flex items-center space-x-2">
                                                    <User className="w-4 h-4 text-gray-500" />
                                                    <div>
                                                        <p className="font-medium">{vehicule.chauffeur.nom_complet}</p>
                                                        <p className="text-sm text-gray-500">{vehicule.chauffeur.telephone}</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-gray-500">Non assigné</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {vehicule.description && (
                                    <div className="mt-4">
                                        <Label className="text-sm font-medium text-gray-500">Description</Label>
                                        <p className="mt-1 text-gray-700">{vehicule.description}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Statistiques */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Statistiques</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Receipt className="w-5 h-5 text-blue-500" />
                                        <span className="text-sm font-medium">Commandes</span>
                                    </div>
                                    <span className="text-lg font-bold text-blue-600">{stats?.total_commandes || 0}</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <DollarSign className="w-5 h-5 text-red-500" />
                                        <span className="text-sm font-medium">Dépenses totales</span>
                                    </div>
                                    <span className="text-lg font-bold text-red-600">{stats?.total_depenses || 0} DT</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                                    <div className="flex items-center space-x-2">
                                        <Fuel className="w-5 h-5 text-green-500" />
                                        <span className="text-sm font-medium">Carburant utilisé</span>
                                    </div>
                                    <span className="text-lg font-bold text-green-600">{stats?.total_carburant || 0} L</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Actions rapides */}
                <div className="flex space-x-4">
                    <Dialog open={showDepenseDialog} onOpenChange={setShowDepenseDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-red-500 hover:bg-red-600">
                                <Receipt className="w-4 h-4 mr-2" />
                                Ajouter une dépense
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Nouvelle dépense</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleDepenseSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="type_depense">Type de dépense *</Label>
                                    <Select value={depenseData.type_depense} onValueChange={(value) => setDepenseData('type_depense', value)}>
                                        <SelectTrigger className={depenseErrors.type_depense ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner le type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                            <SelectItem value="reparation">Réparation</SelectItem>
                                            <SelectItem value="pieces">Pièces de rechange</SelectItem>
                                            <SelectItem value="assurance">Assurance</SelectItem>
                                            <SelectItem value="autre">Autre</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {depenseErrors.type_depense && (
                                        <p className="text-red-500 text-sm mt-1">{depenseErrors.type_depense}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="montant">Montant (DT) *</Label>
                                    <Input
                                        id="montant"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={depenseData.montant}
                                        onChange={(e) => setDepenseData('montant', e.target.value)}
                                        className={depenseErrors.montant ? 'border-red-500' : ''}
                                    />
                                    {depenseErrors.montant && (
                                        <p className="text-red-500 text-sm mt-1">{depenseErrors.montant}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date_depense">Date *</Label>
                                    <Input
                                        id="date_depense"
                                        type="date"
                                        value={depenseData.date_depense}
                                        onChange={(e) => setDepenseData('date_depense', e.target.value)}
                                        className={depenseErrors.date_depense ? 'border-red-500' : ''}
                                    />
                                    {depenseErrors.date_depense && (
                                        <p className="text-red-500 text-sm mt-1">{depenseErrors.date_depense}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={depenseData.description}
                                        onChange={(e) => setDepenseData('description', e.target.value)}
                                        placeholder="Description de la dépense"
                                        rows={3}
                                    />
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setShowDepenseDialog(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={processingDepense} className="bg-red-500 hover:bg-red-600">
                                        {processingDepense ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={showCarburantDialog} onOpenChange={setShowCarburantDialog}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-500 hover:bg-green-600">
                                <Fuel className="w-4 h-4 mr-2" />
                                Faire le plein
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Faire le plein</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCarburantSubmit} className="space-y-4">

                                <div>
                                    <Label htmlFor="quantite">Quantité (L) *</Label>
                                    <Input
                                        id="quantite"
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={carburantData.quantite}
                                        onChange={(e) => setCarburantData('quantite', e.target.value)}
                                        className={carburantErrors.quantite ? 'border-red-500' : ''}
                                    />
                                    {carburantErrors.quantite && (
                                        <p className="text-red-500 text-sm mt-1">{carburantErrors.quantite}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date_utilisation">Date *</Label>
                                    <Input
                                        id="date_utilisation"
                                        type="date"
                                        value={carburantData.date_utilisation}
                                        onChange={(e) => setCarburantData('date_utilisation', e.target.value)}
                                        className={carburantErrors.date_utilisation ? 'border-red-500' : ''}
                                    />
                                    {carburantErrors.date_utilisation && (
                                        <p className="text-red-500 text-sm mt-1">{carburantErrors.date_utilisation}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-2">
                                    <Button type="button" variant="outline" onClick={() => setShowCarburantDialog(false)}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" disabled={processingCarburant} className="bg-green-500 hover:bg-green-600">
                                        {processingCarburant ? 'Enregistrement...' : 'Enregistrer'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Commandes clients */}
                <Card>
                    <CardHeader>
                        <CardTitle>Commandes clients récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {commandesClients?.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Numéro</TableHead>
                                        <TableHead>Client</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Montant</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandesClients.map((commande) => (
                                        <TableRow key={commande.id}>
                                            <TableCell className="font-medium">{commande.numero_commande}</TableCell>
                                            <TableCell>{commande.client?.nom}</TableCell>
                                            <TableCell>{new Date(commande.date_commande).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell>
                                                <Badge className={commande.statut === 'livree' ? 'bg-green-500' : 'bg-yellow-500'}>
                                                    {commande.statut}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{commande.montant_total} DT</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Aucune commande trouvée</p>
                        )}
                    </CardContent>
                </Card>

                {/* Dépenses */}
                <Card>
                    <CardHeader>
                        <CardTitle>Dépenses récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {depensesMachines?.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Description</TableHead>
                                        <TableHead>Montant</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {depensesMachines.map((depense) => (
                                        <TableRow key={depense.id}>
                                            <TableCell>{new Date(depense.date_depense).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell>
                                                <Badge className="bg-red-500 text-white">
                                                    {depense.type_depense}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{depense.description || '-'}</TableCell>
                                            <TableCell className="font-medium">{depense.montant} DT</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Aucune dépense trouvée</p>
                        )}
                    </CardContent>
                </Card>

                {/* Utilisation carburant */}
                <Card>
                    <CardHeader>
                        <CardTitle>Utilisation carburant récente</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {utilisationsCarburant?.length > 0 ? (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Type carburant</TableHead>
                                        <TableHead>Quantité</TableHead>
                                        <TableHead>Prix unitaire</TableHead>
                                        <TableHead>Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {utilisationsCarburant.map((utilisation) => (
                                        <TableRow key={utilisation.id}>
                                            <TableCell>{new Date(utilisation.date_utilisation).toLocaleDateString('fr-FR')}</TableCell>
                                            <TableCell>{utilisation.carburant?.type_carburant}</TableCell>
                                            <TableCell>{utilisation.quantite} L</TableCell>
                                            <TableCell>{utilisation.prix_unitaire} DT/L</TableCell>
                                            <TableCell className="font-medium">{(utilisation.quantite * utilisation.prix_unitaire).toFixed(2)} DT</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <p className="text-gray-500 text-center py-4">Aucune utilisation de carburant trouvée</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
