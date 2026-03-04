# 📋 Especificação de Requisitos

## 1. Requisitos Funcionais (RF)
| ID | Requisito | Descrição |
| :--- | :--- | :--- |
| **RF01** | Listagem de Candidatos | O sistema deve listar todos os candidatos de uma eleição de um ano específico (Ano X). |
| **RF02** | Detalhamento de Candidato | O sistema deve permitir a seleção de um candidato específico para exibição de informações detalhadas. |
| **RF03** | Proposta de Governo Simplificada | O sistema deve exibir uma versão resumida e de fácil entendimento do plano de governo. |
| **RF04** | Clipping de Mídias Externas | O sistema deve buscar e listar participações do candidato em vídeos externos (entrevistas, debates e podcasts). |
| **RF05** | Resumo de Vídeos | O sistema deve fornecer resumos textuais (via IA) das últimas participações em vídeo do candidato. |
| **RF06** | Monitoramento de Redes Sociais | O sistema deve coletar e resumir os assuntos abordados nas postagens recentes do candidato. |
| **RF07** | Análise de Alinhamento Temático | O sistema deve confrontar as postagens com o plano de governo, indicando pontos condizentes ou divergentes. |
| **RF08** | Cálculo de Coerência Geral | O sistema deve gerar uma porcentagem (%) de coerência global entre o discurso e a proposta de governo. |
| **RF09** | Cálculo de Coerência por Tópico | O sistema deve exibir o índice de fidelidade para temas específicos (Ex: Saúde, Economia, Educação). |
| **RF10** | Identificação do Espectro Político | O sistema deve identificar o espectro político do candidato e exibi-lo em um mapa visual. |

---

## 2. Requisitos Não Funcionais (RNF)
| ID | Categoria | Descrição |
| :--- | :--- | :--- |
| **RNF01** | Usabilidade | A interface e os resumos devem utilizar linguagem simples, evitando termos técnicos excessivos. |
| **RNF02** | Desempenho | O processamento de resumos e índices de coerência deve ser rápido para permitir navegação fluida. |
| **RNF03** | Confiabilidade | Os algoritmos de resumo e análise devem ser precisos para não distorcer falas ou planos oficiais. |
| **RNF04** | Interoperabilidade | O sistema deve ser capaz de se integrar a APIs de plataformas de vídeo e redes sociais (X, Instagram, etc). |
| **RNF05** | Visualização de Dados | Os índices de coerência devem ser apresentados de forma visual (gráficos ou barras). |
| **RNF06** | Tecnologia | O sistema deve usar IA a ser desenvolvida em Python, rodando em container separado e se comunicar via API. |
| **RNF07** | Armazenamento | O sistema deve garantir a persistência de todos os dados coletados e processados. |
| **RNF08** | Arquitetura | A comunicção entre containers deve ocorrer por meio de api. |
