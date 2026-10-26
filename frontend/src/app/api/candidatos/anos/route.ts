import { NextResponse } from 'next/server';
import { mapaCandidatos } from '@/lib/candidatos';

export const dynamic = 'force-dynamic';

export async function GET() {
  const anos = Array.from(new Set(Object.values(mapaCandidatos).map((c) => c.ano)));
  return NextResponse.json(anos);
}