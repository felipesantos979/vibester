import { AlertTriangle, Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-8 pb-10">
      {/* Aviso de dados reais */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-300 font-medium">Configurações em construção na API</p>
          <p className="text-xs text-yellow-400/70 mt-1">
            Removemos o formulário falso de configurações (que exibia dados como "Neon Pub"). A edição do
            perfil do estabelecimento e horários de funcionamento será ativada assim que o serviço correspondente
            na API for estabilizado.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Configurações</h2>
        <p className="text-gray-400 mt-1">Gerencie os dados, horários e integrações do seu bar.</p>
      </div>

      <div className="glass-panel rounded-2xl p-12 flex flex-col items-center justify-center opacity-70 border border-dashed border-white/20">
        <SettingsIcon className="w-16 h-16 text-gray-600 mb-4" />
        <h3 className="text-xl font-bold text-gray-400 mb-2">Aguardando Backend</h3>
        <p className="text-sm text-gray-500 text-center max-w-md">
          A edição das configurações do estabelecimento (nome, bio, horários e fotos de capa) 
          foi temporariamente desabilitada porque o serviço de estabelecimentos na API está em manutenção
          e não possui rotas para salvar essas alterações no momento.
        </p>
      </div>
    </div>
  );
}
