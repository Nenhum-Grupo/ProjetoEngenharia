from datetime import datetime, timezone, timedelta

def discover_timePeriod():
    '''
    Gera strings com o intervalo de busca de tweets para o scraping no twitter via API do apify
    :return: tupla. ex: ("2026-07-26_04:00:00_UTC", "2026-07-27_04:00:00_UTC") ([since], [until])
    '''

    agora_utc = datetime.now(timezone.utc)
    
    hoje_meia_noite = agora_utc.replace(hour=0, minute=0, second=0, microsecond=0)

    
    until = hoje_meia_noite
    since = until - timedelta(days=1)

    
    since_str = since.strftime('%Y-%m-%d_%H:%M:%S_UTC')
    until_str = until.strftime('%Y-%m-%d_%H:%M:%S_UTC')


    return (since_str, until_str)

if __name__ == "__main__":
    print(discover_timePeriod())