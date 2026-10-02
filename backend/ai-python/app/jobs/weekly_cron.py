import json
import psycopg

from app.utils.s3_handler import upload_dict_to_s3, build_s3_key, get_s3_object

from app.core.config import settings
from app.services.summarize import Gemini_Handler
from app.services.twitter_scraper import SocialMedia_Handler
from app.utils.date_discover import discover_currentTimePeriod, discover_previousTimePeriod

def get_candidatos_ano_com_id(DB_url: str, ano: int) -> list[tuple[int, str, str]]:
    """
    Retorna uma lista de dicionários com os candidatos e seus respectivos handles do Twitter para um determinado ano.

    :param DB_url: URL de conexão com o banco de dados PostgreSQL.
    :param ano: Ano para o qual se deseja obter os candidatos.
    :return: Lista de dicionários, cada um contendo 'id', 'nome' e 'handle' do candidato.
    """
    query = """
        SELECT c.id, c.nome, t.username
        FROM candidato c
        INNER JOIN candidato_twitter t ON c.id = t.candidato_id
        INNER JOIN monitoramento_ano m ON c.id = m.candidato_id
        WHERE m.ano = %s;
    """
    with psycopg.connect(DB_url) as conn:
        with conn.cursor() as cur:
            cur.execute(query, (ano,))
            rows = cur.fetchall()
            
            return rows if rows else []


def get_status_execucao(DB_url: str, candidato_id: int, semana_str: str) -> tuple[bool, bool]:
    """
    Retorna o status de execução do scraping para um determinado ano e semana.

    :param DB_url: URL de conexão com o banco de dados PostgreSQL.
    :param candidato_id: ID do candidato para o qual se deseja obter o status.
    :param semana_str: String representando a semana (ex: "2026-08-01_2026-08-08").
    :return: Tupla contendo o status de execução.
    """
    query = """
        SELECT posts, resumo
        FROM execucao_semanal
        WHERE semana = %s AND candidato_id = %s;
    """
    with psycopg.connect(DB_url) as conn:
        with conn.cursor() as cur:
            cur.execute(query, (semana_str, candidato_id))
            row = cur.fetchone()
            
            if row:
                return row[0], row[1]
            else:
                return False, False


def upsert_status_execucao(DB_url: str, candidato_id: int, semana_str: str, posts: bool, resumo: bool):
    """
    Insere ou atualiza o status de execução do scraping para um determinado ano e semana.

    :param DB_url: URL de conexão com o banco de dados PostgreSQL.
    :param candidato_id: ID do candidato para o qual se deseja atualizar o status.
    :param semana_str: String representando a semana (ex: "2026-08-01_2026-08-08").
    :param posts: Status de execução dos posts (True/False).
    :param resumo: Status de execução do resumo (True/False).
    """
    query = """
        INSERT INTO execucao_semanal (semana, candidato_id, posts, resumo, atualizado_em)
        VALUES (%s, %s, %s, %s, CURRENT_TIMESTAMP)
        ON CONFLICT (semana, candidato_id) DO UPDATE
        SET posts = EXCLUDED.posts,
            resumo = EXCLUDED.resumo,
            atualizado_em = CURRENT_TIMESTAMP;
    """
    with psycopg.connect(DB_url) as conn:
        with conn.cursor() as cur:
            cur.execute(query, (semana_str, candidato_id, posts, resumo))


