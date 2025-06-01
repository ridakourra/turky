import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Save, ArrowLeft } from 'lucide-react';

export default function FormActions({ processing, isEdit = false }) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-6 border-t border-gray-200">
            <Link href={route('users.index')}>
                <Button variant="outline" type="button">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Retour à la liste
                </Button>
            </Link>

            <Button type="submit" disabled={processing}>
                {processing ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        {isEdit ? 'Mise à jour...' : 'Création...'}
                    </>
                ) : (
                    <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEdit ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
                    </>
                )}
            </Button>
        </div>
    );
}
