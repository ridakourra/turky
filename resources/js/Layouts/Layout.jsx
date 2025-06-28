import React, { useState } from "react";
import { Head, Link, usePage } from "@inertiajs/react";
import {
    LayoutDashboard,
    Building2,
    Users,
    UserCheck,
    Truck,
    Construction,
    Package,
    ShoppingCart,
    FileText,
    TrendingUp,
    Menu,
    X,
    ChevronDown,
    Settings,
    LogOut,
    Bell,
    Search,
    Home,
} from "lucide-react";
import { Toaster } from "sonner";

const AdminLayout = ({ children, title }) => {
    const { url, props } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState({});

    const navigation = [
        {
            name: "Tableau de Bord",
            href: "/dashboard",
            icon: LayoutDashboard,
            current: url === "/dashboard",
        },
        {
            name: "Entreprise",
            icon: Building2,
            children: [
                {
                    name: "Informations",
                    href: "/entreprise",
                    current: url.startsWith("/entreprise"),
                },
            ],
        },
        {
            name: "Employés",
            icon: Users,
            children: [
                {
                    name: "Liste des Employés",
                    href: "/employers",
                    current: url === "/employers",
                },
                {
                    name: "Ajouter Employé",
                    href: "/employers/create",
                    current: url === "/employers/create",
                },
                {
                    name: "Absences",
                    href: "/absences",
                    current: url.startsWith("/absences"),
                },
            ],
        },
        {
            name: "Clients",
            icon: UserCheck,
            children: [
                {
                    name: "Liste des Clients",
                    href: "/clients",
                    current: url === "/clients",
                },
                {
                    name: "Ajouter Client",
                    href: "/clients/create",
                    current: url === "/clients/create",
                },
            ],
        },
        {
            name: "Fournisseurs",
            icon: Package,
            children: [
                {
                    name: "Liste des Fournisseurs",
                    href: "/fournisseurs",
                    current: url === "/fournisseurs",
                },
                {
                    name: "Ajouter Fournisseur",
                    href: "/fournisseurs/create",
                    current: url === "/fournisseurs/create",
                },
            ],
        },
        {
            name: "Véhicules",
            icon: Truck,
            children: [
                {
                    name: "Liste des Véhicules",
                    href: "/vehicules",
                    current: url === "/vehicules",
                },
                {
                    name: "Ajouter Véhicule",
                    href: "/vehicules/create",
                    current: url === "/vehicules/create",
                },
            ],
        },
        {
            name: "Engins Lourds",
            icon: Construction,
            children: [
                {
                    name: "Liste des Engins",
                    href: "/engins-lourds",
                    current: url === "/engins-lourds",
                },
                {
                    name: "Ajouter Engin",
                    href: "/engins-lourds/create",
                    current: url === "/engins-lourds/create",
                },
            ],
        },
        {
            name: "Produits",
            icon: Package,
            children: [
                {
                    name: "Liste des Produits",
                    href: "/produits",
                    current: url === "/produits",
                },
                {
                    name: "Ajouter Produit",
                    href: "/produits/create",
                    current: url === "/produits/create",
                },
                {
                    name: "Stock",
                    href: "/stocks",
                    current: url.startsWith("/stocks"),
                },
            ],
        },
        {
            name: "Commandes",
            icon: ShoppingCart,
            children: [
                {
                    name: "Commandes Clients",
                    href: "/commandes",
                    current: url === "/commandes",
                },
                {
                    name: "Nouvelle Commande",
                    href: "/commandes/create",
                    current: url === "/commandes/create",
                },
                {
                    name: "Commandes Fournisseurs",
                    href: "/commandes-fournisseurs",
                    current: url === "/commandes-fournisseurs",
                },
                {
                    name: "Livraisons",
                    href: "/livraisons",
                    current: url.startsWith("/livraisons"),
                },
            ],
        },
        {
            name: "Rapports",
            icon: FileText,
            children: [
                {
                    name: "Tous les Rapports",
                    href: "/rapports",
                    current: url === "/rapports",
                },
                {
                    name: "Rapports Ventes",
                    href: "/rapports/ventes",
                    current: url === "/rapports/ventes",
                },
                {
                    name: "Rapports Stock",
                    href: "/rapports/stock",
                    current: url === "/rapports/stock",
                },
                {
                    name: "Rapports Salaires",
                    href: "/rapports/salaires",
                    current: url === "/rapports/salaires",
                },
            ],
        },
    ];

    const toggleDropdown = (index) => {
        setDropdownOpen((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    const NavItem = ({ item, index }) => {
        if (item.children) {
            return (
                <div className="space-y-1">
                    <Toaster />
                    <button
                        onClick={() => toggleDropdown(index)}
                        className={`
              w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg
              transition-colors duration-200
              ${
                  item.children.some((child) => child.current)
                      ? "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              }
            `}
                    >
                        <div className="flex items-center">
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.name}
                        </div>
                        <ChevronDown
                            className={`h-4 w-4 transition-transform duration-200 ${
                                dropdownOpen[index] ? "rotate-180" : ""
                            }`}
                        />
                    </button>
                    {dropdownOpen[index] && (
                        <div className="ml-6 space-y-1">
                            {item.children.map((child, childIndex) => (
                                <Link
                                    key={childIndex}
                                    href={child.href}
                                    className={`
                    block px-3 py-2 text-sm rounded-md transition-colors duration-200
                    ${
                        child.current
                            ? "bg-yellow-200 text-yellow-900 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                                >
                                    {child.name}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        return (
            <Link
                href={item.href}
                className={`
          flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
          ${
              item.current
                  ? "bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
          }
        `}
            >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
            </Link>
        );
    };

    return (
        <>
            <Head title={title} />

            <div className="flex h-screen bg-gray-50 overflow-hidden">
                {/* Mobile sidebar backdrop */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* Sidebar */}
                <div
                    className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:relative lg:inset-0
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
                >
                    <div className="flex flex-col h-full">
                        {/* Logo */}
                        <div className="flex items-center justify-between h-16 px-4 bg-yellow-400 flex-shrink-0">
                            <div className="flex items-center">
                                <Building2 className="h-8 w-8 text-yellow-900" />
                                <span className="ml-2 text-xl font-bold text-yellow-900">
                                    Panel Admin
                                </span>
                            </div>
                            <button
                                onClick={() => setSidebarOpen(false)}
                                className="lg:hidden text-yellow-900 hover:text-yellow-700"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        {/* Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navigation.map((item, index) => (
                                <NavItem
                                    key={index}
                                    item={item}
                                    index={index}
                                />
                            ))}
                        </nav>

                        {/* User section */}
                        <div className="p-4 border-t border-gray-200 flex-shrink-0">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                                    <span className="text-sm font-medium text-yellow-900">
                                        {props.auth?.user?.name?.charAt(0) ||
                                            "A"}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {props.auth?.user?.name ||
                                            "Administrateur"}
                                    </p>
                                    <p className="text-xs text-gray-500 truncate">
                                        {props.auth?.user?.email ||
                                            "admin@entreprise.com"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex space-x-2">
                                <button className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">
                                    <Settings className="h-4 w-4 mr-1" />
                                    Paramètres
                                </button>
                                <Link
                                    href="/logout"
                                    method="post"
                                    className="flex-1 flex items-center justify-center px-3 py-2 text-xs font-medium text-red-700 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                                >
                                    <LogOut className="h-4 w-4 mr-1" />
                                    Déconnexion
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main content area */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Top header */}
                    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0 z-30">
                        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setSidebarOpen(true)}
                                    className="lg:hidden text-gray-500 hover:text-gray-700"
                                >
                                    <Menu className="h-6 w-6" />
                                </button>

                                {/* Breadcrumb */}
                                <nav className="flex items-center space-x-2 text-sm">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-500 hover:text-gray-700"
                                    >
                                        <Home className="h-4 w-4" />
                                    </Link>
                                    <span className="text-gray-400">/</span>
                                    <span className="text-gray-900 font-medium">
                                        {title}
                                    </span>
                                </nav>
                            </div>

                            <div className="flex items-center space-x-4">
                                {/* Search bar */}
                                <div className="hidden md:block relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Search className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        placeholder="Rechercher..."
                                        className="w-64 pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Notifications */}
                                <button className="relative text-gray-500 hover:text-gray-700">
                                    <Bell className="h-5 w-5" />
                                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
                                </button>

                                {/* Stats indicator */}
                                <div className="hidden sm:flex items-center space-x-2 px-3 py-1 bg-yellow-100 rounded-full">
                                    <TrendingUp className="h-4 w-4 text-yellow-600" />
                                    <span className="text-sm font-medium text-yellow-800">
                                        En ligne
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content with scroll */}
                    <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-gray-50 overflow-auto">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;
