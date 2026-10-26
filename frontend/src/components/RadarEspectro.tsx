'use client';

import React, { useEffect, useState } from 'react';
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

type Props = {
  dados: DadoRadar[];
  carregando?: boolean;
  nome?: string;
};

const corDe = (key: string) =>
  CATEGORIAS.find((c) => c.key === key)?.cor ?? '#64748B';

// quebra o rótulo em linhas curtas para caber no eixo do radar
function quebrar(texto: string, max = 14): string[] {
  const linhas: string[] = [];
  let atual = '';
  for (const palavra of texto.split(' ')) {
    if ((atual + ' ' + palavra).trim().length > max && atual) {
      linhas.push(atual);
      atual = palavra;
    } else {
      atual = (atual + ' ' + palavra).trim();
    }
  }
  if (atual) linhas.push(atual);
  return linhas;
}

export default function RadarEspectro({ dados, carregando, nome }: Props) {
  const [ativo, setAtivo] = useState<string | null>(null);
  const [estreito, setEstreito] = useState(false);

  // telas pequenas: radar menor e rótulos mais curtos para não cortar nas bordas
  useEffect(() => {
    const ajustar = () => setEstreito(window.innerWidth < 640);
    ajustar();
    window.addEventListener('resize', ajustar);
    return () => window.removeEventListener('resize', ajustar);
  }, []);

  if (carregando) {
    return (
      <div className="flex h-[420px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-t-2 border-blue-600" />
      </div>
    );
  }

  if (!dados.some((d) => d.percentual > 0)) {
    return (
      <p className="py-16 text-center font-medium text-slate-400">
        Dados do plano de governo indisponíveis para montar o radar.
      </p>
    );
  }

  const maximo = Math.max(...dados.map((d) => d.percentual));
  const dominio = Math.max(10, Math.ceil((maximo * 1.15) / 10) * 10);
  const ordenados = [...dados].sort((a, b) => b.percentual - a.percentual);
  const lider = ordenados[0];
  const total = dados.reduce((s, d) => s + d.quantidade, 0);

  // Rótulo de cada eixo. Todos ficam à MESMA distância da ponta do radar:
  // o bloco de texto cresce para fora (acima, abaixo ou para o lado).
  const ALTURA_LINHA = 15;
  const FOLGA = 14; // distância fixa entre a ponta do radar e o rótulo

  const EixoTick = (props: any) => {
    const { x, y, cx, cy, payload } = props;
    const d = dados.find((i) => i.label === payload.value);
    if (!d) return null;

    const dx = x - cx;
    const dy = y - cy;
    const dist = Math.hypot(dx, dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;

    // ponto de ancoragem a uma folga constante da ponta
    const ax = cx + ux * (dist + FOLGA - 8);
    const ay = cy + uy * (dist + FOLGA - 8);

    const anchor = Math.abs(ux) < 0.25 ? 'middle' : ux > 0 ? 'start' : 'end';

    const linhas = quebrar(d.label, estreito ? 11 : 14);
    const altura = linhas.length * ALTURA_LINHA;
    // uy = -1 → bloco acima do ponto; 0 → centralizado; 1 → abaixo
    const topo = ay - altura / 2 + (uy * altura) / 2;

    const on = ativo === d.key;
    const fade = ativo && !on ? 0.3 : 1;

    return (
      <text textAnchor={anchor} opacity={fade}>
        {linhas.map((l, i) => (
          <tspan
            key={i}
            x={ax}
            y={topo + 11 + i * ALTURA_LINHA}
            fontSize={estreito ? 11 : 12}
            fontWeight={on ? 900 : 700}
            fill={corDe(d.key)}
          >
            {l}
          </tspan>
        ))}
      </text>
    );
  };

  return (
    <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
      {/* Radar */}
      <div className="h-[420px] w-full md:h-[460px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={dados} outerRadius={estreito ? '58%' : '80%'} accessibilityLayer={false}>
            <PolarGrid stroke="#E2E8F0" />
            <PolarAngleAxis dataKey="label" tick={<EixoTick />} />
            <PolarRadiusAxis domain={[0, dominio]} tick={false} axisLine={false} />
            <Radar
              name={nome}
              dataKey="percentual"
              stroke="#2563EB"
              fill="#2563EB"
              fillOpacity={0.3}
              strokeWidth={2}
              isAnimationActive={false}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Legenda */}
      <div>
        <div className="mb-4 rounded-2xl bg-blue-50 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">
            Como ler
          </p>
          <p className="mt-1 text-xs font-medium leading-relaxed text-slate-600">
            Cada ponta do radar é um tópico. Quanto mais longe do centro, maior a
            parcela das propostas do plano de governo dedicada ao tópico.
          </p>
        </div>

        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Legenda · do maior para o menor foco
        </p>

        <ol className="space-y-1.5" onMouseLeave={() => setAtivo(null)}>
          {ordenados.map((d, i) => {
            const on = ativo === d.key;
            return (
              <li
                key={d.key}
                onMouseEnter={() => setAtivo(d.key)}
                onClick={() => setAtivo(on ? null : d.key)}
                className={`flex min-h-[64px] cursor-pointer flex-col justify-center rounded-xl border px-3 py-2 transition-all ${
                  on ? 'border-slate-300 bg-white shadow-sm' : 'border-transparent hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black text-white"
                    style={{ backgroundColor: corDe(d.key) }}
                  >
                    {i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{d.label}</p>
                    <p className="text-[11px] font-medium text-slate-500">
                      {d.quantidade} {d.quantidade === 1 ? 'proposta' : 'propostas'}
                    </p>
                  </div>
                  <span className="text-lg font-black text-slate-900">{d.percentual}%</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${d.percentual}%`, backgroundColor: corDe(d.key) }}
                  />
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mt-4 text-xs font-medium text-slate-500">
          Maior foco: <strong className="text-slate-800">{lider.label}</strong> ({lider.percentual}%) ·
          Total de {total} propostas analisadas.
        </p>
      </div>
    </div>
  );
}