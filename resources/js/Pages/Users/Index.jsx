import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import {
  Users, UserPlus, Search, Filter, Download, Eye, Edit,
  Trash2, ToggleLeft, ToggleRight, CreditCard, AlertCircle,
  ChevronUp, ChevronDown, Calendar, Phone, MapPin, UserX,
  Building, DollarSign, Clock
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import AdminLayout from '@/Layouts/AdminLayout';

export default function UsersIndex({ users, statistics, filters, roles }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedRole, setSelectedRole] = useState(filters.role || null);
    const [selectedStatus, setSelectedStatus] = useState(filters.status || null);
    const [hasDebt, setHasDebt] = useState(filters.has_debt || null);
    const [sortBy, setSortBy] = useState(filters.sort_by || 'created_at');
    const [sortDirection, setSortDirection] = useState(filters.sort_direction || 'desc');

  const handleSearch = () => {
    router.get(route('users.index'), {
      search: searchTerm,
      role: selectedRole === null ? '' : selectedRole,
      status: selectedStatus === null ? '' : selectedStatus,
      has_debt: hasDebt === null ? '' : hasDebt,
      sort_by: sortBy,
      sort_direction: sortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const handleSort = (column) => {
    const newSortDirection = sortBy === column && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortBy(column);
    setSortDirection(newSortDirection);

    router.get(route('users.index'), {
      search: searchTerm,
      role: selectedRole,
      status: selectedStatus,
      has_debt: hasDebt,
      sort_by: column,
      sort_direction: newSortDirection,
    }, {
      preserveState: true,
      replace: true,
    });
  };

  const toggleUserStatus = (userId) => {
    router.post(route('users.toggle-status', userId), {}, {
      preserveScroll: true,
    });
  };

  const deleteUser = (userId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      router.delete(route('users.destroy', userId));
    }
  };

  const exportUsers = () => {
    window.location.href = route('users.export', {
      search: searchTerm,
      role: selectedRole,
      status: selectedStatus,
      has_debt: hasDebt,
    });
  };

  const getRoleBadgeColor = (role) => {
    const colors = {
      client: 'bg-blue-100 text-blue-800 border-blue-200',
      directeur: 'bg-red-100 text-red-800 border-red-200',
      comptable: 'bg-green-100 text-green-800 border-green-200',
      livreur: 'bg-orange-100 text-orange-800 border-orange-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: 'Client',
      directeur: 'Directeur',
      comptable: 'Comptable',
      livreur: 'Livreur',
    };
    return labels[role] || role;
  };

  const getRoleIcon = (role) => {
    const icons = {
      client: Users,
      directeur: Building,
      comptable: DollarSign,
      livreur: Clock,
    };
    const IconComponent = icons[role] || Users;
    return <IconComponent className="w-4 h-4" />;
  };

  const SortIcon = ({ column }) => {
    if (sortBy !== column) return null;
    return sortDirection === 'asc' ?
      <ChevronUp className="w-4 h-4 inline ml-1" /> :
      <ChevronDown className="w-4 h-4 inline ml-1" />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedRole(null);
    setSelectedStatus(null);
    setHasDebt(null);
    router.get(route('users.index'));
  };

  return (
    <>
      <AdminLayout title="Gestion des Utilisateurs">
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 mt-1">Gérer tous les utilisateurs du système</p>
            </div>
            <div className="flex gap-3">
                <Button onClick={exportUsers} variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Exporter
                </Button>
                <Link href={route('users.create')}>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <UserPlus className="w-4 h-4" />
                    Nouvel Utilisateur
                </Button>
                </Link>
            </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Card className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Utilisateurs</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-gray-900">{statistics.total_users}</div>
                    <Users className="w-8 h-8 text-blue-500" />
                </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Utilisateurs Actifs</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-green-600">{statistics.active_users}</div>
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-red-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Inactifs</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-red-600">{statistics.inactive_users}</div>
                    <UserX className="w-8 h-8 text-red-500" />
                </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-orange-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Total Dettes</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-orange-600">
                    {new Intl.NumberFormat('fr-MA', {
                        style: 'currency',
                        currency: 'MAD'
                    }).format(statistics.total_debt)}
                    </div>
                    <CreditCard className="w-8 h-8 text-orange-500" />
                </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-purple-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Employés</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-purple-600">{statistics.employees_count}</div>
                    <Building className="w-8 h-8 text-purple-500" />
                </div>
                </CardContent>
            </Card>

            <Card className="border-l-4 border-l-indigo-500">
                <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">Clients</CardTitle>
                </CardHeader>
                <CardContent>
                <div className="flex items-center justify-between">
                    <div className="text-2xl font-bold text-indigo-600">{statistics.clients_count}</div>
                    <Users className="w-8 h-8 text-indigo-500" />
                </div>
                </CardContent>
            </Card>
            </div>

            {/* Filters and Search */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filtres et Recherche
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div>
                    <Input
                    type="text"
                    placeholder="Rechercher par nom, téléphone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                    />
                </div>

                {/* Role Select */}
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                    <SelectTrigger>
                    <SelectValue placeholder="Tous les rôles" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="client">Client</SelectItem>
                    <SelectItem value="directeur">Directeur</SelectItem>
                    <SelectItem value="comptable">Comptable</SelectItem>
                    <SelectItem value="livreur">Livreur</SelectItem>
                    </SelectContent>
                </Select>

                {/* Status Select */}
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                    <SelectValue placeholder="Tous les statuts" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="active">Actifs</SelectItem>
                    <SelectItem value="inactive">Inactifs</SelectItem>
                    </SelectContent>
                </Select>

                {/* Debt Select */}
                <Select value={hasDebt} onValueChange={setHasDebt}>
                    <SelectTrigger>
                    <SelectValue placeholder="Dettes" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="yes">Avec dettes</SelectItem>
                    <SelectItem value="no">Sans dettes</SelectItem>
                    </SelectContent>
                </Select>

                <div className="flex gap-2">
                    <Button onClick={handleSearch} className="flex-1">
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                    </Button>
                    <Button onClick={clearFilters} variant="outline">
                    Effacer
                    </Button>
                </div>
                </div>
            </CardContent>
            </Card>

            {/* Users Table */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Liste des Utilisateurs ({users.data.length})
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                    <tr className="border-b">
                        <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('nom')}>
                        <div className="flex items-center gap-2">
                            Nom Complet
                            <SortIcon column="nom" />
                        </div>
                        </th>
                        <th className="text-left p-3">
                        Contact
                        </th>
                        <th className="text-left p-3">
                        Rôle
                        </th>
                        <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('date_debut')}>
                        <div className="flex items-center gap-2">
                            Date Début
                            <SortIcon column="date_debut" />
                        </div>
                        </th>
                        <th className="text-left p-3">
                        Statut
                        </th>
                        <th className="text-left p-3 cursor-pointer hover:bg-gray-50" onClick={() => handleSort('dettes')}>
                        <div className="flex items-center gap-2">
                            Dettes
                            <SortIcon column="dettes" />
                        </div>
                        </th>
                        <th className="text-right p-3">
                        Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.data.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                            <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-bold">
                                {user.nom.charAt(0)}{user.prenom.charAt(0)}
                            </div>
                            <div>
                                <div className="font-semibold text-gray-900">
                                {user.prenom} {user.nom}
                                </div>
                                <div className="text-sm text-gray-500">
                                CIN: {user.cin}
                                </div>
                            </div>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-gray-400" />
                                {user.telephone}
                            </div>
                            {user.adresse && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                {user.adresse}
                                </div>
                            )}
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                            {getRoleIcon(user.role)}
                            <Badge className={getRoleBadgeColor(user.role)}>
                                {getRoleLabel(user.role)}
                            </Badge>
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="flex items-center gap-2 text-sm">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            {new Date(user.date_debut).toLocaleDateString('fr-FR')}
                            </div>
                        </td>
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                            {user.est_actif ? (
                                <ToggleRight className="w-5 h-5 text-green-500" />
                            ) : (
                                <ToggleLeft className="w-5 h-5 text-gray-400" />
                            )}
                            <Badge className={user.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {user.est_actif ? 'Actif' : 'Inactif'}
                            </Badge>
                            </div>
                        </td>
                        <td className="p-3">
                            {user.dettes > 0 ? (
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-orange-500" />
                                <span className="font-semibold text-orange-600">
                                {new Intl.NumberFormat('fr-MA', {
                                    style: 'currency',
                                    currency: 'MAD'
                                }).format(user.dettes)}
                                </span>
                            </div>
                            ) : (
                            <span className="text-green-600 font-medium">Aucune dette</span>
                            )}
                        </td>
                        <td className="p-3">
                            <div className="flex items-center gap-2">
                            <Link href={route('users.show', user.id)}>
                                <Button size="sm" variant="outline" className="text-blue-600 hover:text-blue-700">
                                <Eye className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Link href={route('users.edit', user.id)}>
                                <Button size="sm" variant="outline" className="text-green-600 hover:text-green-700">
                                <Edit className="w-4 h-4" />
                                </Button>
                            </Link>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleUserStatus(user.id)}
                                className={user.est_actif ? 'text-orange-600 hover:text-orange-700' : 'text-green-600 hover:text-green-700'}
                            >
                                {user.est_actif ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => deleteUser(user.id)}
                                className="text-red-600 hover:text-red-700"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                            </div>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 && (
                <div className="flex items-center justify-between mt-6">
                    <div className="text-sm text-gray-500">
                    Affichage de {users.from} à {users.to} sur {users.total} résultats
                    </div>
                    <div className="flex gap-2">
                    {users.links.map((link, index) => (
                        <Button
                        key={index}
                        size="sm"
                        variant={link.active ? "default" : "outline"}
                        onClick={() => link.url && router.visit(link.url)}
                        disabled={!link.url}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                    </div>
                </div>
                )}
            </CardContent>
            </Card>
        </div>

      </AdminLayout>
    </>
  );
}
