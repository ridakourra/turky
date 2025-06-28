import React, { useState } from "react";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import AdminLayout from "@/Layouts/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    ArrowLeft,
    Edit,
    User,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    CreditCard,
    Plus,
    Truck,
    Construction,
    Package,
    FileText,
    UserX,
    DollarSign,
    Clock,
    CheckCircle,
    XCircle,
    AlertTriangle,
    TrendingUp,
    Eye,
    Filter,
    Download,
    Search,
} from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

const EmployersShow = () => {
    const { employer, stats } = usePage().props;
    const [absenceDialog, setAbsenceDialog] = useState(false);
    const [budgetDialog, setBudgetDialog] = useState(false);
    const [filters, setFilters] = useState({
        absences: { justifie: "all", date_from: "", date_to: "" },
        livraisons: { status: "all", date_from: "", date_to: "" },
        budgets: { date_from: "", date_to: "" },
        salaires: { date_from: "", date_to: "" },
    });

    const {
        data: absenceData,
        setData: setAbsenceData,
        post: postAbsence,
        processing: processingAbsence,
        errors: absenceErrors,
        reset: resetAbsence,
    } = useForm({
        justifie: false,
        raison: "",
        date: new Date().toISOString().split("T")[0],
    });

    const {
        data: budgetData,
        setData: setBudgetData,
        post: postBudget,
        processing: processingBudget,
        errors: budgetErrors,
        reset: resetBudget,
    } = useForm({
        montant: "",
        date: new Date().toISOString().split("T")[0],
        note: "",
    });

    const handleAddAbsence = (e) => {
        e.preventDefault();
        postAbsence(route("employers.add-absence", employer.id), {
            onSuccess: () => {
                resetAbsence();
                setAbsenceDialog(false);
            },
        });
    };

    const handleAddBudget = (e) => {
        e.preventDefault();
        postBudget(route("employers.add-budget", employer.id), {
            onSuccess: () => {
                resetBudget();
                setBudgetDialog(false);
            },
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("fr-MA", {
            style: "currency",
            currency: "MAD",
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("fr-FR", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getSalaireInfo = () => {
        if (!employer.salaires || employer.salaires.length === 0) {
            return { type: "Non défini", details: [] };
        }

        const types = [...new Set(employer.salaires.map((s) => s.type))];
        const type = types.join(", ");

        if (types.includes("unitaire")) {
            const details = employer.salaires.map((s) => ({
                produit: s.produit?.nom || "Produit supprimé",
                prix: s.prix,
                unite: s.produit?.unite || "unité",
            }));
            return { type, details };
        } else {
            const details = [{ prix: employer.salaires[0]?.prix }];
            return { type, details };
        }
    };

    const salaireInfo = getSalaireInfo();

    const filteredAbsences =
        employer.absences?.filter((absence) => {
            if (filters.absences.justifie !== "all") {
                const isJustifie = filters.absences.justifie === "true";
                if (absence.justifie !== isJustifie) return false;
            }
            if (
                filters.absences.date_from &&
                absence.date < filters.absences.date_from
            )
                return false;
            if (
                filters.absences.date_to &&
                absence.date > filters.absences.date_to
            )
                return false;
            return true;
        }) || [];

    const filteredLivraisons =
        employer.livraisons?.filter((livraison) => {
            if (
                filters.livraisons.status !== "all" &&
                livraison.status !== filters.livraisons.status
            )
                return false;
            if (
                filters.livraisons.date_from &&
                livraison.date < filters.livraisons.date_from
            )
                return false;
            if (
                filters.livraisons.date_to &&
                livraison.date > filters.livraisons.date_to
            )
                return false;
            return true;
        }) || [];

    const filteredBudgets =
        employer.budgets_chiffeurs?.filter((budget) => {
            if (
                filters.budgets.date_from &&
                budget.date < filters.budgets.date_from
            )
                return false;
            if (
                filters.budgets.date_to &&
                budget.date > filters.budgets.date_to
            )
                return false;
            return true;
        }) || [];

    const filteredRapportsSalaires =
        employer.rapports_salaires?.filter((rapport) => {
            if (
                filters.salaires.date_from &&
                rapport.date_operation < filters.salaires.date_from
            )
                return false;
            if (
                filters.salaires.date_to &&
                rapport.date_operation > filters.salaires.date_to
            )
                return false;
            return true;
        }) || [];

    return (
        <AdminLayout title={`Employé: ${employer.nom}`}>
            <Head title={`${employer.nom} - Détails`} />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Link href={route("employers.index")}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Retour
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                {employer.nom}
                                <Badge
                                    variant={
                                        employer.actif ? "default" : "secondary"
                                    }
                                >
                                    {employer.actif ? "Actif" : "Inactif"}
                                </Badge>
                            </h1>
                            <p className="text-sm text-gray-600">
                                {employer.fonction || "Fonction non définie"} •
                                CIN: {employer.cin}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Dialog
                            open={absenceDialog}
                            onOpenChange={setAbsenceDialog}
                        >
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="flex items-center gap-2"
                                >
                                    <UserX className="h-4 w-4" />
                                    Ajouter Absence
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Ajouter une Absence
                                    </DialogTitle>
                                    <DialogDescription>
                                        Enregistrer une nouvelle absence pour{" "}
                                        {employer.nom}
                                    </DialogDescription>
                                </DialogHeader>
                                <form
                                    onSubmit={handleAddAbsence}
                                    className="space-y-4"
                                >
                                    <div className="space-y-2">
                                        <Label htmlFor="absence-date">
                                            Date *
                                        </Label>
                                        <Input
                                            id="absence-date"
                                            type="date"
                                            value={absenceData.date}
                                            onChange={(e) =>
                                                setAbsenceData(
                                                    "date",
                                                    e.target.value
                                                )
                                            }
                                            className={
                                                absenceErrors.date
                                                    ? "border-red-500"
                                                    : ""
                                            }
                                        />
                                        {absenceErrors.date && (
                                            <p className="text-sm text-red-600">
                                                {absenceErrors.date}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="absence-raison">
                                            Raison
                                        </Label>
                                        <Textarea
                                            id="absence-raison"
                                            value={absenceData.raison}
                                            onChange={(e) =>
                                                setAbsenceData(
                                                    "raison",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Raison de l'absence..."
                                            rows={3}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="absence-justifie"
                                            checked={absenceData.justifie}
                                            onCheckedChange={(checked) =>
                                                setAbsenceData(
                                                    "justifie",
                                                    checked
                                                )
                                            }
                                        />
                                        <Label htmlFor="absence-justifie">
                                            Absence justifiée
                                        </Label>
                                    </div>
                                    <DialogFooter>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() =>
                                                setAbsenceDialog(false)
                                            }
                                        >
                                            Annuler
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processingAbsence}
                                            className="bg-yellow-500 hover:bg-yellow-600"
                                        >
                                            {processingAbsence
                                                ? "Ajout..."
                                                : "Ajouter"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        {(employer.fonction
                            ?.toLowerCase()
                            .includes("chauffeur") ||
                            employer.fonction
                                ?.toLowerCase()
                                .includes("driver")) && (
                            <Dialog
                                open={budgetDialog}
                                onOpenChange={setBudgetDialog}
                            >
                                <DialogTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="flex items-center gap-2"
                                    >
                                        <DollarSign className="h-4 w-4" />
                                        Ajouter Budget
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>
                                            Ajouter un Budget
                                        </DialogTitle>
                                        <DialogDescription>
                                            Allouer un budget pour le chauffeur{" "}
                                            {employer.nom}
                                        </DialogDescription>
                                    </DialogHeader>
                                    <form
                                        onSubmit={handleAddBudget}
                                        className="space-y-4"
                                    >
                                        <div className="space-y-2">
                                            <Label htmlFor="budget-montant">
                                                Montant (DH) *
                                            </Label>
                                            <Input
                                                id="budget-montant"
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={budgetData.montant}
                                                onChange={(e) =>
                                                    setBudgetData(
                                                        "montant",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Montant du budget"
                                                className={
                                                    budgetErrors.montant
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {budgetErrors.montant && (
                                                <p className="text-sm text-red-600">
                                                    {budgetErrors.montant}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget-date">
                                                Date *
                                            </Label>
                                            <Input
                                                id="budget-date"
                                                type="date"
                                                value={budgetData.date}
                                                onChange={(e) =>
                                                    setBudgetData(
                                                        "date",
                                                        e.target.value
                                                    )
                                                }
                                                className={
                                                    budgetErrors.date
                                                        ? "border-red-500"
                                                        : ""
                                                }
                                            />
                                            {budgetErrors.date && (
                                                <p className="text-sm text-red-600">
                                                    {budgetErrors.date}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="budget-note">
                                                Note
                                            </Label>
                                            <Textarea
                                                id="budget-note"
                                                value={budgetData.note}
                                                onChange={(e) =>
                                                    setBudgetData(
                                                        "note",
                                                        e.target.value
                                                    )
                                                }
                                                placeholder="Note ou commentaire..."
                                                rows={3}
                                            />
                                        </div>
                                        <DialogFooter>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() =>
                                                    setBudgetDialog(false)
                                                }
                                            >
                                                Annuler
                                            </Button>
                                            <Button
                                                type="submit"
                                                disabled={processingBudget}
                                                className="bg-yellow-500 hover:bg-yellow-600"
                                            >
                                                {processingBudget
                                                    ? "Ajout..."
                                                    : "Ajouter"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        )}

                        <Link href={route("employers.edit", employer.id)}>
                            <Button className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600">
                                <Edit className="h-4 w-4" />
                                Modifier
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Absences
                            </CardTitle>
                            <UserX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {stats.total_absences}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                {stats.absences_justifiees} justifiées
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Livraisons
                            </CardTitle>
                            <Truck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">
                                {stats.total_livraisons}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Livraisons effectuées
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Budget Total
                            </CardTitle>
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {formatCurrency(stats.total_budget || 0)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Ce mois:{" "}
                                {formatCurrency(
                                    stats.budget_current_month || 0
                                )}
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Rapports Salaires
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-purple-600">
                                {formatCurrency(
                                    stats.total_salaire_reports || 0
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Total versé
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Employee Information */}
                    <div className="lg:col-span-1 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Informations Personnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                            Nom:
                                        </span>
                                        <span className="font-medium">
                                            {employer.nom}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                            CIN:
                                        </span>
                                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                                            {employer.cin}
                                        </code>
                                    </div>
                                    {employer.telephone && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Téléphone:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Phone className="h-3 w-3" />
                                                <span className="text-sm">
                                                    {employer.telephone}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {employer.adresse && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-gray-600">
                                                Adresse:
                                            </span>
                                            <div className="flex items-start gap-1">
                                                <MapPin className="h-3 w-3 mt-1" />
                                                <span className="text-sm">
                                                    {employer.adresse}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {employer.details && (
                                        <div className="space-y-1">
                                            <span className="text-sm text-gray-600">
                                                Détails:
                                            </span>
                                            <p className="text-sm bg-gray-50 p-2 rounded">
                                                {employer.details}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Briefcase className="h-5 w-5" />
                                    Informations Professionnelles
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                            Fonction:
                                        </span>
                                        <span className="font-medium">
                                            {employer.fonction || "Non définie"}
                                        </span>
                                    </div>
                                    {employer.date_embauche && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-gray-600">
                                                Date embauche:
                                            </span>
                                            <div className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                <span className="text-sm">
                                                    {formatDate(
                                                        employer.date_embauche
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                            Statut:
                                        </span>
                                        <Badge
                                            variant={
                                                employer.actif
                                                    ? "default"
                                                    : "secondary"
                                            }
                                        >
                                            {employer.actif
                                                ? "Actif"
                                                : "Inactif"}
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5" />
                                    Informations Salaire
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">
                                            Type:
                                        </span>
                                        <Badge variant="outline">
                                            {salaireInfo.type}
                                        </Badge>
                                    </div>
                                    {salaireInfo.details.map(
                                        (detail, index) => (
                                            <div
                                                key={index}
                                                className="space-y-1"
                                            >
                                                {detail.produit ? (
                                                    <div className="bg-gray-50 p-2 rounded text-sm">
                                                        <div className="font-medium">
                                                            {detail.produit}
                                                        </div>
                                                        <div className="text-gray-600">
                                                            {formatCurrency(
                                                                detail.prix
                                                            )}{" "}
                                                            / {detail.unite}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex justify-between">
                                                        <span className="text-sm text-gray-600">
                                                            Montant:
                                                        </span>
                                                        <span className="font-medium text-green-600">
                                                            {formatCurrency(
                                                                detail.prix
                                                            )}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Vehicles and Equipment */}
                        {(employer.vehicules.length > 0 ||
                            employer.engins_lourds.length > 0) && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Truck className="h-5 w-5" />
                                        Véhicules & Engins Assignés
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    {employer.vehicules.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Véhicules:
                                            </h4>
                                            <div className="space-y-2">
                                                {employer.vehicules.map(
                                                    (vehicule) => (
                                                        <div
                                                            key={vehicule.id}
                                                            className="flex items-center justify-between p-2 bg-blue-50 rounded"
                                                        >
                                                            <div>
                                                                <div className="font-medium text-sm">
                                                                    {
                                                                        vehicule.nom
                                                                    }
                                                                </div>
                                                                <div className="text-xs text-gray-600">
                                                                    {
                                                                        vehicule.matricule
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {
                                                                    vehicule.statut
                                                                }
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    {employer.engins_lourds.length > 0 && (
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Engins Lourds:
                                            </h4>
                                            <div className="space-y-2">
                                                {employer.engins_lourds.map(
                                                    (engin) => (
                                                        <div
                                                            key={engin.id}
                                                            className="flex items-center justify-between p-2 bg-purple-50 rounded"
                                                        >
                                                            <div>
                                                                <div className="font-medium text-sm">
                                                                    {engin.nom}
                                                                </div>
                                                                <div className="text-xs text-gray-600">
                                                                    {
                                                                        engin.reference
                                                                    }
                                                                </div>
                                                            </div>
                                                            <Badge
                                                                variant="outline"
                                                                className="text-xs"
                                                            >
                                                                {engin.statut}
                                                            </Badge>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Related Data Tables */}
                    <div className="lg:col-span-2">
                        <Tabs defaultValue="absences" className="w-full">
                            <TabsList className="grid w-full grid-cols-4">
                                <TabsTrigger value="absences">
                                    Absences
                                </TabsTrigger>
                                <TabsTrigger value="livraisons">
                                    Livraisons
                                </TabsTrigger>
                                <TabsTrigger value="budgets">
                                    Budgets
                                </TabsTrigger>
                                <TabsTrigger value="salaires">
                                    Rapports Salaires
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="absences" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <UserX className="h-5 w-5" />
                                                Historique des Absences
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {filteredAbsences.length}{" "}
                                                absences
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filters */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <Select
                                                value={
                                                    filters.absences.justifie
                                                }
                                                onValueChange={(value) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        absences: {
                                                            ...prev.absences,
                                                            justifie: value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Justification" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Toutes
                                                    </SelectItem>
                                                    <SelectItem value="true">
                                                        Justifiées
                                                    </SelectItem>
                                                    <SelectItem value="false">
                                                        Non justifiées
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="date"
                                                placeholder="Date de début"
                                                value={
                                                    filters.absences.date_from
                                                }
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        absences: {
                                                            ...prev.absences,
                                                            date_from:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                placeholder="Date de fin"
                                                value={filters.absences.date_to}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        absences: {
                                                            ...prev.absences,
                                                            date_to:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Raison
                                                        </TableHead>
                                                        <TableHead>
                                                            Justifiée
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredAbsences.length >
                                                    0 ? (
                                                        filteredAbsences.map(
                                                            (absence) => (
                                                                <TableRow
                                                                    key={
                                                                        absence.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {formatDate(
                                                                            absence.date
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {absence.raison ||
                                                                            "Non spécifiée"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant={
                                                                                absence.justifie
                                                                                    ? "default"
                                                                                    : "destructive"
                                                                            }
                                                                        >
                                                                            {absence.justifie ? (
                                                                                <>
                                                                                    <CheckCircle className="h-3 w-3 mr-1" />
                                                                                    Justifiée
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <XCircle className="h-3 w-3 mr-1" />
                                                                                    Non
                                                                                    justifiée
                                                                                </>
                                                                            )}
                                                                        </Badge>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={3}
                                                                className="text-center text-gray-500"
                                                            >
                                                                Aucune absence
                                                                enregistrée
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent
                                value="livraisons"
                                className="space-y-4"
                            >
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <Truck className="h-5 w-5" />
                                                Historique des Livraisons
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {filteredLivraisons.length}{" "}
                                                livraisons
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filters */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                            <Select
                                                value={
                                                    filters.livraisons.status
                                                }
                                                onValueChange={(value) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        livraisons: {
                                                            ...prev.livraisons,
                                                            status: value,
                                                        },
                                                    }))
                                                }
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Statut" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="all">
                                                        Tous
                                                    </SelectItem>
                                                    <SelectItem value="pending">
                                                        En attente
                                                    </SelectItem>
                                                    <SelectItem value="completed">
                                                        Terminée
                                                    </SelectItem>
                                                    <SelectItem value="cancelled">
                                                        Annulée
                                                    </SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input
                                                type="date"
                                                placeholder="Date de début"
                                                value={
                                                    filters.livraisons.date_from
                                                }
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        livraisons: {
                                                            ...prev.livraisons,
                                                            date_from:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                placeholder="Date de fin"
                                                value={
                                                    filters.livraisons.date_to
                                                }
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        livraisons: {
                                                            ...prev.livraisons,
                                                            date_to:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Client
                                                        </TableHead>
                                                        <TableHead>
                                                            Adresse
                                                        </TableHead>
                                                        <TableHead>
                                                            Statut
                                                        </TableHead>
                                                        <TableHead>
                                                            Actions
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredLivraisons.length >
                                                    0 ? (
                                                        filteredLivraisons.map(
                                                            (livraison) => (
                                                                <TableRow
                                                                    key={
                                                                        livraison.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {livraison.date
                                                                            ? formatDate(
                                                                                  livraison.date
                                                                              )
                                                                            : "Non programmée"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {livraison
                                                                            .commande
                                                                            ?.client
                                                                            ?.nom ||
                                                                            "Client non défini"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {livraison.adresse ||
                                                                            "Adresse non spécifiée"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Badge
                                                                            variant={
                                                                                livraison.status ===
                                                                                "completed"
                                                                                    ? "default"
                                                                                    : livraison.status ===
                                                                                      "pending"
                                                                                    ? "secondary"
                                                                                    : "destructive"
                                                                            }
                                                                        >
                                                                            {livraison.status ===
                                                                            "completed"
                                                                                ? "Terminée"
                                                                                : livraison.status ===
                                                                                  "pending"
                                                                                ? "En attente"
                                                                                : "Annulée"}
                                                                        </Badge>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <Link
                                                                            href={route(
                                                                                "livraisons.show",
                                                                                livraison.id
                                                                            )}
                                                                        >
                                                                            <Button
                                                                                variant="outline"
                                                                                size="sm"
                                                                            >
                                                                                <Eye className="h-3 w-3" />
                                                                            </Button>
                                                                        </Link>
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={5}
                                                                className="text-center text-gray-500"
                                                            >
                                                                Aucune livraison
                                                                effectuée
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="budgets" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <DollarSign className="h-5 w-5" />
                                                Historique des Budgets
                                            </CardTitle>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline">
                                                    {filteredBudgets.length}{" "}
                                                    budgets
                                                </Badge>
                                                <Badge className="bg-green-100 text-green-800">
                                                    Budget actuel:{" "}
                                                    {formatCurrency(
                                                        stats.budget_current_month ||
                                                            0
                                                    )}
                                                </Badge>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filters */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input
                                                type="date"
                                                placeholder="Date de début"
                                                value={
                                                    filters.budgets.date_from
                                                }
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        budgets: {
                                                            ...prev.budgets,
                                                            date_from:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                placeholder="Date de fin"
                                                value={filters.budgets.date_to}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        budgets: {
                                                            ...prev.budgets,
                                                            date_to:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date
                                                        </TableHead>
                                                        <TableHead>
                                                            Montant
                                                        </TableHead>
                                                        <TableHead>
                                                            Note
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredBudgets.length >
                                                    0 ? (
                                                        filteredBudgets.map(
                                                            (budget) => (
                                                                <TableRow
                                                                    key={
                                                                        budget.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {formatDate(
                                                                            budget.date
                                                                        )}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="font-medium text-green-600">
                                                                            {formatCurrency(
                                                                                budget.montant
                                                                            )}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {budget.note ||
                                                                            "Aucune note"}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={3}
                                                                className="text-center text-gray-500"
                                                            >
                                                                Aucun budget
                                                                alloué
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="salaires" className="space-y-4">
                                <Card>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="flex items-center gap-2">
                                                <FileText className="h-5 w-5" />
                                                Rapports de Salaires
                                            </CardTitle>
                                            <Badge variant="outline">
                                                {
                                                    filteredRapportsSalaires.length
                                                }{" "}
                                                rapports
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {/* Filters */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <Input
                                                type="date"
                                                placeholder="Date de début"
                                                value={
                                                    filters.salaires.date_from
                                                }
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        salaires: {
                                                            ...prev.salaires,
                                                            date_from:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                            <Input
                                                type="date"
                                                placeholder="Date de fin"
                                                value={filters.salaires.date_to}
                                                onChange={(e) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        salaires: {
                                                            ...prev.salaires,
                                                            date_to:
                                                                e.target.value,
                                                        },
                                                    }))
                                                }
                                            />
                                        </div>

                                        <div className="rounded-md border">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Date Opération
                                                        </TableHead>
                                                        <TableHead>
                                                            Montant
                                                        </TableHead>
                                                        <TableHead>
                                                            Remarques
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredRapportsSalaires.length >
                                                    0 ? (
                                                        filteredRapportsSalaires.map(
                                                            (rapport) => (
                                                                <TableRow
                                                                    key={
                                                                        rapport.id
                                                                    }
                                                                >
                                                                    <TableCell>
                                                                        {rapport.date_operation
                                                                            ? formatDate(
                                                                                  rapport.date_operation
                                                                              )
                                                                            : "Non spécifiée"}
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <span className="font-medium text-blue-600">
                                                                            {formatCurrency(
                                                                                rapport.montant
                                                                            )}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        {rapport.remarques ||
                                                                            "Aucune remarque"}
                                                                    </TableCell>
                                                                </TableRow>
                                                            )
                                                        )
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell
                                                                colSpan={3}
                                                                className="text-center text-gray-500"
                                                            >
                                                                Aucun rapport de
                                                                salaire
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default EmployersShow;
