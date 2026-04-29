'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronLeft,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Cargo =
  | 'PRESIDENTE'
  | 'PREFEITO'
  | 'GOVERNADOR'
  | 'DEPUTADO_ESTADUAL'
  | 'DEPUTADO_FEDERAL'
  | 'SENADOR'
  | 'VEREADOR';

type CargoFiltro = Cargo | '';

type Filtros = {
  nome: string;
  ano: string;
  partido: string;
  cargo: CargoFiltro;
  estado: string;
  cidade: string;
};

type Candidato = {
  id: number;
  nome: string;
  partido: string;
  cargo: Cargo;
  ano: number;
  estado: string | null;
  cidade: string | null;
  linkFoto: string;
  plano_resumo: string;
  indiceDeCoerencia: number;
};

type CandidatosResponse = {
  candidatos: Candidato[];
  estados: string[];
  cidades: string[];
  listPartidos: string[];
};

const API_URL = 'http://localhost:8080';

const CARGOS_COM_ESTADO: Cargo[] = [
  'GOVERNADOR',
  'DEPUTADO_ESTADUAL',
  'DEPUTADO_FEDERAL',
  'SENADOR',
  'PREFEITO',
  'VEREADOR',
];

const CARGOS_COM_CIDADE: Cargo[] = ['PREFEITO', 'VEREADOR'];

const CARGO_LABEL: Record<Cargo, string> = {
  PRESIDENTE: 'Presidente',
  PREFEITO: 'Prefeito',
  GOVERNADOR: 'Governador',
  DEPUTADO_ESTADUAL: 'Deputado Estadual',
  DEPUTADO_FEDERAL: 'Deputado Federal',
  SENADOR: 'Senador',
  VEREADOR: 'Vereador',
};

const cargoPermiteEstado = (cargo: CargoFiltro) => {
  if (cargo === '') return true;

  return CARGOS_COM_ESTADO.includes(cargo);
};

const cargoNecessitaCidade = (cargo: CargoFiltro) => {
  if (cargo === '') return false;

  return CARGOS_COM_CIDADE.includes(cargo);
};

