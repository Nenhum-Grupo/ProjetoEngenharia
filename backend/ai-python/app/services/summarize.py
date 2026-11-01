from app.core.config import settings

from google.genai import types, errors
from pydantic import BaseModel, Field
from typing import List, Optional
from google import genai
from time import sleep
import inspect
import json
import os

class TweetCategorized(BaseModel):
    id: str = Field(description="ID único original do tweet analisado")
    post_citado: Optional[str] = Field(default="---", description="Texto do post citado/retweetado ou '---'")
    post: str = Field(description="Texto do post analisado")
    categoria: str = Field(description="Categoria atribuída ao post")

class TweetCategorizedBatch(BaseModel):
    results: List[TweetCategorized] = Field(description="Lista contendo as análises estruturadas de todos os tweets fornecidos no prompt")

class Gemini_Handler():
    def __init__(self, arquivo=None):
        self.arquivo = arquivo

        self.client = genai.Client(api_key=settings.google_api_key.get_secret_value())

        self.MODELS = ["models/gemini-2.5-flash", "models/gemma-4-31b-it", "models/gemini-3.1-flash-lite"]

        self.categorizador = self.MODELS[2]
        self.resumidor = self.MODELS[2]

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
        """,
        "Categorizador": """
        Você é um Analista de Comunicação Política e Estatístico especializado em categorizar postagens de candidatos políticos nas redes sociais. Dado um post, você deve categorizá-lo em uma das seguintes categorias: 

        - RELACOES_INTERNACIONAIS (acordos, diplomatas, posições geopolíticas, comércio exterior)
        - LIBERDADE_DEMOCRACIA (liberdade de expressão, instituições, STF, transparência, combate ao autoritarismo)
        - SISTEMA_POLITICO (reforma política, críticas a adversários/partidos, alianças, funcionamento do Estado, Justiça)
        - ECONOMIA (impostos, inflação, emprego, indústria, gastos públicos, agro, mercado)
        - BEM_ESTAR_QUALIDADE_DE_VIDA (saúde, educação, segurança pública, moradia, transporte, meio ambiente)
        - ESTRUTURA_SOCIAL (combate à pobreza, desigualdade, programas sociais, fome)
        - GRUPOS_SOCIAIS (pautas de mulheres, negros, indígenas, PCDs, idosos, jovens, religiosos)
        - OFF_TOPIC (posts que não se encaixam nas categorias acima e, necessariamente, não são "posts políticos")
        """
}

    def categorização_posts(self, posts):
        """
        Analisa uma lista de posts e categoriza cada um deles em tópicos políticos relevantes, ignorando conteúdos sem relevância política.

        :param posts: lista de strings contendo os posts a serem analisados
        :return: lista de dicionários com a categorização dos posts
        """

        posts_mapeados = []

        for i in range(2):

            post_formatado = ""

            for post in posts:
                if str(post.get("id")) in posts_mapeados:
                    continue
                post_formatado += f"id: {post.get('id')}\npost_citado: {post.get('quoted_context') or '---'}\npost: {post.get('text')}\n"

            if post_formatado == "":
                break
            
            agente = self.agentes["Categorizador"]

            for tentativa in range(3):
                try:
                    print("Iniciando processamento de categorização")
                    response = self.client.models.generate_content(
                        model=self.categorizador,
                        contents=[
                            types.Content(
                                role="user",
                                parts=[types.Part.from_text(text=f"{agente}\n\n{post_formatado}")]
                            )
                        ],
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            response_schema=TweetCategorizedBatch,
                            temperature=0.1,
                        ),
                    )

                    break

                except errors.ServerError as e:
                    if tentativa < 2:
                        metodo_atual = inspect.currentframe().f_code.co_name
                        print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                        sleep(300)
                        continue
                    raise e

            structured_data = TweetCategorizedBatch.model_validate_json(response.text)

            mapa_gemini = {str(item.id): item for item in structured_data.results}

            for post in posts:
                post_id = str(post.get("id"))

                if post_id in posts_mapeados:
                    continue
                
                # 1. Primeira checagem: o ID existe no mapa?
                if post_id in mapa_gemini:
                    item_gemini = mapa_gemini[post_id]
                    
                    # Normaliza os textos para comparação (remove espaços extras e torna minúsculo)
                    texto_original = " ".join(post.get("text", "").split()).lower()
                    texto_gemini = " ".join(item_gemini.post.split()).lower()
                    
                    # 2. Segunda checagem (Dupla Verificação): compara os primeiros 50 caracteres
                    if texto_original[:50] == texto_gemini[:50]:
                        post["category"] = item_gemini.categoria
                        post["erro"] = False  # Marca o post como consistente
                        post["detalhe_erro"] = None
                        posts_mapeados.append(post_id)
                    else:
                        # Log de alerta caso o ID bata mas o conteúdo seja totalmente diferente
                        print(f"⚠️ Alerta de inconsistência no Tweet ID {post_id}: Texto não bate 100%.")
                        post["category"] = "OFF_TOPIC"
                        post["erro"] = True  # Marca o post para revisão manual
                        post["detalhe_erro"] = f"DIVERGENCIA_TEXTO | ia_retornou: {texto_gemini}"
                else:
                    post["category"] = "OFF_TOPIC"
                    post["erro"] = True  # Marca o post para revisão manual
                    post["detalhe_erro"] = "ID_NAO_ENCONTRADO"

        return posts


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
                        model=self.resumidor,
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


if __name__ == "__main__":
    GH = Gemini_Handler()
    filename = "tweets_FlavioBolsonaro_sample.json"
    filepath = os.path.join(os.getcwd(), "data", "mock", filename)
    
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Arquivo local não encontrado em: {filepath}")

    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)

    new_data = GH.categorização_posts(data)

    folder_path = os.path.join(os.getcwd(), "data", "mock")
    os.makedirs(folder_path, exist_ok=True)  # Cria a pasta caso nao exista

    filepath = os.path.join(folder_path, "tweets_categorizados_FlavioBolsonaro_sample.json")

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(new_data, f, ensure_ascii=False, indent=4)