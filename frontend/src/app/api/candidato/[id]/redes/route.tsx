import { NextRequest, NextResponse } from 'next/server';
import { fetchGithubJson, listGithubDir, GithubOpts } from '@/lib/github';
import { getCandidato } from '@/lib/candidatos';
import { normalizarTopicosSemana } from '@/lib/topicos';

export const dynamic = 'force-dynamic';

// Repo dos posts. Sem GITHUB_POSTS_REPO, usa o mesmo repo dos dados.
const postsOpts: GithubOpts = {
  repo: process.env.GITHUB_POSTS_REPO,
  token: process.env.GITHUB_POSTS_TOKEN,
  branch: process.env.GITHUB_POSTS_BRANCH,
};

const MAX_SEMANAS = 12;
const TOP_POSTS = 5;
const MAX_CHARS = 400;

const dirResumo = (ano: number, pasta: string) => `${ano}/${pasta}/resumo_posts`;
const dirPosts = (ano: number, pasta: string) => `${ano}/${pasta}/posts`;

// Transforma um tweet bruto no formato que a página usa.
function normalizarPost(p: any) {
  const likes = Number(p?.metrics?.likes ?? 0);
  const retweets = Number(p?.metrics?.retweets ?? 0);
  const data = p?.created_at ? new Date(p.created_at) : null;
  const texto = String(p?.text ?? '');

  return {
    id: p?.id,
    url: p?.url,
    text: texto.length > MAX_CHARS ? texto.slice(0, MAX_CHARS).trimEnd() + '…' : texto,
    createdAt: data && !isNaN(data.getTime()) ? data.toISOString() : undefined,
    likes,
    retweets,
    score: likes + retweets,
  };
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const c = getCandidato(id);
  const pasta = c.pastaPosts || c.pasta;
  const dResumo = dirResumo(c.ano, pasta);
  const dPosts = dirPosts(c.ano, pasta);

  const [listaResumo, listaPosts] = await Promise.all([
    listGithubDir(dResumo, postsOpts),
    listGithubDir(dPosts, postsOpts),
  ]);

  if (!listaResumo.ok && !listaPosts.ok) {
    return NextResponse.json(
      { error: 'Histórico de redes sociais não encontrado.', detalhe: listaResumo.error },
      { status: listaResumo.status === 404 ? 404 : 502 }
    );
  }

  const nomesResumo = new Set(listaResumo.ok ? listaResumo.data.filter((n) => n.endsWith('.json')) : []);
  const nomesPosts = new Set(listaPosts.ok ? listaPosts.data.filter((n) => n.endsWith('.json')) : []);

  // semanas = união das duas pastas, mais recentes primeiro
  const nomes = Array.from(new Set([...nomesResumo, ...nomesPosts]))
    .sort()
    .reverse()
    .slice(0, MAX_SEMANAS);

  const semanas = await Promise.all(
    nomes.map(async (nome) => {
      const [rResumo, rPosts] = await Promise.all([
        nomesResumo.has(nome) ? fetchGithubJson(`${dResumo}/${nome}`, postsOpts) : null,
        nomesPosts.has(nome) ? fetchGithubJson(`${dPosts}/${nome}`, postsOpts) : null,
      ]);

      const brutos: any[] = rPosts && rPosts.ok && Array.isArray(rPosts.data) ? rPosts.data : [];
      const normalizados = brutos.map(normalizarPost);

      const destaques = [...normalizados]
        .sort((a, b) => b.score - a.score)
        .slice(0, TOP_POSTS);

      const dadosResumo =
        rResumo && rResumo.ok && rResumo.data && !Array.isArray(rResumo.data)
          ? rResumo.data
          : {};

      return {
        ...dadosResumo,
        semana: nome.replace(/\.json$/, ''),
        topicos: normalizarTopicosSemana(dadosResumo),
        totalPosts: normalizados.length,
        posts: destaques,
      };
    })
  );

  return NextResponse.json(semanas);
}