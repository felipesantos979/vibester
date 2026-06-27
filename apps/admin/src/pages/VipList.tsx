import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Search, Filter, Download } from 'lucide-react';

const vipRequests = [
  { id: 1, name: 'Lucas Silva', event: 'Neon Night: Techno', date: 'Há 10 min', status: 'pending', friends: 2 },
  { id: 2, name: 'Mariana Costa', event: 'Neon Night: Techno', date: 'Há 25 min', status: 'approved', friends: 0 },
  { id: 3, name: 'João Pedro', event: 'Double Chopp Univ.', date: 'Há 1 hora', status: 'pending', friends: 4 },
  { id: 4, name: 'Amanda Souza', event: 'Samba de Domingo', date: 'Há 2 horas', status: 'rejected', friends: 1 },
];

export default function VipList() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">VIP List</h2>
          <p className="text-gray-400 mt-1">Gerencie aprovações e convidados das suas listas.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="p-2.5 bg-bg-card border border-border-subtle rounded-xl text-gray-300 hover:text-white hover:border-white/20 transition-all">
            <Download className="w-5 h-5" />
          </button>
          <button className="bg-white hover:bg-gray-200 text-bg-dark px-5 py-2.5 rounded-xl font-bold transition-all duration-300 shadow-lg">
            Exportar P/ Portaria
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row gap-4 justify-between items-center bg-white/[0.02]">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar nome..." 
              className="w-full bg-bg-dark border border-border-subtle rounded-lg py-2 pl-9 pr-4 text-sm text-white focus:outline-none focus:border-brand-fire transition-colors"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
            Filtrar por Evento
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 text-xs uppercase tracking-wider text-gray-500 bg-black/20">
                <th className="p-4 font-medium">Nome do Convidado</th>
                <th className="p-4 font-medium">Evento</th>
                <th className="p-4 font-medium">Acompanhantes</th>
                <th className="p-4 font-medium">Solicitado</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {vipRequests.map((req, i) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={req.id} 
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="p-4">
                    <span className="font-bold text-white group-hover:text-brand-fire transition-colors">{req.name}</span>
                  </td>
                  <td className="p-4 text-sm text-gray-300">{req.event}</td>
                  <td className="p-4 text-sm text-gray-400">+{req.friends} pessoas</td>
                  <td className="p-4 text-sm text-gray-400">{req.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                      req.status === 'pending' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' :
                      req.status === 'approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {req.status === 'pending' ? 'Pendente' : req.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-2">
                    {req.status === 'pending' ? (
                      <>
                        <button className="p-1.5 bg-green-500/20 hover:bg-green-500/40 text-green-400 rounded transition-colors" title="Aprovar">
                          <Check className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-400 rounded transition-colors" title="Rejeitar">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <span className="text-xs text-gray-600 italic">Finalizado</span>
                    )}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
