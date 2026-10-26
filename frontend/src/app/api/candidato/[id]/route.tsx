import { NextRequest, NextResponse } from 'next/server';
import { fetchGithubJson } from '@/lib/github';
import { getCandidato } from '@/lib/candidatos';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const infoBase = getCandidato(id);

  const result = await fetchGithubJson(`2026/${infoBase.pasta}/plano-resumo.json`);

  let resumoGeral = 'Resumo geral em processamento.';
  if (result.ok) {
    resumoGeral = result.data.resumoGeral || result.data.resumo || resumoGeral;
  } else {
    resumoGeral = `Erro ao carregar resumo do GitHub (${result.status}).`;
  }

  return NextResponse.json({ ...infoBase, resumoGeral });
}