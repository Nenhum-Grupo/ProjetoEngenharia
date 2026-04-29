import os
import fitz
from pathlib import Path
from app.core.config import settings
import boto3

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

    response = s3.list_objects(Bucket=bucketName)
    if NOME_DO_ARQUIVO not in response['Contents']:
        raise "Erro: key especificada não foi encontrada"

    response = s3.get_object(Bucket=bucketName, Key=bucketKey)
    content_bytes = response['Body'].read()
    content_string = content_bytes.decode('utf-8')
    print(content_string)
    return content_string