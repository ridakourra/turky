import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Textarea } from '@/Components/ui/textarea';
import { Alert, AlertDescription } from '@/Components/ui/alert';
import { Building2, Save, ArrowLeft, Upload, X } from 'lucide-react';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Edit({ entreprise }) {
    const { data, setData, post, put, processing, errors, progress } = useForm({
        nom_entreprise: entreprise?.nom_entreprise || '',
        description: entreprise?.description || '',
        ice: entreprise?.ice || '',
        rc: entreprise?.rc || '',
        cnss: entreprise?.cnss || '',
        if: entreprise?.if || '',
        date_creation: entreprise?.date_creation || '',
        logo: null,
        _method: entreprise ? 'PUT' : 'POST'
    });

    const [logoPreview, setLogoPreview] = useState(entreprise?.logo || null);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (entreprise) {
            post(route('entreprise.update'), {
                forceFormData: true,
                onSuccess: () => {
                    // Success handled by controller redirect
                }
            });
        } else {
            post(route('entreprise.store'), {
                forceFormData: true,
                onSuccess: () => {
                    // Success handled by controller redirect
                }
            });
        }
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('logo', file);
            const reader = new FileReader();
            reader.onload = (e) => setLogoPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setLogoPreview(null);
    };

    return (
        <AdminLayout>
            <Head title={entreprise ? "Modifier l'entreprise" : "Créer l'entreprise"} />
            
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {entreprise ? "Modifier l'entreprise" : "Créer l'entreprise"}
                        </h1>
                        <p className="text-gray-600 mt-1">
                            {entreprise ? "Modifiez les informations de votre entreprise" : "Configurez les informations de votre entreprise"}
                        </p>
                    </div>
                    <Link href={route('entreprise.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
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
                                    <Label htmlFor="nom_entreprise">Nom de l'entreprise *</Label>
                                    <Input
                                        id="nom_entreprise"
                                        type="text"
                                        value={data.nom_entreprise}
                                        onChange={(e) => setData('nom_entreprise', e.target.value)}
                                        className={errors.nom_entreprise ? 'border-red-500' : ''}
                                        placeholder="Entrez le nom de l'entreprise"
                                    />
                                    {errors.nom_entreprise && (
                                        <p className="text-sm text-red-600 mt-1">{errors.nom_entreprise}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        className={errors.description ? 'border-red-500' : ''}
                                        placeholder="Description de l'entreprise"
                                        rows={3}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">{errors.description}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="date_creation">Date de création</Label>
                                    <Input
                                        id="date_creation"
                                        type="date"
                                        value={data.date_creation}
                                        onChange={(e) => setData('date_creation', e.target.value)}
                                        className={errors.date_creation ? 'border-red-500' : ''}
                                    />
                                    {errors.date_creation && (
                                        <p className="text-sm text-red-600 mt-1">{errors.date_creation}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Informations légales */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Informations légales</CardTitle>
                                <CardDescription>
                                    Identifiants et références officielles
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="ice">ICE</Label>
                                    <Input
                                        id="ice"
                                        type="text"
                                        value={data.ice}
                                        onChange={(e) => setData('ice', e.target.value)}
                                        className={errors.ice ? 'border-red-500' : ''}
                                        placeholder="Identifiant Commun de l'Entreprise"
                                    />
                                    {errors.ice && (
                                        <p className="text-sm text-red-600 mt-1">{errors.ice}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="rc">Registre de Commerce</Label>
                                    <Input
                                        id="rc"
                                        type="text"
                                        value={data.rc}
                                        onChange={(e) => setData('rc', e.target.value)}
                                        className={errors.rc ? 'border-red-500' : ''}
                                        placeholder="Numéro du registre de commerce"
                                    />
                                    {errors.rc && (
                                        <p className="text-sm text-red-600 mt-1">{errors.rc}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="cnss">CNSS</Label>
                                    <Input
                                        id="cnss"
                                        type="text"
                                        value={data.cnss}
                                        onChange={(e) => setData('cnss', e.target.value)}
                                        className={errors.cnss ? 'border-red-500' : ''}
                                        placeholder="Numéro CNSS"
                                    />
                                    {errors.cnss && (
                                        <p className="text-sm text-red-600 mt-1">{errors.cnss}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="if">Identifiant Fiscal</Label>
                                    <Input
                                        id="if"
                                        type="text"
                                        value={data.if}
                                        onChange={(e) => setData('if', e.target.value)}
                                        className={errors.if ? 'border-red-500' : ''}
                                        placeholder="Identifiant fiscal"
                                    />
                                    {errors.if && (
                                        <p className="text-sm text-red-600 mt-1">{errors.if}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Logo */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Logo de l'entreprise</CardTitle>
                            <CardDescription>
                                Téléchargez le logo de votre entreprise (formats acceptés: JPG, PNG, SVG)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {logoPreview && (
                                    <div className="relative inline-block">
                                        <img 
                                            src={logoPreview} 
                                            alt="Aperçu du logo" 
                                            className="max-h-32 object-contain border rounded-lg"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                            onClick={removeLogo}
                                        >
                                            <X className="h-3 w-3" />
                                        </Button>
                                    </div>
                                )}
                                
                                <div>
                                    <Label htmlFor="logo">Choisir un logo</Label>
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={handleLogoChange}
                                        className={errors.logo ? 'border-red-500' : ''}
                                    />
                                    {errors.logo && (
                                        <p className="text-sm text-red-600 mt-1">{errors.logo}</p>
                                    )}
                                </div>
                                
                                {progress && (
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-500 h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${progress.percentage}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Submit Button */}
                    <div className="flex justify-end space-x-4">
                        <Link href={route('entreprise.index')}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={processing}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white"
                        >
                            {processing ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Enregistrement...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4 mr-2" />
                                    {entreprise ? 'Mettre à jour' : 'Créer'}
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}