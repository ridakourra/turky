import { UserX, CheckCircle, AlertTriangle, Calendar, FileText } from "lucide-react";

export default function AbsencesSection({ user }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('fr-FR');
    };

    const getStatusBadge = (justified) => {
        return justified ? (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                <CheckCircle className="w-3 h-3 mr-1" />
                Justifiée
            </span>
        ) : (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Non Justifiée
            </span>
        );
    };

    const totalAbsences = user.absences?.length || 0;
    const justifiedAbsences = user.absences?.filter(absence => absence.justifie).length || 0;
    const unjustifiedAbsences = totalAbsences - justifiedAbsences;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <UserX className="w-5 h-5" />
                    Gestion des Absences
                </h3>
            </div>

            <div className="p-6">
                {/* Summary Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <UserX className="w-5 h-5 text-gray-600" />
                            <div>
                                <p className="text-sm text-gray-600">Total Absences</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAbsences}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <div>
                                <p className="text-sm text-gray-600">Justifiées</p>
                                <p className="text-2xl font-bold text-green-600">{justifiedAbsences}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <div>
                                <p className="text-sm text-gray-600">Non Justifiées</p>
                                <p className="text-2xl font-bold text-red-600">{unjustifiedAbsences}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Absences List */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-4">Historique des Absences</h4>

                    {totalAbsences === 0 ? (
                        <div className="text-center py-8">
                            <UserX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500">Aucune absence enregistrée</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {user.absences.slice(0, 5).map((absence, index) => (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-4 h-4" />
                                            <span className="font-medium">
                                                {formatDate(absence.date_absence)}
                                            </span>
                                        </div>

                                        {absence.raison && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <FileText className="w-4 h-4" />
                                                <span className="text-sm">{absence.raison}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {getStatusBadge(absence.justifie)}
                                        <span className="text-xs text-gray-500">
                                            {formatDate(absence.created_at)}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            {totalAbsences > 5 && (
                                <div className="text-center pt-4">
                                    <p className="text-sm text-gray-500">
                                        Et {totalAbsences - 5} autres absences...
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
