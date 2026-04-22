'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ChevronRight, ChevronLeft, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Cargo =
  | ''
  | 'PRESIDENTE'
  | 'PREFEITO'
  | 'GOVERNADOR'
  | 'DEPUTADO_ESTADUAL'
  | 'DEPUTADO_FEDERAL'
  | 'SENADOR'
  | 'VEREADOR';

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [filtros, setFiltros] = useState({
    nome: '',
    ano: '',
    partido: '',
    cargo: '' as Cargo,
  });

  const fetchCandidatos = async () => {
    try {
      setLoading(true);

      const body = {
        nome: filtros.nome.trim() !== '' ? filtros.nome : null,
        ano: filtros.ano !== '' ? Number(filtros.ano) : null,
        partido: filtros.partido.trim() !== '' ? filtros.partido : null,
        cargo: filtros.cargo !== '' ? filtros.cargo : null,
      };

      console.log('Body enviado:', body);

      const res = await fetch('http://localhost:8080/candidatos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();
      setCandidatos(data);
    } catch (e) {
      console.error('Erro ao buscar candidatos:', e);
    } finally {
      setLoading(false);
    }
  };

  const rotate = useCallback((dir: 'next' | 'prev') => {
    if (candidatos.length <= 1) return;

    setCandidatos((prev) => {
      const arr = [...prev];

      if (dir === 'next') {
        const first = arr.shift();
        if (first) arr.push(first);
      } else {
        const last = arr.pop();
        if (last) arr.unshift(last);
      }

      return arr;
    });
  }, [candidatos.length]);

  useEffect(() => {
    if (loading || isPaused || candidatos.length <= 3) return;

    const interval = setInterval(() => rotate('next'), 5000);
    return () => clearInterval(interval);
  }, [loading, isPaused, candidatos.length, rotate]);

  useEffect(() => {
    fetchCandidatos();
  }, [filtros]);

  return (
    <main className="min-h-screen bg-[#E9F1F7] flex flex-col font-sans text-slate-800">
      <nav className="bg-white px-8 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <h1 className="font-black text-2xl tracking-tighter text-slate-900 uppercase">
          POLITIC<span className="text-blue-500">.DATA</span>
        </h1>

        <div className="flex gap-3 flex-wrap">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              size={16}
            />
            <input
              placeholder="Nome..."
              className="border border-slate-200 pl-10 pr-4 py-2 rounded-lg text-sm w-64 outline-none focus:border-blue-500 transition-all"
              value={filtros.nome}
              onChange={(e) =>
                setFiltros((prev) => ({ ...prev, nome: e.target.value }))
              }
            />
          </div>

          <input
            placeholder="Partido..."
            className="border border-slate-200 px-4 py-2 rounded-lg text-sm w-32 outline-none focus:border-blue-500 transition-all"
            value={filtros.partido}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, partido: e.target.value }))
            }
          />

          <select
            className="border border-slate-200 px-4 py-2 rounded-lg text-sm w-32 outline-none focus:border-blue-500 transition-all bg-white"
            value={filtros.ano}
            onChange={(e) =>
              setFiltros((prev) => ({ ...prev, ano: e.target.value }))
            }
          >
            <option value="">Ano...</option>
            <option value="2022">2022</option>
            <option value="2018">2018</option>
            <option value="2014">2014</option>
            <option value="2010">2010</option>
          </select>

          <select
            className="border border-slate-200 px-4 py-2 rounded-lg text-sm w-56 outline-none focus:border-blue-500 transition-all bg-white"
            value={filtros.cargo}
            onChange={(e) =>
              setFiltros((prev) => ({
                ...prev,
                cargo: e.target.value as Cargo,
              }))
            }
          >
            <option value="">Cargo...</option>
            <option value="PRESIDENTE">Presidente</option>
            <option value="PREFEITO">Prefeito</option>
            <option value="GOVERNADOR">Governador</option>
            <option value="DEPUTADO_ESTADUAL">Deputado Estadual</option>
            <option value="DEPUTADO_FEDERAL">Deputado Federal</option>
            <option value="SENADOR">Senador</option>
            <option value="VEREADOR">Vereador</option>
          </select>
        </div>
      </nav>

      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {candidatos.length > 3 && (
          <div className="absolute w-full max-w-[1400px] flex justify-between px-6 z-40 pointer-events-none">
            <button
              onClick={() => rotate('prev')}
              className="pointer-events-auto bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all"
            >
              <ChevronLeft size={32} />
            </button>
            <button
              onClick={() => rotate('next')}
              className="pointer-events-auto bg-slate-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-all"
            >
              <ChevronRight size={32} />
            </button>
          </div>
        )}

        <div className="flex gap-8 justify-center items-center w-full px-10">
          <AnimatePresence mode="popLayout" initial={false}>
            {(candidatos.length <= 3 ? candidatos : candidatos.slice(0, 3)).map((cand) => (
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
                    <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
                      <img
                        src={cand.foto_url}
                        className="w-full h-full object-cover object-top contrast-[1.08] brightness-[1.02] saturate-[0.95] [image-rendering:auto]"
                        alt={cand.nome}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

                      <div className="absolute bottom-6 left-6 bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-lg shadow-xl uppercase tracking-widest z-10">
                        {cand.partido}
                      </div>
                    </div>

                    <div className="p-8 flex-1 flex flex-col">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em]">
                        {cand.cargo} • {cand.ano}
                      </p>

                      <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3 truncate group-hover:text-blue-600 transition-colors">
                        {cand.nome}
                      </h3>

                      <p className="text-slate-500 text-sm leading-relaxed h-[85px] line-clamp-4 mb-4 overflow-hidden">
                        {cand.plano_resumo}
                      </p>

                      <div className="mt-auto pt-6 border-t border-slate-100 flex justify-between items-end">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase mb-1 tracking-widest">
                            Coerência
                          </p>
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