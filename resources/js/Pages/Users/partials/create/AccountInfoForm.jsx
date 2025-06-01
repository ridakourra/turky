import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Key } from 'lucide-react';

export default function AccountInfoForm({ data, setData, errors }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="space-y-6 bg-blue-50/30 p-6 rounded-lg border border-blue-200">
            <div className="border-b border-blue-200 pb-4">
                <h3 className="text-lg font-semibold text-[#262626] flex items-center">
                    <Lock className="mr-2 h-5 w-5 text-[#f9c401]" />
                    Informations de compte
                </h3>
                <p className="text-sm text-blue-600 mt-1">
                    Configuration du compte de connexion pour l'accès au système
                </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <Key className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-medium text-blue-800">
                            Compte requis
                        </h4>
                        <p className="text-sm text-blue-600 mt-1">
                            Ce rôle nécessite un compte de connexion pour accéder au système d'administration.
                            Veuillez définir un mot de passe sécurisé.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mot de passe */}
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-[#262626] mb-2">
                        Mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                                errors.password ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Entrez le mot de passe"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
                    <div className="mt-1 text-xs text-gray-500">
                        Minimum 6 caractères requis
                    </div>
                </div>

                {/* Confirmation du mot de passe */}
                <div>
                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-[#262626] mb-2">
                        Confirmer le mot de passe <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                                errors.password_confirmation ? 'border-red-500' : 'border-gray-300'
                            }`}
                            placeholder="Confirmez le mot de passe"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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

            {/* Password strength indicator */}
            {data.password && (
                <div className="space-y-2">
                    <div className="text-sm font-medium text-[#262626]">
                        Force du mot de passe:
                    </div>
                    <div className="flex space-x-1">
                        <div className={`h-2 w-1/4 rounded ${
                            data.password.length >= 6 ? 'bg-red-400' : 'bg-gray-200'
                        }`} />
                        <div className={`h-2 w-1/4 rounded ${
                            data.password.length >= 8 ? 'bg-yellow-400' : 'bg-gray-200'
                        }`} />
                        <div className={`h-2 w-1/4 rounded ${
                            data.password.length >= 10 && /[A-Z]/.test(data.password) ? 'bg-blue-400' : 'bg-gray-200'
                        }`} />
                        <div className={`h-2 w-1/4 rounded ${
                            data.password.length >= 12 && /[A-Z]/.test(data.password) && /[0-9]/.test(data.password) ? 'bg-green-400' : 'bg-gray-200'
                        }`} />
                    </div>
                    <div className="text-xs text-gray-500 space-y-1">
                        <div className={`flex items-center ${data.password.length >= 6 ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="mr-2">•</span>
                            Au moins 6 caractères
                        </div>
                        <div className={`flex items-center ${data.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="mr-2">•</span>
                            Au moins 8 caractères (recommandé)
                        </div>
                        <div className={`flex items-center ${/[A-Z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="mr-2">•</span>
                            Au moins une majuscule (recommandé)
                        </div>
                        <div className={`flex items-center ${/[0-9]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}`}>
                            <span className="mr-2">•</span>
                            Au moins un chiffre (recommandé)
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
