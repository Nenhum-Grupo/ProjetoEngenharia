'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ChevronLeft, FileText, Download } from 'lucide-react';

export default function CandidatoDetalhes() {
  const { id } = useParams();
  const router = useRouter();
  const [candidato, setCandidato] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/api/candidatos/${id}`)
      .then(res => res.json())
      .then(data => setCandidato(data));
  }, [id]);

  if (!candidato) return <div className="p-20 text-center">Carregando...</div>;

  return (
    <main className="min-h-screen bg-white">
      {/* Header Fixo */}
      <div className="max-w-4xl mx-auto p-8">
        <button onClick={() => router.back()} className="flex items-center text-slate-500 hover:text-blue-600 mb-12 transition-colors">
          <ChevronLeft size={20} className="mr-1" /> Voltar ao Painel
        </button>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Foto 3:4 Lateral */}
          <div className="rounded-[3rem] overflow-hidden shadow-2xl aspect-[3/4]">
            <img src={candidato.foto_url} alt={candidato.nome} className="w-full h-full object-cover" />
          </div>

          {/* Conteúdo */}
          <div className="flex flex-col h-full justify-center">
            <span className="text-blue-600 font-black text-sm uppercase tracking-[0.2em] mb-4">{candidato.partido}</span>
            <h1 className="text-5xl font-black text-slate-900 leading-none mb-6">{candidato.nome}</h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-10">{candidato.resumo}</p>
            
            <a 
              href={candidato.pdf_url} 
              target="_blank" 
              className="flex items-center justify-center gap-3 bg-slate-900 text-white p-6 rounded-3xl font-bold hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-200"
            >
              <FileText size={24} /> Ver Plano de Governo (PDF)
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}