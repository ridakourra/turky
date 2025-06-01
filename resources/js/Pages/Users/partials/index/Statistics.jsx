import { Card, CardContent } from "@/components/ui/card";
import { Users, UserCheck, UserX, CreditCard, TrendingUp, Calendar } from "lucide-react";

export default function Statistics({ users }) {
    // Calculate statistics from the users data
    const totalUsers = users.total || 0;
    const activeUsers = users.data?.filter(user => user.est_actif).length || 0;
    const inactiveUsers = totalUsers - activeUsers;

    // Calculate total debt
    const totalDebt = users.data?.reduce((sum, user) => sum + (user.dettes || 0), 0) || 0;

    // Calculate users with debt
    const usersWithDebt = users.data?.filter(user => user.dettes > 0).length || 0;

    // Calculate recent users (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUsers = users.data?.filter(user => {
        if (!user.created_at) return false;
        return new Date(user.created_at) >= thirtyDaysAgo;
    }).length || 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const stats = [
        {
            title: "Total Utilisateurs",
            value: totalUsers,
            icon: Users,
            color: "text-blue-600",
            bgColor: "bg-blue-100",
            description: "Tous les utilisateurs"
        },
        {
            title: "Utilisateurs Actifs",
            value: activeUsers,
            icon: UserCheck,
            color: "text-green-600",
            bgColor: "bg-green-100",
            description: "Comptes actifs"
        },
        {
            title: "Utilisateurs Inactifs",
            value: inactiveUsers,
            icon: UserX,
            color: "text-red-600",
            bgColor: "bg-red-100",
            description: "Comptes désactivés"
        },
        {
            title: "Total des Dettes",
            value: formatCurrency(totalDebt),
            icon: CreditCard,
            color: "text-orange-600",
            bgColor: "bg-orange-100",
            description: `${usersWithDebt} utilisateurs avec dettes`
        },
        {
            title: "Nouveaux (30j)",
            value: recentUsers,
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100",
            description: "Créés ce mois-ci"
        },
        {
            title: "Taux d'Activité",
            value: totalUsers > 0 ? `${Math.round((activeUsers / totalUsers) * 100)}%` : "0%",
            icon: Calendar,
            color: "text-indigo-600",
            bgColor: "bg-indigo-100",
            description: "Utilisateurs actifs"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        {stat.title}
                                    </p>
                                    <p className="mt-1 text-2xl font-bold text-gray-900">
                                        {stat.value}
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500">
                                        {stat.description}
                                    </p>
                                </div>
                                <div className={`flex-shrink-0 p-2 rounded-lg ${stat.bgColor}`}>
                                    <Icon className={`w-5 h-5 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
