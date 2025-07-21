import React, { useState } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { Textarea } from '@/Components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { ArrowLeft, Edit, Plus, DollarSign, Calendar, Truck, FileText, Trash2 } from 'lucide-react';
import { Link } from '@inertiajs/react';

export default function Show({ employee, salaireCalculations, produits }) {
    const [deleteEmployee, setDeleteEmployee] = useState(null);
    const [showAbsenceDialog, setShowAbsenceDialog] = useState(false);
    const [showBudgetDialog, setShowBudgetDialog] = useState(false);
    const [showHistoriqueDialog, setShowHistoriqueDialog] = useState(false);
    const [showPaySalaryDialog, setShowPaySalaryDialog] = useState(false);
    const [selectedSalaire, setSelectedSalaire] = useState(null);

    const absenceForm = useForm({
        date_debut: '',
        date_fin: '',
        type_absence: '',
        justification: '',
        commentaire: ''
    });

    const budgetForm = useForm({
        montant: '',
        description: '',
        date_attribution: new Date().toISOString().split('T')[0]
    });

    const historiqueForm = useForm({
        salaire_id: '',
        quantite: '',
        date: new Date().toISOString().split('T')[0]
    });

    const paymentForm = useForm({
        montant: '',
        description: ''
    });

    const handleAbsenceSubmit = (e) => {
        e.preventDefault();
        absenceForm.post(route('employees.absences.store', employee.id), {
            onSuccess: () => {
                setShowAbsenceDialog(false);
                absenceForm.reset();
            }
        });
    };

    const handleBudgetSubmit = (e) => {
        e.preventDefault();
        budgetForm.post(route('employees.budgets.store', employee.id), {
            onSuccess: () => {
                setShowBudgetDialog(false);
                budgetForm.reset();
            }
        });
    };

    const handleHistoriqueSubmit = (e) => {
        e.preventDefault();
        historiqueForm.post(route('employees.historique.store', employee.id), {
            onSuccess: () => {
                setShowHistoriqueDialog(false);
                historiqueForm.reset();
            }
        });
    };

    const handlePaymentSubmit = (e) => {
        e.preventDefault();
        paymentForm.post(route('employees.pay-salary', employee.id), {
            onSuccess: () => {
                setShowPaySalaryDialog(false);
                paymentForm.reset();
            }
        });
    };

    const handleDelete = () => {
        if (deleteEmployee) {
            router.delete(route('employees.destroy', deleteEmployee.id), {
                onSuccess: () => router.get(route('employees.index'))
            });
        }
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            directeur: 'bg-yellow-500',
            comptable: 'bg-blue-500',
            chauffeur: 'bg-green-500',
            ouvrier: 'bg-gray-500'
        };
        return colors[role] || 'bg-gray-500';
    };

    const getAbsenceTypeBadge = (type) => {
        const colors = {
            maladie: 'bg-red-500',
            conge: 'bg-blue-500',
            non_justifie: 'bg-orange-500',
            autre: 'bg-gray-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const getBudgetStatusBadge = (statut) => {
        const colors = {
            attribue: 'bg-green-500',
            utilise: 'bg-blue-500',
            solde: 'bg-gray-500'
        };
        return colors[statut] || 'bg-gray-500';
    };

    const totalSalaryToPay = salaireCalculations?.reduce((sum, calc) => sum + calc.montant_a_payer, 0) || 0;

    return (
        <AdminLayout>
            <Head title={employee.nom_complet} />
            
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href={route('employees.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <h1 className="text-3xl font-bold text-gray-900">{employee.nom_complet}</h1>
                        <Badge className={`${getRoleBadgeColor(employee.role)} text-white`}>
                            {employee.role}
                        </Badge>
                        <Badge variant={employee.actif ? 'default' : 'secondary'}>
                            {employee.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                    </div>
                    <div className="flex space-x-2">
                        <Link href={route('employees.edit', employee.id)}>
                            <Button variant="outline">
                                <Edit className="w-4 h-4 mr-2" />
                                Modifier
                            </Button>
                        </Link>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button 
                                    variant="outline" 
                                    onClick={() => setDeleteEmployee(employee)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Supprimer
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir supprimer l'employé {employee.nom_complet} ? 
                                        Cette action est irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setDeleteEmployee(null)}>
                                        Annuler
                                    </AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={handleDelete}
                                        className="bg-red-500 hover:bg-red-600"
                                    >
                                        Supprimer
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                {/* Informations personnelles */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Informations personnelles</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div>
                                <Label className="text-sm font-medium text-gray-500">CIN</Label>
                                <p className="text-gray-900">{employee.cin}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Téléphone</Label>
                                <p className="text-gray-900">{employee.telephone || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Adresse</Label>
                                <p className="text-gray-900">{employee.addresse || '-'}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Date d'embauche</Label>
                                <p className="text-gray-900">{new Date(employee.date_embauche).toLocaleDateString('fr-FR')}</p>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Dernier salaire payé</Label>
                                <p className="text-gray-900">
                                    {employee.date_dernier_salaire ? 
                                        new Date(employee.date_dernier_salaire).toLocaleDateString('fr-FR') : 
                                        'Jamais payé'
                                    }
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Salaires */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Salaires</CardTitle>
                                <Dialog open={showPaySalaryDialog} onOpenChange={setShowPaySalaryDialog}>
                                    <DialogTrigger asChild>
                                        <Button 
                                            size="sm" 
                                            className="bg-yellow-500 hover:bg-yellow-600"
                                            onClick={() => paymentForm.setData('montant', totalSalaryToPay.toString())}
                                        >
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            Payer
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Payer le salaire</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handlePaymentSubmit} className="space-y-4">
                                            <div>
                                                <Label>Montant à payer (DH)</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={paymentForm.data.montant}
                                                    onChange={(e) => paymentForm.setData('montant', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={paymentForm.data.description}
                                                    onChange={(e) => paymentForm.setData('description', e.target.value)}
                                                    placeholder="Description du paiement..."
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button type="button" variant="outline" onClick={() => setShowPaySalaryDialog(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" disabled={paymentForm.processing}>
                                                    Payer
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {salaireCalculations?.map((calc, index) => (
                                <div key={index} className="border rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <Badge variant="outline">{calc.salaire.type}</Badge>
                                            {calc.salaire.produit && (
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Produit: {calc.salaire.produit.nom}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">{calc.montant_base} DH</p>
                                            <p className="text-sm text-gray-600">base</p>
                                        </div>
                                    </div>
                                    <div className="mt-2 pt-2 border-t">
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">À payer:</span>
                                            <span className="font-bold text-green-600">{calc.montant_a_payer} DH</span>
                                        </div>
                                        {calc.quantite_travaillee && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Quantité travaillée:</span>
                                                <span className="text-sm">{calc.quantite_travaillee}</span>
                                            </div>
                                        )}
                                        {calc.quantite_produite && (
                                            <div className="flex justify-between">
                                                <span className="text-sm text-gray-600">Quantité produite:</span>
                                                <span className="text-sm">{calc.quantite_produite}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="border-t pt-3">
                                <div className="flex justify-between font-bold">
                                    <span>Total à payer:</span>
                                    <span className="text-green-600">{totalSalaryToPay.toLocaleString()} DH</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Véhicule (si chauffeur) */}
                    {employee.role === 'chauffeur' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Véhicule assigné</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {employee.vehicules?.length > 0 ? (
                                    <div className="space-y-2">
                                        {employee.vehicules.map((vehicule) => (
                                            <div key={vehicule.id} className="border rounded-lg p-3">
                                                <p className="font-medium">{vehicule.matricule}</p>
                                                <p className="text-sm text-gray-600">{vehicule.marque} {vehicule.modele}</p>
                                                <Badge variant="outline">{vehicule.statut}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Aucun véhicule assigné</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Absences */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Absences récentes</CardTitle>
                            <Dialog open={showAbsenceDialog} onOpenChange={setShowAbsenceDialog}>
                                <DialogTrigger asChild>
                                    <Button size="sm" variant="outline">
                                        <Plus className="w-4 h-4 mr-2" />
                                        Ajouter une absence
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Nouvelle absence</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleAbsenceSubmit} className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Label>Date de début *</Label>
                                                <Input
                                                    type="date"
                                                    value={absenceForm.data.date_debut}
                                                    onChange={(e) => absenceForm.setData('date_debut', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Date de fin</Label>
                                                <Input
                                                    type="date"
                                                    value={absenceForm.data.date_fin}
                                                    onChange={(e) => absenceForm.setData('date_fin', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Label>Type d'absence *</Label>
                                            <Select value={absenceForm.data.type_absence} onValueChange={(value) => absenceForm.setData('type_absence', value)}>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Sélectionner le type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="maladie">Maladie</SelectItem>
                                                    <SelectItem value="conge">Congé</SelectItem>
                                                    <SelectItem value="non_justifie">Non justifié</SelectItem>
                                                    <SelectItem value="autre">Autre</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div>
                                            <Label>Justification</Label>
                                            <Textarea
                                                value={absenceForm.data.justification}
                                                onChange={(e) => absenceForm.setData('justification', e.target.value)}
                                                placeholder="Justification de l'absence..."
                                            />
                                        </div>
                                        <div>
                                            <Label>Commentaire</Label>
                                            <Textarea
                                                value={absenceForm.data.commentaire}
                                                onChange={(e) => absenceForm.setData('commentaire', e.target.value)}
                                                placeholder="Commentaire..."
                                            />
                                        </div>
                                        <div className="flex justify-end space-x-2">
                                            <Button type="button" variant="outline" onClick={() => setShowAbsenceDialog(false)}>
                                                Annuler
                                            </Button>
                                            <Button type="submit" disabled={absenceForm.processing}>
                                                Ajouter
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {employee.absences?.length > 0 ? (
                            <div className="space-y-3">
                                {employee.absences.map((absence) => (
                                    <div key={absence.id} className="border rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <Badge className={`${getAbsenceTypeBadge(absence.type_absence)} text-white`}>
                                                    {absence.type_absence}
                                                </Badge>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Du {new Date(absence.date_debut).toLocaleDateString('fr-FR')}
                                                    {absence.date_fin && ` au ${new Date(absence.date_fin).toLocaleDateString('fr-FR')}`}
                                                </p>
                                                {absence.justification && (
                                                    <p className="text-sm text-gray-700 mt-1">{absence.justification}</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">Aucune absence enregistrée</p>
                        )}
                    </CardContent>
                </Card>

                {/* Budgets chauffeur */}
                {employee.role === 'chauffeur' && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Budgets chauffeur</CardTitle>
                                <Dialog open={showBudgetDialog} onOpenChange={setShowBudgetDialog}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Ajouter un budget
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Nouveau budget</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleBudgetSubmit} className="space-y-4">
                                            <div>
                                                <Label>Montant (DH) *</Label>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    value={budgetForm.data.montant}
                                                    onChange={(e) => budgetForm.setData('montant', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Date d'attribution *</Label>
                                                <Input
                                                    type="date"
                                                    value={budgetForm.data.date_attribution}
                                                    onChange={(e) => budgetForm.setData('date_attribution', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Description</Label>
                                                <Textarea
                                                    value={budgetForm.data.description}
                                                    onChange={(e) => budgetForm.setData('description', e.target.value)}
                                                    placeholder="Description du budget..."
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button type="button" variant="outline" onClick={() => setShowBudgetDialog(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" disabled={budgetForm.processing}>
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            {employee.budget_chauffeurs?.length > 0 ? (
                                <div className="space-y-3">
                                    {employee.budget_chauffeurs.map((budget) => (
                                        <div key={budget.id} className="border rounded-lg p-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium">{budget.montant} DH</p>
                                                    <p className="text-sm text-gray-600">
                                                        {new Date(budget.date_attribution).toLocaleDateString('fr-FR')}
                                                    </p>
                                                    {budget.description && (
                                                        <p className="text-sm text-gray-700 mt-1">{budget.description}</p>
                                                    )}
                                                </div>
                                                <Badge className={`${getBudgetStatusBadge(budget.statut)} text-white`}>
                                                    {budget.statut}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500">Aucun budget attribué</p>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Historique de travail */}
                {(employee.salaires?.some(s => ['journalier', 'horaire', 'par_produit'].includes(s.type))) && (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Historique de travail</CardTitle>
                                <Dialog open={showHistoriqueDialog} onOpenChange={setShowHistoriqueDialog}>
                                    <DialogTrigger asChild>
                                        <Button size="sm" variant="outline">
                                            <Plus className="w-4 h-4 mr-2" />
                                            Ajouter un historique
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Nouvel historique de travail</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleHistoriqueSubmit} className="space-y-4">
                                            <div>
                                                <Label>Type de salaire *</Label>
                                                <Select value={historiqueForm.data.salaire_id} onValueChange={(value) => historiqueForm.setData('salaire_id', value)}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Sélectionner le type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {employee.salaires?.filter(s => ['journalier', 'horaire', 'par_produit'].includes(s.type)).map((salaire) => (
                                                            <SelectItem key={salaire.id} value={salaire.id.toString()}>
                                                                {salaire.type} {salaire.produit ? `- ${salaire.produit.nom}` : ''}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <Label>Quantité *</Label>
                                                <Input
                                                    type="number"
                                                    min="1"
                                                    value={historiqueForm.data.quantite}
                                                    onChange={(e) => historiqueForm.setData('quantite', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <Label>Date *</Label>
                                                <Input
                                                    type="date"
                                                    value={historiqueForm.data.date}
                                                    onChange={(e) => historiqueForm.setData('date', e.target.value)}
                                                    required
                                                />
                                            </div>
                                            <div className="flex justify-end space-x-2">
                                                <Button type="button" variant="outline" onClick={() => setShowHistoriqueDialog(false)}>
                                                    Annuler
                                                </Button>
                                                <Button type="submit" disabled={historiqueForm.processing}>
                                                    Ajouter
                                                </Button>
                                            </div>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-500">Historique de travail affiché dans les calculs de salaire ci-dessus</p>
                        </CardContent>
                    </Card>
                )}

                {/* Commandes récentes (si chauffeur) */}
                {employee.role === 'chauffeur' && employee.commandes_clients?.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Commandes récentes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {employee.commandes_clients.map((commande) => (
                                    <div key={commande.id} className="border rounded-lg p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-medium">Commande #{commande.id}</p>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(commande.created_at).toLocaleDateString('fr-FR')}
                                                </p>
                                            </div>
                                            <Badge variant="outline">{commande.statut}</Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AdminLayout>
    );
}