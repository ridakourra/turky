import { Package, TrendingUp, Calendar, BarChart3, Activity } from "lucide-react";

export default function WorkHistorySection({ user }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const formatDateTime = (date) => {
        return new Date(date).toLocaleString('fr-FR');
    };

    const workHistory = user.historiqueTravails || [];
    const totalQuantity = workHistory.reduce((sum, work) => sum + (work.quatite || 0), 0);
    const averageQuantity = workHistory.length > 0 ? Math.round(totalQuantity / workHistory.length) : 0;

    // Group by date for better visualization
    const groupedWork = workHistory.reduce((acc, work) => {
        const date = new Date(work.created_at).toDateString();
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(work);
        return acc;
    }, {});

    const dailyTotals = Object.entries(groupedWork).map(([date, works]) => ({
        date,
        total: works.reduce((sum, work) => sum + (work.quatite || 0), 0),
        count: works.length
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Historique de Travail
                </h3>
            </div>

            <div className="p-6">
                {/* Work Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Package className="w-5 h-5 text-blue-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Produit</p>
                                <p className="text-2xl font-bold text-blue-600">{totalQuantity}</p>
                                <p className="text-xs text-gray-500">unités</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Moyenne</p>
                                <p className="text-2xl font-bold text-green-600">{averageQuantity}</p>
                                <p className="text-xs text-gray-500">par session</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-purple-600" />
                            <div>
                                <p className="text-sm text-gray-600">Sessions</p>
                                <p className="text-2xl font-bold text-purple-600">{workHistory.length}</p>
                                <p className="text-xs text-gray-500">total</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-orange-600" />
                            <div>
                                <p className="text-sm text-gray-600">Jours Actifs</p>
                                <p className="text-2xl font-bold text-orange-600">{Object.keys(groupedWork).length}</p>
                                <p className="text-xs text-gray-500">jours</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Summary */}
                {dailyTotals.length > 0 && (
                    <div className="mb-6">
                        <h4 className="font-medium text-gray-900 mb-4">Résumé par Jour</h4>
                        <div className="space-y-2">
                            {dailyTotals.slice(0, 7).map((day, index) => (
                                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="w-4 h-4 text-gray-600" />
                                        <span className="font-medium text-gray-900">
                                            {new Date(day.date).toLocaleDateString('fr-FR')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-600">
                                            {day.count} session(s)
                                        </span>
                                        <span className="font-bold text-blue-600">
                                            {day.total} unités
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Detailed Work History */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4">Historique Détaillé</h4>

                    {workHistory.length === 0 ? (
                        <div className="text-center py-8">
                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Aucun historique de travail enregistré</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {workHistory.slice(0, 10).map((work, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Package className="w-5 h-5 text-gray-600" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {work.quatite} unités produites
                                            </p>
                                            {work.description && (
                                                <p className="text-sm text-gray-600">
                                                    {work.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatDate(work.created_at)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDateTime(work.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}

                            {workHistory.length > 10 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-500">
                                        Et {workHistory.length - 10} autres entrées...
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
