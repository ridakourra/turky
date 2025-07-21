import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Badge } from '@/Components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/Components/ui/alert-dialog';
import { Search, Plus, Edit, Trash2, Eye, ArrowUpDown } from 'lucide-react';

export default function Index({ employees, filters }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [role, setRole] = useState(filters?.role || 'all');
    const [statut, setStatut] = useState(filters?.statut || 'all');
    const [deleteEmployee, setDeleteEmployee] = useState(null);

    const handleSearch = () => {
        router.get(route('employees.index'), {
            search,
            role,
            statut,
            sort: filters?.sort,
            direction: filters?.direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleSort = (field) => {
        const direction = filters?.sort === field && filters?.direction === 'asc' ? 'desc' : 'asc';
        router.get(route('employees.index'), {
            ...filters,
            sort: field,
            direction
        }, {
            preserveState: true,
            replace: true
        });
    };

    const handleDelete = () => {
        if (deleteEmployee) {
            router.delete(route('employees.destroy', deleteEmployee.id), {
                onSuccess: () => setDeleteEmployee(null)
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

    const getSalaryInfo = (salaires) => {
        if (!salaires || salaires.length === 0) return 'Aucun salaire';
        
        const types = salaires.map(s => s.type).join(', ');
        const total = salaires.reduce((sum, s) => sum + parseFloat(s.montant), 0);
        
        return `${types} - ${total.toLocaleString()} DH`;
    };

    return (
        <AdminLayout>
            <Head title="Employés" />
            
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Employés</h1>
                    <Link href={route('employees.create')}>
                        <Button className="bg-yellow-500 hover:bg-yellow-600">
                            <Plus className="w-4 h-4 mr-2" />
                            Nouvel Employé
                        </Button>
                    </Link>
                </div>

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filtres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Rechercher..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>
                            
                            <Select value={role} onValueChange={setRole}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Rôle" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les rôles</SelectItem>
                                    <SelectItem value="directeur">Directeur</SelectItem>
                                    <SelectItem value="comptable">Comptable</SelectItem>
                                    <SelectItem value="chauffeur">Chauffeur</SelectItem>
                                    <SelectItem value="ouvrier">Ouvrier</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Select value={statut} onValueChange={setStatut}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tous les statuts</SelectItem>
                                    <SelectItem value="actif">Actif</SelectItem>
                                    <SelectItem value="inactif">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                            
                            <Button onClick={handleSearch} className="bg-yellow-500 hover:bg-yellow-600">
                                Rechercher
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Employees Table */}
                <Card>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('nom_complet')}
                                                className="font-semibold text-gray-900"
                                            >
                                                Nom Complet
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('cin')}
                                                className="font-semibold text-gray-900"
                                            >
                                                CIN
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-3 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('role')}
                                                className="font-semibold text-gray-900"
                                            >
                                                Rôle
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Téléphone</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Salaire</th>
                                        <th className="px-6 py-3 text-left">
                                            <Button
                                                variant="ghost"
                                                onClick={() => handleSort('date_embauche')}
                                                className="font-semibold text-gray-900"
                                            >
                                                Date d'embauche
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </Button>
                                        </th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Statut</th>
                                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {employees?.data?.map((employee) => (
                                        <tr key={employee.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-gray-900">{employee.nom_complet}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{employee.cin}</td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${getRoleBadgeColor(employee.role)} text-white`}>
                                                    {employee.role}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">{employee.telephone || '-'}</td>
                                            <td className="px-6 py-4 text-gray-600 text-sm">
                                                {getSalaryInfo(employee.salaires)}
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {new Date(employee.date_embauche).toLocaleDateString('fr-FR')}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={employee.actif ? 'default' : 'secondary'}>
                                                    {employee.actif ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <Link href={route('employees.show', employee.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Eye className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <Link href={route('employees.edit', employee.id)}>
                                                        <Button variant="outline" size="sm">
                                                            <Edit className="w-4 h-4" />
                                                        </Button>
                                                    </Link>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={() => setDeleteEmployee(employee)}
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Êtes-vous sûr de vouloir supprimer l'employé {deleteEmployee?.nom_complet} ? 
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
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* Pagination */}
                        {employees?.links && (
                            <div className="px-6 py-4 border-t">
                                <div className="flex items-center justify-between">
                                    <div className="text-sm text-gray-600">
                                        Affichage de {employees.from} à {employees.to} sur {employees.total} employés
                                    </div>
                                    <div className="flex space-x-2">
                                        {employees.links.map((link, index) => (
                                            <Button
                                                key={index}
                                                variant={link.active ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => link.url && router.get(link.url)}
                                                disabled={!link.url}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}