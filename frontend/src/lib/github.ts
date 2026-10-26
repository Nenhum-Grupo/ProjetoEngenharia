// Helpers para ler JSONs do GitHub (server-side only).
// Usa a Contents API (funciona com repo privado e com PAT classic ou fine-grained).
// Por padrão lê o repo de dados (GITHUB_REPO). Passe opts.repo / opts.token
// para ler de OUTRO repositório (ex.: o dos posts).

export type GithubOpts = { repo?: string; token?: string; branch?: string };

export type GithubResult<T = any> =
  | { ok: true; data: T }
  | { ok: false; status: number; error: string };

function resolver(opts: GithubOpts = {}) {
  return {
    token: (opts.token ?? process.env.GITHUB_TOKEN)?.trim(),
    repo: (opts.repo ?? process.env.GITHUB_REPO)?.trim(), // "dono/repo"
    branch: opts.branch ?? process.env.GITHUB_BRANCH ?? 'main',
  };
}

async function chamar(path: string, accept: string, opts?: GithubOpts) {
  const { token, repo, branch } = resolver(opts);

  if (!token || !repo || !repo.includes('/')) {
    console.error(`[github] token/repo ausentes ou inválidos (repo="${repo}")`);
    return { ok: false as const, status: 500, error: 'Variáveis do GitHub não configuradas (token e repo no formato dono/repo)' };
  }

  const encodedPath = path.split('/').map(encodeURIComponent).join('/');
  const url = `https://api.github.com/repos/${repo}/contents/${encodedPath}?ref=${branch}`;

  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: accept,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'tcc-frontend',
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      console.error(`[github] ${res.status} em ${repo}@${branch}:${path} -> ${body.slice(0, 200)}`);
      return { ok: false as const, status: res.status, error: `GitHub respondeu ${res.status}` };
    }
    return { ok: true as const, res };
  } catch (e) {
    console.error('[github] erro de rede:', e);
    return { ok: false as const, status: 500, error: 'Falha ao acessar o GitHub' };
  }
}

export async function fetchGithubJson<T = any>(
  path: string,
  opts?: GithubOpts
): Promise<GithubResult<T>> {
  const r = await chamar(path, 'application/vnd.github.raw+json', opts);
  if (!r.ok) return r;
  try {
    return { ok: true, data: (await r.res.json()) as T };
  } catch {
    console.error(`[github] JSON inválido em ${path}`);
    return { ok: false, status: 500, error: 'JSON inválido' };
  }
}

// Lista os nomes dos arquivos de uma pasta do repo.
export async function listGithubDir(
  path: string,
  opts?: GithubOpts
): Promise<GithubResult<string[]>> {
  const r = await chamar(path, 'application/vnd.github+json', opts);
  if (!r.ok) return r;
  const itens = (await r.res.json()) as { name: string; type: string }[];
  return { ok: true, data: itens.filter((i) => i.type === 'file').map((i) => i.name) };
}