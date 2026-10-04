import json
import boto3
from app.core.config import settings
from botocore.exceptions import ClientError

def _get_val(setting_attr):
    """Garante o retorno de uma string pura a partir do Pydantic Settings."""
    val = getattr(settings, setting_attr, None)
    if val is not None and hasattr(val, "get_secret_value"):
        return val.get_secret_value()
    return val if val is not None else ""

def _get_s3_client():
    aws_access_key = _get_val("aws_access_key_id")
    aws_secret_key = _get_val("aws_secret_access_key")
    aws_region = _get_val("aws_region")

    return boto3.client(
        "s3",
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region
    )


def upload_dict_to_s3(data_dict: dict, s3_key: str, bucket_name: str):
    """
    Envia um dicionário Python diretamente para o S3 como arquivo .json limpo.

    :param data_dict: Dicionário com o conteúdo a ser salvo.
    :param s3_key: nome do arquivo a ser salvo (com "pasta").
    :param bucket_name: nome do bucket S3 usado.
    """

    s3_client = _get_s3_client()
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
        print(f"[S3] Erro ao enviar '{s3_key}': {e}")
        raise e


def get_s3_object(bucket_name: str, s3_key: str) -> dict | list:
    s3_client = _get_s3_client()
    response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
    return json.loads(response['Body'].read().decode('utf-8'))


def build_s3_key(ano:str, candidato: str, subpasta: str, filename: str) -> str:
    """
    Gera a chave e enxuta para o S3.
    
    :return key: exemplo: 
    """
    return f"{ano}/{candidato}/{subpasta}/{filename}"