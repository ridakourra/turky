import React, { useState } from "react";
import { Head, useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, LogIn, Building2 } from "lucide-react";
import { toast, Toaster } from "sonner";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        cin: "",
        password: "",
        remember: false,
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onSuccess: () => {
                toast.success("Connexion réussie !");
            },
            onError: (errors) => {
                if (errors.cin) {
                    toast.error(errors.cin);
                }
                if (errors.password) {
                    toast.error(errors.password);
                }
            },
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-gray-50 to-white flex items-center justify-center p-4">
            <Head title="Connexion" />
            <Toaster />
            <div className="w-full max-w-md space-y-8">
                {/* Logo et titre */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="w-8 h-8 text-gray-900" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Connexion
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Accédez à votre espace de gestion
                    </p>
                </div>

                {/* Formulaire de connexion */}
                <Card className="border-0 shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl font-semibold text-center text-gray-900">
                            Se connecter
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Entrez vos identifiants pour accéder à votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Champ CIN */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="cin"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    CIN
                                </Label>
                                <Input
                                    id="cin"
                                    type="text"
                                    placeholder="Entrez votre CIN"
                                    value={data.cin}
                                    onChange={(e) =>
                                        setData("cin", e.target.value)
                                    }
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                                        errors.cin
                                            ? "border-red-500"
                                            : "border-gray-300"
                                    }`}
                                    disabled={processing}
                                />
                                {errors.cin && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-2"
                                    >
                                        <AlertDescription>
                                            {errors.cin}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Champ mot de passe */}
                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Mot de passe
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Entrez votre mot de passe"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${
                                            errors.password
                                                ? "border-red-500"
                                                : "border-gray-300"
                                        }`}
                                        disabled={processing}
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="w-5 h-5" />
                                        ) : (
                                            <Eye className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <Alert
                                        variant="destructive"
                                        className="mt-2"
                                    >
                                        <AlertDescription>
                                            {errors.password}
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>

                            {/* Case à cocher "Se souvenir de moi" */}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked) =>
                                        setData("remember", checked)
                                    }
                                    className="data-[state=checked]:bg-yellow-400 data-[state=checked]:border-yellow-400"
                                />
                                <Label
                                    htmlFor="remember"
                                    className="text-sm text-gray-600 cursor-pointer"
                                >
                                    Se souvenir de moi
                                </Label>
                            </div>

                            {/* Bouton de connexion */}
                            <Button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center space-x-2"
                            >
                                {processing ? (
                                    <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <LogIn className="w-5 h-5" />
                                        <span>Se connecter</span>
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Pied de page */}
                <div className="text-center text-sm text-gray-500">
                    {/* <p>© 2024 Système de Gestion. Tous droits réservés.</p> */}
                </div>
            </div>
        </div>
    );
}
