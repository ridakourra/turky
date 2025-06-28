import React, { useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    ArrowLeft,
    Edit,
    Package,
    ShoppingCart,
    User,
    CreditCard,
    MapPin,
    FileText,
    Calendar,
    Search,
    Filter,
    Eye,
    Truck,
    UserCheck,
} from "lucide-react";

export default function Show({ fournisseur, stocks, commandes }) {
    const [stocksSearch, setStocksSearch] = useState("");
    const [commandesSearch, setCommandesSearch] = useState("");

    const handleStocksFilter = (e) => {
        e.preventDefault();
        router.get(
            `/fournisseurs/${fournisseur.id}`,
            {
                stocks_search: stocksSearch,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleCommandesFilter = (e) => {
        e.preventDefault();
        router.get(
            `/fournisseurs/${fournisseur.id}`,
            {
                commandes_search: commandesSearch,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    return (
        <AdminLayout title={`Fournisseur: ${fournisseur.nom}`}>
            <Head title={`${fournisseur.nom} - Fournisseur`} />

            <div className="space-y-6">
                {/* Header */}
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Link href="/fournisseurs">
                                    <Button variant="outline" size="sm">
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Retour
                                    </Button>
                                </Link>
                                <div>
                                    <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                        <User className="h-6 w-6" />
                                        {fournisseur.nom}
                                    </CardTitle>
                                    <p className="text-gray-600">
                                        Détails du fournisseur et ses activités
                                    </p>
                                </div>
                            </div>
                            <Link href={`/fournisseurs/${fournisseur.id}/edit`}>
                                <Button className="bg-yellow-500 hover:bg-yellow-600">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                </Card>

                {/* Fournisseur Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Nom</p>
                                    <p className="font-semibold">
                                        {fournisseur.nom}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <CreditCard className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        ICE/CIN
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className="font-mono"
                                    >
                                        {fournisseur.ice_ou_cin}
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Package className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Stocks
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {stocks.total}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <ShoppingCart className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Commandes
                                    </p>
                                    <p className="font-semibold text-lg">
                                        {commandes.total}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Adresse
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">
                                {fournisseur.adresse ||
                                    "Aucune adresse renseignée"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Informations système
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div>
                                <span className="text-sm text-gray-600">
                                    Créé le :
                                </span>
                                <span className="ml-2 font-medium">
                                    {new Date(
                                        fournisseur.created_at
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                            <div>
                                <span className="text-sm text-gray-600">
                                    Modifié le :
                                </span>
                                <span className="ml-2 font-medium">
                                    {new Date(
                                        fournisseur.updated_at
                                    ).toLocaleDateString("fr-FR")}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Notes */}
                {fournisseur.note && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Notes
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 whitespace-pre-wrap">
                                {fournisseur.note}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Tabs for Stocks and Commandes */}
                <Card>
                    <CardContent className="p-0">
                        <Tabs defaultValue="stocks" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger
                                    value="stocks"
                                    className="flex items-center gap-2"
                                >
                                    <Package className="h-4 w-4" />
                                    Stocks ({stocks.total})
                                </TabsTrigger>
                                <TabsTrigger
                                    value="commandes"
                                    className="flex items-center gap-2"
                                >
                                    <ShoppingCart className="h-4 w-4" />
                                    Commandes ({commandes.total})
                                </TabsTrigger>
                            </TabsList>

                            {/* Stocks Tab */}
                            <TabsContent
                                value="stocks"
                                className="space-y-4 p-6"
                            >
                                {/* Stocks Filter */}
                                <form
                                    onSubmit={handleStocksFilter}
                                    className="flex gap-4"
                                >
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Rechercher dans les stocks..."
                                            value={stocksSearch}
                                            onChange={(e) =>
                                                setStocksSearch(e.target.value)
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button type="submit" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filtrer
                                    </Button>
                                </form>

                                {/* Stocks Table */}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead>Produit</TableHead>
                                                <TableHead>Quantité</TableHead>
                                                <TableHead>
                                                    Prix Unitaire
                                                </TableHead>
                                                <TableHead>Fabriqué</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stocks.data.map((stock) => (
                                                <TableRow key={stock.id}>
                                                    <TableCell className="font-medium">
                                                        {stock.produit?.nom ||
                                                            "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {stock.quantite}{" "}
                                                            {stock.produit
                                                                ?.unite || ""}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {stock.prix_unitaire
                                                            ? `${stock.prix_unitaire} DH`
                                                            : "—"}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                stock.fabrique
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {stock.fabrique
                                                                ? "Oui"
                                                                : "Non"}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {stock.produit && (
                                                            <Link
                                                                href={`/produits/${stock.produit.id}`}
                                                            >
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {stocks.data.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan="5"
                                                        className="text-center py-8 text-gray-500"
                                                    >
                                                        Aucun stock trouvé
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Stocks Pagination */}
                                {stocks.last_page > 1 && (
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Affichage de {stocks.from} à{" "}
                                            {stocks.to} sur {stocks.total}{" "}
                                            résultats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {stocks.links.map((link, index) => (
                                                <Button
                                                    key={index}
                                                    variant={
                                                        link.active
                                                            ? "default"
                                                            : "outline"
                                                    }
                                                    size="sm"
                                                    onClick={() =>
                                                        link.url &&
                                                        router.get(link.url)
                                                    }
                                                    disabled={!link.url}
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>

                            {/* Commandes Tab */}
                            <TabsContent
                                value="commandes"
                                className="space-y-4 p-6"
                            >
                                {/* Commandes Filter */}
                                <form
                                    onSubmit={handleCommandesFilter}
                                    className="flex gap-4"
                                >
                                    <div className="flex-1 relative">
                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                        <Input
                                            placeholder="Rechercher dans les commandes..."
                                            value={commandesSearch}
                                            onChange={(e) =>
                                                setCommandesSearch(
                                                    e.target.value
                                                )
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                    <Button type="submit" size="sm">
                                        <Filter className="h-4 w-4 mr-2" />
                                        Filtrer
                                    </Button>
                                </form>

                                {/* Commandes Table */}
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-gray-50">
                                                <TableHead>Date</TableHead>
                                                <TableHead>Employé</TableHead>
                                                <TableHead>Véhicule</TableHead>
                                                <TableHead>Lignes</TableHead>
                                                <TableHead>Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {commandes.data.map((commande) => (
                                                <TableRow key={commande.id}>
                                                    <TableCell>
                                                        {new Date(
                                                            commande.date
                                                        ).toLocaleDateString(
                                                            "fr-FR"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {commande.employer ? (
                                                            <div className="flex items-center gap-2">
                                                                <UserCheck className="h-4 w-4 text-blue-500" />
                                                                {
                                                                    commande
                                                                        .employer
                                                                        .nom
                                                                }
                                                            </div>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {commande.vehicule ? (
                                                            <div className="flex items-center gap-2">
                                                                <Truck className="h-4 w-4 text-green-500" />
                                                                {
                                                                    commande
                                                                        .vehicule
                                                                        .nom
                                                                }
                                                            </div>
                                                        ) : (
                                                            "—"
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline">
                                                            {commande.lines
                                                                ?.length ||
                                                                0}{" "}
                                                            produits
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link
                                                            href={`/commandes-fournisseurs/${commande.id}`}
                                                        >
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                            </Button>
                                                        </Link>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                            {commandes.data.length === 0 && (
                                                <TableRow>
                                                    <TableCell
                                                        colSpan="5"
                                                        className="text-center py-8 text-gray-500"
                                                    >
                                                        Aucune commande trouvée
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>

                                {/* Commandes Pagination */}
                                {commandes.last_page > 1 && (
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm text-gray-700">
                                            Affichage de {commandes.from} à{" "}
                                            {commandes.to} sur {commandes.total}{" "}
                                            résultats
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {commandes.links.map(
                                                (link, index) => (
                                                    <Button
                                                        key={index}
                                                        variant={
                                                            link.active
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        onClick={() =>
                                                            link.url &&
                                                            router.get(link.url)
                                                        }
                                                        disabled={!link.url}
                                                        dangerouslySetInnerHTML={{
                                                            __html: link.label,
                                                        }}
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                    <CardContent className="pt-6">
                        <h3 className="font-medium text-gray-900 mb-4">
                            Actions rapides
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            <Link href={`/fournisseurs/${fournisseur.id}/edit`}>
                                <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-2" />
                                    Modifier
                                </Button>
                            </Link>
                            <Link href="/commandes-fournisseurs/create">
                                <Button variant="outline" size="sm">
                                    <ShoppingCart className="h-4 w-4 mr-2" />
                                    Nouvelle commande
                                </Button>
                            </Link>
                            <Link href="/fournisseurs">
                                <Button variant="outline" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Liste des fournisseurs
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
