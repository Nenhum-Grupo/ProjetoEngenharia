from app.utils.date_discover import discover_timePeriod
from app.core.config import settings

import os
from apify_client import ApifyClient

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

if __name__ == "__main__":

    since_str, until_str = discover_timePeriod()

    resultado = fetch_tweets_for_candidate(candidatos_v0[0], since_str, until_str)

    resultado_filtrado = clean_and_filter_tweets(resultado)

    print(f"\n\ndataset_itens:\n")

    for item in resultado_filtrado:
        print(f"{item}\n")