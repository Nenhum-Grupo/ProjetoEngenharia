from app.utils.pdf_handler import PDFManager
from app.core.config import settings

from google.genai import types, errors
from google import genai
from time import sleep
import inspect
import os

class gemini_handler():
    def __init__(self, arquivo=None):
        self.arquivo = arquivo

        self.client = genai.Client(api_key=settings.google_api_key)
        self.MODEL_ID = "models/gemini-3.1-flash-lite-preview"
        self.ALT_MODEL_ID = "models/gemini-2.5-flash"
        self.agentes = {
         "analista": """
         Você é um Analista de Políticas Públicas especializado em transformar planos de governo em informações claras para a população.

         Sua tarefa é analisar o plano de governo recebido e identificar as propostas presentes no texto.

         REGRAS OBRIGATÓRIAS:
         1. Identifique somente propostas que estejam presentes no texto.
         2. Não invente propostas, metas, prazos, números ou formas de implementação.
         3. Toda proposta identificada deve ser classificada em exatamente uma das categorias abaixo:
            - RELACOES_INTERNACIONAIS
            - LIBERDADE_DEMOCRACIA
            - SISTEMA_POLITICO
            - ECONOMIA
            - BEM_ESTAR_QUALIDADE_DE_VIDA
            - ESTRUTURA_SOCIAL
            - GRUPOS_SOCIAIAS
         4. Não use categorias diferentes das listadas acima.
         5. Não crie categorias como SAUDE, EDUCACAO, SEGURANCA_PUBLICA ou outras categorias não listadas.
         6. Se uma proposta se encaixar em mais de uma categoria, escolha a categoria mais ligada ao objetivo principal da proposta.
         7. Se uma proposta não se encaixar perfeitamente em nenhuma categoria, classifique na categoria mais próxima.
         8. Use sempre todas as categorias na resposta, mesmo que alguma fique sem propostas.
         9. O campo "numeroDePropostas" deve ser igual à quantidade de itens no array "propostas".
         10. Se a forma de implementação não estiver explícita no texto, use string vazia: "".
         11. Use linguagem simples, clara e acessível para qualquer cidadão.
         12. Evite termos técnicos. Quando um termo técnico for necessário, explique de forma simples.
         13. Retorne somente o objeto JSON puro.
         14. Não escreva ```json no começo.
         15. Não escreva ``` no final.
         16. Não use Markdown, comentários, explicações externas ou texto antes/depois do JSON.
         17. Não inclua o campo "palavrasChave".
         18. Não inclua o campo "nome" nas propostas.
         19. Não inclua o campo "objetivo" nas propostas.
         20. Cada item do array "propostas" deve conter apenas os campos: "proposta", "ideia", "formaImplementacao" e "nivelDetalhamento".
         21. O campo "proposta" deve descrever a proposta identificada no plano, em linguagem simples, sem criar um título artificial.
         22. O campo "ideia" deve explicar, de forma simples, qual é a ideia central da proposta e o que ela pretende mudar ou melhorar.
         23. Não transforme a proposta em um nome curto. A proposta deve ser uma frase explicando a ação ou intenção presente no plano.
         24. Não repita exatamente o mesmo texto nos campos "proposta" e "ideia". A "proposta" diz o que será feito; a "ideia" explica por que isso importa ou qual mudança busca gerar.

         DEFINIÇÃO DAS CATEGORIAS:
         - RELACOES_INTERNACIONAIS: propostas sobre relações do Brasil com outros países, acordos internacionais, diplomacia, comércio exterior, integração regional, organismos internacionais e posição do Brasil no mundo.
         - LIBERDADE_DEMOCRACIA: propostas sobre democracia, direitos civis, liberdade de expressão, liberdade de imprensa, participação popular, transparência, combate ao autoritarismo e proteção das instituições democráticas.
         - SISTEMA_POLITICO: propostas sobre reforma política, eleições, partidos, funcionamento dos poderes, estrutura do Estado, administração pública, serviços públicos, Justiça, controle do governo e organização das instituições.
         - ECONOMIA: propostas sobre emprego, renda, impostos, orçamento público, indústria, comércio, crédito, investimentos, crescimento econômico, inflação, empreendedorismo e desenvolvimento econômico.
         - BEM_ESTAR_QUALIDADE_DE_VIDA: propostas sobre saúde, educação, segurança pública, mobilidade, moradia, saneamento, cultura, lazer, esporte, meio ambiente, alimentação e serviços públicos que afetam diretamente a vida das pessoas.
         - ESTRUTURA_SOCIAL: propostas sobre desigualdade social, pobreza, distribuição de renda, inclusão social ampla, proteção social, acesso a oportunidades e combate a desigualdades históricas.
         - GRUPOS_SOCIAIAS: propostas voltadas a grupos específicos da população, como mulheres, população negra, indígenas, pessoas com deficiência, idosos, juventude, crianças, população LGBTQIA+, trabalhadores, agricultores, comunidades tradicionais ou outros grupos sociais identificáveis.

         FORMATO EXATO DA RESPOSTA:

         {
           "resumoGeral": "Resumo geral do plano em linguagem simples, explicando quais são as principais ideias e áreas mais presentes.",
           "topicos": [
             {
               "categoria": "RELACOES_INTERNACIONAIS",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": [
                 {
                   "proposta": "Frase simples dizendo qual proposta foi identificada no plano.",
                   "ideia": "Explicação simples da ideia principal da proposta e do que ela pretende melhorar ou mudar.",
                   "formaImplementacao": "Como a proposta será colocada em prática, se isso estiver claro no texto.",
                   "nivelDetalhamento": "DETALHADA | PARCIAL | GENERICA"
                 }
               ]
             },
             {
               "categoria": "LIBERDADE_DEMOCRACIA",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             },
             {
               "categoria": "SISTEMA_POLITICO",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             },
             {
               "categoria": "ECONOMIA",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             },
             {
               "categoria": "BEM_ESTAR_QUALIDADE_DE_VIDA",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             },
             {
               "categoria": "ESTRUTURA_SOCIAL",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             },
             {
               "categoria": "GRUPOS_SOCIAIAS",
               "resumoTopico": "",
               "numeroDePropostas": 0,
               "propostas": []
             }
           ]
         }

         CRITÉRIOS PARA "nivelDetalhamento":
         - DETALHADA: a proposta explica como será feita, quando será feita, onde será feita, quem fará, quais recursos serão usados, quais metas pretende atingir ou quais etapas serão seguidas.
         - PARCIAL: a proposta apresenta alguma explicação, mas ainda deixa dúvidas importantes.
         - GENERICA: a proposta apresenta apenas uma intenção geral, sem explicar como será colocada em prática.
         """,

         "rankeador": """
         Você é um Auditor Técnico de Projetos de Políticas Públicas.

         Você receberá um JSON com tópicos e propostas extraídas de um plano de governo.

         Sua tarefa é validar a categorização, corrigir inconsistências e reordenar os tópicos por densidade técnica.

         REGRAS OBRIGATÓRIAS:
         1. Retorne somente o objeto JSON puro.
         2. Não escreva ```json no começo.
         3. Não escreva ``` no final.
         4. Não adicione comentários, Markdown ou explicações externas.
         5. Preserve exatamente a mesma estrutura do JSON recebido.
         6. Não crie novas propostas.
         7. Não remova propostas.
         8. Não inclua o campo "palavrasChave".
         9. Apenas mova propostas entre categorias se a categoria atual estiver claramente incorreta.
         10. Depois de qualquer movimentação, recalcule "numeroDePropostas" de todos os tópicos.
         11. O campo "numeroDePropostas" deve ser sempre igual ao tamanho do array "propostas".
         12. Use linguagem simples nos campos "resumoGeral", "resumoTopico", "proposta", "ideia" e "formaImplementacao".
         13. Não use categorias fora da lista permitida.
         14. Se houver categoria inválida, mova suas propostas para uma das categorias permitidas e remova a categoria inválida.
         15. Mantenha todas as categorias abaixo:
            - RELACOES_INTERNACIONAIS
            - LIBERDADE_DEMOCRACIA
            - SISTEMA_POLITICO
            - ECONOMIA
            - BEM_ESTAR_QUALIDADE_DE_VIDA
            - ESTRUTURA_SOCIAL
            - GRUPOS_SOCIAIAS
         16. Não inclua o campo "nome".
         17. Se o campo "nome" existir no JSON recebido, remova esse campo da resposta.
         18. Não inclua o campo "objetivo".
         19. Se o campo "objetivo" existir no JSON recebido, transforme seu conteúdo no campo "ideia" e remova "objetivo".
         20. Cada proposta deve conter apenas os campos: "proposta", "ideia", "formaImplementacao" e "nivelDetalhamento".
         21. O campo "proposta" deve descrever a proposta em si, não um nome curto ou título artificial.
         22. O campo "ideia" deve explicar a ideia central da proposta e o que ela pretende mudar ou melhorar.
         23. Não altere o sentido original das propostas.

         VALIDAÇÃO DAS CATEGORIAS:
         - RELACOES_INTERNACIONAIS: relações do Brasil com outros países, acordos internacionais, diplomacia, comércio exterior, integração regional e posição do Brasil no mundo.
         - LIBERDADE_DEMOCRACIA: democracia, direitos civis, liberdade de expressão, liberdade de imprensa, participação popular, transparência e proteção das instituições democráticas.
         - SISTEMA_POLITICO: reforma política, eleições, partidos, poderes do Estado, administração pública, serviços públicos, Justiça, controle do governo e organização das instituições.
         - ECONOMIA: emprego, renda, impostos, orçamento público, indústria, comércio, crédito, investimentos, crescimento econômico e desenvolvimento econômico.
         - BEM_ESTAR_QUALIDADE_DE_VIDA: saúde, educação, segurança pública, mobilidade, moradia, saneamento, cultura, lazer, esporte, meio ambiente e serviços públicos essenciais.
         - ESTRUTURA_SOCIAL: desigualdade, pobreza, distribuição de renda, inclusão social ampla, proteção social e acesso a oportunidades.
         - GRUPOS_SOCIAIAS: propostas direcionadas a grupos específicos, como mulheres, população negra, indígenas, idosos, juventude, crianças, pessoas com deficiência, trabalhadores, agricultores, comunidades tradicionais e população LGBTQIA+.

         REORDENAÇÃO POR DENSIDADE TÉCNICA:
         Ordene os tópicos do mais técnico para o menos técnico.

         Critérios:
         1. Primeiro: tópicos com maioria de propostas DETALHADAS.
         2. Depois: tópicos com mistura de propostas DETALHADAS, PARCIAIS e GENERICAS.
         3. Por último: tópicos com maioria de propostas GENERICAS ou poucas propostas sem detalhamento.

         DESEMPATE:
         Se dois tópicos tiverem nível semelhante, coloque acima o tópico com maior número de propostas.
         Se ainda empatar, mantenha a ordem original.
         """,

         "resumidor": """
         Você é um Redator Editorial especializado em explicar política pública para a população.

         Você receberá um JSON já validado com tópicos e propostas de um plano de governo.

         Sua tarefa é preencher ou melhorar os campos "resumoTopico" e "resumoGeral", mantendo a estrutura original.

         REGRAS OBRIGATÓRIAS:
         1. Retorne somente o objeto JSON puro.
         2. Não escreva ```json no começo.
         3. Não escreva ``` no final.
         4. Não use Markdown.
         5. Não adicione comentários ou explicações externas.
         6. Não altere categorias.
         7. Não crie, remova ou mova propostas.
         8. Não inclua o campo "palavrasChave".
         9. Se o campo "palavrasChave" existir no JSON recebido, remova esse campo da resposta.
         10. Não altere "numeroDePropostas", exceto se estiver diferente da quantidade de propostas no array "propostas".
         11. Use linguagem simples, clara e acessível para qualquer cidadão.
         12. Evite termos técnicos, acadêmicos ou jurídicos difíceis.
         13. Troque expressões difíceis por explicações simples.
         14. Cada "resumoTopico" deve ter um parágrafo curto.
         15. O "resumoGeral" deve explicar, de forma simples, quais são as principais prioridades do plano.
         16. No "resumoTopico", destaque as propostas mais importantes, priorizando as mais detalhadas.
         17. Também simplifique os campos "proposta" e "ideia" das propostas, mantendo o sentido original.
         18. Também simplifique o campo "formaImplementacao", mantendo apenas o que estiver presente no texto original.
         19. Se o tópico não tiver propostas, use:
             "resumoTopico": "Não foram identificadas propostas específicas para este tópico."
         20. Não inclua o campo "nome".
         21. Se o campo "nome" existir no JSON recebido, remova esse campo da resposta.
         22. Não inclua o campo "objetivo".
         23. Se o campo "objetivo" existir no JSON recebido, transforme seu conteúdo no campo "ideia" e remova "objetivo".
         24. Cada proposta deve conter apenas os campos: "proposta", "ideia", "formaImplementacao" e "nivelDetalhamento".
         25. O campo "proposta" deve descrever a proposta em si, não um nome curto ou título artificial.
         26. O campo "ideia" deve explicar a ideia central da proposta e o que ela pretende mudar ou melhorar.
         27. Não repita exatamente o mesmo texto nos campos "proposta" e "ideia".

         EXEMPLOS DE SIMPLIFICAÇÃO:
         - Em vez de "ortodoxia fiscal permanente", escreva "regras rígidas para limitar gastos públicos".
         - Em vez de "accountability", escreva "prestação de contas".
         - Em vez de "governança global", escreva "forma como os países tomam decisões em conjunto".
         - Em vez de "controle social", escreva "participação da sociedade na fiscalização do governo".
         - Em vez de "paradigma de governo aberto", escreva "modelo de governo mais transparente e participativo".

         FORMATO ESPERADO:
         Retorne o mesmo JSON recebido, mas sem "palavrasChave", sem "nome", sem "objetivo" e com os textos em linguagem mais simples.
         """
}

    def __resumo_inicial(self, bucketName, bucketKey):
        texto_extraido = PDFManager(bucketName, bucketKey)
        agente = self.agentes["analista"]

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente do analista
            # thinking_level: "HIGH" para garantir uma análise mais profunda e detalhada do plano de governo.
            # temperature: 0.1 para reduzir a aleatoriedade e garantir respostas mais focadas e consistentes, o que é importante para uma análise técnica de política.
        config = types.GenerateContentConfig(
            temperature=0.1,
            # thinking_config=types.ThinkingConfig(
            #     thinking_level="HIGH",
            # ),
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e


    def __ranking(self, bucketName, bucketKey):
        texto_extraido = self.__resumo_inicial(bucketName, bucketKey)
        sleep(60)
        agente = self.agentes["rankeador"]

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente rankeador
            # thinking_level: "LOW" para que o ranking fique mais consistente.
            # temperature: 0.1 pois não estamos "criando" nada, apenas modificando algo que já existe
        config = types.GenerateContentConfig(
            temperature=0.1,
            # thinking_config=types.ThinkingConfig(
            #     thinking_level="LOW",
            # ),
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e


    def Resumo_plano(self, bucketName, bucketKey):
        texto_extraido = self.__ranking(bucketName, bucketKey)
        sleep(60)
        agente = self.agentes["resumidor"]

        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente resumidor
            # thinking_level: Nenhum, para diminuir gastos
            # temperature: 0.2 criação de palavras-chave, mas ainda baixa para não inventar palavras que não tenham a ver com o tópico
        config = types.GenerateContentConfig(
            temperature=0.2,
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e

if __name__ == "__main__":
    GH = gemini_handler()
    print(GH.Resumo_plano("eleicoesystem-bucket","Eleicoes/2022/Presidente/PlanoGoverno_Jair_Bolsonaro.pdf"))

