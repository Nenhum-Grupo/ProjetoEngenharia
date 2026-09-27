import json

from app.utils.date_discover import discover_timePeriod
from app.core.config import settings

import os
import psycopg
from apify_client import ApifyClient

from app.services.summarize import Gemini_Handler

class SocialMedia_Handler():
    def __init__(self, ano=2026):
        self.ACTOR_ID = "kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest"
        DB_URL = settings.database_url.get_secret_value()

        self.candidatos = self._get_handles_ano(DB_URL, ano) # Temporário - Ideal seria ter as contas em algum BD

        self.client = ApifyClient(settings.api_twitter.get_secret_value())

    def fetch_tweets_for_candidate(self, candidate_handle: str, since: str, until: str) -> list[dict]:
        """
        Dispara o Actor no Apify para raspar tweets de um candidato em um intervalo de tempo de 24 horas 
        e devolve uma lista com os tweets brutos encontrados.

        :param candidate_handle: perfil do candidato (sem o @)
        :param since: discover_timePeriod()[0] -> string de tempo indicando o momento em que começamos a buscar tweets (dia anterior, 00:00)
        :param until: discover_timePeriod()[1] -> string de tempo indicando o momento em que paramos de buscar tweets (hoje, 00:00)
        :return posts: lista com os tweets brutos encontrados.
        """

        search_query = f"from:{candidate_handle} since:{since} until:{until}"

        # Se a resposta for aprovada como adequada (número okay de posts retornados), remover maxItems (para pegar todos os posts)
            # Se não, trocar o maxItems por um número mais adequado (preferencialmente:
            # (2000/3) / número de candidatos)
                # motivo: 1000 posts são 0.25 dólares, temos 5 dólares por mês
                # por mês, podemos pegar 20000 posts
                # dividimos 20000 por 30, para pegar quantos posts são permitidos por dia
                # dividimos o resultado pelo número de candidatos, para saber quantos posts podemos pegar por candidato por dia
        run_input = {
            "searchTerms": [search_query],
            "queryType": "Latest",
            #"maxItems": 30, # Trava de segurança para não explodir os créditos - julgado desnecessário no momento
            "include:nativeretweets": False
        }

        # Debug - pode ser removido posteriormente
        print(f"Iniciando busca para @{candidate_handle} ({since} ateh {until})...")

        run = self.client.actor(self.ACTOR_ID).call(run_input=run_input)

        dataset_items = self.client.dataset(run.default_dataset_id).list_items().items

        print(f"Coleta concluida! {len(dataset_items)} tweets encontrados para @{candidate_handle}.")

        return dataset_items

    def clean_and_filter_tweets(self, raw_dataset_items: list[dict]) -> list[dict]:
        """
        Filtra o dataset bruto retornado pelo Apify, removendo avisos do scraper,
        tweets vazios e estruturando apenas as informações essenciais.

        :param raw_dataset_items: lista de dicionários com os metadados brutos retornados pelo Apify
        :return clean_tweets: lista de dicionários contendo os tweets filtrados e higienizados (id, url, texto, métricas)
        """
        clean_tweets = []

        for item in raw_dataset_items:
            # ignorando avisos/mocks do KaitoEasyAPI
            if item.get("type") == "mock_tweet" or item.get("id") == -1:
                continue
                
            # garantindo que e um tweet valido e possui texto
            tweet_text = item.get("text", "").strip()
            if not tweet_text:
                continue

            # extraindo campos interessantes ao projeto
            tweet_data = {
                "id": item.get("id"),
                "url": item.get("url"),
                "created_at": item.get("createdAt"),
                "text": tweet_text,
                "metrics": {
                    "likes": item.get("likeCount", 0),
                    "retweets": item.get("retweetCount", 0)
                }
            }

            # 4. se for um tweet citado (Quote Tweet), adicionamos o texto citado como contexto
            quoted = item.get("quoted_tweet")
            if quoted and isinstance(quoted, dict):
                tweet_data["quoted_context"] = quoted.get("text", "")

            clean_tweets.append(tweet_data)

        return clean_tweets

    def format_tweets_for_gemini(self, clean_tweets: list[dict]) -> tuple[str, list[str]]:
        """
        Formata a lista de tweets higienizados para a estrutura esperada no prompt do Gemini.

        :param clean_tweets: Lista de dicionário retornada pelo método load_tweets_from_json.
        :return posts: String no formato: '[{text do post 1}, {text do post 2}, ...]'.
        :return intervalo: Lista de strings contendo: [{Data do primeiro tweet}, {Data do segundo tweet}.
        """
        print(f"Transformando dados para processamento...")
        
        if not clean_tweets:
            return "[]", ["", ""]

        # Inverte a lista para que os tweets mais antigos fiquem no topo do arquivo 
        tweets_ordenados = list(reversed(clean_tweets))

        posts = []
        for item in tweets_ordenados:
            text = ""
            if item.get("quoted_context"):
                text = f'Post citado: "{item.get("quoted_context")}"\n'
                
            text += f'Post: {item["text"]}'

            posts.append(text)

        intervalo = [tweets_ordenados[0]["created_at"], tweets_ordenados[-1]["created_at"]]


        return str(posts), intervalo

    def save_to_json(self, data: list[dict], filename: str) -> str:
        """
        Salva uma lista de dicionarios em um arquivo JSON local na pasta 'data/mock'.

        :param data: dados a serem salvos (tweets filtrados)
        :param filename: nome do arquivo com extensao .json
        :return filepath: caminho completo do arquivo salvo
        """

        folder_path = os.path.join(os.getcwd(), "data", "mock")
        os.makedirs(folder_path, exist_ok=True)  # Cria a pasta caso nao exista

        filepath = os.path.join(folder_path, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=4)

        print(f"💾 Arquivo salvo com sucesso em: {filepath}")
        return filepath

    def load_tweets_from_json(self, filename: str) -> list[dict]:
        """
        Carrega dados de um arquivo JSON local para testes sem consumo de API.

        :param filename: nome do arquivo na pasta 'data/mock'
        :return data: lista de dicionarios contendo os tweets
        """
        filepath = os.path.join(os.getcwd(), "data", "mock", filename)

        if not os.path.exists(filepath):
            raise FileNotFoundError(f"Arquivo local não encontrado em: {filepath}")

        with open(filepath, "r", encoding="utf-8") as f:
            data = json.load(f)

        print(f"📂 Dados carregados localmente de: {filepath} ({len(data)} itens)")
        return data

    def _get_handles_ano(self, DB_URL: str, ano: int) -> list[str]:
        query = """
            SELECT c.nome, t.username
            FROM candidato c
            INNER JOIN candidato_twitter t on c.id = t.candidato_id
            INNER JOIN monitoramento_ano m ON c.id = m.candidato_id
            WHERE m.ano = %s;
        """

        with psycopg.connect(DB_URL) as conn:
            with conn.cursor() as cur:
                cur.execute(query, (ano,))

                rows = cur.fetchall()

        return rows


