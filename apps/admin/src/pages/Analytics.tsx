import { AlertTriangle, BarChart3 } from 'lucide-react';

export default function Analytics() {
  return (
    <div className="space-y-8 pb-10">
      {/* Aviso de dados reais */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-300 font-medium">Analytics em construção na API</p>
          <p className="text-xs text-yellow-400/70 mt-1">
            Os gráficos falsos de retenção, demografia e tempo de permanência foram removidos.
            Esses dados reais estarão disponíveis assim que o serviço de estatísticas for implementado no backend.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Analytics da Noite</h2>
        <p className="text-gray-400 mt-1">Dados demográficos, retenção e histórico de vibração.</p>
      </div>

      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center opacity-70 border border-dashed border-white/20">
        <BarChart3 className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">Aguardando Backend</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          O painel de estatísticas avançadas (tempo de permanência, demografia, pico de energia) 
          ainda não possui um serviço correspondente na API de produção.
        </p>
      </div>
    </div>
  );
}
