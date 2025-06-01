import { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import AdminLayout from "@/Layouts/AdminLayout";

export default function Edit({ user }) {
    const { data, setData, patch, processing, errors } = useForm({
        nom: user.nom,
        prenom: user.prenom,
        telephone: user.telephone || '',
        cin: user.cin,
        password: '',
        adresse: user.adresse || '',
        role: user.role,
        date_debut: user.date_debut || '',
        est_actif: user.est_actif
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit User" />

            <div className="max-w-2xl mx-auto py-8">
                <h2 className="text-2xl font-bold text-[#262626] mb-6">Edit User</h2>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
                    {/* Same form fields as Create.jsx but with existing values */}
                    {/* ... Copy the form fields from Create.jsx ... */}

                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.get(route('users.index'))}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]"
                        >
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </AdminLayout>
    );
}
