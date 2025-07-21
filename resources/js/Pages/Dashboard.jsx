import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import {
  Users,
  UserCheck,
  Package,
  Truck,
  Wrench,
  Fuel,
  TrendingUp,
  DollarSign
} from 'lucide-react';

const Dashboard = ({ stats = {} }) => {
  const dashboardCards = [
    {
      title: 'Employés',
      value: stats.employees || 0,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Clients',
      value: stats.clients || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Fournisseurs',
      value: stats.fournisseurs || 0,
      icon: Package,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Véhicules',
      value: stats.vehicules || 0,
      icon: Truck,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Engins Lourds',
      value: stats.engins || 0,
      icon: Wrench,
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    },
    {
      title: 'Niveau Carburant',
      value: `${stats.carburant_level || 0}L`,
      icon: Fuel,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <AdminLayout>
      <Head title="Tableau de bord - Turky" />

      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de bord</h1>
          <p className="mt-1 text-sm text-gray-600">
            Vue d'ensemble de votre entreprise
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg ${card.bgColor}`}>
                      <Icon className={`h-6 w-6 ${card.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{card.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                Activité récente
              </CardTitle>
              <CardDescription>
                Dernières actions dans le système
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nouveau client ajouté</p>
                    <p className="text-xs text-gray-500">Il y a 2 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Commande livrée</p>
                    <p className="text-xs text-gray-500">Il y a 4 heures</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maintenance véhicule</p>
                    <p className="text-xs text-gray-500">Il y a 1 jour</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-yellow-600" />
                Résumé financier
              </CardTitle>
              <CardDescription>
                Aperçu des finances ce mois
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenus</span>
                  <span className="text-sm font-medium text-green-600">+{stats.revenue || 0} MAD</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Dépenses</span>
                  <span className="text-sm font-medium text-red-600">-{stats.expenses || 0} MAD</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium text-gray-900">Bénéfice net</span>
                  <span className="text-sm font-bold text-gray-900">{(stats.revenue || 0) - (stats.expenses || 0)} MAD</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
