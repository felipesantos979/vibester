import { AlertTriangle, Users } from 'lucide-react';

export default function VipList() {
  return (
    <div className="space-y-8 pb-10">
      {/* Aviso de dados reais */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-300 font-medium">Lista de Confirmados em construção na API</p>
          <p className="text-xs text-yellow-400/70 mt-1">
            Removemos os nomes falsos gerados pelo navegador. A visualização detalhada de usuários que confirmaram
            presença nos seus eventos será liberada assim que os endpoints de "presença" forem implementados no backend.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Confirmados</h2>
          <p className="text-gray-400 mt-1">Veja quem confirmou presença nos seus eventos.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center opacity-70 border border-dashed border-white/20">
        <Users className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">Aguardando Backend</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          A lista de pessoas (VIPs) que confirmaram presença nos eventos não está disponível ainda porque o 
          serviço de eventos da API não possui as rotas para buscar os perfis de usuários confirmados.
        </p>
      </div>
    </div>
  );
}
