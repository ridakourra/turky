import { Banknote, TrendingUp, Calendar, DollarSign, Clock } from "lucide-react";

export default function SalarySection({ user }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const getSalaryTypeLabel = (type) => {
        const types = {
            'par_jour': 'Par Jour',
            'par_mois': 'Par Mois',
            'par_produit': 'Par Produit'
        };
        return types[type] || type;
    };

    const getSalaryTypeIcon = (type) => {
        switch(type) {
            case 'par_jour':
                return Calendar;
            case 'par_mois':
                return Clock;
            case 'par_produit':
                return TrendingUp;
            default:
                return DollarSign;
        }
    };

    const currentSalary = user.salaire?.[0];
    const salaryHistory = user.historiqueSalaires || [];
    const totalPaid = salaryHistory.reduce((sum, salary) => sum + (salary.montant || 0), 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Banknote className="w-5 h-5" />
                    Gestion des Salaires
                </h3>
            </div>

            <div className="p-6">
                {/* Current Salary Info */}
                {currentSalary && (
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">Salaire Actuel</h4>
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {(() => {
                                        const IconComponent = getSalaryTypeIcon(currentSalary.type_travail);
                                        return <IconComponent className="w-6 h-6 text-blue-600" />;
                                    })()}
                                    <div>
                                        <p className="font-semibold text-blue-900">
                                            {formatCurrency(currentSalary.montant)}
                                        </p>
                                        <p className="text-sm text-blue-700">
                                            {getSalaryTypeLabel(currentSalary.type_travail)}
                                        </p>
                                    </div>
                                </div>

                                {currentSalary.date_derniere_paiement && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">Dernier paiement</p>
                                        <p className="font-medium text-gray-900">
                                            {formatDate(currentSalary.date_derniere_paiement)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Salary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Payé</p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatCurrency(totalPaid)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Nb. Paiements</p>
                                <p className="text-lg font-bold text-purple-600">
                                    {salaryHistory.length}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-gray-600">Moyenne</p>
                                <p className="text-lg font-bold text-orange-600">
                                    {formatCurrency(salaryHistory.length > 0 ? totalPaid / salaryHistory.length : 0)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Salary History */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4">Historique des Paiements</h4>

                    {salaryHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <Banknote className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun paiement enregistré</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {salaryHistory.slice(0, 5).map((salary, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Banknote className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(salary.montant)}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Paiement de salaire
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatDate(salary.date)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(salary.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {salaryHistory.length > 5 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-500">
                                        Et {salaryHistory.length - 5} autres paiements...
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
