import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  MapPin,
  Clipboard,
  User as UserIcon,
  TrendingUp,  // تمّ التعديل هنا
} from "lucide-react";
import { useState } from "react";
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

export default function Show({ vehicule }) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    router.delete(route("vehicules.destroy", vehicule.id), {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    });
    setDeleteDialog(false);
  };

  return (
    <AdminLayout titleHead={`${vehicule.nom}`} title="Détails Véhicule">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href={route("vehicules.index")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{vehicule.nom}</h1>
              <div className="flex items-center gap-2 mt-1">
                {vehicule.actif ? (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                    Actif
                  </span>
                ) : (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                    Inactif
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Link href={route("vehicules.edit", vehicule.id)}>
              <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                <Edit className="w-4 h-4 mr-2" />
                Modifier
              </Button>
            </Link>
            <Button
              variant="outline"
              className="border-red-200 text-red-600 hover:bg-red-50"
              onClick={() => setDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
            </Button>
          </div>
        </div>

        {/* Photo */}
        {vehicule.photo && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <img
              src={`/storage/${vehicule.photo}`}
              alt={vehicule.nom}
              className="w-full max-h-64 object-cover rounded-md"
            />
          </div>
        )}

        {/* Main Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-center space-x-2">
            <Clipboard className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Matricule :</span>
            <span className="text-sm text-gray-900">{vehicule.matricule}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gray-500" /> {/* هنا استخدمنا TrendingUp */}
            <span className="text-sm font-medium text-gray-700">Type :</span>
            <span className="text-sm text-gray-900">
              {vehicule.type || "–"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <UserIcon className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Chauffeur :</span>
            <span className="text-sm text-gray-900">
              {vehicule.chauffeur
                ? `${vehicule.chauffeur.nom} ${vehicule.chauffeur.prenom}`
                : "–"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Capacité (t) :</span>
            <span className="text-sm text-gray-900">
              {vehicule.capacite_tonne !== null ? vehicule.capacite_tonne : "–"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Consommation (L/km) :
            </span>
            <span className="text-sm text-gray-900">
              {vehicule.consommation_litre_par_km !== null
                ? vehicule.consommation_litre_par_km
                : "–"}
            </span>
          </div>

          {/* Notes */}
          <div className="space-y-1">
            <span className="text-sm font-medium text-gray-700">Notes :</span>
            <p className="text-sm text-gray-900">{vehicule.notes || "–"}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer le véhicule{" "}
              <strong>{vehicule.nom}</strong> ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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
