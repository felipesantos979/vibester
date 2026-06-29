import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Eye, TrendingUp, Image, AlertTriangle } from 'lucide-react';
import { getEstablishmentId } from '../lib/establishment';
import { listPostsByEstablishment } from '../api/posts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [postCount, setPostCount] = useState<number | null>(null);
  const [establishmentId, setEstablishmentId] = useState<string | null>(null);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const estId = await getEstablishmentId();
        if (!active) return;
        setEstablishmentId(estId);
        const posts = await listPostsByEstablishment(estId);
        if (active) setPostCount(posts.filter((p) => !p.isDeleted).length);
      } catch (err) {
        if (active) setLoadError(err instanceof Error ? err.message : 'Erro ao carregar dados.');
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="space-y-8 pb-10">
      {/* Aviso de dados reais */}
      <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl px-5 py-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-yellow-300 font-medium">Dashboard em construção</p>
          <p className="text-xs text-yellow-400/70 mt-1">
            A API ainda não fornece métricas de lotação, check-ins ou visualizações. 
            Os dados abaixo são os únicos reais disponíveis. Conforme novos endpoints 
            forem criados no backend, este painel será atualizado.
          </p>
        </div>
      </div>

      {loadError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-5 py-3 text-red-400 text-sm">
          {loadError}
        </div>
      )}

      {/* Row 1: KPI Cards — dados reais disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1: Posts publicados (real) */}
        <div
          onClick={() => navigate('/posts')}
          className="glass-panel rounded-2xl p-6 relative overflow-hidden group border-brand-fire/20 transition-all duration-300 hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
        >
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-brand-fire/10 rounded-full group-hover:bg-brand-fire/20 transition-all duration-500"></div>
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Posts Publicados</p>
              <h3 className="text-3xl font-bold text-white mt-1">
                {postCount !== null ? postCount : '—'}
              </h3>
            </div>
            <div className="p-3 bg-brand-fire/10 rounded-xl">
              <Image className="w-6 h-6 text-brand-fire" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-6 font-medium">
            Total de posts no seu estabelecimento
          </p>
        </div>

        {/* KPI 2: Lotação — sem endpoint */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 opacity-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Lotação Atual</p>
              <h3 className="text-3xl font-bold text-gray-600 mt-1">—</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <Users className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-6 font-medium">
            Aguardando endpoint na API
          </p>
        </div>

        {/* KPI 3: Check-ins — sem endpoint */}
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 opacity-50">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-gray-400 text-sm font-medium">Check-ins Hoje</p>
              <h3 className="text-3xl font-bold text-gray-600 mt-1">—</h3>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <TrendingUp className="w-6 h-6 text-gray-600" />
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-6 font-medium">
            Aguardando endpoint na API
          </p>
        </div>
      </div>

      {/* Row 2: Seções futuras */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fluxo da Vibe — sem endpoint */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 opacity-50">
          <h3 className="text-lg font-bold text-white mb-2">Fluxo da Vibe</h3>
          <p className="text-sm text-gray-400 mb-8">Horários de pico e volume de check-ins no seu estabelecimento.</p>
          <div className="h-48 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
            <div className="text-center">
              <Eye className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500 font-medium">Sem dados disponíveis</p>
              <p className="text-xs text-gray-600 mt-1">A API ainda não tem endpoint de métricas de fluxo</p>
            </div>
          </div>
        </div>

        {/* Promoções — sem endpoint */}
        <div className="lg:col-span-1 glass-panel rounded-2xl p-6 flex flex-col opacity-50">
          <h3 className="text-lg font-bold text-white mb-2">Promoções Ativas</h3>
          <p className="text-sm text-gray-400 mb-4">O que está rolando agora.</p>
          <div className="flex-1 flex items-center justify-center border border-dashed border-white/10 rounded-xl min-h-[120px]">
            <div className="text-center px-4">
              <p className="text-sm text-gray-500 font-medium">Nenhuma promoção</p>
              <p className="text-xs text-gray-600 mt-1">Endpoint de promoções ainda não disponível na API</p>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Confirmações — sem endpoint */}
      <div className="glass-panel rounded-2xl p-6 opacity-50">
        <h3 className="text-lg font-bold text-white mb-2">Confirmações Recentes</h3>
        <p className="text-sm text-gray-400 mb-4">Últimos usuários que confirmaram presença nos eventos.</p>
        <div className="h-24 flex items-center justify-center border border-dashed border-white/10 rounded-xl">
          <p className="text-sm text-gray-500">Aguardando endpoints de eventos e confirmações na API</p>
        </div>
      </div>
    </div>
  );
}
