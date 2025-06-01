import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { User, Phone, CreditCard, MapPin, Calendar } from "lucide-react";

export default function PersonalInfoForm({ data, setData, errors }) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2 pb-4 border-b border-gray-200">
                <User className="w-5 h-5 text-[#f9c401]" />
                <h3 className="text-lg font-semibold text-[#262626]">
                    Informations Personnelles
                </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <Label htmlFor="nom">Nom <span className="text-red-500">*</span></Label>
                    <div className="mt-1">
                        <Input
                            id="nom"
                            value={data.nom}
                            onChange={e => setData('nom', e.target.value)}
                            className={errors.nom ? 'border-red-500' : ''}
                            placeholder="Entrez le nom"
                        />
                        {errors.nom && <p className="mt-1 text-sm text-red-500">{errors.nom}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="prenom">Prénom <span className="text-red-500">*</span></Label>
                    <div className="mt-1">
                        <Input
                            id="prenom"
                            value={data.prenom}
                            onChange={e => setData('prenom', e.target.value)}
                            className={errors.prenom ? 'border-red-500' : ''}
                            placeholder="Entrez le prénom"
                        />
                        {errors.prenom && <p className="mt-1 text-sm text-red-500">{errors.prenom}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="cin">CIN <span className="text-red-500">*</span></Label>
                    <div className="mt-1">
                        <Input
                            id="cin"
                            value={data.cin}
                            onChange={e => setData('cin', e.target.value)}
                            className={errors.cin ? 'border-red-500' : ''}
                            placeholder="Ex: AB123456"
                        />
                        {errors.cin && <p className="mt-1 text-sm text-red-500">{errors.cin}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="telephone">Téléphone</Label>
                    <div className="mt-1">
                        <Input
                            id="telephone"
                            value={data.telephone}
                            onChange={e => setData('telephone', e.target.value)}
                            className={errors.telephone ? 'border-red-500' : ''}
                            placeholder="Ex: +212 6XX XXX XXX"
                        />
                        {errors.telephone && <p className="mt-1 text-sm text-red-500">{errors.telephone}</p>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="date_debut">Date de début <span className="text-red-500">*</span></Label>
                    <div className="mt-1">
                        <Input
                            id="date_debut"
                            type="date"
                            value={data.date_debut}
                            onChange={e => setData('date_debut', e.target.value)}
                            className={errors.date_debut ? 'border-red-500' : ''}
                        />
                        {errors.date_debut && <p className="mt-1 text-sm text-red-500">{errors.date_debut}</p>}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <Switch
                        id="est_actif"
                        checked={data.est_actif}
                        onCheckedChange={checked => setData('est_actif', checked)}
                    />
                    <Label htmlFor="est_actif" className="cursor-pointer">
                        Utilisateur actif
                    </Label>
                </div>

                <div className="md:col-span-2">
                    <Label htmlFor="adresse">Adresse</Label>
                    <div className="mt-1">
                        <Textarea
                            id="adresse"
                            value={data.adresse}
                            onChange={e => setData('adresse', e.target.value)}
                            className={errors.adresse ? 'border-red-500' : ''}
                            rows={3}
                            placeholder="Entrez l'adresse complète"
                        />
                        {errors.adresse && <p className="mt-1 text-sm text-red-500">{errors.adresse}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
