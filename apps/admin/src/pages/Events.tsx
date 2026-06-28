import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Calendar, MapPin, Users, MoreVertical } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Neon Night: Techno & House',
    date: 'Sexta, 24 de Maio • 23:00',
    status: 'Publicado',
    capacity: '80%',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 2,
    title: 'Double Chopp Universitário',
    date: 'Sábado, 25 de Maio • 18:00',
    status: 'Rascunho',
    capacity: '45%',
    image: 'https://images.unsplash.com/photo-1575037614876-c38556f65d1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  },
  {
    id: 3,
    title: 'Samba de Domingo',
    date: 'Domingo, 26 de Maio • 15:00',
    status: 'Publicado',
    capacity: '95%',
    image: 'https://images.unsplash.com/photo-1533174000228-db3db7842363?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
  }
];

export default function Events() {
  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Eventos & Promos</h2>
          <p className="text-gray-400 mt-1">Gerencie a agenda do seu estabelecimento.</p>
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="w-5 h-5" />
            </div>
            <input 
              type="text" 
              className="w-full bg-bg-card border border-border-subtle rounded-xl py-2 pl-10 pr-4 text-white focus:outline-none focus:border-brand-fire focus:ring-1 focus:ring-brand-fire transition-all duration-300"
              placeholder="Buscar evento..."
            />
          </div>
          <button className="bg-brand-fire hover:bg-[#ff571a] text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 shadow-[0_0_15px_rgba(255,69,0,0.3)] hover:shadow-[0_0_25px_rgba(255,69,0,0.5)] flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">Novo Evento</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event, i) => (
          <motion.div 
            key={event.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="glass-panel rounded-2xl overflow-hidden group border-white/5 hover:border-brand-fire/30 transition-colors"
          >
            <div className="relative h-48 w-full overflow-hidden">
              <div className="absolute inset-0 bg-black/40 z-10 group-hover:bg-transparent transition-colors duration-500"></div>
              <img 
                src={event.image} 
                alt={event.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute top-4 left-4 z-20">
                <span className={`px-3 py-1 text-xs font-bold rounded-full backdrop-blur-md border ${
                  event.status === 'Publicado' 
                    ? 'bg-brand-fire/20 text-white border-brand-fire/50 shadow-[0_0_10px_rgba(255,69,0,0.5)]' 
                    : 'bg-white/10 text-gray-300 border-white/20'
                }`}>
                  {event.status}
                </span>
              </div>
              <button className="absolute top-4 right-4 z-20 p-2 bg-black/50 hover:bg-black text-white rounded-full backdrop-blur-md transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-5">
              <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-fire transition-colors">{event.title}</h3>
              
              <div className="space-y-2 mt-4">
                <div className="flex items-center text-sm text-gray-400">
                  <Calendar className="w-4 h-4 mr-2 text-brand-fire/70" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-2 text-brand-fire/70" />
                  Estimativa: {event.capacity} de lotação
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
