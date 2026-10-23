import json
import base64
from github import Github, GithubException
from app.core.config import settings


def _unwrap_secret(val):
    if hasattr(val, "get_secret_value"):
        return val.get_secret_value()
    return str(val) if val is not None else ""


def get_github_repo():
    """Instancia a conexão com o repositório do GitHub."""
    token = _unwrap_secret(getattr(settings, "token_github", None))
    repo_name = _unwrap_secret(getattr(settings, "repo_github", None))  # ex: "usuario/tcc-storage"
    
    g = Github(token)
    return g.get_repo(repo_name)


def upload_dict_to_github(data_dict: list | dict, file_path: str, repo_instance=None):
    """
    Envia um dicionário/lista formatado como JSON para um caminho específico no repositório.
    Atualiza o arquivo se ele já existir (sobrescrita limpa equivalente ao S3).
    """
    repo = repo_instance or get_github_repo()
    json_str = json.dumps(data_dict, ensure_ascii=False, indent=4)
    commit_message = f"chore(data): upsert {file_path}"

    try:
        # Tenta buscar o arquivo existente para pegar o SHA (necessário para sobrescrever)
        existing_file = repo.get_contents(file_path)
        repo.update_file(
            path=file_path,
            message=commit_message,
            content=json_str,
            sha=existing_file.sha,
            branch="main"
        )
        print(f"  🐙 [GitHub] Arquivo atualizado: {file_path}")

    except GithubException as e:
        if e.status == 404:
            # O arquivo não existe, cria um novo
            repo.create_file(
                path=file_path,
                message=commit_message,
                content=json_str,
                branch="main"
            )
            print(f"  🐙 [GitHub] Arquivo criado: {file_path}")
        else:
            print(f"  ❌ [GitHub] Erro ao salvar '{file_path}': {e}")
            raise e


def get_github_object(file_path: str, repo_instance=None) -> list | dict:
    """
    Lê um arquivo JSON do repositório privado do GitHub e o converte para objeto Python.
    """
    repo = repo_instance or get_github_repo()
    
    try:
        content_file = repo.get_contents(file_path)
        # O GitHub retorna o conteúdo em base64
        decoded_bytes = base64.b64decode(content_file.content)
        json_str = decoded_bytes.decode("utf-8")
        
        parsed = json.loads(json_str)
        if isinstance(parsed, str):
            parsed = json.loads(parsed)
            
        return parsed
    except GithubException as e:
        print(f"  ❌ [GitHub] Erro ao buscar '{file_path}': {e}")
        raise e


def build_storage_key(ano: str, candidato: str, subpasta: str, filename: str) -> str:
    """Mantém a mesma estrutura de diretórios do S3."""
    return f"{ano}/{candidato}/{subpasta}/{filename}"