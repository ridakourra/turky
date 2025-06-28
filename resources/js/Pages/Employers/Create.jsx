import React, { useState } from "react";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
    ArrowLeft, 
    User, 
    Phone, 
    MapPin, 
    Calendar, 
    Briefcase, 
    CreditCard, 
    Plus, 
    X,
    Info,
    DollarSign,
    Package
} from "lucide-react";

const EmployersCreate = () => {
    const { produits } = usePage().props;
    const [salaireProduits, setSalaireProduits] = useState([]);

    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        cin: '',
        password: '',
        telephone: '',
        adresse: '',
        details: '',
        actif: true,
        date_embauche: '',
        fonction: '',
        salaire_type: '',
        salaire_montant: '',
        salaire_produits: []
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = {
            ...data,
            salaire_produits: salaireProduits
        };
        post(route('employers.store'), {
            data: formData,
            onSuccess: () => reset()
        });
    };

    const handleSalaireTypeChange = (value) => {
        setData('salaire_type', value);
        if (value !== 'unitaire') {
            setSalaireProduits([]);
        } else {
            setData('salaire_montant', '');
        }
    };

    const addSalaireProduit = () => {
        setSalaireProduits([...salaireProduits, { produit_id: '', prix: '' }]);
    };

    const removeSalaireProduit = (index) => {
        setSalaireProduits(salaireProduits.filter((_, i) => i !== index));
    };

    const updateSalaireProduit = (index, field, value) => {
        const updated = [...salaireProduits];
        updated[index][field] = value;
        setSalaireProduits(updated);
    };

    const getSalaireTypeDescription = () => {
        switch (data.salaire_type) {
            case 'mensuel':
                return 'Le salaire sera calculé mensuellement selon le montant fixe défini.';
            case 'journalier':
                return 'Le salaire sera calculé quotidiennement selon le montant par jour défini.';
            case 'horaire':
                return 'Le salaire sera calculé selon le nombre d\'heures travaillées.';
            case 'unitaire':
                return 'Le salaire sera calculé selon la quantité de produits traités par l\'employé.';
            default:
                return '';
        }
    };

    return (
        <AdminLayout title="Ajouter un Employé">
            <Head title="Ajouter Employé" />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href={route('employers.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Ajouter un Employé</h1>
                        <p className="text-sm text-gray-600">
                            Créez un nouveau profil employé avec toutes les informations nécessaires
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Main Information */}
                        <div className="lg:col-span-2 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="h-5 w-5" />
                                        Informations Personnelles
                                    </CardTitle>
                                    <CardDescription>
                                        Informations de base de l'employé
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="nom">Nom Complet *</Label>
                                            <Input
                                                id="nom"
                                                value={data.nom}
                                                onChange={(e) => setData('nom', e.target.value)}
                                                placeholder="Nom et prénom de l'employé"
                                                className={errors.nom ? 'border-red-500' : ''}
                                            />
                                            {errors.nom && (
                                                <p className="text-sm text-red-600">{errors.nom}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cin">CIN *</Label>
                                            <Input
                                                id="cin"
                                                value={data.cin}
                                                onChange={(e) => setData('cin', e.target.value)}
                                                placeholder="Carte d'identité nationale"
                                                className={errors.cin ? 'border-red-500' : ''}
                                            />
                                            {errors.cin && (
                                                <p className="text-sm text-red-600">{errors.cin}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="password">Mot de Passe *</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={data.password}
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Mot de passe de connexion"
                                                className={errors.password ? 'border-red-500' : ''}
                                            />
                                            {errors.password && (
                                                <p className="text-sm text-red-600">{errors.password}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="telephone">Téléphone</Label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="telephone"
                                                    value={data.telephone}
                                                    onChange={(e) => setData('telephone', e.target.value)}
                                                    placeholder="Numéro de téléphone"
                                                    className="pl-10"
                                                />
                                            </div>
                                            {errors.telephone && (
                                                <p className="text-sm text-red-600">{errors.telephone}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="adresse">Adresse</Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Textarea
                                                id="adresse"
                                                value={data.adresse}
                                                onChange={(e) => setData('adresse', e.target.value)}
                                                placeholder="Adresse complète de l'employé"
                                                className="pl-10"
                                                rows={2}
                                            />
                                        </div>
                                        {errors.adresse && (
                                            <p className="text-sm text-red-600">{errors.adresse}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="details">Détails Supplémentaires</Label>
                                        <Textarea
                                            id="details"
                                            value={data.details}
                                            onChange={(e) => setData('details', e.target.value)}
                                            placeholder="Informations supplémentaires, commentaires..."
                                            rows={3}
                                        />
                                        {errors.details && (
                                            <p className="text-sm text-red-600">{errors.details}</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Briefcase className="h-5 w-5" />
                                        Informations Professionnelles
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="fonction">Fonction/Poste</Label>
                                            <Input
                                                id="fonction"
                                                value={data.fonction}
                                                onChange={(e) => setData('fonction', e.target.value)}
                                                placeholder="Ex: Chauffeur, Opérateur, etc."
                                            />
                                            {errors.fonction && (
                                                <p className="text-sm text-red-600">{errors.fonction}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="date_embauche">Date d'Embauche</Label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="date_embauche"
                                                    type="date"
                                                    value={data.date_embauche}
                                                    onChange={(e) => setData('date_embauche', e.target.value)}
                                                    className="pl-10"
                                                />
                                            </div>
                                            {errors.date_embauche && (
                                                <p className="text-sm text-red-600">{errors.date_embauche}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="actif"
                                            checked={data.actif}
                                            onCheckedChange={(checked) => setData('actif', checked)}
                                        />
                                        <Label htmlFor="actif">Employé actif</Label>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Salary Configuration */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <CreditCard className="h-5 w-5" />
                                        Configuration du Salaire
                                    </CardTitle>
                                    <CardDescription>
                                        Définissez le type et le montant du salaire de l'employé
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="salaire_type">Type de Salaire *</Label>
                                        <Select value={data.salaire_type} onValueChange={handleSalaireTypeChange}>
                                            <SelectTrigger className={errors.salaire_type ? 'border-red-500' : ''}>
                                                <SelectValue placeholder="Choisissez le type de salaire" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="mensuel">Mensuel</SelectItem>
                                                <SelectItem value="journalier">Journalier</SelectItem>
                                                <SelectItem value="horaire">Par Heure</SelectItem>
                                                <SelectItem value="unitaire">Par Unité/Produit</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.salaire_type && (
                                            <p className="text-sm text-red-600">{errors.salaire_type}</p>
                                        )}
                                    </div>

                                    {data.salaire_type && (
                                        <Alert>
                                            <Info className="h-4 w-4" />
                                            <AlertDescription>
                                                {getSalaireTypeDescription()}
                                            </AlertDescription>
                                        </Alert>
                                    )}

                                    {data.salaire_type && data.salaire_type !== 'unitaire' && (
                                        <div className="space-y-2">
                                            <Label htmlFor="salaire_montant">
                                                Montant {data.salaire_type === 'mensuel' ? 'Mensuel' : 
                                                        data.salaire_type === 'journalier' ? 'Journalier' : 'par Heure'} (DH) *
                                            </Label>
                                            <div className="relative">
                                                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                                <Input
                                                    id="salaire_montant"
                                                    type="number"
                                                    step="0.01"
                                                    min="0"
                                                    value={data.salaire_montant}
                                                    onChange={(e) => setData('salaire_montant', e.target.value)}
                                                    placeholder="Montant en dirhams"
                                                    className="pl-10"
                                                />
                                            </div>
                                            {errors.salaire_montant && (
                                                <p className="text-sm text-red-600">{errors.salaire_montant}</p>
                                            )}
                                        </div>
                                    )}

                                    {data.salaire_type === 'unitaire' && (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <Label>Produits et Prix par Unité</Label>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addSalaireProduit}
                                                >
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Ajouter Produit
                                                </Button>
                                            </div>

                                            {salaireProduits.length === 0 && (
                                                <Alert>
                                                    <Package className="h-4 w-4" />
                                                    <AlertDescription>
                                                        Ajoutez au moins un produit avec son prix par unité pour ce type de salaire.
                                                    </AlertDescription>
                                                </Alert>
                                            )}

                                            <div className="space-y-3">
                                                {salaireProduits.map((salaireProduit, index) => (
                                                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                                                        <div className="flex-1">
                                                            <Label className="text-sm">Produit</Label>
                                                            <Select
                                                                value={salaireProduit.produit_id}
                                                                onValueChange={(value) => updateSalaireProduit(index, 'produit_id', value)}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Choisir un produit" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {produits.map((produit) => (
                                                                        <SelectItem key={produit.id} value={produit.id.toString()}>
                                                                            {produit.nom} ({produit.unite})
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div className="w-32">
                                                            <Label className="text-sm">Prix/Unité (DH)</Label>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                min="0"
                                                                value={salaireProduit.prix}
                                                                onChange={(e) => updateSalaireProduit(index, 'prix', e.target.value)}
                                                                placeholder="0.00"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => removeSalaireProduit(index)}
                                                            className="text-red-600 hover:text-red-700"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>

                                            {errors.salaire_produits && (
                                                <p className="text-sm text-red-600">{errors.salaire_produits}</p>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Aperçu</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Nom:</span>
                                            <span className="font-medium">{data.nom || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">CIN:</span>
                                            <span className="font-medium">{data.cin || 'Non défini'}</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Fonction:</span>
                                            <span className="font-medium">{data.fonction || 'Non défini'}</span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Type Salaire:</span>
                                            <span className="font-medium">
                                                {data.salaire_type ? (
                                                    <Badge variant="outline">{data.salaire_type}</Badge>
                                                ) : 'Non défini'}
                                            </span>
                                        </div>
                                        {data.salaire_type !== 'unitaire' && data.salaire_montant && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-600">Montant:</span>
                                                <span className="font-medium text-green-600">
                                                    {data.salaire_montant} DH
                                                </span>
                                            </div>
                                        )}
                                        {data.salaire_type === 'unitaire' && salaireProduits.length > 0 && (
                                            <div className="text-sm">
                                                <span className="text-gray-600">Produits:</span>
                                                <div className="mt-1 space-y-1">
                                                    {salaireProduits.map((sp, index) => {
                                                        const produit = produits.find(p => p.id.toString() === sp.produit_id);
                                                        return (
                                                            <div key={index} className="text-xs bg-gray-50 p-2 rounded">
                                                                {produit?.nom}: {sp.prix} DH/{produit?.unite}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                        <Separator />
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">Statut:</span>
                                            <Badge variant={data.actif ? "default" : "secondary"}>
                                                {data.actif ? "Actif" : "Inactif"}
                                            </Badge>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-lg">Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button 
                                        type="submit" 
                                        className="w-full bg-yellow-500 hover:bg-yellow-600"
                                        disabled={processing}
                                    >
                                        {processing ? 'Création...' : 'Créer l\'Employé'}
                                    </Button>
                                    <Link href={route('employers.index')}>
                                        <Button type="button" variant="outline" className="w-full">
                                            Annuler
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
};

export default EmployersCreate;