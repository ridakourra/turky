import React, { useState } from 'react';
import { Link, useForm } from '@inertiajs/react';
import {
  UserPlus, Save, ArrowLeft, User, Phone, MapPin,
  CreditCard, Calendar, Shield, DollarSign, Clock,
  AlertCircle, Eye, EyeOff, ArrowRight, ChevronLeft
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/Layouts/AdminLayout';

export default function Create({ roles, salary_types }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, setData, post, processing, errors, reset } = useForm({
    nom: '',
    prenom: '',
    telephone: '',
    cin: '',
    password: '',
    password_confirmation: '',
    adresse: '',
    role: '',
    date_debut: new Date().toISOString().split('T')[0],
    est_actif: true,
    salaire_montant: '',
    salaire_type: '',
  });

  // Seuls directeur et comptable ont des comptes avec mot de passe
  const hasAccount = ['directeur', 'comptable'].includes(data.role);

  const getSteps = () => {
    const steps = [
      { number: 1, title: 'Choix du rôle', description: 'Définir le type d\'employé' }
    ];

    if (data.role) {
      steps.push({ number: 2, title: 'Informations personnelles', description: 'Données de base' });
    }

    if (hasAccount && data.role) {
      steps.push({ number: 3, title: 'Données du compte', description: 'Mot de passe et paramètres' });
    }

    if (data.role) {
      steps.push({
        number: hasAccount ? 4 : 3,
        title: 'Paramètres du salaire',
        description: 'Configuration du salaire'
      });
    }

    return steps;
  };

  const steps = getSteps();
  const maxSteps = steps.length;

  const handleNext = () => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRoleChange = (role) => {
    setData('role', role);
    // Reset password fields if not directeur/comptable
    if (!['directeur', 'comptable'].includes(role)) {
      setData(prev => ({
        ...prev,
        password: '',
        password_confirmation: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare data based on role
    const submitData = { ...data };

    // Remove password fields for employees without accounts
    if (!hasAccount) {
      delete submitData.password;
      delete submitData.password_confirmation;
    }

    post(route('users.store'), {
      data: submitData,
      onSuccess: () => reset(),
    });
  };

  const getRoleIcon = (role) => {
    const icons = {
      employe: User,
      directeur: Shield,
      comptable: DollarSign,
      livreur: Clock,
    };
    const IconComponent = icons[role] || User;
    return <IconComponent className="w-4 h-4" />;
  };

  const canProceedFromStep = (step) => {
    switch (step) {
      case 1:
        return !!data.role;
      case 2:
        return data.nom && data.prenom && data.telephone && data.cin;
      case 3:
        if (hasAccount) {
          return data.password && data.password_confirmation;
        }
        // For salary step when no account needed
        return data.salaire_montant && data.salaire_type;
      case 4:
        // Salary step for directeur/comptable
        return data.salaire_montant && data.salaire_type;
      default:
        return true;
    }
  };

  return (
    <>
      <AdminLayout title={'Créer un nouvel employé'}>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href={route('users.index')}>
                <Button variant="outline" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Créer un nouvel employé</h1>
                <p className="text-gray-600 mt-1">Ajouter un nouvel employé au système</p>
              </div>
            </div>
          </div>

          {/* Progress Steps */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-8">
                {steps.map((step, index) => (
                  <React.Fragment key={step.number}>
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= step.number
                            ? 'bg-[#f9c401] text-[#262626]'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step.number}
                      </div>
                      <div className="text-center mt-2">
                        <p className="text-sm font-medium text-gray-900">{step.title}</p>
                        <p className="text-xs text-gray-500">{step.description}</p>
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-4 ${
                          currentStep > step.number ? 'bg-[#f9c401]' : 'bg-gray-200'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <div className="space-y-6">
            {/* Step 1: Role Selection */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Choisir le rôle de l'employé
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <AlertDescription className="text-blue-700">
                      Veuillez d'abord choisir le type d'employé pour déterminer les champs requis
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="role">Rôle *</Label>
                    <Select value={data.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Choisir le rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(roles).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            <div className="flex items-center gap-2">
                              {getRoleIcon(key)}
                              <span>{label}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.role && (
                      <p className="text-red-500 text-sm mt-1">{errors.role}</p>
                    )}
                  </div>

                  {data.role && (
                    <Alert className="border-green-200 bg-green-50">
                      <AlertCircle className="w-4 h-4 text-green-500" />
                      <AlertDescription className="text-green-700">
                        {data.role === 'directeur' && "Directeur : a un compte avec mot de passe et un salaire avec privilèges administratifs"}
                        {data.role === 'comptable' && "Comptable : a un compte avec mot de passe et un salaire avec privilèges comptables"}
                        {data.role === 'livreur' && "Livreur : a un salaire seulement, sans compte système"}
                        {data.role === 'employe' && "Employé : a un salaire seulement, sans compte système"}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Step 2: Personal Information */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="prenom">Prénom *</Label>
                      <Input
                        id="prenom"
                        type="text"
                        value={data.prenom}
                        onChange={e => setData('prenom', e.target.value)}
                        placeholder="Entrez le prénom"
                        className={errors.prenom ? 'border-red-500' : ''}
                      />
                      {errors.prenom && (
                        <p className="text-red-500 text-sm mt-1">{errors.prenom}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="nom">Nom de famille *</Label>
                      <Input
                        id="nom"
                        type="text"
                        value={data.nom}
                        onChange={e => setData('nom', e.target.value)}
                        placeholder="Entrez le nom de famille"
                        className={errors.nom ? 'border-red-500' : ''}
                      />
                      {errors.nom && (
                        <p className="text-red-500 text-sm mt-1">{errors.nom}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="telephone">Numéro de téléphone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="telephone"
                          type="tel"
                          value={data.telephone}
                          onChange={e => setData('telephone', e.target.value)}
                          placeholder="+212 6XX XXX XXX"
                          className={`pl-10 ${errors.telephone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.telephone && (
                        <p className="text-red-500 text-sm mt-1">{errors.telephone}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cin">Numéro de carte d'identité *</Label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                        <Input
                          id="cin"
                          type="text"
                          value={data.cin}
                          onChange={e => setData('cin', e.target.value)}
                          placeholder="AB123456"
                          className={`pl-10 ${errors.cin ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.cin && (
                        <p className="text-red-500 text-sm mt-1">{errors.cin}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="adresse">Adresse</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Textarea
                        id="adresse"
                        value={data.adresse}
                        onChange={e => setData('adresse', e.target.value)}
                        placeholder="Entrez l'adresse complète"
                        className={`pl-10 ${errors.adresse ? 'border-red-500' : ''}`}
                        rows={3}
                      />
                    </div>
                    {errors.adresse && (
                      <p className="text-red-500 text-sm mt-1">{errors.adresse}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="date_debut">Date de début *</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="date_debut"
                        type="date"
                        value={data.date_debut}
                        onChange={e => setData('date_debut', e.target.value)}
                        className={`pl-10 ${errors.date_debut ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.date_debut && (
                      <p className="text-red-500 text-sm mt-1">{errors.date_debut}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="est_actif"
                      checked={data.est_actif}
                      onCheckedChange={(checked) => setData('est_actif', checked)}
                    />
                    <Label htmlFor="est_actif" className="text-sm font-medium">
                      Employé actif
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Account Settings (for directeur, comptable only) */}
            {currentStep === 3 && hasAccount && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Paramètres du compte
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="w-4 h-4 text-blue-500" />
                    <AlertDescription className="text-blue-700">
                      Cet employé aura besoin d'un mot de passe pour accéder au système
                    </AlertDescription>
                  </Alert>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="password">Mot de passe *</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={data.password}
                          onChange={e => setData('password', e.target.value)}
                          placeholder="8 caractères minimum"
                          className={errors.password ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1 h-8 w-8 p-0"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="password_confirmation">Confirmer le mot de passe *</Label>
                      <div className="relative">
                        <Input
                          id="password_confirmation"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={data.password_confirmation}
                          onChange={e => setData('password_confirmation', e.target.value)}
                          placeholder="Répétez le mot de passe"
                          className={errors.password_confirmation ? 'border-red-500' : ''}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-2 top-1 h-8 w-8 p-0"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                      </div>
                      {errors.password_confirmation && (
                        <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Salary Settings */}
            {((currentStep === 4 && hasAccount) || (currentStep === 3 && !hasAccount)) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Paramètres du salaire
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="border-green-200 bg-green-50">
                    <AlertCircle className="w-4 h-4 text-green-500" />
                    <AlertDescription className="text-green-700">
                      Tous les employés doivent avoir un salaire configuré selon leur type de travail
                    </AlertDescription>
                  </Alert>

                  <div>
                    <Label htmlFor="salaire_type">Type de salaire *</Label>
                    <Select
                      value={data.salaire_type}
                      onValueChange={(value) => setData('salaire_type', value)}
                    >
                      <SelectTrigger className={errors.salaire_type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Choisir le type de salaire" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(salary_types).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.salaire_type && (
                      <p className="text-red-500 text-sm mt-1">{errors.salaire_type}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="salaire_montant">Montant (MAD) *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        id="salaire_montant"
                        type="number"
                        min="0"
                        step="0.01"
                        value={data.salaire_montant}
                        onChange={e => setData('salaire_montant', e.target.value)}
                        placeholder="0.00"
                        className={`pl-10 ${errors.salaire_montant ? 'border-red-500' : ''}`}
                      />
                    </div>
                    {errors.salaire_montant && (
                      <p className="text-red-500 text-sm mt-1">{errors.salaire_montant}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                      >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Précédent
                      </Button>
                    )}
                  </div>

                  <div className="flex items-center gap-4">
                    <Link href={route('users.index')}>
                      <Button type="button" variant="outline">
                        Annuler
                      </Button>
                    </Link>

                    {currentStep < maxSteps ? (
                      <Button
                        type="button"
                        onClick={handleNext}
                        disabled={!canProceedFromStep(currentStep)}
                        className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]"
                      >
                        Suivant
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={processing}
                        className="bg-[#f9c401] hover:bg-[#e0b001] text-[#262626]"
                      >
                        {processing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-[#262626] border-t-transparent rounded-full animate-spin mr-2" />
                            Création en cours...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Créer l'employé
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </AdminLayout>
    </>
  );
}
