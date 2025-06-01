import { User, Briefcase, Calendar, Info } from "lucide-react";

export default function UserInfo({ user }) {
    const getRoleDescription = (role) => {
        const descriptions = {
            'client': 'Utilisateur client ayant accès aux services et pouvant avoir des dettes.',
            'directeur': 'Directeur avec accès complet au système et gestion des opérations.',
            'comptable': 'Comptable responsable de la gestion financière et des paiements.',
            'livreur': 'Livreur chargé des livraisons et du suivi de production.'
        };
        return descriptions[role] || 'Utilisateur du système.';
    };

    const getSalaryTypeLabel = (type) => {
        const types = {
            'par_jour': 'Par Jour',
            'par_mois': 'Par Mois',
            'par_produit': 'Par Produit'
        };
        return types[type] || type;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Informations Détaillées
                </h3>
            </div>

            <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <User className="w-4 h-4" />
                            Informations Personnelles
                        </h4>

                        <div className="space-y-3 pl-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Nom Complet:</span>
                                <span className="font-medium">{user.nom} {user.prenom}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">CIN:</span>
                                <span className="font-medium">{user.cin}</span>
                            </div>

                            {user.telephone && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Téléphone:</span>
                                    <span className="font-medium">{user.telephone}</span>
                                </div>
                            )}

                            {user.adresse && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Adresse:</span>
                                    <span className="font-medium text-right max-w-xs">{user.adresse}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Informations Professionnelles
                        </h4>

                        <div className="space-y-3 pl-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Rôle:</span>
                                <span className="font-medium capitalize">{user.role}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Statut:</span>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                    user.est_actif
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {user.est_actif ? 'Actif' : 'Inactif'}
                                </span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-600">Date de début:</span>
                                <span className="font-medium">
                                    {new Date(user.date_debut).toLocaleDateString('fr-FR')}
                                </span>
                            </div>

                            {/* Salary info for non-clients */}
                            {user.role !== 'client' && user.salaire && user.salaire.length > 0 && (
                                <>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type de Salaire:</span>
                                        <span className="font-medium">
                                            {getSalaryTypeLabel(user.salaire[0].type_travail)}
                                        </span>
                                    </div>

                                    {user.salaire[0].date_derniere_paiement && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Dernier Paiement:</span>
                                            <span className="font-medium">
                                                {new Date(user.salaire[0].date_derniere_paiement).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* Client debt info */}
                            {user.role === 'client' && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Dettes Actuelles:</span>
                                    <span className={`font-medium ${user.dettes > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {new Intl.NumberFormat('fr-MA', {
                                            style: 'currency',
                                            currency: 'MAD'
                                        }).format(user.dettes || 0)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Role Description */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <h4 className="font-medium text-gray-900 mb-2">Description du Rôle</h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                        {getRoleDescription(user.role)}
                    </p>
                </div>

                {/* Additional Information */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">Créé le:</span>
                            <span className="font-medium text-gray-900">
                                {new Date(user.created_at).toLocaleDateString('fr-FR')}
                            </span>
                        </div>

                        {user.updated_at && (
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Modifié le:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user.updated_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
