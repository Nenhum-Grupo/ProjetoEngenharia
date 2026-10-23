import requests
import json
from app.core.config import settings

def _unwrap_secret(val):
    if hasattr(val, "get_secret_value"):
        return val.get_secret_value()
    return str(val) if val is not None else ""

def get_raw_json_from_github(file_path: str) -> list | dict | None:
    """
    Busca um arquivo JSON diretamente da URL Raw de um repositório privado ou público no GitHub.
    
    :param file_path: Caminho relativo do arquivo no repositório (ex: '2026/FlavioBolsonaro/posts/2026-08-01_a_2026-08-08.json')
    """
    token = _unwrap_secret(getattr(settings, "github_token", None))
    repo_name = _unwrap_secret(getattr(settings, "github_repo", None))  # ex: 'usuario/meu-repo-dados'
    branch = getattr(settings, "github_branch", "main")

    url = f"https://raw.githubusercontent.com/{repo_name}/{branch}/{file_path}"
    
    headers = {
        "Authorization": f"token {token}",
        "Accept": "application/vnd.github.v3.raw"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        
        if response.status_code == 200:
            return response.json()
        elif response.status_code == 404:
            print(f"⚠️ [GitHub Raw] Arquivo não encontrado: {file_path}")
            return None
        else:
            print(f"❌ [GitHub Raw] Erro HTTP {response.status_code} ao buscar {file_path}")
            return None

    except Exception as e:
        print(f"❌ [GitHub Raw] Exceção na requisição: {e}")
        return None


# =====================================================================
# EXEMPLO DE USO
# =====================================================================
if __name__ == "__main__":
    caminho_teste = "2026/FlavioBolsonaro/resumo_posts/2026-08-01_a_2026-08-08.json"
    dados = get_raw_json_from_github(caminho_teste)
    if dados:
        print("✅ Dados baixados com sucesso via RAW!")
        print(json.dumps(dados, indent=2, ensure_ascii=False)[:300])