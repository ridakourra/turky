import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { ArrowLeft, Calendar, DollarSign, FileText, Tag, User, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Show({ transaction }) {
    const getTypeTransactionBadge = (type) => {
        return type === 'entree' ? (
            <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-4 h-4 mr-1" />
                Entrée
            </Badge>
        ) : (
            <Badge className="bg-red-100 text-red-800">
                <TrendingDown className="w-4 h-4 mr-1" />
                Sortie
            </Badge>
        );
    };

    const getReferenceTypeLabel = (referenceType) => {
        const types = {
            'App\\Models\\Salaire': 'Salaire',
            'App\\Models\\CommandeClient': 'Commande Client',
            'App\\Models\\EnginLourd': 'Engin Lourd',
            'App\\Models\\BudgetChauffeur': 'Budget Chauffeur',
            'App\\Models\\LivraisonCarburant': 'Livraison Carburant',
            'App\\Models\\DepenseMachine': 'Dépense Machine'
        };
        return types[referenceType] || referenceType;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const getRelatedEntityInfo = () => {
        if (!transaction.reference) return null;

        const reference = transaction.reference;
        const type = transaction.reference_type;

        switch (type) {
            case 'App\\Models\\Salaire':
                return {
                    title: 'Salaire',
                    details: [
                        { label: 'Employé', value: reference.employee?.nom + ' ' + reference.employee?.prenom },
                        { label: 'Mois', value: reference.mois },
                        { label: 'Année', value: reference.annee },
                        { label: 'Salaire de base', value: formatCurrency(reference.salaire_base) },
                        { label: 'Prime', value: formatCurrency(reference.prime || 0) },
                        { label: 'Déduction', value: formatCurrency(reference.deduction || 0) }
                    ]
                };
            case 'App\\Models\\CommandeClient':
                return {
                    title: 'Commande Client',
                    details: [
                        { label: 'Client', value: reference.client?.nom },
                        { label: 'Date commande', value: format(new Date(reference.date_commande), 'dd/MM/yyyy', { locale: fr }) },
                        { label: 'Montant total', value: formatCurrency(reference.montant_total) },
                        { label: 'Montant payé', value: formatCurrency(reference.montant_paye) },
                        { label: 'Statut', value: reference.statut }
                    ]
                };
            case 'App\\Models\\EnginLourd':
                return {
                    title: 'Engin Lourd',
                    details: [
                        { label: 'Nom', value: reference.nom },
                        { label: 'Type', value: reference.type },
                        { label: 'Marque', value: reference.marque },
                        { label: 'Modèle', value: reference.modele },
                        { label: 'Année', value: reference.annee },
                        { label: 'Prix achat', value: formatCurrency(reference.prix_achat) }
                    ]
                };
            case 'App\\Models\\BudgetChauffeur':
                return {
                    title: 'Budget Chauffeur',
                    details: [
                        { label: 'Chauffeur', value: reference.chauffeur?.nom + ' ' + reference.chauffeur?.prenom },
                        { label: 'Date', value: format(new Date(reference.date), 'dd/MM/yyyy', { locale: fr }) },
                        { label: 'Montant', value: formatCurrency(reference.montant) },
                        { label: 'Description', value: reference.description }
                    ]
                };
            case 'App\\Models\\LivraisonCarburant':
                return {
                    title: 'Livraison Carburant',
                    details: [
                        { label: 'Véhicule', value: reference.vehicule?.marque + ' ' + reference.vehicule?.modele },
                        { label: 'Date livraison', value: format(new Date(reference.date_livraison), 'dd/MM/yyyy', { locale: fr }) },
                        { label: 'Quantité', value: reference.quantite + ' L' },
                        { label: 'Prix unitaire', value: formatCurrency(reference.prix_unitaire) },
                        { label: 'Montant total', value: formatCurrency(reference.montant_total) }
                    ]
                };
            case 'App\\Models\\DepenseMachine':
                return {
                    title: 'Dépense Machine',
                    details: [
                        { label: 'Machine', value: reference.engin_lourd?.nom },
                        { label: 'Date', value: format(new Date(reference.date), 'dd/MM/yyyy', { locale: fr }) },
                        { label: 'Type dépense', value: reference.type_depense },
                        { label: 'Montant', value: formatCurrency(reference.montant) },
                        { label: 'Description', value: reference.description }
                    ]
                };
            default:
                return null;
        }
    };

    const relatedEntity = getRelatedEntityInfo();

    return (
        <AuthenticatedLayout>
            <Head title={`Transaction #${transaction.id}`} />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    <div className="mb-6">
                        <Link href="/transactions">
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour aux transactions
                            </Button>
                        </Link>
                    </div>

                    <div className="grid gap-6">
                        {/* Informations principales de la transaction */}
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <DollarSign className="w-5 h-5" />
                                            Transaction #{transaction.id}
                                        </CardTitle>
                                        <CardDescription>
                                            Détails de la transaction financière
                                        </CardDescription>
                                    </div>
                                    {getTypeTransactionBadge(transaction.type_transaction)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Date de création</p>
                                                <p className="text-sm text-gray-600">
                                                    {format(new Date(transaction.created_at), 'dd/MM/yyyy à HH:mm', { locale: fr })}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Tag className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Type de référence</p>
                                                <Badge variant="outline">
                                                    {getReferenceTypeLabel(transaction.reference_type)}
                                                </Badge>
                                            </div>
                                        </div>

                                        {transaction.reference_id && (
                                            <div className="flex items-center gap-3">
                                                <FileText className="w-4 h-4 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium">ID de référence</p>
                                                    <p className="text-sm text-gray-600">#{transaction.reference_id}</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <DollarSign className="w-4 h-4 text-gray-500" />
                                            <div>
                                                <p className="text-sm font-medium">Montant</p>
                                                <p className={`text-lg font-bold ${
                                                    transaction.type_transaction === 'entree' ? 'text-green-600' : 'text-red-600'
                                                }`}>
                                                    {transaction.type_transaction === 'entree' ? '+' : '-'}
                                                    {formatCurrency(transaction.montant)}
                                                </p>
                                            </div>
                                        </div>

                                        {transaction.description && (
                                            <div className="flex items-start gap-3">
                                                <FileText className="w-4 h-4 text-gray-500 mt-1" />
                                                <div>
                                                    <p className="text-sm font-medium">Description</p>
                                                    <p className="text-sm text-gray-600">
                                                        {transaction.description}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations sur l'entité liée */}
                        {relatedEntity && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <User className="w-5 h-5" />
                                        Détails de {relatedEntity.title}
                                    </CardTitle>
                                    <CardDescription>
                                        Informations sur l'entité associée à cette transaction
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {relatedEntity.details.map((detail, index) => (
                                            <div key={index} className="space-y-1">
                                                <p className="text-sm font-medium text-gray-700">{detail.label}</p>
                                                <p className="text-sm text-gray-600">{detail.value || 'Non spécifié'}</p>
                                                {index < relatedEntity.details.length - 1 && index % 2 === 1 && (
                                                    <Separator className="mt-3" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Métadonnées de la transaction */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Métadonnées</CardTitle>
                                <CardDescription>
                                    Informations techniques sur la transaction
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-700">ID Transaction</p>
                                        <p className="text-gray-600">#{transaction.id}</p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Date de création</p>
                                        <p className="text-gray-600">
                                            {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-700">Dernière modification</p>
                                        <p className="text-gray-600">
                                            {format(new Date(transaction.updated_at), 'dd/MM/yyyy HH:mm:ss', { locale: fr })}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
