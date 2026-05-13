'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ShieldCheck, 
  Award, 
  Plus, 
  Minus, 
  Layout, 
  TextQuote, 
  BarChart3, 
  Target 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DetalheCandidato() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('principal');
  const [expandedTopic, setExpandedTopic] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    const candidatoId = Array.isArray(id) ? id[0] : id;

    fetch(`/api/candidato/${candidatoId}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(val => {
        console.log("Dados da API:", val); // Verifique a estrutura no F12 do navegador
        setData(val);
        setLoading(false);
      })
      .catch(err => {
        console.error('Erro ao buscar candidato:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
    </div>
  );

  if (!data) return (
    <div className="p-20 text-center text-slate-500 font-bold">Candidato não encontrado.</div>
  );

  // LÓGICA DE EXTRAÇÃO DOS TÓPICOS:
  // Tenta pegar de data.topicos ou de data.resumo.topicos (baseado no ResumoDTO.java)
  const listaTopicos = data.topicos || data.resumo?.topicos || [];

  const imageSrc = data.linkFoto
    ? data.linkFoto.startsWith('data:') ? data.linkFoto : `data:image/jpeg;base64,${data.linkFoto}`
    : null;

  const tabs = [
    { id: 'principal', label: 'Principal', icon: <Layout size={18} /> },
    { id: 'topicos', label: 'Resumo por Tópicos', icon: <TextQuote size={18} /> },
    { id: 'espectro', label: 'Espectro Político', icon: <BarChart3 size={18} /> },
    { id: 'coerencia', label: 'Índice de Coerência', icon: <Target size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
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
        {/* HERO CARD */}
        <div className="relative w-full min-h-[400px] rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-slate-900 flex items-center">
          <div className="absolute inset-0 opacity-30 bg-slate-500" />
          <div className="relative z-10 w-full flex flex-col md:flex-row items-center px-8 md:px-16 gap-12">
            <div className="h-[300px] md:h-[350px] aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shrink-0">
              {imageSrc ? (
                <img src={imageSrc} className="w-full h-full object-cover" alt={data.nome} />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400">Sem foto</div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                <ShieldCheck size={14} /> Candidato Oficial
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{data.nome}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-200/80 font-bold text-lg uppercase">
                <span className="text-white">{data.partido}</span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{data.cargo}</span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{data.ano ?? '2022'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ABAS */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'principal' && (
              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-black">
                      <span className="w-2 h-8 bg-blue-600 rounded-full" />
                      Diretrizes Gerais
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-xl italic font-medium">
                      "{data.resumoGeral || data.resumo?.resumo || 'Resumo não disponível.'}"
                    </p>
                  </section>
                </div>
                <div className="bg-blue-600 p-8 rounded-[3rem] text-white h-fit shadow-xl">
                  <p className="text-[11px] font-black uppercase opacity-70 mb-2">Coerência Atual</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black">{data.indiceDeCoerencia ?? '0.0'}</span>
                    <span className="text-xl opacity-60">/ 100</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topicos' && (
              <div className="space-y-4 max-w-4xl">
                {listaTopicos.length > 0 ? (
                  listaTopicos.map((topico: any, index: number) => (
                    <div key={index} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                      <button
                        onClick={() => setExpandedTopic(expandedTopic === index ? null : index)}
                        className="w-full px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                            <TextQuote size={20} />
                          </div>
                          <div className="text-left">
                            <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">
                              {topico.categoria?.nome || "Tópico Geral"}
                            </h3>
                            <span className="text-sm text-slate-500 font-bold">
                              {topico.numeroDePropostas || 0} Propostas
                            </span>
                          </div>
                        </div>
                        {expandedTopic === index ? <Minus className="text-blue-600" /> : <Plus className="text-blue-600" />}
                      </button>
                      
                      <AnimatePresence>
                        {expandedTopic === index && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-8 pb-8 pt-4 border-t border-slate-100 text-slate-600 leading-relaxed text-lg">
                              <p className="font-medium mb-6">
                                {topico.resumoTopico || "Sem detalhes para este tópico."}
                              </p>

                              {topico.propostas && topico.propostas.length > 0 && (
                                <div className="space-y-4 mt-4">
                                  <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">Propostas detalhadas</h4>
                                  {topico.propostas.map((p: any, i: number) => (
                                    <div key={i} className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                      <h5 className="font-bold text-blue-600 text-base">{p.proposta}</h5>
                                      <p className="text-sm text-slate-600 mt-1">{p.ideia}</p>
                                      {p.formaImplementacao && (
                                        <div className="mt-3 pt-3 border-t border-slate-200/60 text-xs text-slate-400 italic">
                                          <span className="font-bold not-italic">Implementação:</span> {p.formaImplementacao}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center text-slate-400 font-bold">
                    Nenhum tópico encontrado para este plano de governo.
                  </div>
                )}
              </div>
            )}

            {(activeTab === 'espectro' || activeTab === 'coerencia') && (
              <div className="bg-white p-20 rounded-[3.5rem] border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400">
                <Award size={48} className="opacity-20 mb-4" />
                <span className="font-black uppercase tracking-widest text-sm">Em desenvolvimento...</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}