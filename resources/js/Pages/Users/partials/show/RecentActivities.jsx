import {
    UserX,
    CreditCard,
    Banknote,
    Package,
    CheckCircle,
    Clock,
    AlertTriangle
} from "lucide-react";

export default function RecentActivities({ activities }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getActivityIcon = (type) => {
        const icons = {
            absence: UserX,
            dette: CreditCard,
            salaire: Banknote,
            travail: Package
        };
        return icons[type] || Clock;
    };

    const getActivityColor = (status) => {
        const colors = {
            justified: 'text-green-600',
            unjustified: 'text-red-600',
            paid: 'text-green-600',
            pending: 'text-orange-600',
            completed: 'text-blue-600',
            default: 'text-gray-600'
        };
        return colors[status] || colors.default;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            justified: {
                icon: CheckCircle,
                label: 'Justifiée',
                className: 'bg-green-100 text-green-800'
            },
            unjustified: {
                icon: AlertTriangle,
                label: 'Non Justifiée',
                className: 'bg-red-100 text-red-800'
            },
            paid: {
                icon: CheckCircle,
                label: 'Payé',
                className: 'bg-green-100 text-green-800'
            },
            pending: {
                icon: Clock,
                label: 'En Attente',
                className: 'bg-orange-100 text-orange-800'
            },
            completed: {
                icon: CheckCircle,
                label: 'Complété',
                className: 'bg-blue-100 text-blue-800'
            }
        };

        if (!statusConfig[status]) return null;

        const { icon: Icon, label, className } = statusConfig[status];
        return (
            <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${className}`}>
                <Icon className="w-3 h-3 mr-1" />
                {label}
            </span>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                    Activités Récentes
                </h3>
            </div>

            <div className="divide-y divide-gray-100">
                {activities.length === 0 ? (
                    <div className="p-6 text-center">
                        <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">Aucune activité récente</p>
                    </div>
                ) : (
                    activities.map((activity, index) => {
                        const Icon = getActivityIcon(activity.type);
                        return (
                            <div key={index} className="p-4 hover:bg-gray-50">
                                <div className="flex items-start gap-3">
                                    <div className={`mt-1 ${getActivityColor(activity.status)}`}>
                                        <Icon className="w-5 h-5" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-gray-900">
                                                {activity.title}
                                            </p>
                                            {getStatusBadge(activity.status)}
                                        </div>

                                        <p className="text-sm text-gray-600 mt-0.5">
                                            {activity.description}
                                        </p>

                                        <p className="text-xs text-gray-500 mt-1">
                                            {formatDate(activity.date)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
