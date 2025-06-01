import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function Filter({ filters, chauffeurs, onChange }) {
  // local state: نستخدم "all" لتمثيل no‐filter داخلياً
  const [local, setLocal] = useState({
    search: filters.search || "",
    chauffeur_id: filters.chauffeur_id || "all",
    status: filters.status || "all",
    capacite_from: filters.capacite_from || "",
    capacite_to: filters.capacite_to || "",
    per_page: filters.per_page || 10,
  });

  // إصبع لتجنّب الاتصال الأوليِّ بـ onChange
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    onChange({
      search: local.search,
      chauffeur_id: local.chauffeur_id === "all" ? "" : local.chauffeur_id,
      status: local.status === "all" ? "" : local.status,
      capacite_from: local.capacite_from,
      capacite_to: local.capacite_to,
      per_page: local.per_page,
    });
  }, [local]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Rechercher</label>
          <div className="mt-1">
            <Input
              value={local.search}
              onChange={(e) => setLocal({ ...local, search: e.target.value })}
              placeholder="Nom, Matricule ou Type"
            />
          </div>
        </div>

        {/* Chauffeur */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Chauffeur</label>
          <div className="mt-1">
            <Select
              value={local.chauffeur_id}
              onValueChange={(v) => setLocal({ ...local, chauffeur_id: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                {chauffeurs.map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>
                    {c.nom} {c.prenom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <div className="mt-1">
            <Select
              value={local.status}
              onValueChange={(v) => setLocal({ ...local, status: v })}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Tous" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="inactive">Inactif</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Capacité From */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capacité ≥ (tonnes)
          </label>
          <div className="mt-1">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={local.capacite_from}
              onChange={(e) =>
                setLocal({ ...local, capacite_from: e.target.value })
              }
              placeholder="Min"
            />
          </div>
        </div>

        {/* Capacité To */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Capacité ≤ (tonnes)
          </label>
          <div className="mt-1">
            <Input
              type="number"
              min="0"
              step="0.01"
              value={local.capacite_to}
              onChange={(e) =>
                setLocal({ ...local, capacite_to: e.target.value })
              }
              placeholder="Max"
            />
          </div>
        </div>

        {/* Par page */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Par page</label>
          <div className="mt-1">
            <Select
              value={String(local.per_page)}
              onValueChange={(v) =>
                setLocal({ ...local, per_page: parseInt(v) })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Reset Filters */}
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() =>
              setLocal({
                search: "",
                chauffeur_id: "all",
                status: "all",
                capacite_from: "",
                capacite_to: "",
                per_page: 10,
              })
            }
            className="w-full"
          >
            Réinitialiser
          </Button>
        </div>
      </div>
    </div>
  );
}
