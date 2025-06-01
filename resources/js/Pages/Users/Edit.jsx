import React, { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import PersonalInfoForm from './partials/edit/PersonalInfoForm';
import RoleSelectionForm from './partials/edit/RoleSelectionForm';
import AccountInfoForm from './partials/edit/AccountInfoForm';
import SalaryInfoForm from './partials/edit/SalaryInfoForm';
import FormActions from './partials/edit/FormActions';

export default function Edit({ user, roles, salary_types }) {
    // Get the current salary data
    const currentSalary = user.salaire && user.salaire.length > 0 ? user.salaire[0] : null;

    const { data, setData, patch, processing, errors } = useForm({
        nom: user.nom || '',
        prenom: user.prenom || '',
        telephone: user.telephone || '',
        cin: user.cin || '',
        adresse: user.adresse || '',
        role: user.role || '',
        date_debut: user.date_debut || '',
        est_actif: user.est_actif ?? true,
        password: '',
        password_confirmation: '',
        type_travail: currentSalary?.type_travail || '',
        montant_salaire: currentSalary?.montant || '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showSalary, setShowSalary] = useState(user.role !== 'client');

    // Update form visibility when role changes
    useEffect(() => {
        setShowPassword(['directeur', 'comptable'].includes(data.role));
        setShowSalary(data.role !== 'client');

        // Clear password fields when role changes
        if (!['directeur', 'comptable'].includes(data.role)) {
            setData(prevData => ({
                ...prevData,
                password: '',
                password_confirmation: ''
            }));
        }

        // Clear salary fields when role is client
        if (data.role === 'client') {
            setData(prevData => ({
                ...prevData,
                type_travail: '',
                montant_salaire: ''
            }));
        }
    }, [data.role]);

    const handleRoleChange = (role) => {
        setData('role', role);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('users.update', user.id));
    };

    return (
        <AdminLayout titleHead={`Modifier ${user.nom} ${user.prenom}`} title="Modifier l'utilisateur">
            <Head title="Edit User" />

            <div className="max-w-4xl mx-auto py-8">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="bg-[#f9c401] px-6 py-4">
                        <h2 className="text-xl font-bold text-[#262626]">
                            Modifier l'utilisateur: {user.nom} {user.prenom}
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-8">
                        <PersonalInfoForm
                            data={data}
                            setData={setData}
                            errors={errors}
                        />

                        <RoleSelectionForm
                            data={data}
                            onRoleChange={handleRoleChange}
                            errors={errors}
                            roles={roles}
                        />

                        {showPassword && (
                            <AccountInfoForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                isEdit={true}
                            />
                        )}

                        {showSalary && (
                            <SalaryInfoForm
                                data={data}
                                setData={setData}
                                errors={errors}
                                salaryTypes={salary_types}
                            />
                        )}

                        <FormActions
                            processing={processing}
                            isEdit={true}
                        />
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
