import { NextRequest, NextResponse } from 'next/server';
import { fetchGithubJson } from '@/lib/github';
import { getCandidato } from '@/lib/candidatos';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { pasta } = getCandidato(id);

  const result = await fetchGithubJson(`2026/${pasta}/plano-resumo.json`);
  if (!result.ok) {
    return NextResponse.json(
      { error: 'Plano de governo não encontrado.', detalhe: result.error },
      { status: result.status === 404 ? 404 : 502 }
    );
  }
  return NextResponse.json(result.data);
}