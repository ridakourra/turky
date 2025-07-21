import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Edit, User, Phone, MapPin, DollarSign, ShoppingCart, Truck, Plus, Calendar, FileText } from 'lucide-react';

export default function Show({ 
    client, 
    dettesCalculees, 
    commandes, 
    locationsActuelles, 
    locations, 
    vehicules, 
    chauffeurs, 
    enginsLourds 
}) {
    const [showCommandeDialog, setShowCommandeDialog] = useState(false);
    const [showLocationDialog, setShowLocationDialog] = useState(false);

    const { data: commandeData, setData: setCommandeData, post: postCommande, processing: processingCommande, errors: commandeErrors, reset: resetCommande } = useForm({
        date_commande: '',
        vehicule_id: '',
        chauffeur_id: '',
        commentaire: ''
    });

    const { data: locationData, setData: setLocationData, post: postLocation, processing: processingLocation, errors: locationErrors, reset: resetLocation } = useForm({
        engin_id: '',
        date_debut: '',
        date_fin: '',
        prix_location: '',
        commentaire: ''
    });

    const handleCommandeSubmit = (e) => {
        e.preventDefault();
        postCommande(`/clients/${client.id}/commandes`, {
            onSuccess: () => {
                setShowCommandeDialog(false);
                resetCommande();
            }
        });
    };

    const handleLocationSubmit = (e) => {
        e.preventDefault();
        postLocation(`/clients/${client.id}/locations`, {
            onSuccess: () => {
                setShowLocationDialog(false);
                resetLocation();
            }
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const getStatutBadge = (statut) => {
        const variants = {
            'en_cours': 'default',
            'termine': 'secondary',
            'annule': 'destructive',
            'paye': 'default',
            'non_paye': 'destructive',
            'partiellement_paye': 'secondary'
        };
        return <Badge variant={variants[statut] || 'outline'}>{statut.replace('_', ' ')}</Badge>;
    };

    return (
        <AdminLayout>
            <Head title={client.nom_complet} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/clients">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{client.nom_complet}</h1>
                            <p className="text-gray-600 mt-1">Détails du client</p>
                        </div>
                    </div>
                    <Link href={`/clients/${client.id}/edit`}>
                        <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                            <Edit className="h-4 w-4" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {/* Client Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Informations</CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <Phone className="h-3 w-3" />
                                    <span>{client.telephone || 'Non renseigné'}</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <MapPin className="h-3 w-3 mt-0.5" />
                                    <span className="text-xs">{client.addresse || 'Non renseignée'}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Dettes Actuelles</CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(client.dettes_actuelle)}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Calculées: {formatCurrency(dettesCalculees)}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes</CardTitle>
                            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{commandes.total}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Total des commandes
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Locations Actives</CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{locationsActuelles.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Engins en cours
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Current Rentals */}
                {locationsActuelles.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Locations d'Engins Lourds en Cours
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {locationsActuelles.map((location) => (
                                    <Card key={location.id} className="border-l-4 border-l-yellow-500">
                                        <CardContent className="pt-4">
                                            <div className="space-y-2">
                                                <h4 className="font-semibold">{location.engin?.nom || 'Engin inconnu'}</h4>
                                                <div className="text-sm text-gray-600 space-y-1">
                                                    <p><strong>Début:</strong> {formatDate(location.date_debut)}</p>
                                                    <p><strong>Fin:</strong> {formatDate(location.date_fin)}</p>
                                                    <p><strong>Prix:</strong> {formatCurrency(location.prix_location)}</p>
                                                </div>
                                                {getStatutBadge(location.statut)}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Orders Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5" />
                                Commandes du Client
                            </CardTitle>
                            <Dialog open={showCommandeDialog} onOpenChange={setShowCommandeDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                        <Plus className="h-4 w-4" />
                                        Nouvelle Commande
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Nouvelle Commande</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleCommandeSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="date_commande">Date de Commande *</Label>
                                            <Input
                                                id="date_commande"
                                                type="date"
                                                value={commandeData.date_commande}
                                                onChange={(e) => setCommandeData('date_commande', e.target.value)}
                                                className={commandeErrors.date_commande ? 'border-red-500' : ''}
                                            />
                                            {commandeErrors.date_commande && (
                                                <p className="text-sm text-red-600">{commandeErrors.date_commande}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="vehicule_id">Véhicule *</Label>
                                            <Select value={commandeData.vehicule_id} onValueChange={(value) => setCommandeData('vehicule_id', value)}>
                                                <SelectTrigger className={commandeErrors.vehicule_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Sélectionner un véhicule" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vehicules.map((vehicule) => (
                                                        <SelectItem key={vehicule.id} value={vehicule.id.toString()}>
                                                            {vehicule.marque} {vehicule.modele} - {vehicule.immatriculation}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {commandeErrors.vehicule_id && (
                                                <p className="text-sm text-red-600">{commandeErrors.vehicule_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="chauffeur_id">Chauffeur *</Label>
                                            <Select value={commandeData.chauffeur_id} onValueChange={(value) => setCommandeData('chauffeur_id', value)}>
                                                <SelectTrigger className={commandeErrors.chauffeur_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Sélectionner un chauffeur" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {chauffeurs.map((chauffeur) => (
                                                        <SelectItem key={chauffeur.id} value={chauffeur.id.toString()}>
                                                            {chauffeur.nom} {chauffeur.prenom}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {commandeErrors.chauffeur_id && (
                                                <p className="text-sm text-red-600">{commandeErrors.chauffeur_id}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="commentaire_commande">Commentaire</Label>
                                            <Textarea
                                                id="commentaire_commande"
                                                value={commandeData.commentaire}
                                                onChange={(e) => setCommandeData('commentaire', e.target.value)}
                                                placeholder="Commentaire optionnel"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button type="submit" disabled={processingCommande} className="bg-yellow-500 hover:bg-yellow-600">
                                                {processingCommande ? 'Création...' : 'Créer'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setShowCommandeDialog(false)}>
                                                Annuler
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {commandes.data.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Aucune commande trouvée</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Véhicule</TableHead>
                                        <TableHead>Chauffeur</TableHead>
                                        <TableHead>Montant</TableHead>
                                        <TableHead>Paiement</TableHead>
                                        <TableHead>Commentaire</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {commandes.data.map((commande) => (
                                        <TableRow key={commande.id}>
                                            <TableCell>{formatDate(commande.date_commande)}</TableCell>
                                            <TableCell>
                                                {commande.vehicule ? 
                                                    `${commande.vehicule.marque} ${commande.vehicule.modele}` : 
                                                    'Non assigné'
                                                }
                                            </TableCell>
                                            <TableCell>
                                                {commande.chauffeur ? 
                                                    `${commande.chauffeur.nom} ${commande.chauffeur.prenom}` : 
                                                    'Non assigné'
                                                }
                                            </TableCell>
                                            <TableCell>{formatCurrency(commande.montant_total)}</TableCell>
                                            <TableCell>
                                                {commande.paiement ? 
                                                    getStatutBadge(commande.paiement.statut) : 
                                                    <Badge variant="outline">Aucun paiement</Badge>
                                                }
                                            </TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {commande.commentaire || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination for orders */}
                        {commandes.last_page > 1 && (
                            <div className="flex justify-center mt-4">
                                <div className="flex items-center space-x-2">
                                    {commandes.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <Button key={index} variant="outline" disabled size="sm">
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Link key={index} href={link.url}>
                                                <Button
                                                    variant={link.active ? "default" : "outline"}
                                                    className={link.active ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                                    size="sm"
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Equipment Rentals Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Historique des Locations d'Engins Lourds
                            </CardTitle>
                            <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                        <Plus className="h-4 w-4" />
                                        Nouvelle Location
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Nouvelle Location d'Engin Lourd</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleLocationSubmit} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="engin_id">Engin Lourd *</Label>
                                            <Select value={locationData.engin_id} onValueChange={(value) => setLocationData('engin_id', value)}>
                                                <SelectTrigger className={locationErrors.engin_id ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Sélectionner un engin" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {enginsLourds.map((engin) => (
                                                        <SelectItem key={engin.id} value={engin.id.toString()}>
                                                            {engin.nom} - {engin.marque} {engin.modele}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {locationErrors.engin_id && (
                                                <p className="text-sm text-red-600">{locationErrors.engin_id}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="date_debut">Date Début *</Label>
                                                <Input
                                                    id="date_debut"
                                                    type="date"
                                                    value={locationData.date_debut}
                                                    onChange={(e) => setLocationData('date_debut', e.target.value)}
                                                    className={locationErrors.date_debut ? 'border-red-500' : ''}
                                                />
                                                {locationErrors.date_debut && (
                                                    <p className="text-sm text-red-600">{locationErrors.date_debut}</p>
                                                )}
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="date_fin">Date Fin *</Label>
                                                <Input
                                                    id="date_fin"
                                                    type="date"
                                                    value={locationData.date_fin}
                                                    onChange={(e) => setLocationData('date_fin', e.target.value)}
                                                    className={locationErrors.date_fin ? 'border-red-500' : ''}
                                                />
                                                {locationErrors.date_fin && (
                                                    <p className="text-sm text-red-600">{locationErrors.date_fin}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="prix_location">Prix de Location (MAD) *</Label>
                                            <Input
                                                id="prix_location"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={locationData.prix_location}
                                                onChange={(e) => setLocationData('prix_location', e.target.value)}
                                                placeholder="0.00"
                                                className={locationErrors.prix_location ? 'border-red-500' : ''}
                                            />
                                            {locationErrors.prix_location && (
                                                <p className="text-sm text-red-600">{locationErrors.prix_location}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="commentaire_location">Commentaire</Label>
                                            <Textarea
                                                id="commentaire_location"
                                                value={locationData.commentaire}
                                                onChange={(e) => setLocationData('commentaire', e.target.value)}
                                                placeholder="Commentaire optionnel"
                                                rows={3}
                                            />
                                        </div>

                                        <div className="flex gap-2 pt-4">
                                            <Button type="submit" disabled={processingLocation} className="bg-yellow-500 hover:bg-yellow-600">
                                                {processingLocation ? 'Création...' : 'Créer'}
                                            </Button>
                                            <Button type="button" variant="outline" onClick={() => setShowLocationDialog(false)}>
                                                Annuler
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {locations.data.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">Aucune location trouvée</p>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Engin</TableHead>
                                        <TableHead>Date Début</TableHead>
                                        <TableHead>Date Fin</TableHead>
                                        <TableHead>Prix</TableHead>
                                        <TableHead>Statut</TableHead>
                                        <TableHead>Commentaire</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {locations.data.map((location) => (
                                        <TableRow key={location.id}>
                                            <TableCell>
                                                {location.engin ? 
                                                    `${location.engin.nom} - ${location.engin.marque}` : 
                                                    'Engin inconnu'
                                                }
                                            </TableCell>
                                            <TableCell>{formatDate(location.date_debut)}</TableCell>
                                            <TableCell>{formatDate(location.date_fin)}</TableCell>
                                            <TableCell>{formatCurrency(location.prix_location)}</TableCell>
                                            <TableCell>{getStatutBadge(location.statut)}</TableCell>
                                            <TableCell className="max-w-xs truncate">
                                                {location.commentaire || '-'}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}

                        {/* Pagination for locations */}
                        {locations.last_page > 1 && (
                            <div className="flex justify-center mt-4">
                                <div className="flex items-center space-x-2">
                                    {locations.links.map((link, index) => {
                                        if (link.url === null) {
                                            return (
                                                <Button key={index} variant="outline" disabled size="sm">
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            );
                                        }

                                        return (
                                            <Link key={index} href={link.url}>
                                                <Button
                                                    variant={link.active ? "default" : "outline"}
                                                    className={link.active ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                                                    size="sm"
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Button>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}