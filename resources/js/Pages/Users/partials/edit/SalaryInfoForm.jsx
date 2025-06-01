import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Wallet } from "lucide-react";

export default function SalaryInfoForm({ data, setData, errors, salaryTypes }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Wallet className="w-5 h-5 text-[#f9c401]" />
                <h3 className="text-lg font-semibold text-[#262626]">
                    Configuration du Salaire
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="type_travail">
                        Type de Salaire <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1">
                        <Select
                            value={data.type_travail}
                            onValueChange={value => setData('type_travail', value)}
                        >
                            <SelectTrigger
                                id="type_travail"
                                className={errors.type_travail ? 'border-red-500' : ''}
                            >
                                <SelectValue placeholder="Sélectionner le type" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(salaryTypes || {}).map(([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.type_travail && (
                            <p className="mt-1 text-sm text-red-500">{errors.type_travail}</p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="montant_salaire">
                        Montant (MAD) <span className="text-red-500">*</span>
                    </Label>
                    <div className="mt-1">
                        <Input
                            id="montant_salaire"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={data.montant_salaire}
                            onChange={e => setData('montant_salaire', e.target.value)}
                            className={errors.montant_salaire ? 'border-red-500' : ''}
                        />
                        {errors.montant_salaire && (
                            <p className="mt-1 text-sm text-red-500">{errors.montant_salaire}</p>
                        )}
                    </div>
                </div>
            </div>

            {data.type_travail && (
                <div className="p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                        <strong>Note:</strong>
                        {data.type_travail === 'par_jour' && ' Ce montant sera payé quotidiennement.'}
                        {data.type_travail === 'par_mois' && ' Ce montant sera payé mensuellement.'}
                        {data.type_travail === 'par_produit' && ' Ce montant sera payé par unité produite.'}
                    </p>
                </div>
            )}
        </div>
    );
}
