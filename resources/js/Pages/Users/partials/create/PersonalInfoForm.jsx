import React from 'react';
import { User, Phone, MapPin, CreditCard, Calendar } from 'lucide-react';

export default function PersonalInfoForm({ data, setData, errors }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-[#262626] flex items-center">
                    <User className="mr-2 h-5 w-5 text-[#f9c401]" />
                    Informations personnelles
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                    Saisissez les informations de base de l'utilisateur
                </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nom */}
                <div>
                    <label htmlFor="nom" className="block text-sm font-medium text-[#262626] mb-2">
                        Nom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="nom"
                        value={data.nom}
                        onChange={(e) => setData('nom', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                            errors.nom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Entrez le nom"
                    />
                    {errors.nom && (
                        <p className="mt-1 text-sm text-red-500">{errors.nom}</p>
                    )}
                </div>

                {/* Prénom */}
                <div>
                    <label htmlFor="prenom" className="block text-sm font-medium text-[#262626] mb-2">
                        Prénom <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="prenom"
                        value={data.prenom}
                        onChange={(e) => setData('prenom', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                            errors.prenom ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Entrez le prénom"
                    />
                    {errors.prenom && (
                        <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>
                    )}
                </div>

                {/* CIN */}
                <div>
                    <label htmlFor="cin" className="block text-sm font-medium text-[#262626] mb-2">
                        <CreditCard className="inline mr-1 h-4 w-4" />
                        CIN <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="cin"
                        value={data.cin}
                        onChange={(e) => setData('cin', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                            errors.cin ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Entrez le numéro CIN"
                    />
                    {errors.cin && (
                        <p className="mt-1 text-sm text-red-500">{errors.cin}</p>
                    )}
                </div>

                {/* Téléphone */}
                <div>
                    <label htmlFor="telephone" className="block text-sm font-medium text-[#262626] mb-2">
                        <Phone className="inline mr-1 h-4 w-4" />
                        Téléphone
                    </label>
                    <input
                        type="tel"
                        id="telephone"
                        value={data.telephone}
                        onChange={(e) => setData('telephone', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                            errors.telephone ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Entrez le numéro de téléphone"
                    />
                    {errors.telephone && (
                        <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>
                    )}
                </div>

                {/* Date de début */}
                <div>
                    <label htmlFor="date_debut" className="block text-sm font-medium text-[#262626] mb-2">
                        <Calendar className="inline mr-1 h-4 w-4" />
                        Date de début
                    </label>
                    <input
                        type="date"
                        id="date_debut"
                        value={data.date_debut}
                        onChange={(e) => setData('date_debut', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                            errors.date_debut ? 'border-red-500' : 'border-gray-300'
                        }`}
                    />
                    {errors.date_debut && (
                        <p className="mt-1 text-sm text-red-500">{errors.date_debut}</p>
                    )}
                </div>

                {/* Statut actif */}
                <div className="flex items-center space-x-3">
                    <input
                        type="checkbox"
                        id="est_actif"
                        checked={data.est_actif}
                        onChange={(e) => setData('est_actif', e.target.checked)}
                        className="h-4 w-4 text-[#f9c401] focus:ring-[#f9c401] border-gray-300 rounded"
                    />
                    <label htmlFor="est_actif" className="text-sm text-[#262626]">
                        Utilisateur actif
                    </label>
                </div>
            </div>

            {/* Adresse */}
            <div>
                <label htmlFor="adresse" className="block text-sm font-medium text-[#262626] mb-2">
                    <MapPin className="inline mr-1 h-4 w-4" />
                    Adresse
                </label>
                <textarea
                    id="adresse"
                    rows={3}
                    value={data.adresse}
                    onChange={(e) => setData('adresse', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
                        errors.adresse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Entrez l'adresse complète"
                />
                {errors.adresse && (
                    <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>
                )}
            </div>
        </div>
    );
}
