import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function RoleSelectionForm({ data, onRoleChange, errors, roles }) {
    const roleDescriptions = {
        client: 'Peut avoir des dettes, pas de compte requis',
        directeur: 'Accès complet au système, compte et salaire requis',
        comptable: 'Gestion financière, compte et salaire requis',
        livreur: 'Livraison des commandes, salaire requis'
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Shield className="w-5 h-5 text-[#f9c401]" />
                <h3 className="text-lg font-semibold text-[#262626]">
                    Rôle de l'Utilisateur
                </h3>
            </div>

            <div>
                <Label htmlFor="role">
                    Sélectionner un rôle <span className="text-red-500">*</span>
                </Label>
                <div className="mt-1">
                    <Select
                        value={data.role}
                        onValueChange={onRoleChange}
                    >
                        <SelectTrigger id="role" className={errors.role ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Sélectionner un rôle" />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(roles || {}).map(([value, label]) => (
                                <SelectItem key={value} value={value}>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{label}</span>
                                        <span className="text-xs text-gray-500">
                                            {roleDescriptions[value]}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.role && <p className="mt-1 text-sm text-red-500">{errors.role}</p>}
                </div>
            </div>
        </div>
    );
}