if __name__ == "__main__":
    # Controle de testes:
    # Se MOCK_MODE = False -> Faz a requisicao real no Apify e salva o JSON
    # Se MOCK_MODE = True  -> Le direto do arquivo local sem gastar creditos no Apify
    MOCK_MODE = True
    intervalo = None

    SMH = SocialMedia_Handler()
    
    candidate = SMH.candidatos[0][1] # candidatos[0] = ("Flavio Bolsonaro", "FlavioBolsonaro"), FlavioBolsonaro é o @
    mock_filename = f"tweets_{candidate}_sample.json"
    resumo_filename = f"resumo_{candidate}_sample.json"

    if not MOCK_MODE:
        #since_str, until_str = discover_timePeriod()
        since_str, until_str = "2026-08-01_00:00:00_UTC", "2026-08-08_00:00:00_UTC"
        resultado = SMH.fetch_tweets_for_candidate(candidate, since_str, until_str)
        resultado_filtrado = SMH.clean_and_filter_tweets(resultado)

        # Salva o resultado limpo localmente
        SMH.save_tweets_to_json(resultado_filtrado, mock_filename)
    else:
        # Modo Offline: Le o JSON existente
        data = SMH.load_tweets_from_json(mock_filename)
        resultado_filtrado, intervalo = SMH.format_tweets_for_gemini(data)

    print(intervalo, resultado_filtrado, sep="\n\n")

    #GH = Gemini_Handler()
    #json_resumo = GH.Resumo_Redes(intervalo, resultado_filtrado)
    #json_resumo = json.loads(json_resumo)
    #SMH.save_tweets_to_json(json_resumo, resumo_filename)