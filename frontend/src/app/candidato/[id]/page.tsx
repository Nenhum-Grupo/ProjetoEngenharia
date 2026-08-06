'use client';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ShieldCheck,
  Award,
  Plus,
  Minus,
  Layout,
  TextQuote,
  BarChart3,
  Target,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

const CATEGORIAS = [
  {
    key: 'RELACOES_INTERNACIONAIS',
    label: 'Relações Internacionais',
  },
  {
    key: 'LIBERDADE_DEMOCRACIA',
    label: 'Liberdade e Democracia',
  },
  {
    key: 'SISTEMA_POLITICO',
    label: 'Sistema Político',
  },
  {
    key: 'ECONOMIA',
    label: 'Economia',
  },
  {
    key: 'BEM_ESTAR_QUALIDADE_DE_VIDA',
    label: 'Bem-estar e Qualidade de Vida',
  },
  {
    key: 'ESTRUTURA_SOCIAL',
    label: 'Estrutura Social',
  },
  {
    key: 'GRUPOS_SOCIAIS',
    label: 'Grupos Sociais',
  },
];

function getCategoriaKey(categoria: any) {
  if (!categoria) return '';

  let categoriaKey = '';

  if (typeof categoria === 'string') {
    categoriaKey = categoria;
  } else {
    categoriaKey = categoria.nome || categoria.name || categoria.key || '';
  }

  if (categoriaKey === 'GRUPOS_SOCIAIAS') {
    return 'GRUPOS_SOCIAIS';
  }

  return categoriaKey;
}

function normalizarRespostaTopicos(response: any) {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  return (
    response.topicos ||
    response.resumo?.topicos ||
    response.topicoPlanoList ||
    response.plano?.topicos ||
    response.planoDeGoverno?.topicos ||
    []
  );
}