export default function Home() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [anos, setAnos] = useState<number[]>([]);
  const [partidos, setPartidos] = useState<string[]>([]);
  const [estados, setEstados] = useState<string[]>([]);
  const [cidades, setCidades] = useState<string[]>([]);

  const [filtros, setFiltros] = useState<Filtros>({
    nome: '',
    ano: '2022',
    partido: '',
    cargo: '',
    estado: '',
    cidade: '',
  });

  const podeSelecionarEstado = cargoPermiteEstado(filtros.cargo);

  const podeSelecionarCidade =
    cargoNecessitaCidade(filtros.cargo) && filtros.estado.trim() !== '';

  const anosComPadrao = Array.from(new Set([2022, ...anos])).sort(
    (a, b) => b - a
  );

  const partidosParaSelect = Array.from(
    new Set(
      [...partidos, filtros.partido].filter(
        (partido) => partido.trim() !== ''
      )
    )
  ).sort((a, b) => a.localeCompare(b));

  const estadosParaSelect = Array.from(
    new Set(
      [...estados, filtros.estado].filter((estado) => estado.trim() !== '')
    )
  ).sort((a, b) => a.localeCompare(b));

  const cidadesParaSelect = Array.from(
    new Set(
      [...cidades, filtros.cidade].filter((cidade) => cidade.trim() !== '')
    )
  ).sort((a, b) => a.localeCompare(b));

  const montarPayload = useCallback(() => {
    return {
      nome: filtros.nome.trim() !== '' ? filtros.nome.trim() : null,

      ano: filtros.ano !== '' ? Number(filtros.ano) : null,

      partido: filtros.partido.trim() !== '' ? filtros.partido : null,

      cargo: filtros.cargo !== '' ? filtros.cargo : null,

      estado:
        podeSelecionarEstado && filtros.estado.trim() !== ''
          ? filtros.estado
          : null,

      cidade:
        podeSelecionarCidade && filtros.cidade.trim() !== ''
          ? filtros.cidade
          : null,
    };
  }, [filtros, podeSelecionarEstado, podeSelecionarCidade]);

  const formatarCargo = (cargo: Cargo | string) => {
    return CARGO_LABEL[cargo as Cargo] ?? cargo;
  };

  const formatarCargoFiltro = () => {
    if (filtros.cargo === '') {
      return 'Todos';
    }

    return CARGO_LABEL[filtros.cargo];
  };

  const formatarLocalidade = (cand: Candidato) => {
    if (cand.cargo === 'PRESIDENTE') {
      return null;
    }

    if (cand.cidade && cand.estado) {
      return `${cand.cidade} - ${cand.estado}`;
    }

    if (cand.estado) {
      return cand.estado;
    }

    if (cand.cidade) {
      return cand.cidade;
    }

    return null;
  };

  const fetchAnos = async () => {
    try {
      const anosResponse = await fetch(`${API_URL}/candidatos/anos`);

      if (!anosResponse.ok) {
        throw new Error(`Erro ao buscar anos: ${anosResponse.status}`);
      }

      const anosData = await anosResponse.json();

      setAnos(
        anosData
          .map((ano: number | string) => Number(ano))
          .filter((ano: number) => !Number.isNaN(ano))
          .sort((a: number, b: number) => b - a)
      );
    } catch (e) {
      console.error('Erro ao buscar anos:', e);
    }
  };

  const fetchCandidatos = useCallback(async () => {
    try {
      setLoading(true);

      const body = montarPayload();

      console.log('Body enviado:', body);

      const res = await fetch(`${API_URL}/candidatos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data: CandidatosResponse = await res.json();

      setCandidatos(data.candidatos ?? []);

      setPartidos(
        (data.listPartidos ?? [])
          .filter((partido) => partido !== null)
          .filter((partido) => partido.trim() !== '')
          .sort((a, b) => a.localeCompare(b))
      );

      setEstados(
        (data.estados ?? [])
          .filter((estado) => estado !== null)
          .filter((estado) => estado.trim() !== '')
          .sort((a, b) => a.localeCompare(b))
      );

      setCidades(
        (data.cidades ?? [])
          .filter((cidade) => cidade !== null)
          .filter((cidade) => cidade.trim() !== '')
          .sort((a, b) => a.localeCompare(b))
      );
    } catch (e) {
      console.error('Erro ao buscar candidatos:', e);
      setCandidatos([]);
      setPartidos([]);
      setEstados([]);
      setCidades([]);
    } finally {
      setLoading(false);
    }
  }, [montarPayload]);

  const handleCargoChange = (cargo: CargoFiltro) => {
    setFiltros((prev) => {
      const permiteEstado = cargoPermiteEstado(cargo);
      const necessitaCidade = cargoNecessitaCidade(cargo);

      return {
        ...prev,
        cargo,
        estado: permiteEstado ? prev.estado : '',
        cidade: necessitaCidade && prev.estado.trim() !== '' ? prev.cidade : '',
      };
    });
  };

  const limparFiltros = () => {
    setFiltros({
      nome: '',
      ano: '2022',
      partido: '',
      cargo: '',
      estado: '',
      cidade: '',
    });
  };

  const rotate = useCallback(
    (dir: 'next' | 'prev') => {
      if (candidatos.length <= 1) return;

      setCandidatos((prev) => {
        const arr = [...prev];

        if (dir === 'next') {
          const first = arr.shift();

          if (first) {
            arr.push(first);
          }
        } else {
          const last = arr.pop();

          if (last) {
            arr.unshift(last);
          }
        }

        return arr;
      });
    },
    [candidatos.length]
  );

  useEffect(() => {
    fetchAnos();
  }, []);

  useEffect(() => {
    fetchCandidatos();
  }, [fetchCandidatos]);

  useEffect(() => {
    if (loading || isPaused || candidatos.length <= 3) return;

    const interval = setInterval(() => rotate('next'), 5000);

    return () => clearInterval(interval);
  }, [loading, isPaused, candidatos.length, rotate]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dbeafe_0,#eef6ff_30%,#f8fafc_70%)] flex flex-col font-sans text-slate-800">
      <header className="sticky top-0 z-50 border-b border-white/70 bg-white/85 backdrop-blur-xl shadow-sm">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between px-8 py-4">
          <div>
            <h1 className="font-black text-2xl tracking-tighter text-slate-950 uppercase">
              POLITIC<span className="text-blue-600">.DATA</span>
            </h1>

            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Busca inteligente de candidatos
            </p>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-blue-700 lg:flex">
            <SlidersHorizontal size={14} />
            Filtros ativos
          </div>
        </div>

        <section className="mx-auto max-w-[1500px] px-8 pb-5">
          <div className="rounded-[2rem] border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[0.65fr_1.1fr_1.5fr_0.85fr_0.8fr_1fr_auto]">
              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Ano
                </label>

                <select
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={filtros.ano}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      ano: e.target.value,
                    }))
                  }
                >
                  {anosComPadrao.map((ano) => (
                    <option key={ano} value={ano}>
                      {ano}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Cargo
                </label>

                <select
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={filtros.cargo}
                  onChange={(e) =>
                    handleCargoChange(e.target.value as CargoFiltro)
                  }
                >
                  <option value="">Todos</option>

                  {(Object.keys(CARGO_LABEL) as Cargo[]).map((cargo) => (
                    <option key={cargo} value={cargo}>
                      {CARGO_LABEL[cargo]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative">
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Nome
                </label>

                <Search
                  className="absolute left-3 top-[39px] -translate-y-1/2 text-slate-400"
                  size={16}
                />

                <input
                  placeholder="Buscar por nome..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={filtros.nome}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      nome: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Partido
                </label>

                <select
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-bold outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                  value={filtros.partido}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      partido: e.target.value,
                    }))
                  }
                >
                  <option value="">Todos</option>

                  {partidosParaSelect.map((partido) => (
                    <option key={partido} value={partido}>
                      {partido}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Estado
                </label>

                <select
                  className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition-all ${
                    podeSelecionarEstado
                      ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                      : 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400'
                  }`}
                  value={filtros.estado}
                  disabled={!podeSelecionarEstado}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      estado: e.target.value,
                      cidade: '',
                    }))
                  }
                >
                  <option value="">
                    {podeSelecionarEstado ? 'Todos' : 'Não se aplica'}
                  </option>

                  {estadosParaSelect.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-black uppercase tracking-[0.16em] text-slate-400">
                  Cidade
                </label>

                <select
                  className={`h-11 w-full rounded-xl border px-4 text-sm font-bold outline-none transition-all ${
                    podeSelecionarCidade
                      ? 'border-slate-200 bg-slate-50 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100'
                      : 'cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400'
                  }`}
                  value={filtros.cidade}
                  disabled={!podeSelecionarCidade}
                  onChange={(e) =>
                    setFiltros((prev) => ({
                      ...prev,
                      cidade: e.target.value,
                    }))
                  }
                >
                  <option value="">
                    {podeSelecionarCidade ? 'Todas' : 'Não se aplica'}
                  </option>

                  {cidadesParaSelect.map((cidade) => (
                    <option key={cidade} value={cidade}>
                      {cidade}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="h-11 w-full whitespace-nowrap rounded-xl bg-slate-950 px-5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-slate-900/15 transition-all hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-blue-600/25"
                >
                  Limpar
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs font-semibold text-slate-500">
                Exibindo{' '}
                <span className="font-black text-slate-950">
                  {candidatos.length}
                </span>{' '}
                candidato{candidatos.length === 1 ? '' : 's'}
              </p>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-blue-700">
                  Cargo: {formatarCargoFiltro()}
                </span>

                <span className="rounded-full bg-slate-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-slate-600">
                  Ano visual: {filtros.ano}
                </span>
              </div>
            </div>
          </div>
        </section>
      </header>

      <section
        className="flex flex-1 items-center justify-center overflow-hidden px-8 py-10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative flex min-h-[640px] w-full max-w-[1500px] items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[2rem] bg-white/55 backdrop-blur-sm">
              <div className="rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-widest text-slate-500 shadow-xl">
                Carregando candidatos...
              </div>
            </div>
          )}

          {!loading && candidatos.length === 0 && (
            <div className="rounded-[2rem] border border-slate-200 bg-white px-10 py-8 text-center shadow-sm">
              <h2 className="text-2xl font-black text-slate-950">
                Nenhum candidato encontrado
              </h2>

              <p className="mt-2 text-sm font-medium text-slate-500">
                Ajuste os filtros para tentar outra combinação.
              </p>
            </div>
          )}

          {candidatos.length > 3 && (
            <div className="pointer-events-none absolute z-40 flex w-full justify-between px-2">
              <button
                type="button"
                onClick={() => rotate('prev')}
                className="pointer-events-auto rounded-full bg-slate-950 p-4 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-600"
              >
                <ChevronLeft size={30} />
              </button>

              <button
                type="button"
                onClick={() => rotate('next')}
                className="pointer-events-auto rounded-full bg-slate-950 p-4 text-white shadow-xl transition-all hover:scale-110 hover:bg-blue-600"
              >
                <ChevronRight size={30} />
              </button>
            </div>
          )}

          <div className="flex w-full items-center justify-center gap-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {(candidatos.length <= 3
                ? candidatos
                : candidatos.slice(0, 3)
              ).map((cand) => {
                const localidade = formatarLocalidade(cand);

                return (
                  <motion.div
                    key={cand.id}
                    layout
                    initial={{ opacity: 0, scale: 0.94, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: 20 }}
                    transition={{ duration: 0.45 }}
                    className="w-[320px] shrink-0"
                  >
                    <Link href={`/candidato/${cand.id}`} className="block group">
                      <article className="flex min-h-[620px] flex-col overflow-hidden rounded-[2.5rem] border border-white bg-white shadow-lg shadow-slate-200/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-200/70">
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-200">
                          <img
                            src={cand.linkFoto}
                            className="h-full w-full object-cover object-top contrast-[1.08] brightness-[1.02] saturate-[0.95] [image-rendering:auto]"
                            alt={cand.nome}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-90" />

                          <div className="absolute bottom-6 left-6 z-10 rounded-xl bg-blue-600 px-4 py-1.5 text-[11px] font-black uppercase tracking-widest text-white shadow-xl">
                            {cand.partido}
                          </div>
                        </div>

                        <div className="flex flex-1 flex-col p-8">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">
                            {formatarCargo(cand.cargo)} • {cand.ano}
                          </p>

                          <div className="mt-2 mb-3 flex min-w-0 items-center gap-2">
                            <h3 className="truncate text-2xl font-black text-slate-950 transition-colors group-hover:text-blue-600">
                              {cand.nome}
                            </h3>

                            {localidade && (
                              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest text-slate-500">
                                {localidade}
                              </span>
                            )}
                          </div>

                          <p className="mb-4 h-[85px] overflow-hidden text-sm leading-relaxed text-slate-500 line-clamp-4">
                            {cand.plano_resumo}
                          </p>

                          <div className="mt-auto flex items-end justify-between border-t border-slate-100 pt-6">
                            <div>
                              <p className="mb-1 text-[9px] font-black uppercase tracking-widest text-slate-400">
                                Coerência
                              </p>

                              <p className="text-4xl font-black leading-none text-blue-600">
                                {cand.indiceDeCoerencia}
                              </p>
                            </div>

                            <div className="flex items-center gap-1 text-xs font-black uppercase tracking-tighter text-slate-950 transition-all group-hover:text-blue-600">
                              Detalhes <ChevronRight size={16} />
                            </div>
                          </div>
                        </div>
                      </article>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </main>
  );
}