import { CreditCard, CheckCircle, Clock, AlertTriangle, TrendingDown, TrendingUp } from "lucide-react";

export default function DebtSection({ user }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            'paid': {
                icon: CheckCircle,
                label: 'Payée',
                className: 'bg-green-100 text-green-800'
            },
            'pending': {
                icon: Clock,
                label: 'En Attente',
                className: 'bg-orange-100 text-orange-800'
            },
            'overdue': {
                icon: AlertTriangle,
                label: 'En Retard',
                className: 'bg-red-100 text-red-800'
            }
        };

        const config = statusConfig[status] || statusConfig['pending'];
        const IconComponent = config.icon;

        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${config.className}`}>
                <IconComponent className="w-3 h-3 mr-1" />
                {config.label}
            </span>
        );
    };

    const currentDebt = user.dettes || 0;
    const debtHistory = user.historiqueDettes || [];
    const paidDebts = debtHistory.filter(debt => debt.status === 'paid');
    const pendingDebts = debtHistory.filter(debt => debt.status === 'pending');

    const totalPaid = paidDebts.reduce((sum, debt) => sum + (debt.montant || 0), 0);
    const totalPending = pendingDebts.reduce((sum, debt) => sum + (debt.montant || 0), 0);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    Gestion des Dettes
                </h3>
            </div>

            <div className="p-6">
                {/* Current Debt Status */}
                <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-4">Statut Actuel</h4>
                    <div className={`rounded-lg p-4 ${currentDebt > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                        <div className="flex items-center gap-3">
                            {currentDebt > 0 ? (
                                <AlertTriangle className="w-8 h-8 text-red-600" />
                            ) : (
                                <CheckCircle className="w-8 h-8 text-green-600" />
                            )}
                            <div>
                                <p className={`text-2xl font-bold ${currentDebt > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {formatCurrency(currentDebt)}
                                </p>
                                <p className={`text-sm ${currentDebt > 0 ? 'text-red-700' : 'text-green-700'}`}>
                                    {currentDebt > 0 ? 'Dette actuelle' : 'Aucune dette'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Debt Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingDown className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Payé</p>
                                <p className="text-lg font-bold text-green-600">
                                    {formatCurrency(totalPaid)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {paidDebts.length} paiement(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-gray-600">En Attente</p>
                                <p className="text-lg font-bold text-orange-600">
                                    {formatCurrency(totalPending)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {pendingDebts.length} dette(s)
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Historique</p>
                                <p className="text-lg font-bold text-blue-600">
                                    {formatCurrency(totalPaid + totalPending + currentDebt)}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {debtHistory.length} entrée(s)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Debt History */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4">Historique des Dettes</h4>

                    {debtHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun historique de dette</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {debtHistory.slice(0, 5).map((debt, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {formatCurrency(debt.montant)}
                                            </p>
                                            {debt.description && (
                                                <p className="text-sm text-gray-600">
                                                    {debt.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(debt.status)}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">
                                                {formatDate(debt.created_at)}
                                            </p>
                                            {debt.date_paiement && debt.status === 'paid' && (
                                                <p className="text-xs text-green-600">
                                                    Payé le {formatDate(debt.date_paiement)}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {debtHistory.length > 5 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-500">
                                        Et {debtHistory.length - 5} autres entrées...
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
