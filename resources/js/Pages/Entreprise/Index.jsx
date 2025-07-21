import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Badge } from '@/Components/ui/badge';
import { Separator } from '@/Components/ui/separator';
import { Building2, Edit, Calendar, FileText, Hash, CreditCard, Users, MapPin } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Index({ entreprise }) {
    return (
        <AdminLayout>
            <Head title="Informations de l'entreprise" />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Informations de l'entreprise</h1>
                        <p className="text-gray-600 mt-1">Gérez les informations de votre entreprise</p>
                    </div>
                    <Link href={route('entreprise.edit')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                        </Button>
                    </Link>
                </div>

                {entreprise ? (
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Informations générales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="w-5 h-5 text-yellow-500" />
                                    Informations générales
                                </CardTitle>
                                <CardDescription>
                                    Détails principaux de l'entreprise
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Nom de l'entreprise</label>
                                    <p className="text-lg font-semibold text-gray-900">{entreprise?.nom_entreprise || 'Non défini'}</p>
                                </div>
                                
                                {entreprise?.description && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500">Description</label>
                                        <p className="text-gray-700 mt-1">{entreprise.description}</p>
                                    </div>
                                )}
                                
                                {entreprise?.date_creation && (
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Date de création</label>
                                            <p className="text-gray-700">{new Date(entreprise.date_creation).toLocaleDateString('fr-FR')}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Informations légales */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-yellow-500" />
                                    Informations légales
                                </CardTitle>
                                <CardDescription>
                                    Identifiants et références officielles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {entreprise?.ice && (
                                    <div className="flex items-center gap-2">
                                        <Hash className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">ICE</label>
                                            <p className="text-gray-700">{entreprise.ice}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {entreprise?.rc && (
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Registre de Commerce</label>
                                            <p className="text-gray-700">{entreprise.rc}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {entreprise?.cnss && (
                                    <div className="flex items-center gap-2">
                                        <Users className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">CNSS</label>
                                            <p className="text-gray-700">{entreprise.cnss}</p>
                                        </div>
                                    </div>
                                )}
                                
                                {entreprise?.if && (
                                    <div className="flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-400" />
                                        <div>
                                            <label className="text-sm font-medium text-gray-500">Identifiant Fiscal</label>
                                            <p className="text-gray-700">{entreprise.if}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Logo */}
                        {entreprise?.logo && (
                            <Card className="md:col-span-2">
                                <CardHeader>
                                    <CardTitle>Logo de l'entreprise</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
                                        <img 
                                            src={entreprise.logo} 
                                            alt="Logo de l'entreprise" 
                                            className="max-h-32 object-contain"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                ) : (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Building2 className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune information d'entreprise</h3>
                            <p className="text-gray-600 text-center mb-6">
                                Vous n'avez pas encore configuré les informations de votre entreprise.
                            </p>
                            <Link href={route('entreprise.edit')}>
                                <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                                    <Building2 className="w-4 h-4 mr-2" />
                                    Configurer l'entreprise
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}