import json
from github import Github, GithubException

from app.core.config import settings
from app.utils.s3_handler import _get_s3_client, _get_val


def get_github_repo():
    token = _get_val("token_github")
    repo_name = _get_val("repo_github")
    g = Github(token)
    return g.get_repo(repo_name)


def list_s3_keys_for_year(bucket_name: str, prefix: str = "2026/") -> list[str]:
    """Lista todas as chaves (caminhos de arquivos) dentro de um prefixo no S3."""
    s3_client = _get_s3_client()
    paginator = s3_client.get_paginator("list_objects_v2")

    s3_keys = []
    for page in paginator.paginate(Bucket=bucket_name, Prefix=prefix):
        if "Contents" in page:
            for obj in page["Contents"]:
                key = obj["Key"]
                if not key.endswith("/"):
                    s3_keys.append(key)

    return s3_keys


def migrate_s3_to_github(prefix: str = "2026/"):
    bucket_name = _get_val("bucket_name") or _get_val("bucketname")

    s3_client = _get_s3_client()
    github_repo = get_github_repo()

    print(f"🔍 Buscando arquivos no S3 sob o prefixo '{prefix}'...")
    s3_keys = list_s3_keys_for_year(bucket_name, prefix)

    print(f"📦 {len(s3_keys)} arquivos encontrados para migração.\n")

    for key in s3_keys:
        print(f"⏳ Processando: {key}")
        try:
            # 1. Lê o objeto do S3
            response = s3_client.get_object(Bucket=bucket_name, Key=key)
            content_bytes = response["Body"].read()

            content_str = content_bytes.decode("utf-8")
            parsed_json = json.loads(content_str)
            formatted_json_str = json.dumps(parsed_json, ensure_ascii=False, indent=4)

            # 2. Salva ou atualiza no repositório do GitHub
            commit_message = f"chore(migration): migrate {key} from S3"

            try:
                existing_file = github_repo.get_contents(key)
                github_repo.update_file(
                    path=key,
                    message=commit_message,
                    content=formatted_json_str,
                    sha=existing_file.sha,
                    branch="main"
                )
                print(f"  ✅ [GitHub] Arquivo ATUALIZADO: {key}")

            except GithubException as e:
                if e.status == 404:
                    github_repo.create_file(
                        path=key,
                        message=commit_message,
                        content=formatted_json_str,
                        branch="main"
                    )
                    print(f"  ✨ [GitHub] Arquivo CRIADO: {key}")
                else:
                    raise e

        except Exception as e:
            print(f"  ❌ Erro ao migrar '{key}': {e}")

    print("\n🎉 Migração do S3 para o GitHub concluída com sucesso!")


if __name__ == "__main__":
    migrate_s3_to_github(prefix="2026/")