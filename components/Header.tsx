
import React from 'react';
import { Target, Shield } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950/50 backdrop-blur-xl border-b border-zinc-800/50">
      <div className="max-w-6xl mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center space-x-2 group cursor-pointer">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:rotate-6 transition-transform">
            <Target className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-white leading-none tracking-tighter">AGÊNCIA DOIS.ZERO</span>
            <span className="text-[10px] text-cyan-400 font-bold tracking-widest uppercase">Estrategista Digital</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-zinc-400">
          <a href="#" className="hover:text-cyan-400 transition-colors">Framework</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Metodologia</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Casos de Sucesso</a>
        </nav>

        <div className="flex items-center">
          <button className="flex items-center space-x-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Sessão Segura</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
