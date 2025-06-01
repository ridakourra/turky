import { Link, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import AdminLayout from "@/Layouts/AdminLayout";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Calendar,
  Badge,
  User as UserIcon,
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

// Import partials (kept as‐is)
import UserHeader from "./partials/show/UserHeader";
import UserStatistics from "./partials/show/UserStatistics";
import UserInfo from "./partials/show/UserInfo";
import AbsencesSection from "./partials/show/AbsencesSection";
import SalarySection from "./partials/show/SalarySection";
import DebtSection from "./partials/show/DebtSection";
import WorkHistorySection from "./partials/show/WorkHistorySection";
import RecentActivities from "./partials/show/RecentActivities";

export default function Show({
  user,
  statistics,
  recentActivities,
  canEdit = true,
  canDelete = true,
}) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDelete = () => {
    setLoading(true);
    router.delete(route("users.destroy", user.id), {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    });
    setDeleteDialog(false);
  };

  const getRoleColor = (role) => {
    const colors = {
      client: "bg-blue-100 text-blue-800",
      directeur: "bg-purple-100 text-purple-800",
      comptable: "bg-green-100 text-green-800",
      livreur: "bg-orange-100 text-orange-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
  };

  const getRoleLabel = (role) => {
    const labels = {
      client: "Client",
      directeur: "Directeur",
      comptable: "Comptable",
      livreur: "Livreur",
    };
    return labels[role] || role;
  };

  return (
    <AdminLayout
      titleHead={`${user.nom} ${user.prenom}`}
      title="Détails Utilisateur"
    >
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Link href={route("users.index")}>
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {user.nom} {user.prenom}
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(
                    user.role
                  )}`}
                >
                  {getRoleLabel(user.role)}
                </span>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-full ${
                    user.est_actif ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {user.est_actif ? "Actif" : "Inactif"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {canEdit && (
              <Link href={route("users.edit", user.id)}>
                <Button className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]">
                  <Edit className="w-4 h-4 mr-2" />
                  Modifier
                </Button>
              </Link>
            )}
            {canDelete && (
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={() => setDeleteDialog(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Supprimer
              </Button>
            )}
          </div>
        </div>

        {/* User Header Partial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <UserHeader user={user} />
        </div>

        {/* Statistics Partial */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <UserStatistics user={user} statistics={statistics} />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column – combines UserInfo & role-specific sections */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Informations Personnelles</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Phone className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Téléphone :</span>
                  <span className="text-sm text-gray-900">
                    {user.telephone || "–"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Adresse :</span>
                  <span className="text-sm text-gray-900">{user.adresse || "–"}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date de début :</span>
                  <span className="text-sm text-gray-900">
                    {user.date_debut
                      ? new Date(user.date_debut).toLocaleDateString("fr-FR")
                      : "–"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Rôle :</span>
                  <span className="text-sm text-gray-900">{getRoleLabel(user.role)}</span>
                </div>
              </div>
            </div>

            {/* User Info Partial */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <UserInfo user={user} />
            </div>

            {/* Role-specific sections, each in its own card wrapper */}
            {user.role === "client" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <DebtSection user={user} />
              </div>
            )}

            {user.role !== "client" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <SalarySection user={user} />
              </div>
            )}

            {user.role === "livreur" && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <WorkHistorySection user={user} />
              </div>
            )}

            {/* Absences Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <AbsencesSection user={user} />
            </div>
          </div>

          {/* Right Column – Recent Activities */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <RecentActivities activities={recentActivities} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer l'utilisateur{" "}
              <strong>
                {user.nom} {user.prenom}
              </strong>
              ? Cette action est irréversible et supprimera toutes les données associées.
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
