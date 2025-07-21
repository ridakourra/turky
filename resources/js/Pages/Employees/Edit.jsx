import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Checkbox } from '@/Components/ui/checkbox';
import { Textarea } from '@/Components/ui/textarea';
import { Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Edit({ employee, produits }) {
    const { data, setData, put, processing, errors } = useForm({
        nom_complet: employee.nom_complet || '',
        telephone: employee.telephone || '',
        addresse: employee.addresse || '',
        cin: employee.cin || '',
        password: '',
        role: employee.role || '',
        date_embauche: employee.date_embauche || '',
        actif: employee.actif ?? true,
        salaires: employee.salaires?.length > 0 ? employee.salaires.map(s => ({
            type: s.type,
            montant: s.montant,
            produit_id: s.produit_id
        })) : [{
            type: '',
            montant: '',
            produit_id: null
        }]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('employees.update', employee.id));
    };

    const addSalaire = () => {
        setData('salaires', [...data.salaires, {
            type: '',
            montant: '',
            produit_id: null
        }]);
    };

    const removeSalaire = (index) => {
        const newSalaires = data.salaires.filter((_, i) => i !== index);
        setData('salaires', newSalaires);
    };

    const updateSalaire = (index, field, value) => {
        const newSalaires = [...data.salaires];
        newSalaires[index][field] = value;
        
        // Reset produit_id if type is not par_produit
        if (field === 'type' && value !== 'par_produit') {
            newSalaires[index].produit_id = null;
        }
        
        setData('salaires', newSalaires);
    };

    return (
        <AdminLayout>
            <Head title={`Modifier ${employee.nom_complet}`} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-bold text-gray-900">Modifier {employee.nom_complet}</h1>
                    <Link href={route('employees.index')}>
                        <Button variant="outline">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Informations personnelles */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="nom_complet">Nom complet *</Label>
                                    <Input
                                        id="nom_complet"
                                        value={data.nom_complet}
                                        onChange={(e) => setData('nom_complet', e.target.value)}
                                        className={errors.nom_complet ? 'border-red-500' : ''}
                                    />
                                    {errors.nom_complet && (
                                        <p className="text-red-500 text-sm mt-1">{errors.nom_complet}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="cin">CIN *</Label>
                                    <Input
                                        id="cin"
                                        value={data.cin}
                                        onChange={(e) => setData('cin', e.target.value)}
                                        className={errors.cin ? 'border-red-500' : ''}
                                    />
                                    {errors.cin && (
                                        <p className="text-red-500 text-sm mt-1">{errors.cin}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="telephone">Téléphone</Label>
                                    <Input
                                        id="telephone"
                                        value={data.telephone}
                                        onChange={(e) => setData('telephone', e.target.value)}
                                        className={errors.telephone ? 'border-red-500' : ''}
                                    />
                                    {errors.telephone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="role">Rôle *</Label>
                                    <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                                        <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Sélectionner un rôle" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="directeur">Directeur</SelectItem>
                                            <SelectItem value="comptable">Comptable</SelectItem>
                                            <SelectItem value="chauffeur">Chauffeur</SelectItem>
                                            <SelectItem value="ouvrier">Ouvrier</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.role && (
                                        <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="date_embauche">Date d'embauche *</Label>
                                    <Input
                                        id="date_embauche"
                                        type="date"
                                        value={data.date_embauche}
                                        onChange={(e) => setData('date_embauche', e.target.value)}
                                        className={errors.date_embauche ? 'border-red-500' : ''}
                                    />
                                    {errors.date_embauche && (
                                        <p className="text-red-500 text-sm mt-1">{errors.date_embauche}</p>
                                    )}
                                </div>
                                
                                <div>
                                    <Label htmlFor="password">Nouveau mot de passe</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className={errors.password ? 'border-red-500' : ''}
                                        placeholder="Laisser vide pour conserver l'actuel"
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                                    )}
                                </div>
                            </div>
                            
                            <div>
                                <Label htmlFor="addresse">Adresse</Label>
                                <Textarea
                                    id="addresse"
                                    value={data.addresse}
                                    onChange={(e) => setData('addresse', e.target.value)}
                                    className={errors.addresse ? 'border-red-500' : ''}
                                />
                                {errors.addresse && (
                                    <p className="text-red-500 text-sm mt-1">{errors.addresse}</p>
                                )}
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

                    {/* Salaires */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Salaires *</CardTitle>
                                <Button type="button" onClick={addSalaire} variant="outline" size="sm">
                                    <Plus className="w-4 h-4 mr-2" />
                                    Ajouter un salaire
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.salaires.map((salaire, index) => (
                                <div key={index} className="border rounded-lg p-4 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="font-medium">Salaire {index + 1}</h4>
                                        {data.salaires.length > 1 && (
                                            <Button
                                                type="button"
                                                onClick={() => removeSalaire(index)}
                                                variant="outline"
                                                size="sm"
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </Button>
                                        )}
                                    </div>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <Label>Type de salaire *</Label>
                                            <Select 
                                                value={salaire.type} 
                                                onValueChange={(value) => updateSalaire(index, 'type', value)}
                                            >
                                                <SelectTrigger className={errors[`salaires.${index}.type`] ? 'border-red-500' : ''}>
                                                    <SelectValue placeholder="Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="mensuel">Mensuel</SelectItem>
                                                    <SelectItem value="journalier">Journalier</SelectItem>
                                                    <SelectItem value="horaire">Horaire</SelectItem>
                                                    <SelectItem value="par_produit">Par produit</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            {errors[`salaires.${index}.type`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`salaires.${index}.type`]}</p>
                                            )}
                                        </div>
                                        
                                        <div>
                                            <Label>Montant (DH) *</Label>
                                            <Input
                                                type="number"
                                                step="0.01"
                                                value={salaire.montant}
                                                onChange={(e) => updateSalaire(index, 'montant', e.target.value)}
                                                className={errors[`salaires.${index}.montant`] ? 'border-red-500' : ''}
                                            />
                                            {errors[`salaires.${index}.montant`] && (
                                                <p className="text-red-500 text-sm mt-1">{errors[`salaires.${index}.montant`]}</p>
                                            )}
                                        </div>
                                        
                                        {salaire.type === 'par_produit' && (
                                            <div>
                                                <Label>Produit *</Label>
                                                <Select 
                                                    value={salaire.produit_id?.toString() || ''} 
                                                    onValueChange={(value) => updateSalaire(index, 'produit_id', value)}
                                                >
                                                    <SelectTrigger className={errors[`salaires.${index}.produit_id`] ? 'border-red-500' : ''}>
                                                        <SelectValue placeholder="Sélectionner un produit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {produits?.map((produit) => (
                                                            <SelectItem key={produit.id} value={produit.id.toString()}>
                                                                {produit.nom}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                {errors[`salaires.${index}.produit_id`] && (
                                                    <p className="text-red-500 text-sm mt-1">{errors[`salaires.${index}.produit_id`]}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {errors.salaires && (
                                <p className="text-red-500 text-sm">{errors.salaires}</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end space-x-4">
                        <Link href={route('employees.index')}>
                            <Button type="button" variant="outline">
                                Annuler
                            </Button>
                        </Link>
                        <Button type="submit" disabled={processing} className="bg-yellow-500 hover:bg-yellow-600">
                            <Save className="w-4 h-4 mr-2" />
                            {processing ? 'Mise à jour...' : 'Mettre à jour'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}