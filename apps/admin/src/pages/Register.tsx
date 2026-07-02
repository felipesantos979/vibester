import { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, AtSign } from 'lucide-react';
import VibesterLogo from '../assets/VIBESTER.svg';
import { register } from '../api/auth';
import { ApiError } from '../lib/apiClient';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', bornAt: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/login', { state: { justRegistered: true } });
    } catch (err) {
      if (err instanceof ApiError && err.status === 400) {
        setError('Não foi possível criar a conta. Verifique os dados (usuário/e-mail podem já estar em uso).');
      } else {
        setError('Não foi possível conectar à API. Tente novamente em instantes.');
      }
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const inputCls = "w-full bg-bg-card border border-border-subtle rounded-xl py-3 pl-10 pr-4 text-white focus:outline-none focus:border-brand-fire focus:ring-1 focus:ring-brand-fire transition-all duration-300 disabled:opacity-50";

  return (
    <div className="flex h-screen w-full bg-bg-dark text-white overflow-hidden">
      <div className="hidden lg:flex flex-col flex-1 relative bg-gradient-to-tr from-bg-dark to-[#1a0f0a] p-12 overflow-hidden justify-between border-r border-border-subtle">
        <div className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-brand-fire/10 rounded-full blur-[150px] pointer-events-none"></div>
        <div className="relative z-10 flex-1 flex items-start justify-center w-full pt-4">
          <img src={VibesterLogo} alt="Vibester" className="w-3/4 max-w-[400px]" />
        </div>
        <div className="relative z-10 max-w-lg mb-20">
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.8 }} className="text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            A noite te espera. <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-fire to-orange-400">Assuma o controle.</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.8 }} className="text-lg text-gray-400 font-medium">
            Traga seu negócio para o radar mais quente da cidade.
          </motion.p>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 relative z-10 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="w-full max-w-md my-auto py-10">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2">Seja um Parceiro</h2>
            <p className="text-gray-400">Crie sua conta de acesso ao painel.</p>
          </div>
          <div className="mb-6 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-yellow-400 text-xs leading-relaxed">
            ⚙️ Por enquanto isso cria só a sua conta de acesso. O cadastro do estabelecimento em si (nome do bar, endereço etc.) ainda depende de uma etapa manual — nossa equipe entra em contato após o registro.
          </div>
          {error && (<div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>)}
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Seu Nome</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><User className="w-5 h-5" /></div>
                <input type="text" required value={form.name} onChange={set('name')} disabled={loading} className={inputCls} placeholder="Seu nome completo" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Usuário</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><AtSign className="w-5 h-5" /></div>
                <input type="text" required value={form.username} onChange={set('username')} disabled={loading} className={inputCls} placeholder="seubarnopainel" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">E-mail</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Mail className="w-5 h-5" /></div>
                <input type="email" required value={form.email} onChange={set('email')} disabled={loading} className={inputCls} placeholder="contato@seubar.com.br" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Senha</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Lock className="w-5 h-5" /></div>
                  <input type="password" required minLength={6} value={form.password} onChange={set('password')} disabled={loading} className={inputCls} placeholder="mín. 6 caracteres" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Nascimento</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500"><Calendar className="w-5 h-5" /></div>
                  <input type="date" required value={form.bornAt} onChange={set('bornAt')} disabled={loading} className={inputCls} />
                </div>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full mt-4 bg-white hover:bg-gray-200 text-bg-dark py-3.5 rounded-xl font-bold text-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group disabled:opacity-60">
              {loading ? 'Criando conta...' : 'Criar conta'}
            </button>
          </form>
          <p className="mt-8 text-center text-sm text-gray-400">
            Já possui cadastro?{' '}
            <NavLink to="/login" className="text-white font-medium hover:text-brand-fire transition-colors underline decoration-border-subtle underline-offset-4">Fazer login</NavLink>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
