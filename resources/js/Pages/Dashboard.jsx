import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    DollarSign,
    TrendingUp,
    Package,
    ShoppingCart,
    Truck,
    Users,
    UserCheck,
    Calendar,
    Filter,
} from "lucide-react";
import AdminLayout from "@/Layouts/Layout";

export default function Dashboard({ metrics, recent, chartData, filters }) {
    const [selectedYear, setSelectedYear] = useState(filters.year);
    const [selectedMonth, setSelectedMonth] = useState(filters.month);

    const handleFilterChange = (type, value) => {
        const params = new URLSearchParams(window.location.search);
        params.set(type, value);
        window.location.href = `${
            window.location.pathname
        }?${params.toString()}`;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "MAD",
            minimumFractionDigits: 0,
        }).format(amount || 0);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const metricCards = [
        {
            title: "Bénéfice Net",
            value: formatCurrency(metrics.revenue_net),
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Revenus Bruts",
            value: formatCurrency(metrics.revenue_gross),
            icon: TrendingUp,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Produits",
            value: metrics.products_count,
            icon: Package,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Commandes",
            value: metrics.orders_count,
            icon: ShoppingCart,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Véhicules & Engins",
            value: metrics.vehicles_count,
            icon: Truck,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Employés",
            value: metrics.employees_count,
            icon: Users,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
        {
            title: "Clients",
            value: metrics.clients_count,
            icon: UserCheck,
            color: "text-teal-600",
            bgColor: "bg-teal-50",
        },
    ];

    return (
        <AdminLayout title="Tableau de Bord">
            {/* Header */}
            <div className="mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Tableau de Bord
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Vue d'ensemble de votre activité
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="flex items-center gap-3 bg-white p-3 rounded-lg shadow-sm border">
                        <Filter className="h-4 w-4 text-gray-500" />
                        <Select
                            value={selectedYear.toString()}
                            onValueChange={(value) =>
                                handleFilterChange("year", value)
                            }
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {filters.available_years.map((year) => (
                                    <SelectItem
                                        key={year}
                                        value={year.toString()}
                                    >
                                        {year}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={selectedMonth.toString()}
                            onValueChange={(value) =>
                                handleFilterChange("month", value)
                            }
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(filters.months).map(
                                    ([value, label]) => (
                                        <SelectItem key={value} value={value}>
                                            {label}
                                        </SelectItem>
                                    )
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metricCards.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                        <Card
                            key={index}
                            className="hover:shadow-lg transition-shadow duration-200"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 mb-1">
                                            {metric.title}
                                        </p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {metric.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-full ${metric.bgColor}`}
                                    >
                                        <Icon
                                            className={`h-6 w-6 ${metric.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Chart */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Évolution Mensuelle {selectedYear}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip
                                formatter={(value) => formatCurrency(value)}
                                labelStyle={{ color: "#374151" }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#3B82F6"
                                strokeWidth={2}
                                name="Revenus"
                                dot={{ fill: "#3B82F6" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expenses"
                                stroke="#EF4444"
                                strokeWidth={2}
                                name="Dépenses"
                                dot={{ fill: "#EF4444" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="profit"
                                stroke="#10B981"
                                strokeWidth={2}
                                name="Bénéfice"
                                dot={{ fill: "#10B981" }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Clients */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Clients Récents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recent.clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {client.nom}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {client.telephone}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">
                                            {formatDate(client.created_at)}
                                        </p>
                                        {client.dettes > 0 && (
                                            <p className="text-sm text-red-600 font-medium">
                                                Dette:{" "}
                                                {formatCurrency(client.dettes)}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Orders */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Commandes Récentes
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recent.orders.map((order) => (
                                <div
                                    key={order.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            #{order.id}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {order.client?.nom}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(
                                                order.montant_totale
                                            )}
                                        </p>
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                                order.status === "completed"
                                                    ? "bg-green-100 text-green-800"
                                                    : order.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-gray-100 text-gray-800"
                                            }`}
                                        >
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Products */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">
                            Produits Récents
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {recent.products.map((product) => (
                                <div
                                    key={product.id}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                >
                                    <div>
                                        <p className="font-medium text-gray-900">
                                            {product.nom}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            Stock:{" "}
                                            {product.stocks_sum_quantite || 0}{" "}
                                            {product.unite}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900">
                                            {formatCurrency(product.prix)}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(product.created_at)}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
