'use client';

import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import type { TopicoSemana } from '@/lib/topicos';

type Props = { topicos?: TopicoSemana[] };

export default function TopicosPizza({ topicos }: Props) {
  const lista = topicos ?? [];

  // tópico mais relevante começa selecionado
  const maisRelevante = useMemo(
    () => lista.reduce((a, b) => (b.percentual > (a?.percentual ?? -1) ? b : a), lista[0]),
    [lista]
  );
  const [selecionado, setSelecionado] = useState<string | null>(null);
  const ativoKey = selecionado ?? maisRelevante?.key ?? null;
  const ativo = lista.find((t) => t.key === ativoKey);

  if (lista.length === 0) {
    return (
      <p className="text-sm text-slate-400 italic">
        Sem classificação de tópicos para esta semana.
      </p>
    );
  }

  const dadosPizza = lista.filter((t) => t.percentual > 0);

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr] items-center">
      {/* Pizza (rosca) */}
      <div className="relative h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dadosPizza}
              dataKey="percentual"
              nameKey="label"
              innerRadius={70}
              outerRadius={120}
              paddingAngle={2}
              stroke="none"
              onMouseEnter={(_: unknown, i: number) => setSelecionado(dadosPizza[i]?.key ?? null)}
              onClick={(_: unknown, i: number) => setSelecionado(dadosPizza[i]?.key ?? null)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {dadosPizza.map((t) => (
                <Cell
                  key={t.key}
                  fill={t.cor}
                  fillOpacity={t.key === ativoKey ? 1 : 0.35}
                />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `${v}%`} />
          </PieChart>
        </ResponsiveContainer>

        {/* texto no centro da rosca */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-black text-slate-900">
            {ativo ? `${ativo.percentual}%` : ''}
          </span>
          <span className="max-w-[110px] text-[10px] font-bold uppercase tracking-wide text-slate-500">
            {ativo?.label}
          </span>
        </div>
      </div>

      {/* Lista / legenda interativa */}
      <div className="space-y-2">
        {[...lista]
          .sort((a, b) => b.percentual - a.percentual)
          .map((t) => {
            const on = t.key === ativoKey;
            return (
              <button
                key={t.key}
                type="button"
                onMouseEnter={() => setSelecionado(t.key)}
                onClick={() => setSelecionado(t.key)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                  on ? 'border-slate-300 bg-white shadow-sm' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 font-bold text-slate-700">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: t.cor }} />
                    {t.label}
                  </span>
                  <span className="font-black text-slate-900">{t.percentual}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${t.percentual}%`, backgroundColor: t.cor }}
                  />
                </div>
              </button>
            );
          })}

        {ativo?.justificativa && (
          <p className="rounded-xl bg-slate-50 p-3 text-xs font-medium leading-relaxed text-slate-600">
            {ativo.justificativa}
          </p>
        )}
      </div>
    </div>
  );
}