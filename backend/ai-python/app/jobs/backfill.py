from botocore.exceptions import ClientError
import boto3
import json

from app.services.twitter_scraper import SocialMedia_Handler
from app.services.summarize import Gemini_Handler
from app.core.config import settings


def upload_dict_to_s3(data_dict: dict, s3_key: str, bucket_name: str):
    """
    Envia um dicionário Python diretamente para o S3 como arquivo .json limpo.

    :param data_dict: Dicionário com o conteúdo a ser salvo.
    :param s3_key: nome do arquivo a ser salvo (com "pasta").
    :param bucket_name: nome do bucket S3 usado.
    """

    aws_access_key = (
        settings.aws_access_key_id.get_secret_value()
        if hasattr(settings.aws_access_key_id, "get_secret_value")
        else settings.aws_access_key_id
    )
    aws_secret_key = (
        settings.aws_secret_access_key.get_secret_value()
        if hasattr(settings.aws_secret_access_key, "get_secret_value")
        else settings.aws_secret_access_key
    )
    aws_region = getattr(settings, "aws_region", "us-east-1")

    # Inicializa o cliente do S3 injetando as chaves do .env
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region
    )

    json_bytes = json.dumps(data_dict, ensure_ascii=False, indent=4).encode("utf-8")

    try: 
        s3_client.put_object(
            Bucket=bucket_name,
            Key=s3_key,
            Body=json_bytes,
            ContentType="application/json; charset=utf-8"
        )
        print(f"[S3] Enviado com sucesso para s3://bucket_name/{s3_key}")
    except ClientError as e:
        print(f"[S3] Erro ao enviar '{s3_key}: {e}")

def run_backfill():
    bucket_name = (
        settings.bucketname.get_secret_value()
        if hasattr(settings.bucketname, "get_secret_value")
        else settings.bucketname
    )

    social_handler = SocialMedia_Handler()
    gemini_handler = Gemini_Handler()

    semanas =  [
        ("2026-08-01_00:00:00_UTC", "2026-08-08_00:00:00_UTC"),
        ("2026-08-08_00:00:00_UTC", "2026-08-15_00:00:00_UTC"),
        ("2026-08-15_00:00:00_UTC", "2026-08-22_00:00:00_UTC"),
        ("2026-08-22_00:00:00_UTC", "2026-08-29_00:00:00_UTC"),
        ("2026-08-29_00:00:00_UTC", "2026-09-05_00:00:00_UTC"),
        ("2026-09-05_00:00:00_UTC", "2026-09-12_00:00:00_UTC"),
        ("2026-09-12_00:00:00_UTC", "2026-09-19_00:00:00_UTC"),
        ("2026-09-19_00:00:00_UTC", "2026-09-26_00:00:00_UTC"),
    ]

    print("Iniciando backfill de dados")

    for nome, handle in social_handler.candidatos:
        candidato_pasta = nome.replace(" ", "")
        print(f"\n Processado candidato: {nome} (@{handle})")

        for since, until in semanas:
            dt_inicio = since.split("_")[0]
            dt_fim = until.split("_")[0]
            filename = f"{dt_inicio}_a_{dt_fim}.json"

            print(f"\nPeriodo: {filename}")

            # Scraping e Limpeza tweets

            try:
                raw_tweets = social_handler.fetch_tweets_for_candidate(handle, since, until)
                clean_tweets = social_handler.clean_and_filter_tweets(raw_tweets)
            except Exception as e:
                print(f"Erro ao coletr tweets para @{handle} no periodo {filename}: {e}")
                continue

            if not clean_tweets:
                print(f"Nenhum tweet relevante encontrado para @{handle} no periodo {filename}")
                continue

            # Upload posts

            s3_key_posts = _build_s3_key(
                ano="2026",
                candidato=candidato_pasta,
                subpasta="posts",
                filename=filename
            )
            upload_dict_to_s3(clean_tweets, s3_key_posts, bucket_name)

            # Formatação e chamada da IA
            posts_str, intervalo = social_handler.format_tweets_for_gemini(clean_tweets)

            print("Solicitando resumo semanal ao Gemini...")
            try:
                resumo_raw = gemini_handler.Resumo_Redes(intervalo, posts_str)

                # Garantia de que resumo_dict seja um dict nativo Python
                if isinstance(resumo_raw, str):
                    # Limpa eventuais marcadores ```json do Gemini antes de converter
                    clean_str = resumo_raw.strip().removeprefix("```json").removesuffix("```").strip()
                    resumo_dict = json.loads(clean_str)
                else:
                    resumo_dict = resumo_raw

            except Exception as e:
                print(f"Erro ao gerar resumo com Gemini para @{handle} no periodo {filename}")
                continue

            s3_key_resumo = _build_s3_key(
                ano="2026",
                candidato=candidato_pasta,
                subpasta="resumo_posts",
                filename=filename
            )
            upload_dict_to_s3(resumo_dict, s3_key_resumo, bucket_name)

    print("Backfill finalizado")

def _build_s3_key(ano:str, candidato: str, subpasta: str, filename: str) -> str:
    """
    Gera a chave e enxuta para o S3.
    
    :return key: exemplo: 
    """
    return f"{ano}/{candidato}/{subpasta}/{filename}"

if __name__ == "__main__":
    run_backfill()