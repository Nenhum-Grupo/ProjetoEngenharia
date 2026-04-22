'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [filtros, setFiltros] = useState({ nome: '', partido: '' });

  const fetchCandidatos = async () => {
    const params = new URLSearchParams();
    if (filtros.nome) params.append('nome', filtros.nome);
    if (filtros.partido) params.append('partido', filtros.partido);

    try {
      const res = await fetch(`http://localhost:8000/api/candidatos?${params.toString()}`);
      const data = await res.json();
      setCandidatos(data);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const rotate = useCallback((dir: 'next' | 'prev') => {
    if (candidatos.length <= 1) return;
    setCandidatos(prev => {
      const arr = [...prev];
      dir === 'next' ? arr.push(arr.shift()) : arr.unshift(arr.pop());
      return arr;
    });
  }, [candidatos]);

  useEffect(() => {
    if (loading || isPaused || candidatos.length <= 3) return;
    const interval = setInterval(() => rotate('next'), 5000);
    return () => clearInterval(interval);
  }, [loading, isPaused, candidatos, rotate]);

  useEffect(() => { fetchCandidatos(); }, [filtros]);

  return (
    <main className="min-h-screen bg-[#E9F1F7] flex flex-col font-sans text-slate-800">
      
      {/* --- NavBar --- */}
      <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="font-black text-2xl tracking-tighter text-slate-900 uppercase">
          POLITIC<span className="text-blue-500">.DATA</span>
        </h1>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              placeholder="Nome..." 
              className="border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm w-64 outline-none focus:border-blue-500 transition-all"
              onChange={(e) => setFiltros({...filtros, nome: e.target.value})}
            />
          </div>
          <input 
            placeholder="Partido..." 
            className="border border-slate-200 px-4 py-2 rounded-lg text-sm w-32 outline-none focus:border-blue-500 transition-all"
            onChange={(e) => setFiltros({...filtros, partido: e.target.value})}
          />
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center relative overflow-hidden"
           onMouseEnter={() => setIsPaused(true)}
           onMouseLeave={() => setIsPaused(false)}>
        
        {/* Setas de Navegação */}
        {candidatos.length > 3 && (
          <div className="absolute w-full max-w-[1400px] flex justify-between px-6 z-40 pointer-events-none">
            <button onClick={() => rotate('prev')} className="pointer-events-auto bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all">
              <ChevronLeft size={32} />
            </button>
            <button onClick={() => rotate('next')} className="pointer-events-auto bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all">
              <ChevronRight size={32} />
            </button>
          </div>
        )}

        <div className="flex gap-8 justify-center items-center w-full px-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {(candidatos.length <= 3 ? candidatos : candidatos.slice(0, 3)).map((cand) => (
              
              /* --- Card --- */
              <motion.div
                key={cand.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-[320px] shrink-0"
              >
                <Link href={`/candidato/${cand.id}`} className="block group">
                  <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col min-h-[620px]">
                    
                    {/* --- Foto --- */}
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
                      <img 
                        src={cand.foto_url} 
                        className="w-full h-full object-cover object-top contrast-[1.08] brightness-[1.02] saturate-[0.95] [image-rendering:auto]" 
                        alt={cand.nome} 
                      />
                      {/* Overlay sutil para melhorar definição do cabelo contra fundos claros */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />
                      
                      <div className="absolute bottom-6 left-6 bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-lg shadow-xl uppercase tracking-widest z-10">
                        {cand.partido}
                      </div>
                    </div>

                    {/* Conteúdo do Card */}
                    <div className="p-8 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        {cand.cargo} • {cand.ano}
                      </p>
                      
                      <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3 truncate group-hover:text-blue-600 transition-colors">
                        {cand.nome}
                      </h3>
                      
                      {/* --- Mini Resumo (Aumentado) --- */}
                      <p className="text-slate-500 text-sm leading-relaxed h-[85px] line-clamp-4 mb-4 overflow-hidden">
                        {cand.plano_resumo}
                      </p>

                      {/* Rodapé do Card */}
                      <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">Coerência</p>
                          <p className="text-4xl font-black text-blue-600 leading-none">
                            {cand.indice_de_coerencia}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-slate-900 font-black text-xs group-hover:text-blue-600 transition-all uppercase tracking-tighter">
                          Detalhes <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>

                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}