import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function AccountInfoForm({ data, setData, errors, isEdit = false }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <Lock className="w-5 h-5 text-[#f9c401]" />
                <div>
                    <h3 className="text-lg font-semibold text-[#262626]">
                        {isEdit ? "Modifier le mot de passe" : "Créer un compte"}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {isEdit
                            ? "Laissez vide pour conserver le mot de passe actuel"
                            : "Définissez un mot de passe sécurisé pour l'accès au système"}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="password">
                        Mot de passe {!isEdit && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="mt-1 relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            className={errors.password ? 'border-red-500' : ''}
                            placeholder={isEdit ? "Nouveau mot de passe (optionnel)" : "Entrez le mot de passe"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password_confirmation">
                        Confirmer le mot de passe {!isEdit && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="mt-1 relative">
                        <Input
                            id="password_confirmation"
                            type={showConfirmPassword ? "text" : "password"}
                            value={data.password_confirmation}
                            onChange={e => setData('password_confirmation', e.target.value)}
                            className={errors.password_confirmation ? 'border-red-500' : ''}
                            placeholder={isEdit ? "Confirmer le nouveau mot de passe" : "Confirmez le mot de passe"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4" />
                            ) : (
                                <Eye className="h-4 w-4" />
                            )}
                        </button>
                    </div>
                    {errors.password_confirmation && (
                        <p className="mt-1 text-sm text-red-500">{errors.password_confirmation}</p>
                    )}
                </div>
            </div>

            {isEdit && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-800">
                        <strong>Note:</strong> Si vous ne souhaitez pas changer le mot de passe,
                        laissez ces champs vides. Le mot de passe actuel sera conservé.
                    </p>
                </div>
            )}
        </div>
    );
}
