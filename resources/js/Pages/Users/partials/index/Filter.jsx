// Handle search with debounce
    const handleSearchChange = (value) => {
        setLocalFilters(prev => ({ ...prev, search: value, page: 1 })); // Reset to page 1 when searching

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            onChange({ ...localFilters, search: value, page: 1 });
        }, 300);

        setSearchTimeout(timeout);
    };import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter as FilterIcon, X, RotateCcw, ChevronDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from "@/components/ui/collapsible";

export default function Filter({ filters, roles, onChange }) {
    const [localFilters, setLocalFilters] = useState(filters);
    const [isOpen, setIsOpen] = useState(false);
    const [searchTimeout, setSearchTimeout] = useState(null);

    // Update local filters when props change
    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // Handle search with debounce
    const handleSearchChange = (value) => {
        setLocalFilters(prev => ({ ...prev, search: value }));

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const timeout = setTimeout(() => {
            onChange({ ...localFilters, search: value });
        }, 300);

        setSearchTimeout(timeout);
    };

    const handleFilterChange = (key, value) => {
        // Convert "all" back to empty string for backend
        const actualValue = value === "all" ? "" : value;
        const newFilters = { ...localFilters, [key]: actualValue, page: 1 }; // Reset to page 1 when filtering
        setLocalFilters(newFilters);
        onChange(newFilters);
    };

    const clearFilters = () => {
        const clearedFilters = {
            search: '',
            role: '',
            status: '',
            date_from: '',
            date_to: '',
            debt_status: '',
            sort_by: 'created_at',
            sort_direction: 'desc',
            page: 1,
            per_page: filters.per_page || 10
        };
        setLocalFilters(clearedFilters);
        onChange(clearedFilters);
    };

    const hasActiveFilters = Object.entries(filters).some(([key, value]) =>
        value && key !== 'sort_by' && key !== 'sort_direction' && key !== 'page'
    );

    const activeFilterCount = Object.entries(filters).filter(([key, value]) =>
        value && key !== 'sort_by' && key !== 'sort_direction' && key !== 'page'
    ).length;

    // Convert empty strings to "all" for Select components
    const getSelectValue = (value) => value || "all";

    return (
        <Card className="border-gray-200 shadow-sm">
            <CardContent className="p-6">
                {/* Search Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Rechercher par nom, prénom, CIN ou téléphone..."
                            value={localFilters.search || ''}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="pl-10 pr-10 h-11 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401]"
                        />
                        {localFilters.search && (
                            <button
                                onClick={() => handleSearchChange('')}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                            <CollapsibleTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="whitespace-nowrap h-11 px-4 border-gray-300 hover:bg-gray-50"
                                >
                                    <FilterIcon className="w-4 h-4 mr-2" />
                                    Filtres avancés
                                    {activeFilterCount > 0 && (
                                        <span className="ml-2 bg-[#f9c401] text-[#262626] text-xs px-2 py-0.5 rounded-full font-medium">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                    <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                                </Button>
                            </CollapsibleTrigger>
                        </Collapsible>

                        {hasActiveFilters && (
                            <Button
                                onClick={clearFilters}
                                variant="outline"
                                className="text-gray-600 hover:text-gray-800 h-11 px-4 border-gray-300 hover:bg-gray-50"
                            >
                                <RotateCcw className="w-4 h-4 mr-2" />
                                Réinitialiser
                            </Button>
                        )}
                    </div>
                </div>

                {/* Advanced Filters */}
                <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                    <CollapsibleContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-6 border-t border-gray-200">
                            {/* Role Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="text-sm font-medium text-gray-700">
                                    Rôle
                                </Label>
                                <Select
                                    value={getSelectValue(localFilters.role)}
                                    onValueChange={(value) => handleFilterChange('role', value)}
                                >
                                    <SelectTrigger className="h-10 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401]">
                                        <SelectValue placeholder="Sélectionner un rôle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les rôles</SelectItem>
                                        {Object.entries(roles).map(([key, label]) => (
                                            <SelectItem key={key} value={key}>
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Status Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-sm font-medium text-gray-700">
                                    Statut du compte
                                </Label>
                                <Select
                                    value={getSelectValue(localFilters.status)}
                                    onValueChange={(value) => handleFilterChange('status', value)}
                                >
                                    <SelectTrigger className="h-10 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401]">
                                        <SelectValue placeholder="Sélectionner un statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tous les statuts</SelectItem>
                                        <SelectItem value="active">Actif</SelectItem>
                                        <SelectItem value="inactive">Inactif</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Debt Status Filter */}
                            <div className="space-y-2">
                                <Label htmlFor="debt_status" className="text-sm font-medium text-gray-700">
                                    Statut des dettes
                                </Label>
                                <Select
                                    value={getSelectValue(localFilters.debt_status)}
                                    onValueChange={(value) => handleFilterChange('debt_status', value)}
                                >
                                    <SelectTrigger className="h-10 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401]">
                                        <SelectValue placeholder="Sélectionner le statut" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Toutes les dettes</SelectItem>
                                        <SelectItem value="with_debt">Avec dette</SelectItem>
                                        <SelectItem value="no_debt">Sans dette</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Date Range */}
                            <div className="space-y-2">
                                <Label className="text-sm font-medium text-gray-700">
                                    Période d'embauche
                                </Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <Input
                                            type="date"
                                            value={localFilters.date_from || ''}
                                            onChange={(e) => handleFilterChange('date_from', e.target.value)}
                                            placeholder="Du"
                                            className="h-10 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401] text-sm"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="date"
                                            value={localFilters.date_to || ''}
                                            onChange={(e) => handleFilterChange('date_to', e.target.value)}
                                            placeholder="Au"
                                            className="h-10 border-gray-300 focus:border-[#f9c401] focus:ring-[#f9c401] text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Filter Buttons */}
                        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                            <span className="text-sm font-medium text-gray-600 mr-2">Filtres rapides:</span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('status', 'active')}
                                className={`text-xs ${localFilters.status === 'active' ? 'bg-green-50 border-green-200 text-green-700' : ''}`}
                            >
                                Utilisateurs actifs
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('debt_status', 'with_debt')}
                                className={`text-xs ${localFilters.debt_status === 'with_debt' ? 'bg-red-50 border-red-200 text-red-700' : ''}`}
                            >
                                Avec dettes
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleFilterChange('role', 'client')}
                                className={`text-xs ${localFilters.role === 'client' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}`}
                            >
                                Clients seulement
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    const thirtyDaysAgo = new Date();
                                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                                    handleFilterChange('date_from', thirtyDaysAgo.toISOString().split('T')[0]);
                                }}
                                className="text-xs"
                            >
                                Derniers 30 jours
                            </Button>
                        </div>
                    </CollapsibleContent>
                </Collapsible>

                {/* Active Filters Summary */}
                {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-sm font-medium text-gray-600">Filtres actifs:</span>
                        {localFilters.search && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Recherche: "{localFilters.search}"
                                <button
                                    onClick={() => handleSearchChange('')}
                                    className="ml-1 hover:text-blue-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {localFilters.role && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800">
                                Rôle: {roles[localFilters.role]}
                                <button
                                    onClick={() => handleFilterChange('role', '')}
                                    className="ml-1 hover:text-purple-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {localFilters.status && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                                Statut: {localFilters.status === 'active' ? 'Actif' : 'Inactif'}
                                <button
                                    onClick={() => handleFilterChange('status', '')}
                                    className="ml-1 hover:text-green-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {localFilters.debt_status && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                Dette: {localFilters.debt_status === 'with_debt' ? 'Avec dette' : 'Sans dette'}
                                <button
                                    onClick={() => handleFilterChange('debt_status', '')}
                                    className="ml-1 hover:text-orange-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                        {(localFilters.date_from || localFilters.date_to) && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-100 text-indigo-800">
                                Période: {localFilters.date_from || '...'} - {localFilters.date_to || '...'}
                                <button
                                    onClick={() => {
                                        handleFilterChange('date_from', '');
                                        handleFilterChange('date_to', '');
                                    }}
                                    className="ml-1 hover:text-indigo-600"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            </span>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
