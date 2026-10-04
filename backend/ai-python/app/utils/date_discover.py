from datetime import datetime, timezone, timedelta

def discover_currentTimePeriod():
    '''
    Gera strings com o intervalo de busca de tweets para o scraping no twitter via API do apify

    :return since: string. ex: "2026-08-01_00:00:00_UTC"
    :return until: string. ex  "2026-08-08_00:00:00_UTC"
    :return semana_str: string. ex: "2026-08-01_2026-08-08" (intervalo de busca de tweets para o scraping no twitter via API do apify)
    '''

    agora_utc = datetime.now(timezone.utc)

    ultimo_sabado = (agora_utc - timedelta(days=(agora_utc.weekday() -5) % 7)).replace(hour=0, minute=0, second=0, microsecond=0)
    sabado_anterior = ultimo_sabado - timedelta(days=7)
    
    sabado_anterior = ultimo_sabado - timedelta(days=7)

    dt_inicio = sabado_anterior.strftime("%Y-%m-%d")
    dt_fim = ultimo_sabado.strftime("%Y-%m-%d")

    since = f"{dt_inicio}_00:00:00_UTC"
    until = f"{dt_fim}_00:00:00_UTC"
    semana_str = f"{dt_inicio}_{dt_fim}"    

    return (since, until, semana_str)

def discover_previousTimePeriod(semana_str):
    '''
    Gera strings com o intervalo de busca de tweets para o scraping no twitter via API do apify

    :return: tupla. ex: ("2026-07-26_04:00:00_UTC", "2026-07-27_04:00:00_UTC") ([since], [until])
    '''

    dt_inicio_str, _ = semana_str.split("_")
    dt_inicio = datetime.strptime(dt_inicio_str, "%Y-%m-%d").replace(tzinfo=timezone.utc)

    sabado_retrasado = dt_inicio - timedelta(days=7)

    dt_ini_ant = sabado_retrasado.strftime("%Y-%m-%d")
    dt_fim_ant = dt_inicio_str

    since = f"{dt_ini_ant}_00:00:00_UTC"
    until = f"{dt_fim_ant}_00:00:00_UTC"
    semana_ant_str = f"{dt_ini_ant}_{dt_fim_ant}"

    return since, until, semana_ant_str

if __name__ == "__main__":
    data_atual = discover_currentTimePeriod()
    print(data_atual, discover_previousTimePeriod(data_atual[2]), sep="\n\n")