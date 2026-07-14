import { Download, Share2, FileText } from 'lucide-react';

const reports = [
  { id: 1, consultation: 'Création SARL Casablanca', thematique: 'Création d\'entreprise', date: '08 Juin 2026', status: 'Prêt' },
  { id: 2, consultation: 'Régime fiscal auto-entrepreneur', thematique: 'Fiscalité', date: '03 Juin 2026', status: 'Prêt' },
  { id: 3, consultation: 'Obligations CNSS employeur', thematique: 'CNSS & Social', date: '27 Mai 2026', status: 'En cours' },
];

export default function Rapports() {
  const hasReports = reports.length > 0;

  return (
    <div className="p-5 md:p-6 space-y-5">
      <h1 className="font-syne font-700 text-xl text-white">Rapports</h1>

      {hasReports ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800/60 text-left">
                <th className="pb-3 text-slate-500 font-medium text-xs">Consultation</th>
                <th className="pb-3 text-slate-500 font-medium text-xs">Thématique</th>
                <th className="pb-3 text-slate-500 font-medium text-xs">Date</th>
                <th className="pb-3 text-slate-500 font-medium text-xs">Statut</th>
                <th className="pb-3 text-slate-500 font-medium text-xs text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr key={r.id} className="border-b border-slate-800/40 hover:bg-slate-900/40 transition">
                  <td className="py-3.5 text-white">{r.consultation}</td>
                  <td className="py-3.5">
                    <span className="text-xs bg-turquoise/10 text-turquoise px-2 py-0.5 rounded-full">{r.thematique}</span>
                  </td>
                  <td className="py-3.5 text-slate-400">{r.date}</td>
                  <td className="py-3.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === 'Prêt' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber/10 text-amber'}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-slate-400 hover:text-turquoise transition" title="Télécharger PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-turquoise transition" title="Partager">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
            <FileText className="w-7 h-7 text-slate-600" />
          </div>
          <h3 className="font-syne font-700 text-white mb-1">Aucun rapport</h3>
          <p className="text-slate-500 text-sm text-center max-w-xs">Tes rapports apparaîtront ici après tes premières consultations.</p>
        </div>
      )}
    </div>
  );
}
