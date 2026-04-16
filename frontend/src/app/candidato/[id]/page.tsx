'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, Download, ShieldCheck, Info, Map, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetalheCandidato() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8000/api/candidatos/${id}`)
      .then(res => res.json())
      .then(val => {
        setData(val);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );

  if (!data) return <div className="p-20 text-center text-slate-500 font-bold">Candidato não encontrado.</div>;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
      {/* Navbar Superior */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button 
            onClick={() => router.back()} 
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-all"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" /> 
            Voltar para a lista
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        
        {/* HERO SECTION - SPLIT LAYOUT (Resolve o corte da foto) */}
        <div className="relative w-full min-h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-slate-900 flex items-center">
          
          {/* Background Ambient Blur */}
          <div className="absolute inset-0 opacity-30">
            <img 
              src={data.foto_url} 
              className="w-full h-full object-cover blur-[80px] scale-125" 
              alt="" 
            />
          </div>

          {/* Conteúdo do Hero */}
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center px-8 md:px-16 gap-12">
            
            {/* Foto Vertical (Preserva a proporção original do TSE) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="h-[350px] md:h-[420px] aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shrink-0"
            >
              <img 
                src={data.foto_url} 
                className="w-full h-full object-cover" 
                alt={data.nome} 
              />
            </motion.div>

            {/* Informações Principais */}
            <div className="flex-1 text-center md:text-left">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg mb-6">
                  <ShieldCheck size={14} /> Candidato Oficial
                </div>
                
                <h1 className="text-4xl md:text-7xl font-black text-white leading-[1.1] mb-4">
                  {data.nome}
                </h1>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-200/80 font-bold text-lg uppercase tracking-tight">
                  <span className="text-white">{data.partido}</span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>{data.cargo}</span>
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  <span>{data.ano}</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Sombra de profundidade inferior */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
        </div>

        {/* GRID DE CONTEÚDO */}
        <div className="grid md:grid-cols-3 gap-10">
          
          {/* Coluna Principal (Esquerda) */}
          <div className="md:col-span-2 space-y-8">
            <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Info size={120} />
              </div>
              
              <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
                <span className="w-2 h-10 bg-blue-600 rounded-full" />
                Diretrizes do Plano de Governo
              </h2>
              
              <p className="text-slate-600 leading-relaxed text-xl md:text-2xl italic font-medium">
                "{data.plano_completo}"
              </p>
              
              {data.pdf_url && (
                <div className="mt-12 pt-10 border-t border-slate-100">
                  <a 
                    href={data.pdf_url} 
                    target="_blank" 
                    className="group inline-flex items-center gap-4 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black hover:bg-blue-600 transition-all shadow-xl hover:-translate-y-1 active:scale-95"
                  >
                    <Download size={22} className="group-hover:bounce" />
                    ACESSAR DOCUMENTO ORIGINAL (PDF)
                  </a>
                  <p className="mt-4 text-slate-400 text-xs font-medium px-2">
                    * Link direto para o repositório oficial do TSE.
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar de Status (Direita) */}
          <div className="space-y-6">
            {/* Card de Coerência */}
            <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
              <div className="relative z-10">
                <p className="text-[11px] font-black uppercase opacity-70 tracking-[0.2em] mb-3">Ranking de Coerência</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-8xl font-black leading-none">{data.indice_de_coerencia}</span>
                  <span className="text-2xl font-bold opacity-60">/ 10</span>
                </div>
                <p className="text-sm mt-8 opacity-90 leading-relaxed font-medium">
                  Este índice reflete a fidelidade do candidato às suas promessas de campanha ao longo do mandato.
                </p>
              </div>
              <div className="absolute -bottom-10 -right-10 opacity-10 rotate-12">
                <Award size={200} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}