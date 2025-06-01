import { Link } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
    Eye,
    Edit,
    Trash2,
    MoreHorizontal,
    ArrowUpDown,
    ArrowUp,
    ArrowDown,
    Phone,
    Mail,
    Calendar,
    CreditCard
} from "lucide-react";

const roleColors = {
    client: 'bg-blue-100 text-blue-800',
    directeur: 'bg-purple-100 text-purple-800',
    comptable: 'bg-green-100 text-green-800',
    livreur: 'bg-orange-100 text-orange-800'
};

const roleLabels = {
    client: 'Client',
    directeur: 'Directeur',
    comptable: 'Comptable',
    livreur: 'Livreur'
};

export default function Table({ users, onDelete, onSort, currentSort, sortDirection }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-MA', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const SortButton = ({ field, children }) => {
        const isActive = currentSort === field;
        const direction = isActive ? sortDirection : null;

        return (
            <button
                onClick={() => onSort(field)}
                className="flex items-center gap-1 hover:text-gray-900 transition-colors"
            >
                {children}
                {isActive ? (
                    direction === 'asc' ? (
                        <ArrowUp className="w-4 h-4" />
                    ) : (
                        <ArrowDown className="w-4 h-4" />
                    )
                ) : (
                    <ArrowUpDown className="w-4 h-4 opacity-50" />
                )}
            </button>
        );
    };

    return (
        <div className="overflow-x-auto">
            <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <SortButton field="nom">Utilisateur</SortButton>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <SortButton field="role">Rôle</SortButton>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <SortButton field="date_debut">Date début</SortButton>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <SortButton field="dettes">Dettes</SortButton>
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statut
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Statistiques
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {users.data.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10">
                                        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <span className="text-sm font-medium text-gray-700">
                                                {user.nom.charAt(0)}{user.prenom.charAt(0)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {user.nom} {user.prenom}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            CIN: {user.cin}
                                        </div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="space-y-1">
                                    {user.telephone && (
                                        <div className="flex items-center text-sm text-gray-600">
                                            <Phone className="w-3 h-3 mr-1" />
                                            {user.telephone}
                                        </div>
                                    )}
                                    {user.adresse && (
                                        <div className="text-sm text-gray-500 truncate max-w-32">
                                            {user.adresse}
                                        </div>
                                    )}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={roleColors[user.role] || 'bg-gray-100 text-gray-800'}>
                                    {roleLabels[user.role] || user.role}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Calendar className="w-3 h-3 mr-1" />
                                    {formatDate(user.date_debut)}
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <CreditCard className="w-3 h-3 mr-1" />
                                    <span className={`text-sm font-medium ${
                                        user.dettes > 0 ? 'text-red-600' : 'text-green-600'
                                    }`}>
                                        {formatCurrency(user.dettes)}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <Badge variant={user.est_actif ? 'default' : 'secondary'}>
                                    {user.est_actif ? 'Actif' : 'Inactif'}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-xs text-gray-500 space-y-1">
                                    <div>Absences: {user.absences_count || 0}</div>
                                    <div>Dettes hist.: {user.historique_dettes_count || 0}</div>
                                    <div>Salaires hist.: {user.historique_salaires_count || 0}</div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0">
                                            <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-48">
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('users.show', user.id)}
                                                className="flex items-center"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                Voir les détails
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link
                                                href={route('users.edit', user.id)}
                                                className="flex items-center"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Modifier
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={() => onDelete(user)}
                                            className="flex items-center text-red-600 focus:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4 mr-2" />
                                            Supprimer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
