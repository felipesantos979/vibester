import React from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Clock, CreditCard, Save } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-8 pb-10 max-w-4xl mx-auto lg:mx-0">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Configurações</h2>
        <p className="text-gray-400 mt-1">Gerencie os dados, horários e integrações do seu bar.</p>
      </div>

      <div className="space-y-6">
        {/* Perfil do Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-2xl p-6 md:p-8 border-white/5"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <Store className="w-6 h-6 text-brand-fire" />
            <h3 className="text-xl font-bold text-white">Perfil do Estabelecimento</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nome Oficial</label>
              <input type="text" defaultValue="Neon Pub" className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Categoria</label>
              <select className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors">
                <option>Balada / Nightclub</option>
                <option>Pub</option>
                <option>Bar e Restaurante</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Descrição Curta (Bio)</label>
              <textarea rows={3} defaultValue="O pub mais iluminado da cidade. Música eletrônica, drinks autorais e a melhor vibe." className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors resize-none"></textarea>
            </div>
          </div>
        </motion.div>

        {/* Localização */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-2xl p-6 md:p-8 border-white/5"
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
            <MapPin className="w-6 h-6 text-brand-fire" />
            <h3 className="text-xl font-bold text-white">Localização</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-300">Endereço Completo</label>
              <input type="text" defaultValue="Rua Augusta, 1234" className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Bairro/Região</label>
              <input type="text" defaultValue="Consolação" className="w-full bg-bg-dark border border-border-subtle rounded-xl py-2.5 px-4 text-white focus:outline-none focus:border-brand-fire transition-colors" />
            </div>
          </div>
        </motion.div>
        
        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8 pt-4">
          <button className="px-6 py-3 rounded-xl font-bold text-white bg-bg-card hover:bg-white/5 border border-border-subtle transition-colors">
            Cancelar
          </button>
          <button className="bg-brand-fire hover:bg-[#ff571a] text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-[0_0_20px_rgba(255,69,0,0.3)] hover:shadow-[0_0_30px_rgba(255,69,0,0.5)] flex items-center gap-2">
            <Save className="w-5 h-5" />
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
}
