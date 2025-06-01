import React from 'react';
import { DollarSign, Clock, Package, Calendar } from 'lucide-react';

export default function SalaryInfoForm({ data, setData, errors }) {
  const typeTravailOptions = [
    {
      value: 'par_jour',
      label: 'Par jour',
      icon: Calendar,
      description: 'Salaire calculé par jour de travail',
    },
    {
      value: 'par_mois',
      label: 'Par mois',
      icon: Clock,
      description: 'Salaire mensuel fixe',
    },
    {
      value: 'par_produit',
      label: 'Par produit/pièce',
      icon: Package,
      description: 'Rémunération à la pièce ou par produit',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-semibold text-[#262626] flex items-center">
          <DollarSign className="mr-2 h-5 w-5 text-[#f9c401]" />
          Informations de salaire
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Configuration du système de rémunération pour cet employé
        </p>
      </div>

      {/* Info Box */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <DollarSign className="h-5 w-5 text-green-500 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-green-800">
              Rémunération requise
            </h4>
            <p className="text-sm text-green-600 mt-1">
              Ce rôle nécessite une configuration de salaire. Choisissez le type de travail et définissez le montant correspondant.
            </p>
          </div>
        </div>
      </div>

      {/* Type de travail */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#262626] mb-3">
            Type de travail <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {typeTravailOptions.map((option) => (
              <div
                key={option.value}
                className={`relative cursor-pointer rounded-lg border-2 p-3 transition-all hover:shadow-sm ${
                  data.type_travail === option.value
                    ? 'border-[#f9c401] bg-[#f9c401]/5'
                    : 'border-gray-200 hover:border-[#f9c401]/50'
                }`}
                onClick={() => setData('type_travail', option.value)}
              >
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="type_travail"
                    value={option.value}
                    checked={data.type_travail === option.value}
                    onChange={() => setData('type_travail', option.value)}
                    className="h-3 w-3 text-[#f9c401] focus:ring-[#f9c401]"
                  />
                  <option.icon className="h-4 w-4 text-[#f9c401]" />
                  <span className="text-sm font-medium text-[#262626]">
                    {option.label}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500 ml-5">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
          {errors.type_travail && (
            <p className="mt-2 text-sm text-red-500">{errors.type_travail}</p>
          )}
        </div>
      </div>

      {/* Montant du salaire */}
      <div>
        <label
          htmlFor="montant_salaire"
          className="block text-sm font-medium text-[#262626] mb-2"
        >
          Montant du salaire <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 text-sm">MAD</span>
          </div>
          <input
            type="number"
            id="montant_salaire"
            step="0.01"
            min="0"
            value={data.montant_salaire}
            onChange={(e) => setData('montant_salaire', e.target.value)}
            className={`w-full pl-12 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#f9c401] ${
              errors.montant_salaire ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="0.00"
          />
        </div>
        {errors.montant_salaire && (
          <p className="mt-1 text-sm text-red-500">{errors.montant_salaire}</p>
        )}

        {/* Montant info based on type */}
        {data.type_travail && (
          <div className="mt-2 text-sm text-gray-600">
            {data.type_travail === 'par_jour' && (
              <p>💡 Montant payé pour chaque jour de travail effectué</p>
            )}
            {data.type_travail === 'par_mois' && (
              <p>💡 Salaire mensuel fixe, indépendamment du nombre de jours travaillés</p>
            )}
            {data.type_travail === 'par_produit' && (
              <p>💡 Rémunération par pièce ou produit fabriqué/livré</p>
            )}
          </div>
        )}
      </div>

      {/* Calcul estimatif */}
      {data.montant_salaire && data.type_travail && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-yellow-800 mb-2">
            Estimation mensuelle approximative:
          </h4>
          <div className="text-sm text-yellow-700">
            {data.type_travail === 'par_jour' && (
              <p>
                {data.montant_salaire} MAD/jour × 22 jours ouvrables ={' '}
                <span className="font-semibold">
                  {(parseFloat(data.montant_salaire || 0) * 22).toFixed(2)} MAD/mois
                </span>
              </p>
            )}
            {data.type_travail === 'par_mois' && (
              <p>
                <span className="font-semibold">
                  {parseFloat(data.montant_salaire || 0).toFixed(2)} MAD/mois
                </span>
              </p>
            )}
            {data.type_travail === 'par_produit' && (
              <p>
                Dépend du nombre de produits traités par mois
                <br />
                <span className="text-xs">
                  (Ex: 100 produits × {data.montant_salaire} MAD ={' '}
                  {(parseFloat(data.montant_salaire || 0) * 100).toFixed(2)} MAD)
                </span>
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
