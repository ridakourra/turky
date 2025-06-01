import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import Filter from "./partials/index/Filter";
import Table from "./partials/index/Table";
import { UserPlus } from "lucide-react";
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

export default function Index({ users, filters }) {
    const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, user: null });

    const handleDelete = (user) => {
        setDeleteDialog({ isOpen: true, user });
    };

    const confirmDelete = () => {
        if (deleteDialog.user) {
            router.delete(route('users.destroy', deleteDialog.user.id));
        }
        setDeleteDialog({ isOpen: false, user: null });
    };

    return (
        <AdminLayout titleHead="Users - Index" title="Users">
            <div className="w-full flex justify-between items-center">
                <h1 className="text-2xl font-bold">Utilisateurs</h1>
                <Link href={route('users.create')}>
                    <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Nouveau Utilisateur
                    </Button>
                </Link>
            </div>

            <Filter filters={filters} onChange={newFilters => {
                router.get(route('users.index'), newFilters, {
                    preserveState: true,
                    replace: true
                });
            }} />

            <Table users={users} onDelete={handleDelete} />

            <AlertDialog
                open={deleteDialog.isOpen}
                onOpenChange={isOpen => !isOpen && setDeleteDialog({ isOpen: false, user: null })}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Cette action ne peut pas être annulée. Cela supprimera définitivement l'utilisateur
                            et toutes les données associées.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={confirmDelete}
                            className="bg-red-500 hover:bg-red-600"
                        >
                            Supprimer
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </AdminLayout>
    );
}
