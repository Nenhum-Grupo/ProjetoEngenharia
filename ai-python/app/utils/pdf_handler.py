import os
import io
import fitz
from dotenv import load_dotenv
from pathlib import Path
from app.core.config import settings
from botocore.exceptions import ClientError
import boto3

load_dotenv()

def PDFManager(bucketName, bucketKey):
    s3 = boto3.client('s3')
    response = s3.list_buckets()
    achado = False
    for bucket in response['Buckets']:
        if bucket['Name'] == bucketName:
            achado = True
            break

    if not achado:
        raise "Erro: bucket especificado não foi encontrado"

    try:
        s3.head_object(Bucket=bucketName, Key=bucketKey)
    except ClientError as e:
        status_code = e.response["ResponseMetadata"]["HTTPStatusCode"]
        raise status_code
    
    

    response = s3.get_object(Bucket=bucketName, Key=bucketKey)
    content_bytes = response['Body'].read()
    # --- INÍCIO DA EXTRAÇÃO DE TEXTO DO PDF ---
    try:
        # Transforma os bytes vindos do S3 em um "arquivo virtual" na memória
        pdf_stream = io.BytesIO(content_bytes)
        
        # Abre o PDF a partir da memória
        doc = fitz.open(stream=pdf_stream, filetype="pdf")
        
        texto_extraido = ""
        
        # Itera pelas páginas para extrair o texto
        for pagina in doc:
            texto_extraido += pagina.get_text()
            
        doc.close()
        
        if not texto_extraido.strip():
            print("Aviso: O PDF parece ser composto apenas por imagens (OCR necessário).")
        
        print(texto_extraido)
        return texto_extraido[:25000]

    except Exception as e:
        raise Exception(f"Erro ao processar a estrutura do PDF: {e}")