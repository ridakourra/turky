import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Progress } from '@/Components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/Components/ui/tabs';
import { AlertTriangle, Fuel, Plus, TrendingUp, TrendingDown, Calendar, User, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function CarburantIndex({ carburant, utilisations, livraisons, fournisseurs }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        fournisseur_id: '',
        quantite: '',
        montant_total: '',
        date_livraison: new Date().toISOString().split('T')[0],
        numero_bon: '',
        commentaire: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('carburant.ajouter-livraison'), {
            onSuccess: () => {
                reset();
                setIsDialogOpen(false);
            },
        });
    };

    const formatDate = (date) => {
        return format(new Date(date), 'dd/MM/yyyy', { locale: fr });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatQuantity = (quantity) => {
        return `${quantity} L`;
    };

    const getStatusBadge = (percentage) => {
        if (percentage >= 75) {
            return <Badge className="bg-green-500">Excellent</Badge>;
        } else if (percentage >= 50) {
            return <Badge className="bg-yellow-500">Bon</Badge>;
        } else if (percentage >= 25) {
            return <Badge className="bg-orange-500">Faible</Badge>;
        } else {
            return <Badge className="bg-red-500">Critique</Badge>;
        }
    };

    const getMachineLabel = (utilisation) => {
        if (utilisation.machine_type === 'App\\Models\\Vehicule') {
            return `Véhicule - ${utilisation.machine?.immatriculation || 'N/A'}`;
        } else if (utilisation.machine_type === 'App\\Models\\EnginLourd') {
            return `Engin Lourd - ${utilisation.machine?.reference || 'N/A'}`;
        }
        return 'Machine inconnue';
    };

    const pourcentage = carburant?.niveau_actuel && carburant?.capacite_maximale ?
        (carburant.niveau_actuel / carburant.capacite_maximale) * 100 : 0;
    const isAlerte = carburant?.seuil_alerte && carburant?.niveau_actuel ?
        carburant.niveau_actuel <= carburant.seuil_alerte : false;

    return (
        <AdminLayout>
            <Head title="Gestion du Carburant" />

            <div className="py-12">
                <div className="mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Head Title */}
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            Gestion du Carburant
                        </h2>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-yellow-500 hover:bg-yellow-600">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Nouvelle Livraison
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Ajouter une Livraison de Carburant</DialogTitle>
                                    <DialogDescription>
                                        Enregistrez une nouvelle livraison de carburant dans le système.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="fournisseur_id" className="text-right">
                                                Fournisseur
                                            </Label>
                                            <div className="col-span-3">
                                                <Select
                                                    value={data.fournisseur_id}
                                                    onValueChange={(value) => setData('fournisseur_id', value)}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner un fournisseur" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">Sélectionner un fournisseur</SelectItem>
                                                        {fournisseurs?.map((fournisseur) => (
                                                            <SelectItem key={fournisseur.id} value={fournisseur.id.toString()}>
                                                                {fournisseur.nom_societe}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors.fournisseur_id && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.fournisseur_id}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="quantite" className="text-right">
                                                Quantité (L)
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="quantite"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.quantite}
                                                    onChange={(e) => setData('quantite', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {errors.quantite && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.quantite}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="montant_total" className="text-right">
                                                Montant Total
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="montant_total"
                                                    type="number"
                                                    step="0.01"
                                                    value={data.montant_total}
                                                    onChange={(e) => setData('montant_total', e.target.value)}
                                                    placeholder="0.00"
                                                />
                                                {errors.montant_total && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.montant_total}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="date_livraison" className="text-right">
                                                Date de Livraison
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="date_livraison"
                                                    type="date"
                                                    value={data.date_livraison}
                                                    onChange={(e) => setData('date_livraison', e.target.value)}
                                                />
                                                {errors.date_livraison && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.date_livraison}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="numero_bon" className="text-right">
                                                N° Bon
                                            </Label>
                                            <div className="col-span-3">
                                                <Input
                                                    id="numero_bon"
                                                    value={data.numero_bon}
                                                    onChange={(e) => setData('numero_bon', e.target.value)}
                                                    placeholder="Numéro du bon de livraison"
                                                />
                                                {errors.numero_bon && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.numero_bon}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="commentaire" className="text-right">
                                                Commentaire
                                            </Label>
                                            <div className="col-span-3">
                                                <Textarea
                                                    id="commentaire"
                                                    value={data.commentaire}
                                                    onChange={(e) => setData('commentaire', e.target.value)}
                                                    placeholder="Commentaire optionnel"
                                                    rows={3}
                                                />
                                                {errors.commentaire && (
                                                    <p className="text-sm text-red-600 mt-1">{errors.commentaire}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing} className="bg-yellow-500 hover:bg-yellow-600">
                                            {processing ? 'Ajout...' : 'Ajouter la Livraison'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    {/* Carte de statut du carburant */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Fuel className="h-5 w-5 text-yellow-500" />
                                État du Carburant
                                {isAlerte && (
                                    <Badge className="bg-red-500 ml-2">
                                        <AlertTriangle className="h-3 w-3 mr-1" />
                                        Alerte
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription>
                                Niveau actuel et informations sur le stock de carburant
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm font-medium">Niveau Actuel</span>
                                        {getStatusBadge(pourcentage)}
                                    </div>
                                    <Progress value={pourcentage} className="h-3" />
                                    <div className="flex justify-between text-sm text-gray-600">
                                        <span>{formatQuantity(carburant?.niveau_actuel || 0)}</span>
                                        <span>{formatQuantity(carburant?.capacite_maximale || 0)}</span>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm font-medium">Pourcentage</span>
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {pourcentage.toFixed(1)}%
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <span className="text-sm font-medium">Seuil d'Alerte</span>
                                    <div className="text-lg font-semibold">
                                        {formatQuantity(carburant?.seuil_alerte || 0)}
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Onglets pour les utilisations et livraisons */}
                    <Tabs defaultValue="utilisations" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="utilisations" className="flex items-center gap-2">
                                <TrendingDown className="h-4 w-4" />
                                Utilisations ({utilisations?.data?.length || 0})
                            </TabsTrigger>
                            <TabsTrigger value="livraisons" className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4" />
                                Livraisons ({livraisons?.data?.length || 0})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="utilisations">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Utilisations de Carburant</CardTitle>
                                    <CardDescription>
                                        Historique des consommations de carburant par machine
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Machine</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>Commentaire</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {utilisations?.data?.length > 0 ? (
                                                utilisations.data.map((utilisation) => (
                                                    <TableRow key={utilisation.id}>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            {formatDate(utilisation.date_utilisation)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Fuel className="h-4 w-4 text-yellow-500" />
                                                                {getMachineLabel(utilisation)}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="outline">
                                                                {formatQuantity(utilisation.quantite)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {utilisation.commentaire ? (
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                                    <span className="text-sm">{utilisation.commentaire}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={4} className="text-center text-gray-500">
                                                        Aucune utilisation enregistrée
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination pour utilisations */}
                                    {utilisations?.links && (
                                        <div className="flex justify-center mt-4">
                                            <div className="flex gap-2">
                                                {utilisations.links.map((link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(link.url);
                                                            }
                                                        }}
                                                        disabled={!link.url}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="livraisons">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Livraisons de Carburant</CardTitle>
                                    <CardDescription>
                                        Historique des livraisons et approvisionnements
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Date</TableHead>
                                                <TableHead>Fournisseur</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>Montant</TableHead>
                                                <TableHead>N° Bon</TableHead>
                                                <TableHead>Commentaire</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {livraisons?.data?.length > 0 ? (
                                                livraisons.data.map((livraison) => (
                                                    <TableRow key={livraison.id}>
                                                        <TableCell className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-gray-500" />
                                                            {formatDate(livraison.date_livraison)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <User className="h-4 w-4 text-gray-500" />
                                                                {livraison.fournisseur?.nom_societe || 'N/A'}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge className="bg-green-500">
                                                                {formatQuantity(livraison.quantite)}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell>
                                                            {livraison.montant_total ? (
                                                                <span className="font-medium">
                                                                    {formatCurrency(livraison.montant_total)}
                                                                </span>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {livraison.numero_bon ? (
                                                                <Badge variant="outline">
                                                                    {livraison.numero_bon}
                                                                </Badge>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {livraison.commentaire ? (
                                                                <div className="flex items-center gap-2">
                                                                    <FileText className="h-4 w-4 text-gray-500" />
                                                                    <span className="text-sm">{livraison.commentaire}</span>
                                                                </div>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={6} className="text-center text-gray-500">
                                                        Aucune livraison enregistrée
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>

                                    {/* Pagination pour livraisons */}
                                    {livraisons?.links && (
                                        <div className="flex justify-center mt-4">
                                            <div className="flex gap-2">
                                                {livraisons.links.map((link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => {
                                                            if (link.url) {
                                                                router.get(link.url);
                                                            }
                                                        }}
                                                        disabled={!link.url}
                                                        dangerouslySetInnerHTML={{ __html: link.label }}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AdminLayout>
    );
}
