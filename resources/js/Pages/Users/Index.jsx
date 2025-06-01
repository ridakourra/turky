import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import Filter from "./partials/index/Filter";
import Table from "./partials/index/Table";
import Pagination from "./partials/index/Pagination";
import Statistics from "./partials/index/Statistics";
import { UserPlus } from "lucide-react"; // Remove Download, Upload imports
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Index({ users, filters, roles }) {
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });
    const [loading, setLoading] = useState(false);

    const handleDelete = (user) => {
        setDeleteDialog({ isOpen: true, user });
    };

    const confirmDelete = () => {
        if (deleteDialog.user) {
            setLoading(true);
            router.delete(route('users.destroy', deleteDialog.user.id), {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                }
            });
        }
        setDeleteDialog({ isOpen: false, user: null });
    };

    const handleFilterChange = (newFilters) => {
        router.get(route('users.index'), newFilters, {
            preserveState: true,
            replace: true,
            only: ['users', 'filters']
        });
    };

    const handleSort = (field) => {
        const currentSort = filters.sort_by;
        const currentDirection = filters.sort_direction || 'asc';

        const newDirection = currentSort === field && currentDirection === 'asc' ? 'desc' : 'asc';

        handleFilterChange({
            ...filters,
            sort_by: field,
            sort_direction: newDirection
        });
    };

    return (
        <AdminLayout titleHead="Gestion des Utilisateurs" title="Utilisateurs">
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Utilisateurs</h1>
                        <p className="text-gray-600 mt-1">
                            Gérez tous les utilisateurs du système
                        </p>
                    </div>
                    <Link href={route('users.create')}>
                        <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                            <UserPlus className="w-4 h-4 mr-2" />
                            Nouveau Utilisateur
                        </Button>
                    </Link>
                </div>

                {/* Statistics */}
                <Statistics users={users} />

                {/* Filter */}
                <Filter
                    filters={filters}
                    roles={roles}
                    onChange={handleFilterChange}
                />

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <Table
                        users={users}
                        onDelete={handleDelete}
                        onSort={handleSort}
                        currentSort={filters.sort_by}
                        sortDirection={filters.sort_direction}
                    />

                    {/* Pagination */}
                    {users.data.length > 0 && (
                        <div className="border-t border-gray-200 px-6 py-4">
                            <Pagination
                                data={users}
                                filters={filters}
                                onChange={handleFilterChange}
                            />
                        </div>
                    )}
                </div>

                {/* Empty State */}
                {users.data.length === 0 && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <UserPlus className="w-12 h-12 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                            Aucun utilisateur trouvé
                        </h3>
                        <p className="text-gray-500 mb-4">
                            {Object.keys(filters).some(key => filters[key])
                                ? "Aucun utilisateur ne correspond aux critères de recherche."
                                : "Commencez par créer votre premier utilisateur."
                            }
                        </p>
                        {!Object.keys(filters).some(key => filters[key]) && (
                            <Link href={route('users.create')}>
                                <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Créer un utilisateur
                                </Button>
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Dialog */}
            <AlertDialog
                open={deleteDialog.isOpen}
                onOpenChange={isOpen => !isOpen && setDeleteDialog({ isOpen: false, user: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                        <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer l'utilisateur{' '}
                            <strong>
                                {deleteDialog.user?.nom} {deleteDialog.user?.prenom}
                            </strong>
                            ? Cette action est irréversible et supprimera toutes les données associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            {loading ? 'Suppression...' : 'Supprimer'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
