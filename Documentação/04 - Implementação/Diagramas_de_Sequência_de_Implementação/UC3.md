# Consultar Resumos de Interação na Mídia
![](https://www.plantuml.com/plantuml/png/TPF1RjDE4CRlVefHUlYd-YjAg3XLLTGqG1LegPM0Uk4oyGx9YCsksLrNBOY7GHmuyHHvCSQREEwwvLArzVVzlcyyutCVq8LgepF_XKs93ZVWmuCc-Ucuw3wXhnMPWgx9UrpHHFFAG44ca7kaoeN81PTeGevAiLd1oz7ppw_PtB8AQtYHA2xiVUCy6MKP5i4ww4rPeTh-iZr03n-zP6PBUm-zDyvA0wDwS2IyC7M4cwniGre5tDBoa-bFqIXX1PkJ-ymwbr6E8pJgibeeu3rzPeAei20F_PbPsagUJlAP68ukrzQ7spK7IkCE_5SKKAzfAbHdjIONKwR1wKx8f2mr5nZO6hZ21t92dyX_w49N7VYSVBMnkVLSY1etP89TaBiJSQJlV-y4vDO56Q0Tfkv_XNUY8jTfRqLKAJkdKaA2TG-HM_y9PsVS4CRZr3QRDCrSY8RP99MtZVw3mM00KtIELhi1W8s0K8D2ABS_LsomrcJrbc4mtYq6Jg5kxj4TDCf2qRpi-apu3WFjrxZp3CGTAQT0zxmaE3HgCZD5gRCfE9ThPy_Rtt9pakJ1nG4zA88oUV_FTlLMYoIWs_iY8lNvRkUcz3WUYK0kNt-08POyF8pfXzzP_HXsGCDTHikBHvP5Yj3sHo70PUKBTBjL-Jo5z0yXCtNSefgBoXgA0ECrd89c7z39oWyd_pmZwhDe6YHrhWHmbjR8gwNcmevbBuazoPzDnBmYrupIxxoFDbgacQZJs4LmR5RGNsp_c42UGA47LiGeJaMFlMrgivNMFl_dOXFAdj2iuz6Dd8n6SFCE_eUtYvltOadNz_I4NVnU-Hlkoq8fHUelaFtJCpuNSRNHVm40)

---
## Codificação do Diagrama
```plantuml
@startuml
skinparam style strictuml
skinparam sequenceMessageAlign center
skinparam ParticipantPadding 40
skinparam ParticipantMinWidth 140
skinparam BoxPadding 20

actor "Cidadão" as User

box "Frontend" #MintCream
participant "Frontend Web\n(CandidatoPerfilPage)" as Front
end box

box "Interfaces (Inbound API)" #GhostWhite
participant "CandidatoDetalheController" as Ctrl
end box

box "Application Layer" #AliceBlue
participant "ResumoPosicionamentoService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "ConteudoRepository" as Repo <<interface>>
participant "IAResumoPort" as IA <<interface>>
end box

' --- Carregamento inicial da página ---
User -> Front : acessar página do candidato
activate Front
Front --> User : exibe interface inicial
deactivate Front

' --- Requisição dos resumos de posicionamento ---
User -> Front : solicitar resumo dos posicionamentos
activate Front

Front -> Ctrl : GET /api/candidatos/{id}/posicionamentos/resumo
activate Ctrl

Ctrl -> Service : buscarResumosPosicionamentos(candidatoId)
activate Service

Service -> Repo : listarPorCandidato(candidatoId)
activate Repo
Repo --> Service : List<PosicionamentoPublico>
deactivate Repo

Service -> IA : gerarResumo(posicionamentos)
activate IA
IA --> Service : String (Síntese das ideias)
deactivate IA

Service --> Ctrl : String (Resumo dos posicionamentos)
deactivate Service

Ctrl --> Front : 200 OK + JSON
deactivate Ctrl

Front --> User : renderiza ideias principais
deactivate Front

@enduml
```
