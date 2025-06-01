import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PersonalInfoForm from './partials/create/PersonalInfoForm';
import RoleSelectionForm from './partials/create/RoleSelectionForm';
import AccountInfoForm from './partials/create/AccountInfoForm';
import SalaryInfoForm from './partials/create/SalaryInfoForm';
import FormActions from './partials/create/FormActions';

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nom: '',
        prenom: '',
        telephone: '',
        cin: '',
        adresse: '',
        role: 'client',
        date_debut: '',
        est_actif: true,
        password: '',
        password_confirmation: '',
        type_travail: '',
        montant_salaire: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSalary, setShowSalary] = useState(false);

    // Update visibility based on role selection
    const handleRoleChange = (role) => {
        setData('role', role);

        // Show password fields for directeur and comptable
        setShowPassword(['directeur', 'comptable'].includes(role));

        // Show salary fields for all except client
        setShowSalary(role !== 'client');

        // Reset password and salary fields when role changes
        if (!['directeur', 'comptable'].includes(role)) {
            setData(prev => ({
                ...prev,
                password: '',
                password_confirmation: ''
            }));
        }

        if (role === 'client') {
            setData(prev => ({
                ...prev,
                type_travail: '',
                montant_salaire: ''
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('users.store'));
    };

    return (
        <AdminLayout title="Créer un utilisateur" titleHead="Créer un nouvel utilisateur">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#f9c401] px-6 py-4">
                        <h2 className="text-xl font-bold text-[#262626]">
                            Informations de l'utilisateur
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        {/* Personal Information */}
                        <PersonalInfoForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        {/* Role Selection */}
                        <RoleSelectionForm
                            data={data}
                            onRoleChange={handleRoleChange}
                            errors={errors}
                        />

                        {/* Account Information (for directeur and comptable) */}
                        {showPassword && (
                            <AccountInfoForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        )}

                        {/* Salary Information (for all except client) */}
                        {showSalary && (
                            <SalaryInfoForm
                                data={data}
                                setData={setData}
                                errors={errors}
                            />
                        )}

                        {/* Form Actions */}
                        <FormActions
                            processing={processing}
                            onReset={() => reset()}
                        />
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
