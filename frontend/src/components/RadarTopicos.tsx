'use client';

import React, { useState } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';
import { CATEGORIAS } from '@/lib/topicos';

export type DadoRadar = {
  key: string;
  label: string;
  percentual: number;
  quantidade: number;
};

type Props = { dados: DadoRadar[]; carregando?: boolean };

const corDe = (key: string) =>
  CATEGORIAS.find((c) => c.key === key)?.cor ?? '#64748B';

// Mini radar para o card do candidato. Ao passar o mouse (ou tocar/focar),
// abre um painel com os 7 tópicos e a porcentagem de cada um.
export default function RadarTopicos({ dados, carregando }: Props) {
  const [aberto, setAberto] = useState(false);

  const temDados = dados.some((d) => d.percentual > 0);

  if (carregando) {
    return (
      <div className="flex h-[130px] w-[130px] items-center justify-center rounded-2xl border border-white/10 bg-white/10 backdrop-blur-sm">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
      </div>
    );
  }
  if (!temDados) return null;

  const maximo = Math.max(...dados.map((d) => d.percentual));
  const dominio = Math.max(10, Math.ceil((maximo * 1.15) / 10) * 10);
  const ordenados = [...dados].sort((a, b) => b.percentual - a.percentual);

  return (
    <div
      className="relative"
      onMouseEnter={() => setAberto(true)}
      onMouseLeave={() => setAberto(false)}
      onFocus={() => setAberto(true)}
      onBlur={() => setAberto(false)}
    >
      <button
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-label="Ver tópicos do plano de governo"
        aria-expanded={aberto}
        className="block h-[130px] w-[130px] [&_*]:outline-none rounded-2xl border border-white/15 bg-white/10 p-1 backdrop-blur-sm transition-colors hover:bg-white/20 md:h-[150px] md:w-[150px]"
      >
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dados} outerRadius="78%">
            <PolarGrid stroke="rgba(255,255,255,0.25)" />
            <PolarAngleAxis dataKey="label" tick={false} />
            <PolarRadiusAxis domain={[0, dominio]} tick={false} axisLine={false} />
            <Radar
              dataKey="percentual"
              stroke="#60A5FA"
              fill="#60A5FA"
              fillOpacity={0.45}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </button>

      {aberto && (
        <div
          role="tooltip"
          className="absolute bottom-full right-0 z-30 mb-2 w-64 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-2xl md:bottom-0 md:right-full md:mb-0 md:mr-3 md:w-72"
        >
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            Plano de governo
          </p>
          <p className="mb-3 text-xs font-medium text-slate-500">
            Porcentagem de propostas por tópico
          </p>

          <ul className="space-y-2.5">
            {ordenados.map((d) => (
              <li key={d.key}>
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{ backgroundColor: corDe(d.key) }}
                    />
                    {d.label}
                  </span>
                  <span className="font-black text-slate-900">{d.percentual}%</span>
                </div>
                <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${d.percentual}%`, backgroundColor: corDe(d.key) }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}