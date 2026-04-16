'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    fetch('http://localhost:8000/api/candidatos')
      .then(res => res.json())
      .then(data => {
        setCandidatos(data);
        setLoading(false);
      });
  }, []);

  const rotate = (direction: 'next' | 'prev') => {
    setCandidatos((prev) => {
      const newArray = [...prev];
      if (direction === 'next') {
        const first = newArray.shift();
        newArray.push(first);
      } else {
        const last = newArray.pop();
        newArray.unshift(last);
      }
      return newArray;
    });
  };

  useEffect(() => {
    if (loading || candidatos.length === 0 || isPaused) return;
    const interval = setInterval(() => rotate('next'), 3000);
    return () => clearInterval(interval);
  }, [loading, candidatos, isPaused]);

  if (loading) return <div className="h-screen flex items-center justify-center font-bold">Carregando Dados...</div>;

  return (
    <main className="min-h-screen bg-slate-50 p-8 overflow-hidden flex flex-col items-center justify-center">
      <div className="w-full max-w-6xl">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Eleições 2022</h1>
          <p className="text-slate-500 mt-4 text-lg">Análise inteligente de propostas e perfis.</p>
        </header>

        <div className="relative flex items-center justify-center group h-[650px]">
          {/* Setas */}
          <button onClick={() => rotate('prev')} className="absolute -left-16 z-30 bg-white p-4 rounded-full shadow-2xl border border-slate-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
            <ChevronLeft size={32} />
          </button>
          <button onClick={() => rotate('next')} className="absolute -right-16 z-30 bg-white p-4 rounded-full shadow-2xl border border-slate-100 hover:bg-blue-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
            <ChevronRight size={32} />
          </button>

          <div 
            className="flex gap-8 items-center justify-center w-full"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {candidatos.slice(0, 3).map((cand) => (
                <motion.div
                  key={cand.id}
                  layout
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ type: "spring", stiffness: 200, damping: 25 }}
                  whileHover={{ scale: 1.05, zIndex: 10 }}
                  className="shrink-0"
                >
                  <Link href={`/candidato/${cand.id}`}>
                    <div className="w-[300px] bg-white rounded-[2.5rem] border border-slate-200 overflow-hidden h-[600px] flex flex-col shadow-lg hover:border-blue-500 transition-colors">
                      {/* Foto 3:4 */}
                      <div className="w-full aspect-[3/4] overflow-hidden relative">
                        <img src={cand.foto_url} alt={cand.nome} className="w-full h-full object-cover" />
                        <div className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full text-[10px] font-black text-blue-600 shadow-sm">
                          {cand.partido}
                        </div>
                      </div>
                      <div className="p-8 flex-1 flex flex-col">
                        <h3 className="text-2xl font-bold text-slate-900 leading-tight">{cand.nome}</h3>
                        <p className="text-slate-500 text-sm mt-4 line-clamp-3 leading-relaxed">{cand.resumo}</p>
                        <div className="mt-auto pt-6 flex items-center justify-between text-blue-600 font-bold text-xs uppercase">
                          <span>Detalhes do Plano</span>
                          <ChevronRight size={18} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}