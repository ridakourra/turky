import {
    UserX,
    CreditCard,
    Banknote,
    Package,
    TrendingUp,
    AlertTriangle,
    CheckCircle,
    Clock
} from "lucide-react";

export default function UserStatistics({ user, statistics }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const getStatCards = () => {
        const baseCards = [
            {
                title: "Total Absences",
                value: statistics.totalAbsences || 0,
                icon: UserX,
                color: "text-red-600",
                bgColor: "bg-red-50"
            },
            {
                title: "Absences Justifiées",
                value: statistics.justifiedAbsences || 0,
                icon: CheckCircle,
                color: "text-green-600",
                bgColor: "bg-green-50"
            },
            {
                title: "Absences Non Justifiées",
                value: statistics.unjustifiedAbsences || 0,
                icon: AlertTriangle,
                color: "text-orange-600",
                bgColor: "bg-orange-50"
            }
        ];

        // Role-specific cards
        if (user.role === 'client') {
            return [
                ...baseCards,
                {
                    title: "Dettes Actuelles",
                    value: formatCurrency(statistics.totalDettes || 0),
                    icon: CreditCard,
                    color: "text-red-600",
                    bgColor: "bg-red-50"
                },
                {
                    title: "Dettes Payées",
                    value: formatCurrency(statistics.paidDettes || 0),
                    icon: CheckCircle,
                    color: "text-green-600",
                    bgColor: "bg-green-50"
                },
                {
                    title: "Dettes En Attente",
                    value: formatCurrency(statistics.pendingDettes || 0),
                    icon: Clock,
                    color: "text-orange-600",
                    bgColor: "bg-orange-50"
                }
            ];
        } else {
            const salaryCards = [
                ...baseCards,
                {
                    title: "Salaire Actuel",
                    value: formatCurrency(statistics.currentSalary || 0),
                    icon: Banknote,
                    color: "text-blue-600",
                    bgColor: "bg-blue-50"
                },
                {
                    title: "Total Salaires Payés",
                    value: formatCurrency(statistics.totalSalaryPaid || 0),
                    icon: TrendingUp,
                    color: "text-green-600",
                    bgColor: "bg-green-50"
                },
                {
                    title: "Nombre de Paiements",
                    value: statistics.totalSalaryPayments || 0,
                    icon: CheckCircle,
                    color: "text-purple-600",
                    bgColor: "bg-purple-50"
                }
            ];

            // Additional cards for workers with production tracking
            if (user.role === 'livreur' && statistics.totalWorkHistory) {
                salaryCards.push(
                    {
                        title: "Total Produit",
                        value: `${statistics.totalQuantityProduced || 0} unités`,
                        icon: Package,
                        color: "text-indigo-600",
                        bgColor: "bg-indigo-50"
                    },
                    {
                        title: "Moyenne Quotidienne",
                        value: `${statistics.averageDaily || 0} unités`,
                        icon: TrendingUp,
                        color: "text-teal-600",
                        bgColor: "bg-teal-50"
                    }
                );
            }

            return salaryCards;
        }
    };

    const statCards = getStatCards();

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${card.bgColor}`}>
                            <card.icon className={`w-5 h-5 ${card.color}`} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">{card.title}</p>
                            <p className="text-lg font-semibold text-gray-900">{card.value}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
