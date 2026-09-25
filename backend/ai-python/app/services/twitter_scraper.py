import json

from app.utils.date_discover import discover_timePeriod
from app.core.config import settings

import os
from apify_client import ApifyClient

from app.services.summarize import gemini_handler

# Posteriormente criar uma pasta no S3 (no SQL) ou um projeto no NeonTech (postgreeSQL) para conseguir o perfil dos candidatos
candidatos_v0 = ["FlavioBolsonaro", "LulaOficial"]

ACTOR_ID = "kaitoeasyapi/twitter-x-data-tweet-scraper-pay-per-result-cheapest"


def fetch_tweets_for_candidate(candidate_handle: str, since: str, until: str) -> list[dict]:
    """
    Dispara o Actor no Apify para raspar tweets de um candidato em um intervalo de tempo de 24 horas 
    e devolve uma lista com os tweets brutos encontrados.

    :param candidate_handle: perfil do candidato (sem o @)
    :param since: discover_timePeriod()[0] -> string de tempo indicando o momento em que começamos a buscar tweets (dia anterior, 00:00)
    :param until: discover_timePeriod()[1] -> string de tempo indicando o momento em que paramos de buscar tweets (hoje, 00:00)
    :return posts: lista com os tweets brutos encontrados.
    """

    client = ApifyClient(settings.api_twitter.get_secret_value())

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
        "maxItems": 30, # Trava de segurança para não explodir os créditos
        "include:nativeretweets": False
    }

    # Debug - pode ser removido posteriormente
    print(f"Iniciando busca para @{candidate_handle} ({since} ate {until})...")

    run = client.actor(ACTOR_ID).call(run_input=run_input)

    dataset_items = client.dataset(run.default_dataset_id).list_items().items

    print(f"Coleta concluida! {len(dataset_items)} tweets encontrados para @{candidate_handle}.")

    return dataset_items

def clean_and_filter_tweets(raw_dataset_items: list[dict]) -> list[dict]:
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

def save_tweets_to_json(data: list[dict], filename: str) -> str:
    """
    Salva uma lista de dicionarios em um arquivo JSON local na pasta 'data/mock'.

    :param data: dados a serem salvos (tweets filtrados)
    :param filename: nome do arquivo com extensao .json
    :return filepath: caminho completo do arquivo salvo
    """

    #data.reverse()  # Inverte a lista para que os tweets mais antigos fiquem no topo do arquivo

    folder_path = os.path.join(os.getcwd(), "data", "mock")
    os.makedirs(folder_path, exist_ok=True)  # Cria a pasta caso nao exista

    filepath = os.path.join(folder_path, filename)

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

    print(f"💾 Arquivo salvo com sucesso em: {filepath}")
    return filepath


def load_tweets_from_json(filename: str) -> list[dict]:
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
    print(f"Transformando dados para processamento...")

    # Inverte a lista para que os tweets mais antigos fiquem no topo do arquivo 
        # (para arquivo de testes salvo antes da modificação do código, que já inverte os dados ao salvar)
    data.reverse()

    posts = []

    for item in data:
        text = ""
        if item.get("quoted_context"):
            text = f'Post citado: "{item.get("quoted_context")}"\n'

        text += f'Post: {item["text"]}'

        posts.append(text)

    intervalo = [data[0]["created_at"], data[-1]["created_at"]]

    posts = str(posts)
        


    return posts, intervalo

if __name__ == "__main__":
    # Controle de testes:
    # Se MOCK_MODE = False -> Faz a requisicao real no Apify e salva o JSON
    # Se MOCK_MODE = True  -> Le direto do arquivo local sem gastar creditos no Apify
    MOCK_MODE = True
    intervalo = None
    
    candidate = candidatos_v0[0]
    mock_filename = f"tweets_{candidate}_sample.json"
    resumo_filename = f"resumo_{candidate}_sample.json"

    if not MOCK_MODE:
        #since_str, until_str = discover_timePeriod()
        since_str, until_str = "2026-08-01_00:00:00_UTC", "2026-08-08_00:00:00_UTC"
        resultado = fetch_tweets_for_candidate(candidate, since_str, until_str)
        resultado_filtrado = clean_and_filter_tweets(resultado)

        # Salva o resultado limpo localmente
        save_tweets_to_json(resultado_filtrado, mock_filename)
    else:
        # Modo Offline: Le o JSON existente
        resultado_filtrado, intervalo = load_tweets_from_json(mock_filename)

    print(intervalo, resultado_filtrado, sep="\n\n")

    GH = gemini_handler()
    json_resumo = GH.Resumo_Redes(intervalo, resultado_filtrado)
    json_resumo = json.loads(json_resumo)
    save_tweets_to_json(json_resumo, resumo_filename)