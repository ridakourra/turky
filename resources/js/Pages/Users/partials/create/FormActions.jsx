import React from 'react';
import { Save, RotateCcw, ArrowLeft } from 'lucide-react';

export default function FormActions({ processing, onReset }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            {/* Left side - Back button */}
            <div>
                <a
                    href={route('users.index')}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f9c401] transition-colors"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Retour à la liste
                </a>
            </div>

            {/* Right side - Action buttons */}
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {/* Reset button */}
                <button
                    type="button"
                    onClick={onReset}
                    disabled={processing}
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Réinitialiser
                </button>

                {/* Submit button */}
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-[#f9c401] border border-transparent rounded-md hover:bg-[#f9c401]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f9c401] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {processing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Création en cours...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Créer l'utilisateur
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
