import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
  Building2,
  Users,
  UserCheck,
  Truck,
  Wrench,
  Fuel,
  Package,
  Menu,
  X,
  LogOut,
  Home,
  Factory,
  ShoppingCart,
  Boxes,
  Receipt
} from 'lucide-react';

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { url } = usePage();

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: Home },
    { name: 'Entreprise', href: '/entreprise', icon: Building2 },
    { name: 'Employés', href: '/employees', icon: Users },
    { name: 'Clients', href: '/clients', icon: UserCheck },
    { name: 'Fournisseurs', href: '/fournisseurs', icon: Factory },
    { name: 'Véhicules', href: '/vehicules', icon: Truck },
    { name: 'Engins Lourds', href: '/engins-lourds', icon: Wrench },
    { name: 'Carburant', href: '/carburant', icon: Fuel },
    { name: 'Produits', href: '/produits', icon: Package },
    { name: 'Commandes Clients', href: '/commandes-clients', icon: ShoppingCart },
    { name: 'Commandes Fournisseurs', href: '/commandes-fournisseurs', icon: Boxes },
    { name: 'Transactions', href: '/transactions', icon: Receipt },
    { name: 'Déconnexion', href: '/logout', icon: LogOut }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 flex z-40 md:hidden",
        sidebarOpen ? "" : "hidden"
      )}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <h1 className="text-2xl font-bold text-yellow-600">Turky</h1>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = url === item.href || url.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-yellow-100 text-yellow-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-base font-medium rounded-md'
                    )}
                  >
                    <Icon className={cn(
                      isActive ? 'text-yellow-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-4 flex-shrink-0 h-6 w-6'
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex-1 flex flex-col min-h-0 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <h1 className="text-2xl font-bold text-yellow-600">Turky</h1>
            </div>
            <nav className="mt-5 flex-1 px-2 bg-white space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = url === item.href || url.startsWith(item.href + '/');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      isActive
                        ? 'bg-yellow-100 text-yellow-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                      'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                    )}
                  >
                    <Icon className={cn(
                      isActive ? 'text-yellow-500' : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
            <Link
              href="/logout"
              method="post"
              as="button"
              className="flex-shrink-0 w-full group block"
            >
              <div className="flex items-center">
                <LogOut className="inline-block h-5 w-5 text-gray-400 group-hover:text-gray-500" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                    Déconnexion
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-gray-50">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-500"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
        <main className="flex-1">
          <div className="py-6">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
