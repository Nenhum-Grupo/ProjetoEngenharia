from app.core.config import settings

from google.genai import types, errors
from google import genai
from time import sleep
import inspect
import boto3
import json
import os

class Gemini_Handler():
    def __init__(self, arquivo=None):
        self.arquivo = arquivo

        self.client = genai.Client(api_key=settings.google_api_key.get_secret_value())
        self.MODELS = ["models/gemini-2.5-flash", "models/gemma-4-31b-it", "models/gemini-3.1-flash-lite"]
        self.MODEL_ID = self.MODELS[2]
        self.agentes = {
        "redes_sociais": """
        Você é um Analista de Comunicação Política e Estatístico especializado em sintetizar o posicionamento de candidatos nas redes sociais para a população.

        Sua tarefa é analisar uma lista de postagens da semana de um candidato político, ignorar conteúdos sem relevância política, gerar um resumo estruturado e calcular a distribuição percentual da relevância temática abordada pelo candidato.

        ENTRADA QUE VOCÊ RECEBERÁ:
        1. "intervalo_datas": Duas strings de datas delimitando a semana (ex: desde "Thu Aug 01 00:00:00 +0000 2026" até "Thu Aug 08 00:00:00 +0000 2026").
        2. "posts": Uma lista de strings no formato Python (ex: ["post: texto...", "post citado: texto original \n Post: comentário do candidato..."]).

        REGRAS OBRIGATÓRIAS DE FILTRAGEM E CONTEÚDO:
        1. DESCARTE E IGNORE completamente posts sem pertinência política ou institucional (avisos de live, saudações genéricas, felicitações, avisos de agenda).
        2. Analise a massa total dos posts VÁLIDOS e identifique quais categorias políticas foram abordadas.
        3. Para cada categoria identificada, atribua uma porcentagem estimada de representatividade (peso no discurso total da semana). 
        4. A SOMA DE TODAS AS PORCENTAGENS NO ARRAY "topicos" DEVE SER EXATAMENTE 100%.
        5. NÃO INCLUA categorias com 0%. Se uma categoria não foi abordada no discurso da semana, simplesmente OMITA-A da lista de tópicos.
        6. Para o campo "intervalo", converta o período recebido em um texto amigável no formato "semana do dia X a Y de [Mês]".
        7. Use linguagem simples, clara, neutra e acessível para qualquer cidadão.

        LISTA FIXA DE CATEGORIAS PERMITIDAS PARA "topicos":
        - RELACOES_INTERNACIONAIS (acordos, diplomatas, posições geopolíticas, comércio exterior)
        - LIBERDADE_DEMOCRACIA (liberdade de expressão, instituições, STF, transparência, combate ao autoritarismo)
        - SISTEMA_POLITICO (reforma política, críticas a adversários/partidos, alianças, funcionamento do Estado, Justiça)
        - ECONOMIA (impostos, inflação, emprego, indústria, gastos públicos, agro, mercado)
        - BEM_ESTAR_QUALIDADE_DE_VIDA (saúde, educação, segurança pública, moradia, transporte, meio ambiente)
        - ESTRUTURA_SOCIAL (combate à pobreza, desigualdade, programas sociais, fome)
        - GRUPOS_SOCIAIS (pautas de mulheres, negros, indígenas, PCDs, idosos, jovens, religiosos)

        REGRAS RÍGIDAS DE FORMATO DE SAÍDA:
        1. Retorne SOMENTE o objeto JSON puro como string.
        2. NUNCA escreva ```json no início ou no final.
        3. NUNCA use Markdown ou explicações externas antes/depois do JSON.

        DEFINIÇÃO DOS CAMPOS DO JSON DE SAÍDA:
        - "intervalo": string indicando a semana (ex: "semana do dia 1 a 8 de agosto").
        - "resumo": texto contendo um resumo coeso de 1 a 2 parágrafos sintetizando os principais posicionamentos, críticas e propostas defendidas pelo candidato nas redes durante a semana.
        - "topicos": array de objetos contendo APENAS os tópicos que tiveram relevância (> 0%), informando o campo "categoria" e o campo "porcentagem" (um inteiro de 1 a 100). A soma de "porcentagem" de todos os objetos no array deve ser rigorosamente igual a 100.

        FORMATO EXATO DA RESPOSTA:

        {
        "intervalo": "semana do dia 1 a 8 de agosto",
        "resumo": "Durante a semana, o candidato focou suas publicações em críticas à gestão econômica atual, destacando a alta dos preços e propondo a isenção de impostos sobre produtos básicos. Além disso, reforçou posições sobre a liberdade de expressão e fez acenos a aliados políticos na região sudeste.",
        "topicos": [
            {
            "categoria": "ECONOMIA",
            "porcentagem": 60
            },
            {
            "categoria": "LIBERDADE_DEMOCRACIA",
            "porcentagem": 25
            },
            {
            "categoria": "SISTEMA_POLITICO",
            "porcentagem": 15
            }
        ]
        }
        """
}

    def Resumo_Redes(self, intervalo, posts, bucketName=None, bucketKey=None):
        if bucketName is None or bucketKey is None:
            print("Entrando no Resumo_Redes...")

            agente = self.agentes["redes_sociais"]

            prompt = f"{str(intervalo)}\n{posts}"

            contents = [
                types.Content(
                    role="user",
                    parts=[types.Part.from_text(text=f"{agente}\n\n{prompt}")]
                )
            ]

            config = types.GenerateContentConfig(
                temperature=0.2,
            )

            for tentativa in range(3):
                try:
                    print("Iniciando processamento do resumo das redes sociais")
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
        else:
            pass
