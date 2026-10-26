// Os 7 tópicos do TCC + leitura tolerante do que a IA gerou por semana.

export const CATEGORIAS = [
  { key: 'RELACOES_INTERNACIONAIS', label: 'Relações Internacionais', cor: '#2563EB' },
  { key: 'LIBERDADE_DEMOCRACIA', label: 'Liberdade e Democracia', cor: '#7C3AED' },
  { key: 'SISTEMA_POLITICO', label: 'Sistema Político', cor: '#DB2777' },
  { key: 'ECONOMIA', label: 'Economia', cor: '#16A34A' },
  { key: 'BEM_ESTAR_QUALIDADE_DE_VIDA', label: 'Bem-estar e Qualidade de Vida', cor: '#F59E0B' },
  { key: 'ESTRUTURA_SOCIAL', label: 'Estrutura Social', cor: '#0891B2' },
  { key: 'GRUPOS_SOCIAIS', label: 'Grupos Sociais', cor: '#EA580C' },
] as const;

export type TopicoSemana = {
  key: string;
  label: string;
  cor: string;
  percentual: number; // 0–100, soma 100
  justificativa?: string;
};

const chave = (s: unknown) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .trim()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_|_$/g, '');

// aceita a chave oficial, o rótulo e a grafia errada antiga (GRUPOS_SOCIAIAS)
const INDICE: Record<string, string> = { GRUPOS_SOCIAIAS: 'GRUPOS_SOCIAIS' };
for (const c of CATEGORIAS) {
  INDICE[c.key] = c.key;
  INDICE[chave(c.label)] = c.key;
}

const CAMPOS_FONTE = [
  'topicos', 'relevancia_topicos', 'relevanciaTopicos',
  'distribuicao_topicos', 'distribuicaoTopicos', 'porcentagens', 'percentuais',
];

function acharFonte(semana: any): any {
  const r = semana?.resumo && typeof semana.resumo === 'object' ? semana.resumo : null;
  for (const campo of CAMPOS_FONTE) {
    for (const base of [semana, r]) {
      const v = base?.[campo];
      if (v && typeof v === 'object') return v;
    }
  }
  return null;
}

const num = (v: any): number => {
  const n = typeof v === 'string' ? parseFloat(v.replace('%', '').replace(',', '.')) : Number(v);
  return Number.isFinite(n) && n > 0 ? n : 0;
};

/**
 * Lê os tópicos de uma semana (array [{categoria, percentual}] ou mapa
 * {ECONOMIA: 30}), devolve SEMPRE os 7 tópicos, com percentuais
 * proporcionalmente ajustados para somar 100. Sem dados → [].
 */
export function normalizarTopicosSemana(semana: any): TopicoSemana[] {
  const fonte = acharFonte(semana);
  if (!fonte) return [];

  const bruto: Record<string, { v: number; j?: string }> = {};
  const somar = (nome: unknown, valor: any, just?: any) => {
    const k = INDICE[chave(typeof nome === 'object' && nome ? (nome as any).nome ?? (nome as any).key : nome)];
    if (!k) return;
    bruto[k] = {
      v: (bruto[k]?.v ?? 0) + num(valor),
      j: bruto[k]?.j ?? (typeof just === 'string' ? just : undefined),
    };
  };

  if (Array.isArray(fonte)) {
    for (const it of fonte) {
      somar(
        it?.categoria ?? it?.topico ?? it?.nome ?? it?.name ?? it?.key,
        it?.percentual ?? it?.porcentagem ?? it?.percentage ?? it?.relevancia ?? it?.percent ?? it?.valor,
        it?.justificativa ?? it?.descricao ?? it?.resumo
      );
    }
  } else {
    for (const [nome, v] of Object.entries(fonte)) {
      if (v && typeof v === 'object') {
        const o = v as any;
        somar(nome, o.percentual ?? o.porcentagem ?? o.percentage ?? o.relevancia ?? o.valor, o.justificativa ?? o.descricao);
      } else {
        somar(nome, v);
      }
    }
  }

  const total = Object.values(bruto).reduce((s, x) => s + x.v, 0);
  if (total <= 0) return [];

  return CATEGORIAS.map((c) => ({
    key: c.key,
    label: c.label,
    cor: c.cor,
    percentual: Math.round(((bruto[c.key]?.v ?? 0) / total) * 1000) / 10,
    justificativa: bruto[c.key]?.j,
  }));
}