export default function DetalheCandidato() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();

  const [data, setData] = useState<any>(null);
  const [topicos, setTopicos] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadingTopicos, setLoadingTopicos] = useState(false);
  const [topicosCarregados, setTopicosCarregados] = useState(false);

  const [activeTab, setActiveTab] = useState('principal');
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [expandedProposal, setExpandedProposal] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const candidatoId = Array.isArray(id) ? id[0] : id;

    async function carregarCandidato() {
      try {
        setLoading(true);
        setData(null);
        setTopicos([]);
        setTopicosCarregados(false);
        setExpandedTopic(null);
        setExpandedProposal(null);

        const candidatoResponse = await fetch(
          `${API_URL}/api/candidato/${candidatoId}`
        );

        if (!candidatoResponse.ok) {
          throw new Error(
            `Erro ao buscar candidato: HTTP ${candidatoResponse.status}`
          );
        }

        const candidatoData = await candidatoResponse.json();

        console.log('Dados da API de candidato:', candidatoData);

        setData(candidatoData);
      } catch (err) {
        console.error('Erro ao buscar candidato:', err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    carregarCandidato();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    if (activeTab !== 'topicos') return;
    if (topicosCarregados) return;

    const candidatoId = Array.isArray(id) ? id[0] : id;

    async function carregarTopicos() {
      try {
        setLoadingTopicos(true);

        const topicosResponse = await fetch(
          `${API_URL}/api/candidato/${candidatoId}/plano`
        );

        if (!topicosResponse.ok) {
          throw new Error(
            `Erro ao buscar tópicos: HTTP ${topicosResponse.status}`
          );
        }

        const topicosData = await topicosResponse.json();

        console.log('Dados da API de tópicos:', topicosData);

        setTopicos(normalizarRespostaTopicos(topicosData));
        setTopicosCarregados(true);
      } catch (err) {
        console.error('Erro ao buscar tópicos:', err);
        setTopicos([]);
        setTopicosCarregados(true);
      } finally {
        setLoadingTopicos(false);
      }
    }

    carregarTopicos();
  }, [id, activeTab, topicosCarregados]);

  const topicosNormalizados = useMemo(() => {
    return CATEGORIAS.map((categoria) => {
      const topicoEncontrado = topicos.find((topico: any) => {
        return getCategoriaKey(topico.categoria) === categoria.key;
      });

      const propostas =
        topicoEncontrado?.propostaPlanos ||
        topicoEncontrado?.propostas ||
        [];

      return {
        categoriaKey: categoria.key,
        categoriaLabel: categoria.label,
        resumo:
          topicoEncontrado?.resumo ||
          topicoEncontrado?.resumoTopico ||
          '',
        quantidadePropostas:
          topicoEncontrado?.quantidadePropostas ??
          topicoEncontrado?.numeroDePropostas ??
          propostas.length ??
          0,
        propostas,
      };
    });
  }, [topicos]);

  const totalPropostas = useMemo(() => {
    return topicosNormalizados.reduce((total, topico) => {
      return total + Number(topico.quantidadePropostas || 0);
    }, 0);
  }, [topicosNormalizados]);

  const dadosRadar = useMemo(() => {
    const classificacoes = data?.graficoRadar || [];

    return CATEGORIAS.map((categoria) => {
      const item = classificacoes.find(
        (c: any) => getCategoriaKey(c.categoria) === categoria.key
      );

      return {
        categoriaLabel: categoria.label,
        percentual: item?.percentual ?? 0,
      };
    });
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-20 text-center text-slate-500 font-bold">
        Candidato não encontrado.
      </div>
    );
  }

  const imageSrc = data.linkFoto
    ? data.linkFoto.startsWith('data:')
      ? data.linkFoto
      : `data:image/jpeg;base64,${data.linkFoto}`
    : null;

  const tabs = [
    { id: 'principal', label: 'Principal', icon: <Layout size={18} /> },
    { id: 'topicos', label: 'Resumo por Tópicos', icon: <TextQuote size={18} /> },
    { id: 'espectro', label: 'Espectro Político', icon: <BarChart3 size={18} /> },
    { id: 'coerencia', label: 'Índice de Coerência', icon: <Target size={18} /> },
  ];

  return (
    <main className="min-h-screen bg-[#F8FAFC] pb-32 font-sans">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-600 hover:text-blue-600 font-bold transition-all"
          >
            <ChevronLeft
              size={20}
              className="group-hover:-translate-x-1 transition-transform"
            />
            Voltar para a lista
          </button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="relative w-full min-h-[400px] rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-slate-900 flex items-center">
          <div className="absolute inset-0 opacity-30 bg-slate-500" />

          <div className="relative z-10 w-full flex flex-col md:flex-row items-center px-8 md:px-16 gap-12">
            <div className="h-[300px] md:h-[350px] aspect-[3/4] rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl shrink-0">
              {imageSrc ? (
                <img
                  src={imageSrc}
                  className="w-full h-full object-cover"
                  alt={data.nome}
                />
              ) : (
                <div className="w-full h-full bg-slate-700 flex items-center justify-center text-slate-400">
                  Sem foto
                </div>
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-6">
                <ShieldCheck size={14} />
                Candidato Oficial
              </div>

              <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
                {data.nome}
              </h1>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-blue-200/80 font-bold text-lg uppercase">
                <span className="text-white">{data.partido}</span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{data.cargo}</span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                <span>{data.ano ?? '2022'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setExpandedTopic(null);
                setExpandedProposal(null);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                : 'text-slate-500 hover:bg-slate-100'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'principal' && (
              <div className="grid md:grid-cols-3 gap-10">
                <div className="md:col-span-2">
                  <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                    <h2 className="text-2xl font-black mb-6 flex items-center gap-3 text-black">
                      <span className="w-2 h-8 bg-blue-600 rounded-full" />
                      Diretrizes Gerais
                    </h2>

                    <p className="text-slate-600 leading-relaxed text-xl italic font-medium">
                      &quot;
                      {data.resumoGeral ||
                        data.resumo?.resumo ||
                        'Resumo não disponível.'}
                      &quot;
                    </p>
                  </section>
                </div>

                <div className="bg-blue-600 p-8 rounded-[3rem] text-white h-fit shadow-xl">
                  <p className="text-[11px] font-black uppercase opacity-70 mb-2">
                    Coerência Atual
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-6xl font-black">
                      {data.indiceDeCoerencia ?? '0.0'}
                    </span>
                    <span className="text-xl opacity-60">/ 100</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'topicos' && (
              <div className="max-w-5xl mx-auto space-y-8">
                {loadingTopicos ? (
                  <div className="bg-white p-10 rounded-3xl border border-slate-100 text-center">
                    <div className="mx-auto mb-4 animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
                    <p className="text-slate-500 font-bold">
                      Carregando resumo por tópicos...
                    </p>
                  </div>
                ) : (
                  <>
                    <section className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-8 md:p-10">
                      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
                        <div>
                          <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-2">
                            Distribuição temática
                          </p>

                          <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                            Propostas por tema
                          </h2>
                        </div>

                        <div className="bg-slate-900 text-white rounded-2xl px-5 py-3 text-center shadow-lg">
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                            Total
                          </p>

                          <p className="text-2xl font-black">
                            {totalPropostas}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        {topicosNormalizados.map((topico) => {
                          const percentual =
                            totalPropostas > 0
                              ? Math.round(
                                (Number(topico.quantidadePropostas || 0) /
                                  totalPropostas) *
                                100
                              )
                              : 0;

                          return (
                            <div
                              key={topico.categoriaKey}
                              className="space-y-2"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-sm font-black text-slate-700">
                                  {topico.categoriaLabel}
                                </span>

                                <span className="text-xs font-black text-slate-500">
                                  {topico.quantidadePropostas} propostas ·{' '}
                                  {percentual}%
                                </span>
                              </div>

                              <div className="h-4 w-full rounded-full bg-slate-100 overflow-hidden">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${percentual}%` }}
                                  transition={{
                                    duration: 0.7,
                                    ease: 'easeOut',
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 shadow-sm"
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </section>

                    <section className="space-y-4">
                      {topicosNormalizados.map((topico) => {
                        const topicIsOpen =
                          expandedTopic === topico.categoriaKey;

                        return (
                          <div
                            key={topico.categoriaKey}
                            className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm"
                          >
                            <button
                              onClick={() => {
                                setExpandedTopic(
                                  topicIsOpen ? null : topico.categoriaKey
                                );
                                setExpandedProposal(null);
                              }}
                              className="w-full px-6 md:px-8 py-6 flex items-center justify-between hover:bg-slate-50 transition-colors"
                            >
                              <div className="flex items-center gap-4">
                                <div className="bg-blue-50 text-blue-600 p-3 rounded-2xl">
                                  <TextQuote size={20} />
                                </div>

                                <div className="text-left">
                                  <h3 className="font-black text-slate-900 text-base md:text-lg">
                                    {topico.categoriaLabel}
                                  </h3>

                                  <span className="text-sm text-slate-500 font-bold">
                                    {topico.quantidadePropostas} propostas
                                  </span>
                                </div>
                              </div>

                              {topicIsOpen ? (
                                <Minus className="text-blue-600 shrink-0" />
                              ) : (
                                <Plus className="text-blue-600 shrink-0" />
                              )}
                            </button>

                            <AnimatePresence>
                              {topicIsOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="px-6 md:px-8 pb-8 pt-4 border-t border-slate-100">
                                    <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 mb-6">
                                      <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">
                                        Resumo do tema
                                      </p>

                                      <p className="text-slate-700 leading-relaxed text-base md:text-lg font-medium">
                                        {topico.resumo ||
                                          'Resumo não disponível para este tema.'}
                                      </p>
                                    </div>

                                    <div className="space-y-3">
                                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                        Propostas
                                      </h4>

                                      {topico.propostas.length > 0 ? (
                                        topico.propostas.map(
                                          (proposta: any, index: number) => {
                                            const proposalKey = `${topico.categoriaKey
                                              }-${proposta.id ?? index}`;

                                            const proposalIsOpen =
                                              expandedProposal === proposalKey;

                                            return (
                                              <div
                                                key={proposalKey}
                                                className="rounded-2xl border border-slate-200 bg-white overflow-hidden"
                                              >
                                                <button
                                                  onClick={() =>
                                                    setExpandedProposal(
                                                      proposalIsOpen
                                                        ? null
                                                        : proposalKey
                                                    )
                                                  }
                                                  className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                                                >
                                                  <div className="text-left">
                                                    <p className="text-sm font-black text-blue-600">
                                                      Proposta {index + 1}
                                                    </p>

                                                    <h5 className="font-bold text-slate-800">
                                                      {proposta.proposta ||
                                                        'Proposta sem título'}
                                                    </h5>
                                                  </div>

                                                  {proposalIsOpen ? (
                                                    <Minus
                                                      size={18}
                                                      className="text-blue-600 shrink-0"
                                                    />
                                                  ) : (
                                                    <Plus
                                                      size={18}
                                                      className="text-blue-600 shrink-0"
                                                    />
                                                  )}
                                                </button>

                                                <AnimatePresence>
                                                  {proposalIsOpen && (
                                                    <motion.div
                                                      initial={{
                                                        height: 0,
                                                        opacity: 0,
                                                      }}
                                                      animate={{
                                                        height: 'auto',
                                                        opacity: 1,
                                                      }}
                                                      exit={{
                                                        height: 0,
                                                        opacity: 0,
                                                      }}
                                                      className="overflow-hidden"
                                                    >
                                                      <div className="px-5 pb-5 pt-2 border-t border-slate-100 space-y-4">
                                                        <div>
                                                          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">
                                                            Ideia geral
                                                          </p>

                                                          <p className="text-sm text-slate-700 leading-relaxed">
                                                            {proposta.ideia ||
                                                              'Ideia geral não informada.'}
                                                          </p>
                                                        </div>

                                                        {proposta.formaImplementacao && (
                                                          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                                            <p className="text-xs font-black uppercase tracking-widest text-blue-500 mb-1">
                                                              Forma de
                                                              implementação
                                                            </p>

                                                            <p className="text-sm text-slate-700 leading-relaxed">
                                                              {
                                                                proposta.formaImplementacao
                                                              }
                                                            </p>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </motion.div>
                                                  )}
                                                </AnimatePresence>
                                              </div>
                                            );
                                          }
                                        )
                                      ) : (
                                        <div className="bg-slate-50 rounded-2xl p-5 text-center text-slate-400 font-bold">
                                          Nenhuma proposta cadastrada para este
                                          tema.
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </section>
                  </>
                )}
              </div>
            )}

            {activeTab === 'espectro' && (
              <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                <div className="mb-8">
                  <p className="text-xs font-black uppercase tracking-[0.25em] text-blue-600 mb-2">
                    Classificação temática
                  </p>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900">
                    Espectro Político
                  </h2>
                  {data.categoriaEspectroPolitico && (
                    <span className="inline-block mt-3 bg-blue-50 text-blue-600 font-black text-sm px-4 py-1.5 rounded-full uppercase tracking-wide">
                      {data.categoriaEspectroPolitico.replaceAll('_', ' ')}
                    </span>
                  )}
                </div>

                <ResponsiveContainer width="100%" height={450}>
                  <RadarChart data={dadosRadar} outerRadius="75%">
                    <PolarGrid stroke="#E2E8F0" />
                    <PolarAngleAxis
                      dataKey="categoriaLabel"
                      tick={{ fill: '#334155', fontSize: 12, fontWeight: 700 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={{ fill: '#94A3B8', fontSize: 10 }}
                    />
                    <Radar
                      name={data.nome}
                      dataKey="percentual"
                      stroke="#2563EB"
                      fill="#2563EB"
                      fillOpacity={0.35}
                      strokeWidth={2}
                    />
                    <Tooltip formatter={(value: any) => `${value}%`} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </main>
  );
}