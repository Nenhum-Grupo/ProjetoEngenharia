# código do gemini pra testar se o backfill rodou legal

import json
import boto3
from app.core.config import settings

def get_s3_client():
    """Instancia o cliente do boto3 usando os segredos do Pydantic."""
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

    return boto3.client(
        "s3",
        aws_access_key_id=aws_access_key,
        aws_secret_access_key=aws_secret_key,
        region_name=aws_region
    )


def list_s3_files(bucket_name: str, prefix: str = "2026/"):
    """Lista todos os arquivos presentes no S3 sob um determinado prefixo."""
    s3_client = get_s3_client()
    print(f"\n🔍 Buscando arquivos no S3 sob o prefixo: '{prefix}'...")

    response = s3_client.list_objects_v2(Bucket=bucket_name, Prefix=prefix)

    if "Contents" not in response:
        print("⚠️ Nenhum arquivo encontrado no S3.")
        return []

    files = [item["Key"] for item in response["Contents"]]
    print(f"✅ Encontrados {len(files)} arquivos no bucket:\n")
    for file in files:
        print(f"  📄 {file}")
    
    return files


def read_json_from_s3(bucket_name: str, s3_key: str) -> dict | list:
    """Baixa um arquivo JSON do S3 e o converte para objeto Python."""
    s3_client = get_s3_client()
    print(f"\n📖 Lendo o arquivo: s3://{bucket_name}/{s3_key}")

    response = s3_client.get_object(Bucket=bucket_name, Key=s3_key)
    content = response["Body"].read().decode("utf-8")
    
    parsed = json.loads(content)
    # Se o conteúdo estiver serializado duas vezes como string, faz o parse de novo
    if isinstance(parsed, str):
        parsed = json.loads(parsed)
        
    return parsed


def inspect_s3_data():
    bucket_name = (
        settings.bucketname.get_secret_value()
        if hasattr(settings.bucketname, "get_secret_value")
        else settings.bucketname
    )

    # 1. Lista a árvore de arquivos salvos
    arquivos = list_s3_files(bucket_name, prefix="2026/")
    
    if not arquivos:
        return

    # 2. Separa amostras de posts e resumos
    posts_sample_key = next((k for k in arquivos if "/posts/" in k), None)
    resumo_sample_key = next((k for k in arquivos if "/resumo_posts/" in k or "/resumos/" in k), None)

    # 3. Valida e exibe os posts brutos
    if posts_sample_key:
        print("\n" + "=" * 60)
        print("🔍 INSPEÇÃO: ARQUIVO DE POSTS LIMPOS")
        print("=" * 60)
        posts_data = read_json_from_s3(bucket_name, posts_sample_key)
        print(f"Total de posts no arquivo: {len(posts_data)}")
        if posts_data:
            print("\nExemplo do primeiro post:")
            print(json.dumps(posts_data[0], ensure_ascii=False, indent=2))

    # 4. Valida e exibe o resumo semanal da IA
    if resumo_sample_key:
        print("\n" + "=" * 60)
        print("🤖 INSPEÇÃO: RESUMO SEMANAL GERADO PELO GEMINI")
        print("=" * 60)
        resumo_data = read_json_from_s3(bucket_name, resumo_sample_key)
        print(json.dumps(resumo_data, ensure_ascii=False, indent=2))

        # Checagem adicional: valida se a soma dos tópicos dá 100%
        topicos = resumo_data.get("topicos", resumo_data.get("topicoPlanoList", []))
        if topicos and isinstance(topicos, list):
            soma = sum(t.get("porcentagem", t.get("percentual", 0)) for t in topicos if isinstance(t, dict))
            print(f"\n📊 Validação Matemática dos Tópicos: Soma das porcentagens = {soma}%")


if __name__ == "__main__":
    inspect_s3_data()