def processar_semana_candidato(
    candidato_id: int,
    nome: str,
    handle: str,
    since: str,
    until: str,
    semana_str: str,
    social_handler: SocialMedia_Handler,
    gemini_handler: Gemini_Handler,
    db_url: str,
    bucketname: str,
    ano: str = "2026"
):
    """
    Processa os tweets de um candidato para uma semana específica, realizando scraping, limpeza, upload para S3 e resumo com Gemini.

    :param candidato_id: ID do candidato.
    :param nome: Nome do candidato.
    :param handle: Handle do Twitter do candidato.
    :param since: Data de início do período (ex: "2026-08-01_00:00:00_UTC").
    :param until: Data de fim do período (ex: "2026-08-08_00:00:00_UTC").
    :param semana_str: String representando a semana (ex: "2026-08-01_2026-08-08").
    :param social_handler: Instância da classe SocialMedia_Handler.
    :param gemini_handler: Instância da classe Gemini_Handler.
    :param db_url: URL de conexão com o banco de dados PostgreSQL.
    :param bucketname: Nome do bucket S3 para upload dos arquivos.
    :param ano: Ano do monitoramento (padrão é "2026").
    """

    candidato_pasta = nome.replace(" ", "")
    dt_inicio = since.split("_")[0]
    dt_fim = until.split("_")[0]
    filename = f"{dt_inicio}_a_{dt_fim}.json"


    posts_ok, resumo_ok = get_status_execucao(db_url, candidato_id, semana_str)

    if posts_ok and resumo_ok:
        print(f"Semana {semana_str} já concluída.")
        return

    clean_tweets = []
    s3_key_posts = build_s3_key(ano=ano, candidato=candidato_pasta, subpasta="posts", filename=filename)

    if not posts_ok:
        try:
            raw_tweets = social_handler.fetch_tweets_for_candidate(handle, since, until)
            clean_tweets = social_handler.clean_and_filter_tweets(raw_tweets)

            if clean_tweets:
                upload_dict_to_s3(clean_tweets, s3_key_posts, bucketname)
                posts_ok = True
                upsert_status_execucao(db_url, candidato_id, semana_str, posts=posts_ok, resumo=resumo_ok)

            else:
                print(f"Nenhum tweet relevante encontrado para @{handle} no período {filename}")
                upsert_status_execucao(db_url, candidato_id, semana_str, posts=True, resumo=resumo_ok)
                return
            
        except Exception as e:
            print(f"Erro ao coletar tweets para @{handle} no período {filename}: {e}")
            return

    if posts_ok and not resumo_ok:
        print(f"Solicitando resumo semanal ao Gemini para @{handle} no período {filename}...")
        try:
            if not clean_tweets:
                # Se os tweets limpos não foram carregados anteriormente, carregue-os do S3
                clean_tweets = get_s3_object(bucketname, s3_key_posts)
            
            posts_str, intervalo = social_handler.format_tweets_for_gemini(clean_tweets)
            resumo_raw = gemini_handler.Resumo_Redes(intervalo, posts_str)

            if isinstance(resumo_raw, str):
                clean_str = resumo_raw.strip()
                if clean_str.startswith("```"):
                    clean_str = clean_str.removeprefix("```json").removesuffix("```").strip()
                resumo_dict = json.loads(clean_str)
            else:
                resumo_dict = resumo_raw

            s3_key_resumo = build_s3_key(ano=ano, candidato=candidato_pasta, subpasta="resumo_posts", filename=filename)
            upload_dict_to_s3(resumo_dict, s3_key_resumo, bucketname)

            resumo_ok = True
            upsert_status_execucao(db_url, candidato_id, semana_str, posts=True, resumo=True)
            print(f"Semana {semana_str} processada com sucesso para @{handle}.")
        except Exception as e:
            print(f"Erro ao gerar resumo com Gemini para @{handle} no período {filename}: {e}")
            return

def run_weekly_cron():
    """
    Executa o processo de scraping, limpeza, upload e resumo para todos os candidatos monitorados na semana atual.
    """

    DB_url = settings.database_url.get_secret_value() if hasattr(settings.database_url, "get_secret_value") else settings.database_url
    bucketname = (
        settings.bucketname.get_secret_value()
        if hasattr(settings.bucketname, "get_secret_value")
        else settings.bucketname
    )

    social_handler = SocialMedia_Handler()
    gemini_handler = Gemini_Handler()

    since_atual, until_atual, semana_atual_str = discover_currentTimePeriod()
    since_ant, until_ant, semana_ant_str = discover_previousTimePeriod(semana_atual_str)

    candidatos = get_candidatos_ano_com_id(DB_url, ano=2026)

    print(f"\nIniciando processamento semanal para a semana {semana_atual_str} + {semana_ant_str} (verificação) e candidatos monitorados...\n")

    ano_atual = since_atual[:4]
    ano_anterior = since_ant[:4]

    for cand_id, nome, handle in candidatos:
        print(f"\nProcessando candidato: {nome} (@{handle})")

        posts_ant_ok, resumo_ant_ok = get_status_execucao(DB_url, cand_id, semana_ant_str)
        if not (posts_ant_ok and resumo_ant_ok):
            print(f"Semana anterior {semana_ant_str} não concluída para @{handle}. Processando...")
            processar_semana_candidato(
                candidato_id=cand_id,
                nome=nome,
                handle=handle,
                since=since_ant,
                until=until_ant,
                semana_str=semana_ant_str,
                social_handler=social_handler,
                gemini_handler=gemini_handler,
                db_url=DB_url,
                bucketname=bucketname,
                ano=ano_anterior
            )

        print(f"Processando semana atual {semana_atual_str} para @{handle}...")
        processar_semana_candidato(
            candidato_id=cand_id,
            nome=nome,
            handle=handle,
            since=since_atual,
            until=until_atual,
            semana_str=semana_atual_str,
            social_handler=social_handler,
            gemini_handler=gemini_handler,
            db_url=DB_url,
            bucketname=bucketname,
            ano=ano_atual
        )

if __name__ == "__main__":
    run_weekly_cron()