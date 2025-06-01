import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Search, X } from "lucide-react";

export default function Filter({ filters, onChange }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (key, value) => {
        const newFilters = { ...localFilters, [key]: value };
        setLocalFilters(newFilters);
        onChange(newFilters);
    };

    const handleReset = () => {
        const emptyFilters = {};
        setLocalFilters(emptyFilters);
        onChange(emptyFilters);
    };

    return (
        <Card className="p-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                    <Input
                        placeholder="Rechercher..."
                        value={localFilters.search || ''}
                        onChange={e => handleChange('search', e.target.value)}
                        className="pl-10"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <Select
                    value={localFilters.role || ''}
                    onValueChange={value => handleChange('role', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="client">Client</SelectItem>
                        <SelectItem value="directeur">Directeur</SelectItem>
                        <SelectItem value="comptable">Comptable</SelectItem>
                        <SelectItem value="livreur">Livreur</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={localFilters.est_actif?.toString() || ''}
                    onValueChange={value => handleChange('est_actif', value)}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Actif</SelectItem>
                        <SelectItem value="0">Inactif</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="flex justify-end mt-4">
                <Button
                    variant="outline"
                    onClick={handleReset}
                    className="flex items-center"
                >
                    <X className="w-4 h-4 mr-2" />
                    Réinitialiser
                </Button>
            </div>
        </Card>
    );
}
