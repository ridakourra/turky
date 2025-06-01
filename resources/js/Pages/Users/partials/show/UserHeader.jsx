import { User, Phone, MapPin, Calendar, IdCard } from "lucide-react";

export default function UserHeader({ user }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start gap-6">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-[#f9c401] to-[#e0b001] rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-[#262626]" />
                </div>

                {/* User Details */}
                <div className="flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <IdCard className="w-4 h-4" />
                                <span className="text-sm">CIN:</span>
                                <span className="font-medium text-gray-900">{user.cin}</span>
                            </div>

                            {user.telephone && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span className="text-sm">Téléphone:</span>
                                    <span className="font-medium text-gray-900">{user.telephone}</span>
                                </div>
                            )}

                            {user.adresse && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span className="text-sm">Adresse:</span>
                                    <span className="font-medium text-gray-900">{user.adresse}</span>
                                </div>
                            )}
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Date de début:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user.date_debut).toLocaleDateString('fr-FR')}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span className="text-sm">Membre depuis:</span>
                                <span className="font-medium text-gray-900">
                                    {new Date(user.created_at).toLocaleDateString('fr-FR')}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
