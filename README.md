# ProjetoEngenharia

## Integrantes
- Edmilson Li Quansang — 10425514
- Gabriel Pereira Faravola — 10427189
- João Paulo Berto Massabki — 10425593
- Pietro Caffettani — 10425628

---
## Definição da Demanda
- [Documentação Completa](README.md#documentação)
### 1 Problema ou oportunidade percebida

  Este projeto nasce da necessidade real de democratizar o acesso à informação política no Brasil. Hoje, grande parte da população encontra dificuldades para compreender planos de governo, acompanhar posicionamentos públicos e avaliar se há coerência entre o que foi prometido e o que é efetivamente defendido ao longo do tempo. Os documentos oficiais costumam ser extensos, escritos em linguagem técnica e pouco acessível, o que afasta o cidadão comum do debate qualificado e abre espaço para discursos superficiais, emocionais ou populistas.

### 2 Razão ou justificativa para a demanda

  Diante desse cenário, surge a necessidade de uma solução que torne essas informações mais acessíveis e compreensíveis para a população. A proposta da plataforma é enfrentar esse problema oferecendo um ambiente digital organizado, claro e acessível, que transforme informação dispersa em conteúdo compreensível, permitindo que qualquer pessoa entenda, compare e acompanhe propostas políticas de forma objetiva.

### 3 Descrição sucinta do produto de software

  O sistema será desenvolvido como um site estruturado para facilitar a navegação e a compreensão das informações. A página inicial apresentará candidatos organizados em cards visuais contendo foto, nome, partido e um indicativo de posicionamento no espectro político. Esses elementos não terão função de julgamento, mas de contextualização. Ao selecionar um candidato, o usuário será direcionado a uma página dedicada, composta por um cabeçalho com informações básicas e uma navegação interna que permite acessar diferentes dimensões da análise.

A primeira dimensão será o resumo do plano de governo. Os planos oficiais serão analisados e sintetizados com apoio de inteligência artificial, sempre preservando o conteúdo essencial, mas traduzindo-o para uma linguagem simples, direta e de fácil leitura. O foco será destacar os principais tópicos abordados, como saúde, educação, economia e segurança, apresentando as ideias centrais de cada área sem excesso de texto ou termos técnicos. Também serão indicados tópicos menos desenvolvidos no plano, para que o usuário tenha uma visão equilibrada do que recebe maior ou menor prioridade. Haverá a possibilidade de acessar um resumo mais completo, mantendo a organização por relevância e clareza.

Outra dimensão da análise envolverá o comportamento público recente do candidato. A plataforma reunirá informações provenientes de redes sociais, incluindo postagens, comentários, imagens e vídeos, organizando esses conteúdos por temas. Em vez de simplesmente exibir publicações isoladas, o sistema apresentará um panorama consolidado das ideias mais recorrentes defendidas nesses canais. A mesma lógica será aplicada a participações em debates, entrevistas, podcasts, discursos oficiais e outras mídias de terceiros. O objetivo não é reproduzir integralmente o conteúdo, mas sintetizar os posicionamentos e organizá-los por assunto, facilitando a comparação com o plano formal.

Um dos principais diferenciais da plataforma será o índice de coerência. Esse índice comparará o plano de governo com os posicionamentos públicos recentes, avaliando o grau de alinhamento entre promessa formal e discurso atual. Haverá um indicador geral e indicadores específicos por tema, permitindo que o usuário compreenda, por exemplo, se o candidato mantém consistência nas áreas de saúde ou educação. A intenção não é emitir juízo político, mas oferecer uma métrica clara e baseada em critérios definidos, tornando mais transparente a relação entre o que foi prometido e o que é defendido publicamente.

Quando aplicável, a plataforma também apresentará um histórico estatístico relacionado a cargos anteriores ocupados pelo candidato. Serão analisadas promessas feitas em eleições passadas, temas efetivamente abordados durante o mandato e possíveis mudanças de posicionamento ao longo do tempo. Esse contexto histórico permitirá uma avaliação mais ampla da trajetória política, evitando análises limitadas a um único momento eleitoral.

### 4 Clientes, usuários e envolvidos

  Os principais usuários da plataforma são os cidadãos interessados em compreender melhor as propostas e posicionamentos de candidatos políticos. A ferramenta busca atender especialmente eleitores que desejam acessar informações de forma clara, organizada e baseada em fontes públicas.

Além dos usuários finais, o sistema também pode ser relevante para pesquisadores, jornalistas e analistas políticos que desejam acompanhar e comparar posicionamentos públicos ao longo do tempo. De forma mais ampla, a sociedade civil é impactada positivamente pela disponibilização de informações políticas mais acessíveis e estruturadas, contribuindo para um debate público mais qualificado.

### 5 Etapas para construção do produto

  Para a construção do sistema, o desenvolvimento do produto seguirá algumas etapas principais. Inicialmente será realizado o levantamento e a definição dos requisitos do sistema, identificando as funcionalidades necessárias e os dados que deverão ser coletados e processados.

Em seguida será feita a modelagem do sistema, incluindo a definição da arquitetura, dos diagramas e da estrutura de dados que sustentará a plataforma.

Posteriormente será implementada a etapa de coleta e integração de dados, responsável por reunir informações públicas provenientes de planos de governo, redes sociais, entrevistas e outras mídias.

Na sequência serão desenvolvidos os módulos de análise baseados em inteligência artificial, responsáveis por gerar resumos, identificar temas recorrentes e calcular os índices de coerência entre propostas e posicionamentos públicos.

Após isso será desenvolvido o site que servirá como interface da plataforma, permitindo que os usuários naveguem pelas informações de forma clara e organizada.

Por fim, serão realizadas etapas de integração, testes e implantação do sistema, garantindo o funcionamento adequado da plataforma antes de sua disponibilização para uso público.

### 6 Critérios de qualidade do produto

  Toda a construção do projeto será orientada por princípios de neutralidade ideológica, transparência metodológica e acessibilidade. A linguagem utilizada na apresentação dos conteúdos será simples e inclusiva, com foco em legibilidade e organização visual que favoreça a leitura.

As fontes utilizadas serão públicas e rastreáveis, e a metodologia de análise deverá ser clara o suficiente para permitir compreensão e eventual auditoria. O objetivo final é ampliar o discernimento e a capacidade crítica da população brasileira, estimulando uma relação mais consciente com o processo democrático e fortalecendo a cobrança fundamentada durante o exercício do mandato.

## Documentação:
- [Histórias de Usuários](./Documentação/01%20-%20Requisitos/Histórias_De_Usuários.md)
- [Requisitos](./Documentação/01%20-%20Requisitos/Requisitos.md)
- [Casos de uso](./Documentação/02%20-%20Casos%20de%20Uso/Diagrama_Casos_de_Uso.md)
- [Implantação](./Documentação/03%20-%20Implementação/Diagrama_Implantação.md)
- Diagramas de Sequência de Negócios:
  - [UC1](./sistema-java/docs/01%20-%20Domínio/Diagramas_de_Sequência_do_Sistema/UC1.md)
  - [UC2](./sistema-java/docs/01%20-%20Domínio/Diagramas_de_Sequência_do_Sistema/UC2.md)
  - [UC3](./sistema-java/docs/01%20-%20Domínio/Diagramas_de_Sequência_do_Sistema/UC3.md)
  - [UC4](./sistema-java/docs/01%20-%20Domínio/Diagramas_de_Sequência_do_Sistema/UC4.md)
  - [UC5](./sistema-java/docs/01%20-%20Domínio/Diagramas_de_Sequência_do_Sistema/UC5.md)
- [Diagrama de Classes de Negócios](./sistema-java/docs/01%20-%20Domínio/Diagrama_de_Classes_Negocios.md)
- Diagramas de Sequência de Sistema:
  - [UC1](./sistema-java/docs/02%20-%20Implementação/Diagramas_de_Squência_de_Implementação/UC1.md)
  - [UC2](./sistema-java/docs/02%20-%20Implementação/Diagramas_de_Squência_de_Implementação/UC2.md)
  - [UC3](./sistema-java/docs/02%20-%20Implementação/Diagramas_de_Squência_de_Implementação/UC3.md)
  - [UC4](./sistema-java/docs/02%20-%20Implementação/Diagramas_de_Squência_de_Implementação/UC4.md)
  - [UC5](./sistema-java/docs/02%20-%20Implementação/Diagramas_de_Squência_de_Implementação/UC5.md)
- [Diagrama Componentes](./sistema-java/docs/02%20-%20Implementação/Diagrama_Componentes.md)
- [Diagrama de Classes de Implementação](./sistema-java/docs/02%20-%20Implementação/Diagrama_de_Classes_de_Implementação.md)
- [Diagrama de pacotes](./sistema-java/docs/02%20-%20Implementação/Diagrama_Pacotes.md)