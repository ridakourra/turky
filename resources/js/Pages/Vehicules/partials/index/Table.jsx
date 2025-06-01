import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import {
  Eye,
  Edit,
  Trash2,
  ChevronsUpDown,
} from "lucide-react";

export default function Table({
  vehicules,
  onDelete,
  onSort,
  currentSort,
  sortDirection,
}) {
  const SortHeader = ({ field, label }) => {
    const isActive = currentSort === field;
    const direction = isActive ? sortDirection : null;

    return (
      <th
        scope="col"
        className="cursor-pointer px-4 py-2 text-left text-sm font-medium text-gray-700"
        onClick={() => onSort(field)}
      >
        <div className="flex items-center">
          {label}
          <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />
          {isActive && (
            <span className="sr-only">
              {direction === "asc" ? "sorted ascending" : "sorted descending"}
            </span>
          )}
        </div>
      </th>
    );
  };

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <SortHeader field="nom" label="Nom" />
          <SortHeader field="matricule" label="Matricule" />
          <SortHeader field="type" label="Type" />
          <SortHeader field="chauffeur_id" label="Chauffeur" />
          <SortHeader field="capacite_tonne" label="Capacité (t)" />
          <SortHeader field="actif" label="Statut" />
          <th scope="col" className="px-4 py-2 text-left text-sm font-medium text-gray-700">
            Actions
          </th>
        </tr>
      </thead>

      <tbody className="bg-white divide-y divide-gray-200">
        {vehicules.data.map((v) => (
          <tr key={v.id}>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
              {v.nom}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
              {v.matricule}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
              {v.type || "–"}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
              {v.chauffeur
                ? `${v.chauffeur.nom} ${v.chauffeur.prenom}`
                : "–"}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
              {v.capacite_tonne !== null ? v.capacite_tonne : "–"}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm">
              {v.actif ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Actif
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Inactif
                </span>
              )}
            </td>
            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 space-x-2">
              <Link href={route("vehicules.show", v.id)}>
                <Button variant="outline" size="icon">
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Link href={route("vehicules.edit", v.id)}>
                <Button variant="outline" size="icon">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                variant="outline"
                size="icon"
                className="text-red-600 hover:bg-red-50"
                onClick={() => onDelete(v)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
