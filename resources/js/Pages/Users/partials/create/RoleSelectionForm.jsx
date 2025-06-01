import React from 'react';
import { Shield, Users, Calculator, Truck } from 'lucide-react';

export default function RoleSelectionForm({ data, onRoleChange, errors }) {
  const roles = [
    {
      value: 'client',
      label: 'Client',
      icon: Users,
      description: 'Utilisateur client sans compte ni salaire',
    },
    {
      value: 'directeur',
      label: 'Directeur',
      icon: Shield,
      description: 'Administrateur avec compte et salaire',
    },
    {
      value: 'comptable',
      label: 'Comptable',
      icon: Calculator,
      description: 'Gestionnaire avec compte et salaire',
    },
    {
      value: 'livreur',
      label: 'Livreur',
      icon: Truck,
      description: 'Employé avec salaire mais sans compte',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-[#262626] flex items-center">
          <Shield className="mr-2 h-5 w-5 text-[#f9c401]" />
          Rôle de l'utilisateur
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Sélectionnez le rôle qui déterminera les permissions et les fonctionnalités disponibles
        </p>
      </div>

      {/* Role options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roles.map((role) => (
          <div
            key={role.value}
            className={`relative cursor-pointer rounded-lg border-2 p-4 transition-all hover:shadow-md ${
              data.role === role.value
                ? 'border-[#f9c401] bg-[#f9c401]/5'
                : 'border-gray-200 hover:border-[#f9c401]/50'
            }`}
            onClick={() => onRoleChange(role.value)}
          >
            <div className="flex items-start space-x-3">
              <input
                type="radio"
                name="role"
                value={role.value}
                checked={data.role === role.value}
                onChange={() => onRoleChange(role.value)}
                className="mt-1 h-4 w-4 text-[#f9c401] focus:ring-[#f9c401]"
              />

              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <role.icon className="h-5 w-5 text-[#f9c401]" />
                  <span className="text-sm font-medium text-[#262626]">
                    {role.label}
                  </span>
                </div>

                <p className="mt-1 text-xs text-gray-500">
                  {role.description}
                </p>

                {/* Badges */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {role.value !== 'client' && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Salaire
                    </span>
                  )}
                  {['directeur', 'comptable'].includes(role.value) && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Compte
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Error message */}
      {errors.role && (
        <p className="text-sm text-red-500">{errors.role}</p>
      )}

      {/* Role details panel */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-[#262626] mb-2">
          Informations sur le rôle sélectionné:
        </h4>
        <div className="text-sm text-gray-600 space-y-1">
          {data.role === 'client' && (
            <>
              <p>• Aucun accès au système d'administration</p>
              <p>• Pas de salaire configuré</p>
              <p>• Utilisé pour les clients externes</p>
            </>
          )}
          {data.role === 'directeur' && (
            <>
              <p>• Accès complet au système</p>
              <p>• Compte de connexion requis</p>
              <p>• Configuration de salaire</p>
              <p>• Gestion des utilisateurs et paramètres</p>
            </>
          )}
          {data.role === 'comptable' && (
            <>
              <p>• Accès aux fonctions comptables</p>
              <p>• Compte de connexion requis</p>
              <p>• Configuration de salaire</p>
              <p>• Gestion des finances et rapports</p>
            </>
          )}
          {data.role === 'livreur' && (
            <>
              <p>• Accès limité aux fonctions de livraison</p>
              <p>• Pas de compte de connexion</p>
              <p>• Configuration de salaire</p>
              <p>• Suivi des livraisons et travail</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
