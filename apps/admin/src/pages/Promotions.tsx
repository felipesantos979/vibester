import { AlertTriangle, Tag } from 'lucide-react';

export default function Promotions() {
  return (
    <div className="space-y-8 pb-10">
      {/* Aviso de dados reais */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-300 font-medium">Promoções em construção na API</p>
          <p className="text-xs text-yellow-400/70 mt-1">
            Removemos as promoções falsas (mockadas). O gerenciamento de promoções (descontos, promoções relâmpago, etc.)
            estará disponível aqui assim que a equipe de backend liberar o novo serviço.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Promoções</h2>
          <p className="text-gray-400 mt-1">Gerencie suas promoções e descontos.</p>
        </div>
        <button 
          disabled
          className="bg-[#FF4500]/50 text-white/50 px-6 py-2.5 rounded-full font-medium cursor-not-allowed"
        >
          + Nova Promoção
        </button>
      </div>

      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center opacity-70 border border-dashed border-white/20">
        <Tag className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">Aguardando Backend</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          A funcionalidade de criar e gerenciar promoções foi temporariamente desabilitada 
          até que a integração com a API real seja concluída.
        </p>
      </div>
    </div>
  );
}
