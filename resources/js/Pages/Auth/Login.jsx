import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, Building2 } from 'lucide-react';

const Login = ({ errors }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { data, setData, post, processing } = useForm({
    cin: '',
    password: '',
    remember: false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/login');
  };

  return (
    <>
      <Head title="Connexion - Turky" />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-yellow-500 rounded-full flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-3xl font-bold text-gray-900">Turky</h1>
            <p className="mt-2 text-sm text-gray-600">
              Connectez-vous à votre compte
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-center text-xl">Connexion</CardTitle>
              <CardDescription className="text-center">
                Entrez vos identifiants pour accéder au système
              </CardDescription>
            </CardHeader>
            <CardContent>
              {errors.cin && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                  <AlertDescription className="text-red-800">
                    {errors.cin}
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cin">CIN</Label>
                  <Input
                    id="cin"
                    type="text"
                    value={data.cin}
                    onChange={(e) => setData('cin', e.target.value)}
                    placeholder="Entrez votre CIN"
                    className="w-full"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Entrez votre mot de passe"
                      className="w-full pr-10"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                  />
                  <Label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
                    Se souvenir de moi
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 text-white"
                >
                  {processing ? 'Connexion...' : 'Se connecter'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            © 2024 Turky. Tous droits réservés.
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;