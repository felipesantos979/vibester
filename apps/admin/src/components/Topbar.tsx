import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Plus, Camera, PartyPopper, X, CalendarDays, Image as ImageIcon, Tag, CheckCheck, Settings, LogOut, User } from 'lucide-react';
import { formatTimeAgo } from '../lib/dateUtils';
import { handleLogout } from '../lib/auth';

export type NotificationType = 'evento' | 'post' | 'sistema' | 'promocao';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: number;
  read: boolean;
  linkTo?: string;
}

const typeIcons: Record<string, React.FC<any>> = {
  evento: CalendarDays,
  post: ImageIcon,
  promocao: Tag,
  sistema: Bell,
};

export default function Topbar() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    if (showNotifications || showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowNotifications(false);
        setShowProfileMenu(false);
        setShowCreateModal(false);
      }
    };
    document.addEventListener('keydown', handleGlobalKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [showNotifications, showProfileMenu]);

  const handleCreate = (path: string) => {
    setShowCreateModal(false);
    navigate(path);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    if (notification.linkTo) {
      navigate(notification.linkTo);
    }
    setShowNotifications(false);
  };

  return (
    <>
      <header className="h-20 border-b border-border-subtle bg-bg-card flex items-center justify-between px-8 z-20 sticky top-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Visão Geral da Noite <span className="text-2xl">🔥</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">Acompanhe o fluxo e o calor do seu espaço.</p>
        </div>

        <div className="flex items-center gap-6">
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-brand-fire hover:bg-[#ff571a] text-white px-5 py-2.5 rounded-full font-medium transition-all duration-300 shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Criar Postagem/Evento</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none"
            >
              <Bell className="w-6 h-6" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 w-2.5 h-2.5 bg-brand-fire rounded-full border-2 border-bg-dark"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 glass-panel bg-bg-card border border-border-subtle shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-bg-dark/50">
                  <h3 className="font-bold text-white">Notificações</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-xs text-brand-fire hover:text-orange-400 font-medium flex items-center gap-1 transition-colors"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                      Marcar todas como lidas
                    </button>
                  )}
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.length > 0 ? (
                    notifications.map(notification => {
                      const Icon = typeIcons[notification.type] || Bell;
                      return (
                        <div
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer flex gap-3 ${!notification.read ? 'bg-white/[0.03]' : ''}`}
                        >
                          <div className={`mt-0.5 shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${!notification.read ? 'bg-brand-fire/20 text-brand-fire' : 'bg-white/10 text-gray-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 relative">
                            {!notification.read && (
                              <div className="absolute -left-5 top-2 w-1.5 h-1.5 rounded-full bg-brand-fire"></div>
                            )}
                            <p className="text-sm font-bold text-white mb-0.5">{notification.title}</p>
                            <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{notification.message}</p>
                            <p className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-wider">{formatTimeAgo(notification.createdAt)}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-8 text-center text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-3 opacity-20" />
                      <p className="text-sm font-medium">Nenhuma notificação por aqui ainda.</p>
                    </div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <div className="p-3 border-t border-border-subtle bg-bg-dark/30 text-center">
                    <button
                      onClick={() => setShowNotifications(false)}
                      className="text-xs text-gray-400 hover:text-white font-medium transition-colors"
                    >
                      Ver todas as notificações
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="relative" ref={profileDropdownRef}>
            <div 
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="h-10 w-10 rounded-full border border-border-subtle overflow-hidden bg-bg-card hover:border-brand-fire hover:scale-105 transition-all cursor-pointer flex items-center justify-center ring-2 ring-transparent hover:ring-brand-fire/20"
            >
              <span className="font-bold text-sm text-gray-300">NP</span>
            </div>

            {showProfileMenu && (
              <div className="absolute right-0 mt-3 w-64 glass-panel bg-bg-card border border-border-subtle shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-bg-dark/50">
                  <div className="w-10 h-10 rounded-full bg-brand-fire/20 flex items-center justify-center shrink-0">
                    <span className="font-bold text-brand-fire">NP</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Neon Pub & Lounge</h3>
                    <p className="text-xs text-gray-400">Bar & Lounge</p>
                  </div>
                </div>

                <div className="p-2">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    <User className="w-4 h-4" />
                    <span>Meu Perfil</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate('/settings');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors font-medium text-sm"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Configurações</span>
                  </button>
                  
                  <div className="h-px bg-white/5 my-2"></div>
                  
                  <button
                    onClick={() => handleLogout(navigate)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors font-medium text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sair</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Modal Criar */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-bg-card border border-border-subtle rounded-2xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">O que você quer criar?</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleCreate('/posts')}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-fire/50 hover:bg-brand-fire/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-fire/10 flex items-center justify-center group-hover:bg-brand-fire/20 transition-colors">
                  <Camera className="w-7 h-7 text-brand-fire" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-brand-fire transition-colors">📸 Criar Post</span>
                <span className="text-xs text-gray-500">Publique fotos e legendas</span>
              </button>

              <button
                onClick={() => handleCreate('/events')}
                className="flex flex-col items-center gap-3 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-brand-fire/50 hover:bg-brand-fire/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-fire/10 flex items-center justify-center group-hover:bg-brand-fire/20 transition-colors">
                  <PartyPopper className="w-7 h-7 text-brand-fire" />
                </div>
                <span className="text-lg font-bold text-white group-hover:text-brand-fire transition-colors">🎉 Criar Evento</span>
                <span className="text-xs text-gray-500">Agende shows e promos</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
