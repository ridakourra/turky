import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import Filter from "./partials/index/Filter";
import Table from "./partials/index/Table";
import Pagination from "./partials/index/Pagination";
import { Plus } from "lucide-react";
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

export default function Index({ vehicules, filters, chauffeurs }) {
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    vehicule: null,
  });
  const [loading, setLoading] = useState(false);

  const handleDelete = (v) => {
    setDeleteDialog({ isOpen: true, vehicule: v });
  };

  const confirmDelete = () => {
    if (deleteDialog.vehicule) {
      setLoading(true);
      router.delete(route("vehicules.destroy", deleteDialog.vehicule.id), {
        onSuccess: () => setLoading(false),
        onError: () => setLoading(false),
      });
    }
    setDeleteDialog({ isOpen: false, vehicule: null });
  };

  const handleFilterChange = (newFilters) => {
    router.get(
      route("vehicules.index"),
      newFilters,
      {
        preserveState: true,
        replace: true,
        only: ["vehicules", "filters"],
      }
    );
  };

  const handleSort = (field) => {
    const currentSort = filters.sort_by;
    const currentDir = filters.sort_direction || "asc";
    const newDir =
      currentSort === field && currentDir === "asc" ? "desc" : "asc";

    handleFilterChange({
      ...filters,
      sort_by: field,
      sort_direction: newDir,
    });
  };

  return (
    <AdminLayout titleHead="Gestion des Véhicules" title="Véhicules">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Véhicules</h1>
            <p className="text-gray-600 mt-1">Gérez tous les véhicules</p>
          </div>
          <Link href={route("vehicules.create")}>
            <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
              <Plus className="w-4 h-4 mr-2" />
              Nouveau Véhicule
            </Button>
          </Link>
        </div>

        {/* Filter Card */}
        <Filter
          filters={filters}
          chauffeurs={chauffeurs}
          onChange={handleFilterChange}
        />

        {/* Table Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <Table
            vehicules={vehicules}
            onDelete={handleDelete}
            onSort={handleSort}
            currentSort={filters.sort_by}
            sortDirection={filters.sort_direction}
          />

          {/* Pagination */}
          {vehicules.data.length > 0 && (
            <div className="border-t border-gray-200 px-6 py-4">
              <Pagination
                data={vehicules}
                filters={filters}
                onChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Empty State */}
        {vehicules.data.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun véhicule trouvé
            </h3>
            <p className="text-gray-500 mb-4">
              {Object.keys(filters).some((key) => filters[key])
                ? "Aucun véhicule ne correspond aux critères de recherche."
                : "Commencez par créer votre premier véhicule."}
            </p>
            {!Object.keys(filters).some((key) => filters[key]) && (
              <Link href={route("vehicules.create")}>
                <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer un Véhicule
                </Button>
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen && setDeleteDialog({ isOpen: false, vehicule: null })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le véhicule{" "}
              <strong>{deleteDialog.vehicule?.nom}</strong> ? Cette action est
              irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={loading}
              className="bg-red-500 hover:bg-red-600"
            >
              {loading ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
