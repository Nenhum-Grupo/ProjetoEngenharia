from app.utils.github_handler import (
    get_github_repo,
    get_github_object,
    upload_dict_to_github
)
from app.services.summarize import Gemini_Handler

# Nome da branch de staging criada para os testes
STAGING_BRANCH = "migration"

def listar_posts_recursivo(repo, branch: str = "main") -> list[str]:
    """
    Navega na árvore Git do repositório de forma recursiva e retorna 
    os caminhos de todos os arquivos de posts (2026/.../posts/*.json).
    """
    tree = repo.get_git_tree(branch, recursive=True)
    
    caminhos_posts = [
        element.path for element in tree.tree
        if element.type == "blob"
        and element.path.startswith("2026/")
        and "/posts/" in element.path
        and element.path.endswith(".json")
    ]
    
    return caminhos_posts

def reprocessar_arquivo_especifico(file_path: str, branch: str = STAGING_BRANCH):
    """
    Força a leitura de um arquivo da branch main, executa a categorização no Gemini 
    (com a nova lógica de repescagem/anti-erro) e sobrescreve na branch de staging.
    """
    print(f"🎯 Reprocessando arquivo individual: {file_path}")
    repo = get_github_repo()
    gh_gemini = Gemini_Handler()

    try:
        try:
            tweets_brutos = get_github_object(file_path, repo_instance=repo, branch=branch)
        except Exception:
            # Caso não exista na staging, lê da main
            tweets_brutos = get_github_object(file_path, repo_instance=repo, branch="main")

        if not tweets_brutos:
            print(f"⚠️ Arquivo '{file_path}' está vazio na main.")
            return

        # Limpa marcas antigas de erro se houver e executa com o algoritmo ajustado
        for t in tweets_brutos:
            t.pop("category", None)
            t.pop("erro", None)
            t.pop("detalhe_erro", None)

        tweets_categorizados = gh_gemini.categorização_posts(tweets_brutos)

        # Sobrescreve diretamente na branch de staging
        upload_dict_to_github(
            data_dict=tweets_categorizados,
            file_path=file_path,
            repo_instance=repo,
            branch=branch
        )
        print(f"✅ Arquivo {file_path} reprocessado e salvo na branch '{branch}' com sucesso!")

    except Exception as e:
        print(f"❌ Erro ao reprocessar '{file_path}': {e}")

def run_backfill():
    print("🐙 Conectando ao repositório no GitHub via PyGithub...")
    repo = get_github_repo()
    gh_gemini = Gemini_Handler()

    # 1. Garante que a branch de staging existe (cria a partir da main caso não exista)
    try:
        repo.get_git_ref(f"heads/{STAGING_BRANCH}")
        print(f"🌿 Utilizando branch de staging existente: '{STAGING_BRANCH}'")
    except Exception:
        main_ref = repo.get_git_ref("heads/main")
        repo.create_git_ref(f"refs/heads/{STAGING_BRANCH}", main_ref.object.sha)
        print(f"🌿 Branch '{STAGING_BRANCH}' criada com sucesso a partir da main.")

    # 2. Busca recursivamente todos os caminhos dos JSONs
    print("🔍 Mapeando estrutura de arquivos de posts...")
    caminhos_json = listar_posts_recursivo(repo, branch="main")
    print(f"📦 Total de {len(caminhos_json)} arquivos de posts encontrados.\n")

    # 3. Iteração pelos arquivos para categorização
    for index, file_path in enumerate(caminhos_json, start=1):
        print(f"[{index}/{len(caminhos_json)}] Processando: {file_path}")

        try:
            try:
                tweets_brutos = get_github_object(file_path, repo_instance=repo, branch=STAGING_BRANCH)
            except Exception:
                # Se o arquivo ainda não existir na staging, lê da main
                tweets_brutos = get_github_object(file_path, repo_instance=repo, branch="main")
            
            if not tweets_brutos:
                print(f"  ⚠️ Arquivo vazio em '{file_path}'. Pulando...")
                continue

            if "category" in tweets_brutos[0]:
                print(f"  ⏭️ Arquivo já categorizado em staging. Pulando para o próximo...")
                continue

            # Executa a categorização em lote no Gemini (com retries e fallback automáticos)
            tweets_categorizados = gh_gemini.categorização_posts(tweets_brutos)

            # Salva o arquivo atualizado diretamente na branch de staging
            upload_dict_to_github(
                data_dict=tweets_categorizados,
                file_path=file_path,
                repo_instance=repo,
                branch=STAGING_BRANCH
            )

        except Exception as e:
            print(f"  ❌ Erro ao processar '{file_path}': {e}")
            continue

    print(f"\n🎉 Processamento concluído! Verifique os dados salvos na branch '{STAGING_BRANCH}'.")

if __name__ == "__main__":
    # Para reprocessar APENAS o arquivo que deu desalinhamento no Lula:
    arquivo_problema = "2026/Lula/posts/2026-10-24_a_2026-10-31.json"
    reprocessar_arquivo_especifico(arquivo_problema)

    # Para rodar a migração completa do repositório (com skip automático do que já está pronto):
    # run_backfill()