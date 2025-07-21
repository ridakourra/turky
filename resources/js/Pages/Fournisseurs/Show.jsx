import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { 
    ArrowLeft, 
    Building2, 
    User, 
    Phone, 
    Mail, 
    MapPin, 
    FileText, 
    Hash,
    Edit,
    ShoppingCart,
    Calendar,
    DollarSign,
    Package
} from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function FournisseursShow({ fournisseur, commandes }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'en_attente': { label: 'En Attente', variant: 'secondary' },
            'confirmee': { label: 'Confirmée', variant: 'default' },
            'livree': { label: 'Livrée', variant: 'default' },
            'annulee': { label: 'Annulée', variant: 'destructive' }
        };

        const config = statusConfig[status] || { label: status, variant: 'secondary' };
        return (
            <Badge variant={config.variant} className="capitalize">
                {config.label}
            </Badge>
        );
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={route('fournisseurs.index')}>
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                            {fournisseur.nom_societe}
                        </h2>
                    </div>
                    <Link href={route('fournisseurs.edit', fournisseur.id)}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>
            }
        >
            <Head title={fournisseur.nom_societe} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* Informations du fournisseur */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Building2 className="h-5 w-5 text-yellow-500" />
                                Informations du Fournisseur
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Informations principales */}
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                            <Building2 className="h-4 w-4" />
                                            Société
                                        </div>
                                        <p className="text-lg font-semibold">{fournisseur.nom_societe}</p>
                                    </div>
                                    
                                    {fournisseur.contact_nom && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <User className="h-4 w-4" />
                                                Contact
                                            </div>
                                            <p>{fournisseur.contact_nom}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Informations de contact */}
                                <div className="space-y-4">
                                    {fournisseur.telephone && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <Phone className="h-4 w-4" />
                                                Téléphone
                                            </div>
                                            <p>{fournisseur.telephone}</p>
                                        </div>
                                    )}
                                    
                                    {fournisseur.email && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <Mail className="h-4 w-4" />
                                                Email
                                            </div>
                                            <p>{fournisseur.email}</p>
                                        </div>
                                    )}
                                    
                                    {fournisseur.addresse && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <MapPin className="h-4 w-4" />
                                                Adresse
                                            </div>
                                            <p className="text-sm">{fournisseur.addresse}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Informations légales */}
                                <div className="space-y-4">
                                    {fournisseur.ice && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <Hash className="h-4 w-4" />
                                                ICE
                                            </div>
                                            <p className="font-mono">{fournisseur.ice}</p>
                                        </div>
                                    )}
                                    
                                    {fournisseur.rc && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <FileText className="h-4 w-4" />
                                                RC
                                            </div>
                                            <p className="font-mono">{fournisseur.rc}</p>
                                        </div>
                                    )}
                                    
                                    {fournisseur.if && (
                                        <div>
                                            <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-1">
                                                <FileText className="h-4 w-4" />
                                                IF
                                            </div>
                                            <p className="font-mono">{fournisseur.if}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Commandes du fournisseur */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <ShoppingCart className="h-5 w-5 text-yellow-500" />
                                        Commandes
                                    </CardTitle>
                                    <CardDescription>
                                        {commandes?.data?.length || 0} commande(s) trouvée(s)
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {commandes?.data?.length > 0 ? (
                                <div className="space-y-4">
                                    {commandes.data.map((commande) => (
                                        <div key={commande.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-semibold">Commande #{commande.numero_commande}</h3>
                                                    {getStatusBadge(commande.statut)}
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-lg">{formatCurrency(commande.montant_total)}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600">Date:</span>
                                                    <span>{format(new Date(commande.date_commande), 'dd/MM/yyyy', { locale: fr })}</span>
                                                </div>
                                                
                                                {commande.date_livraison_prevue && (
                                                    <div className="flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-gray-400" />
                                                        <span className="text-gray-600">Livraison prévue:</span>
                                                        <span>{format(new Date(commande.date_livraison_prevue), 'dd/MM/yyyy', { locale: fr })}</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="h-4 w-4 text-gray-400" />
                                                    <span className="text-gray-600">Montant HT:</span>
                                                    <span>{formatCurrency(commande.montant_ht || 0)}</span>
                                                </div>
                                            </div>
                                            
                                            {commande.commentaire && (
                                                <div className="mt-3 pt-3 border-t">
                                                    <p className="text-sm text-gray-600">
                                                        <span className="font-medium">Commentaire:</span> {commande.commentaire}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    
                                    {/* Pagination */}
                                    {commandes.links && (
                                        <div className="flex items-center justify-center gap-2 mt-6">
                                            {commandes.links.map((link, index) => (
                                                <Link
                                                    key={index}
                                                    href={link.url || '#'}
                                                    className={`px-3 py-2 text-sm rounded-md ${
                                                        link.active
                                                            ? 'bg-yellow-500 text-white'
                                                            : link.url
                                                            ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                    preserveState
                                                >
                                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Aucune commande trouvée pour ce fournisseur</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}