import { NextRequest, NextResponse } from 'next/server';
import { fetchGithubJson } from '@/lib/github';
import { mapaCandidatos } from '@/lib/candidatos';

export const dynamic = 'force-dynamic';

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const unicos = (arr: (string | null | undefined)[]) =>
  Array.from(new Set(arr.filter((v): v is string => !!v && v.trim() !== '')));

export async function POST(request: NextRequest) {
  const f = await request.json().catch(() => ({}));
  const todos = Object.values(mapaCandidatos);

  const igual = (a: unknown, b: unknown) => String(a ?? '') === String(b ?? '');

  const filtrados = todos.filter((c) => {
    if (f.ano && !igual(c.ano, f.ano)) return false;
    if (f.partido && !igual(c.partido, f.partido)) return false;
    if (f.cargo && !igual(c.cargo, f.cargo)) return false;
    if (f.estado && !igual(c.estado, f.estado)) return false;
    if (f.cidade && !igual(c.cidade, f.cidade)) return false;
    if (f.nome && !norm(c.nome).includes(norm(String(f.nome)))) return false;
    return true;
  });

  // busca o resumo do plano de cada candidato no GitHub, em paralelo
  const candidatos = await Promise.all(
    filtrados.map(async ({ pasta, ...c }) => {
      const r = await fetchGithubJson(`${c.ano}/${pasta}/plano-resumo.json`);
      const plano_resumo = r.ok
        ? r.data.resumoGeral || r.data.resumo || ''
        : 'Resumo indisponível no momento.';
      return { ...c, plano_resumo };
    })
  );

  return NextResponse.json({
    candidatos,
    estados: unicos(todos.map((c) => c.estado)),
    cidades: unicos(todos.map((c) => c.cidade)),
    listPartidos: unicos(todos.map((c) => c.partido)),
  });
}