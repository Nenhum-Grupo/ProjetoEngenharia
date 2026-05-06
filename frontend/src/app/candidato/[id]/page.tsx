'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, ShieldCheck, Info, Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetalheCandidato() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [data, setData]       = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [debug, setDebug]     = useState<string[]>(['[1] Componente renderizou (server ou client)']);

  const addLog = (msg: string) => setDebug(prev => [...prev, msg]);

  // Roda 1x ao montar no client — sem depender do id no array
  useEffect(() => {
    addLog('[2] useEffect montou ✅');
    addLog(`[3] id recebido: ${JSON.stringify(id)}`);

    if (!id) {
      addLog('[4] ❌ id está undefined/null — fetch abortado');
      setLoading(false);
      return;
    }

    addLog(`[4] Iniciando fetch para /candidato/${id}`);

    fetch(`http://localhost:8080/candidato/${id}`)
      .then(res => {
        addLog(`/api/candidato/${id}`);
        return res.json();
      })
      .then(val => {
        addLog(`[6] Campos recebidos: ${Object.keys(val ?? {}).join(', ')}`);
        addLog(`[7] linkFoto: ${String(val?.linkFoto ?? 'NULL').substring(0, 50)}`);
        addLog(`[8] resumoGeral: ${String(val?.resumoGeral ?? 'NULL').substring(0, 80)}`);
        setData(val);
        setLoading(false);
      })
      .catch(err => {
        addLog(`[5] ❌ Erro: ${err?.message ?? String(err)}`);
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // [] garante que roda ao montar, independente de qualquer estado

  // Painel fixo de debug — remova depois de resolver
  const DebugPanel = () => (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 9999,
      background: '#0f172a', color: '#94a3b8', fontFamily: 'monospace',
      fontSize: 12, padding: '8px 16px', maxHeight: 200, overflowY: 'auto',
      borderTop: '2px solid #334155'
    }}>
      <strong style={{ color: '#38bdf8' }}>🔍 DEBUG PANEL</strong>
      {debug.map((line, i) => <div key={i}>{line}</div>)}
    </div>
  );

  if (loading) return (
    <>
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
      <DebugPanel />
    </>
  );

  if (!data) return (
    <>
      <div className="p-20 text-center text-slate-500 font-bold">Candidato não encontrado.</div>
      <DebugPanel />
    </>
  );

  const imageSrc = data.linkFoto
    ? data.linkFoto.startsWith('data:')
      ? data.linkFoto
      : `data:image/jpeg;base64,${data.linkFoto}`
    : null;

  return (
    <>
      <main className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">

        {/* Navbar */}
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

          {/* HERO */}
          <div className="relative w-full min-h-[450px] rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-slate-900 flex items-center">

            <div className="absolute inset-0 opacity-30 bg-slate-500" />

            <div className="relative z-10 w-full flex flex-col md:flex-row items-center px-8 md:px-16 gap-12">

              {/* FILHO 1 — Foto */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="h-[350px] md:h-[420px] aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shrink-0"
              >
                {imageSrc ? (
                  <img
                    src={imageSrc}
                    className="w-full h-full object-cover"
                    alt={data.nome}
                    onError={(e) => {
                      addLog('[IMG] ❌ Imagem falhou ao carregar');
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400 text-sm">
                    Sem foto
                  </div>
                )}
              </motion.div>
              {/* FIM FILHO 1 */}

              {/* FILHO 2 — Informações */}
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
                    <span>{data.ano ?? '2022'}</span>
                  </div>
                </motion.div>
              </div>
              {/* FIM FILHO 2 */}

            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
          </div>

          {/* GRID */}
          <div className="grid md:grid-cols-3 gap-10">

            <div className="md:col-span-2 space-y-8">
              <section className="bg-white p-10 md:p-14 rounded-[3.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Info size={120} />
                </div>

                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-slate-900">
                  <span className="w-2 h-10 bg-blue-600 rounded-full" />
                  Diretrizes do Plano de Governo
                </h2>

                {data.resumoGeral ? (
                  <p className="text-slate-600 leading-relaxed text-xl md:text-2xl italic font-medium">
                    "{data.resumoGeral}"
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-lg">Resumo não disponível.</p>
                )}
              </section>
            </div>

            <div className="space-y-6">
              <div className="bg-blue-600 p-10 rounded-[3.5rem] text-white shadow-2xl shadow-blue-200 relative overflow-hidden">
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase opacity-70 tracking-[0.2em] mb-3">Ranking de Coerência</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-black leading-none">{data.indiceDeCoerencia}</span>
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

      <DebugPanel />
    </>
  );
}