import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/Components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/ui/table';
import { Badge } from '@/Components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Calendar } from '@/Components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/Components/ui/popover';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/Components/ui/dialog';
import { Label } from '@/Components/ui/label';
import { Search, Filter, Calendar as CalendarIcon, Eye, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function Index({ transactions, filters, totaux }) {
    const [search, setSearch] = useState(filters?.search || '');
    const [typeTransaction, setTypeTransaction] = useState(filters?.type_transaction || 'all');
    const [referenceType, setReferenceType] = useState(filters?.reference_type || 'all');
    const [dateDebut, setDateDebut] = useState(filters?.date_debut ? new Date(filters.date_debut) : null);
    const [dateFin, setDateFin] = useState(filters?.date_fin ? new Date(filters.date_fin) : null);
    const [montantMin, setMontantMin] = useState(filters?.montant_min || '');
    const [montantMax, setMontantMax] = useState(filters?.montant_max || '');
    const [showFilters, setShowFilters] = useState(false);

    const handleSearch = () => {
        router.get('/transactions', {
            search,
            type_transaction: typeTransaction,
            reference_type: referenceType,
            date_debut: dateDebut ? format(dateDebut, 'yyyy-MM-dd') : '',
            date_fin: dateFin ? format(dateFin, 'yyyy-MM-dd') : '',
            montant_min: montantMin,
            montant_max: montantMax
        }, {
            preserveState: true,
            replace: true
        });
    };

    const resetFilters = () => {
        setSearch('');
        setTypeTransaction('all');
        setReferenceType('all');
        setDateDebut(null);
        setDateFin(null);
        setMontantMin('');
        setMontantMax('');
        router.get('/transactions');
    };

    const getTypeTransactionBadge = (type) => {
        return type === 'entree' ? (
            <Badge className="bg-green-100 text-green-800">
                <TrendingUp className="w-3 h-3 mr-1" />
                Entrée
            </Badge>
        ) : (
            <Badge className="bg-red-100 text-red-800">
                <TrendingDown className="w-3 h-3 mr-1" />
                Sortie
            </Badge>
        );
    };

    const getReferenceTypeLabel = (referenceType) => {
        const types = {
            'App\\Models\\Salaire': 'Salaire',
            'App\\Models\\CommandeClient': 'Commande Client',
            'App\\Models\\EnginLourd': 'Engin Lourd',
            'App\\Models\\BudgetChauffeur': 'Budget Chauffeur',
            'App\\Models\\LivraisonCarburant': 'Livraison Carburant',
            'App\\Models\\DepenseMachine': 'Dépense Machine'
        };
        return types[referenceType] || referenceType;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'MAD'
        }).format(amount);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Transactions" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* En-tête avec statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Entrées</CardTitle>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-600">
                                    {formatCurrency(totaux?.entrees || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Sorties</CardTitle>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-red-600">
                                    {formatCurrency(totaux?.sorties || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Solde</CardTitle>
                                <DollarSign className="h-4 w-4 text-blue-600" />
                            </CardHeader>
                            <CardContent>
                                <div className={`text-2xl font-bold ${
                                    (totaux?.solde || 0) >= 0 ? 'text-green-600' : 'text-red-600'
                                }`}>
                                    {formatCurrency(totaux?.solde || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                                <Eye className="h-4 w-4 text-gray-600" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {transactions?.total || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle>Transactions</CardTitle>
                                    <CardDescription>
                                        Gérez et consultez toutes les transactions financières
                                    </CardDescription>
                                </div>
                            </div>

                            {/* Barre de recherche et filtres */}
                            <div className="flex flex-col space-y-4">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1">
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                            <Input
                                                placeholder="Rechercher par description ou montant..."
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pl-10"
                                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Dialog open={showFilters} onOpenChange={setShowFilters}>
                                            <DialogTrigger asChild>
                                                <Button variant="outline">
                                                    <Filter className="h-4 w-4 mr-2" />
                                                    Filtres
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-2xl">
                                                <DialogHeader>
                                                    <DialogTitle>Filtres avancés</DialogTitle>
                                                    <DialogDescription>
                                                        Filtrez les transactions selon vos critères
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <Label>Type de transaction</Label>
                                                        <Select value={typeTransaction} onValueChange={setTypeTransaction}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner le type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Tous les types</SelectItem>
                                                                <SelectItem value="entree">Entrée</SelectItem>
                                                                <SelectItem value="sortie">Sortie</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Type de référence</Label>
                                                        <Select value={referenceType} onValueChange={setReferenceType}>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Sélectionner la référence" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="all">Toutes les références</SelectItem>
                                                                <SelectItem value="salaire">Salaire</SelectItem>
                                                                <SelectItem value="commande_client">Commande Client</SelectItem>
                                                                <SelectItem value="engin_lourd">Engin Lourd</SelectItem>
                                                                <SelectItem value="budget_chauffeur">Budget Chauffeur</SelectItem>
                                                                <SelectItem value="livraison_carburant">Livraison Carburant</SelectItem>
                                                                <SelectItem value="depense_machine">Dépense Machine</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Date début</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {dateDebut ? format(dateDebut, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={dateDebut}
                                                                    onSelect={setDateDebut}
                                                                    locale={fr}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Date fin</Label>
                                                        <Popover>
                                                            <PopoverTrigger asChild>
                                                                <Button variant="outline" className="w-full justify-start text-left font-normal">
                                                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                                                    {dateFin ? format(dateFin, 'dd/MM/yyyy', { locale: fr }) : 'Sélectionner une date'}
                                                                </Button>
                                                            </PopoverTrigger>
                                                            <PopoverContent className="w-auto p-0" align="start">
                                                                <Calendar
                                                                    mode="single"
                                                                    selected={dateFin}
                                                                    onSelect={setDateFin}
                                                                    locale={fr}
                                                                    initialFocus
                                                                />
                                                            </PopoverContent>
                                                        </Popover>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Montant minimum</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={montantMin}
                                                            onChange={(e) => setMontantMin(e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label>Montant maximum</Label>
                                                        <Input
                                                            type="number"
                                                            placeholder="0.00"
                                                            value={montantMax}
                                                            onChange={(e) => setMontantMax(e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2 mt-6">
                                                    <Button variant="outline" onClick={resetFilters}>
                                                        Réinitialiser
                                                    </Button>
                                                    <Button onClick={() => { handleSearch(); setShowFilters(false); }}>
                                                        Appliquer les filtres
                                                    </Button>
                                                </div>
                                            </DialogContent>
                                        </Dialog>
                                        <Button onClick={handleSearch}>
                                            Rechercher
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Référence</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead className="text-right">Montant</TableHead>
                                            <TableHead className="text-center">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {transactions?.data?.length > 0 ? (
                                            transactions.data.map((transaction) => (
                                                <TableRow key={transaction.id}>
                                                    <TableCell>
                                                        {format(new Date(transaction.created_at), 'dd/MM/yyyy HH:mm', { locale: fr })}
                                                    </TableCell>
                                                    <TableCell>
                                                        {getTypeTransactionBadge(transaction.type_transaction)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {getReferenceTypeLabel(transaction.reference_type)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="max-w-xs truncate">
                                                        {transaction.description || 'Aucune description'}
                                                    </TableCell>
                                                    <TableCell className={`text-right font-medium ${
                                                        transaction.type_transaction === 'entree' ? 'text-green-600' : 'text-red-600'
                                                    }`}>
                                                        {transaction.type_transaction === 'entree' ? '+' : '-'}
                                                        {formatCurrency(transaction.montant)}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <Link
                                                            href={`/transactions/${transaction.id}`}
                                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                    Aucune transaction trouvée
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {/* Pagination */}
                            {transactions?.links && (
                                <div className="flex items-center justify-between space-x-2 py-4">
                                    <div className="text-sm text-gray-500">
                                        Affichage de {transactions.from || 0} à {transactions.to || 0} sur {transactions.total || 0} résultats
                                    </div>
                                    <div className="flex space-x-2">
                                        {transactions.links.map((link, index) => {
                                            if (link.url === null) {
                                                return (
                                                    <Button key={index} variant="outline" disabled>
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Button>
                                                );
                                            }

                                            return (
                                                <Link key={index} href={link.url}>
                                                    <Button
                                                        variant={link.active ? "default" : "outline"}
                                                        size="sm"
                                                    >
                                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                                    </Button>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}