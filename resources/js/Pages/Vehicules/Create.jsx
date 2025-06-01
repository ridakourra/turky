import { Head, useForm } from "@inertiajs/react";
import AdminLayout from "@/Layouts/AdminLayout";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Create({ chauffeurs }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    nom: "",
    photo: null,
    matricule: "",
    type: "",
    chauffeur_id: "none", // "none" لتمثيل لا سائق
    capacite_tonne: "",
    consommation_litre_par_km: "",
    actif: true,
    notes: "",
  });

  // ضروريّ حتى نعرض معاينة الصورة فوراً عند الرفع
  const [previewUrl, setPreviewUrl] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setData("photo", file);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // قبل الإرسال، نحوّل "none" إلى ""
    post(route("vehicules.store"), {
      data: {
        ...data,
        chauffeur_id: data.chauffeur_id === "none" ? "" : data.chauffeur_id,
      },
    });
  };

  return (
    <AdminLayout titleHead="Nouveau Véhicule" title="Créer un Véhicule">
      <Head title="Create Vehicule" />
      <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nom */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <Input
              value={data.nom}
              onChange={(e) => setData("nom", e.target.value)}
              className="mt-1 w-full"
              placeholder="Entrer le nom"
            />
            {errors.nom && (
              <p className="mt-1 text-sm text-red-600">{errors.nom}</p>
            )}
          </div>

          {/* Photo */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-[#f9c401]/80 file:text-[#262626] hover:file:bg-[#f9c401]"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 h-24 w-24 object-cover rounded-md border"
              />
            )}
            {errors.photo && (
              <p className="mt-1 text-sm text-red-600">{errors.photo}</p>
            )}
          </div>

          {/* Matricule */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Matricule
            </label>
            <Input
              value={data.matricule}
              onChange={(e) => setData("matricule", e.target.value)}
              className="mt-1 w-full"
              placeholder="AB-123-CD"
            />
            {errors.matricule && (
              <p className="mt-1 text-sm text-red-600">{errors.matricule}</p>
            )}
          </div>

          {/* Type */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <Input
              value={data.type}
              onChange={(e) => setData("type", e.target.value)}
              className="mt-1 w-full"
              placeholder="Camion, Fourgon, ..."
            />
            {errors.type && (
              <p className="mt-1 text-sm text-red-600">{errors.type}</p>
            )}
          </div>

          {/* Chauffeur */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Chauffeur
            </label>
            <Select
              value={data.chauffeur_id}
              onValueChange={(v) => setData("chauffeur_id", v)}
            >
              <SelectTrigger className="mt-1 w-full">
                <SelectValue placeholder="Sélectionner un chauffeur" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Aucun</SelectItem>
                {chauffeurs.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nom} {c.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.chauffeur_id && (
              <p className="mt-1 text-sm text-red-600">{errors.chauffeur_id}</p>
            )}
          </div>

          {/* Capacité & Consommation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Capacité (tonnes)
              </label>
              <Input
                type="number"
                min="0"
                step="0.01"
                value={data.capacite_tonne}
                onChange={(e) => setData("capacite_tonne", e.target.value)}
                className="mt-1 w-full"
                placeholder="e.g. 5.00"
              />
              {errors.capacite_tonne && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.capacite_tonne}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Consommation (L/km)
              </label>
              <Input
                type="number"
                min="0"
                step="0.001"
                value={data.consommation_litre_par_km}
                onChange={(e) =>
                  setData("consommation_litre_par_km", e.target.value)
                }
                className="mt-1 w-full"
                placeholder="e.g. 0.150"
              />
              {errors.consommation_litre_par_km && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.consommation_litre_par_km}
                </p>
              )}
            </div>
          </div>

          {/* Actif & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Actif</label>
              <input
                type="checkbox"
                checked={data.actif}
                onChange={(e) => setData("actif", e.target.checked)}
                className="h-5 w-5 text-[#f9c401] border-gray-200 rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <Textarea
                value={data.notes}
                onChange={(e) => setData("notes", e.target.value)}
                className="mt-1 w-full"
                rows={3}
                placeholder="Informations supplémentaires..."
              />
              {errors.notes && (
                <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 border-t border-gray-200">
            <a
              href={route("vehicules.index")}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f9c401] transition-colors"
            >
              Retour à la liste
            </a>

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button
                type="button"
                onClick={() => reset()}
                disabled={processing}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Réinitialiser
              </button>

              <button
                type="submit"
                disabled={processing}
                className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-[#f9c401] border border-transparent rounded-md hover:bg-[#f9c401]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f9c401] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {processing ? "Enregistrement..." : "Enregistrer"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
