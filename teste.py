import inspect

def __resumo_inicial(arquivo):
    # Retorna '__resumo_inicial'
    metodo_atual = inspect.currentframe().f_code.co_name
    print(f"Executando etapa: {metodo_atual}")
    
    # ... resto do seu código

__resumo_inicial("aa")