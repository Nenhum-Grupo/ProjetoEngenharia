from app.utils.pdf_handler import PDFManager
from app.core.config import settings

from google.genai import types, errors
from google import genai
from time import sleep
import inspect
import os

class gemini_handler():
    def __init__(self, arquivo=None):
        self.arquivo = arquivo

        self.client = genai.Client(api_key=settings.google_api_key)
        self.MODEL_ID = "models/gemini-3.1-flash-lite-preview"
        self.ALT_MODEL_ID = "models/gemini-2.5-flash"
        self.agentes = {
    "analista" : """Você é um Analista de Políticas Públicas. Analise o plano de governo abaixo de forma exaustiva, identificando TODOS os temas abordados e resumindo-os em tópicos. Para cada tópico enontrado no texto, use este formato:
### [Nome do Tópico]
- [Resumo do tópico, destacando os principais pontos abordados (se estiver no texto, se não estiver, escreva "Não especificado no texto")]
- [Proposta] - [Resumo da proposta, destacando como ela será implementada (se estiver no texto, se não estiver, escreva "Não especificado no texto")] (para cada proposta encontrada, se não houver propostas, escreva "Não há propostas para este tópico")
""",
    
    "rankeador": """Você é um Auditor Técnico de Projetos. Sua tarefa é reordenar uma lista de tópicos. 
Cada tópico pode conter uma ou mais propostas.

CRITÉRIO DE PRIORIZAÇÃO (DENSIDADE TÉCNICA):
1. No topo: Tópicos onde TODAS ou a MAIORIA das propostas são detalhadas (explicam como, quando, onde ou quanto).
2. No meio: Tópicos que misturam propostas detalhadas com intenções genéricas.
3. No fim: Tópicos que contêm apenas intenções vagas ou apenas uma proposta isolada sem detalhes.

REGRA DE DESEMPATE:
Se dois tópicos possuem propostas detalhadas, aquele que apresentar a MAIOR QUANTIDADE total de informações concretas (dados, metas, prazos) deve ficar acima. 

Retorne a lista reordenada mantendo a redação original. Não adicione comentários, apenas reordene.
""",

    "resumidor": """Você é um Redator Editorial. A seguir, você receberá um plano de governo em tópicos já resumidos e propostas. Resuma cada tópico em um pequeno parágrafo, com os principais pontos do resumo do tópico e nomes das propostas mais relevantes (as mais detalhadas), certificando-se de usar uma linguagem acessível. Crie palavras chave para cada tópico, usando no máximo 3 palavras por tópico, e separe-as por vírgula. Certifique-se de que os resumos estejam na mesma ordem que o texto que você recebeu. Use o seguinte formato:
### [Ranking de relevância]. [Nome do tópico]
- [Parágrafo resumindo os principais pontos do resumo do tópico e nomes das propostas mais relevantes (se a proposta não tiver nome, nomeie-a de forma breve, usando no máximo 3 palavras)].
- [Palavras-chave]
"""
}
        
    def __resumo_inicial(self, arquivo):
        texto_extraido = PDFManager(arquivo)
        agente = self.agentes["analista"]
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente do analista
            # thinking_level: "HIGH" para garantir uma análise mais profunda e detalhada do plano de governo.
            # temperature: 0.1 para reduzir a aleatoriedade e garantir respostas mais focadas e consistentes, o que é importante para uma análise técnica de política.
        config = types.GenerateContentConfig(
            temperature=0.1,
            # thinking_config=types.ThinkingConfig(
            #     thinking_level="HIGH",
            # ),
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e
            
            break

    
    def __ranking(self, arquivo):
        texto_extraido = self.__resumo_inicial(arquivo)
        sleep(60)
        agente = self.agentes["rankeador"]
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente rankeador
            # thinking_level: "LOW" para que o ranking fique mais consistente.
            # temperature: 0.1 pois não estamos "criando" nada, apenas modificando algo que já existe
        config = types.GenerateContentConfig(
            temperature=0.1,
            # thinking_config=types.ThinkingConfig(
            #     thinking_level="LOW",
            # ),
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e
            
            break
    

    def Resumo_plano(self, arquivo=None):
        texto_extraido = self.__ranking(arquivo)
        sleep(60)
        agente = self.agentes["resumidor"]
        
        contents = [
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=f"{agente}\n\n{texto_extraido}")]
            )
        ]

        # configuração para o agente resumidor
            # thinking_level: Nenhum, para diminuir gastos
            # temperature: 0.2 criação de palavras-chave, mas ainda baixa para não inventar palavras que não tenham a ver com o tópico
        config = types.GenerateContentConfig(
            temperature=0.2,
        )

        for tentativa in range(3):
            try:
                response = self.client.models.generate_content(
                    model=self.MODEL_ID,
                    contents=contents,
                    config=config,
                )

                return response.text
            except errors.ServerError as e:
                if tentativa < 2:
                    metodo_atual = inspect.currentframe().f_code.co_name
                    print(f"Erro de servidor em: {metodo_atual}. Esperando 5 minutos.")

                    sleep(300)
                    continue
                raise e
            
            break
        
if __name__ == "__main__":
    GH = gemini_handler()
    print(GH.Resumo_plano("plano de governo lula.pdf"))
    