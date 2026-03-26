# Visualizar Índices de Coerência
![](https://www.plantuml.com/plantuml/png/RPJ1JZit4CRlVefHE3IeYfAYdgeA4T8MfOMo0YeklKoyGpAgrrviRmHKVHZKGwLAVO5UysB_yORDnY4N2-JvVlDvvvjSX8W-DfLHuG-sDNgi8CHNGt9wreStzDoGrNH38U2IfeQN5ZJPI7wlgX0YQwxHnWBBakqIlfqSlxzX-yXbNC4tMSMbU-cKPnEbK4VdOJ3Z4ilDtsu06E2t83tLmht0u2Vln84j1t0Yl3ZpX9Mg-oPz1JpIudSxdA4jXHLTGVw9JI5FEMsXRPrAXGB-eCzjb2hK560ujmlNoEsqc8lWv6hbGdnSSQIytOx_0qKqAve9rJjZoBTTPj6RWoRJkZQiCRApS8slv8K-DQpfqZG7yAb5mq6OvCbgndloQobioHz_7y0BvwEOxn-Il5_ZMgh8v_07LxDsXK7hxgXsWQFphoqw_RkzpHNfRTIKnygxgzxELp0QZM26tjCIAxBH0Lj1eO4IeTwyBzbYgb5fl30wtqu4leDaEw3VrPGETFULKpvuZP4-vhVLZ4ITA2Ac5ruGSFV-hgSgALTs1kyavXnuyu-4JJe5CTUU1DgHt_nhDHzt6PmHSaGFQ3VlQKovwD1fP_MypOG0hdvyW37MFDuzBep_vFAlSM9GZcXZfD8fW6xqmj1eT6FGpuMWQRWZpSlJNjmbHNKwGVGZ5egOZ-WbEcqOXhMSEM4l47l2KMRbMY3VxsNgN9Lq192xw9EJ-TWjrV4NvOdB84Sy5IwmPcUt8IoQXM6Tkyjmohf8uDRaEv2QcgNp72i7pms1ziqRgjgxAiKqf7YsNqnfLq6TDGkIuV_RVY5j4kxc1Gus_xKpKtdIigodNH8t-vFhuzEElFzf4CxXmBl0x8NsR3A1sr_WQ_Zv_lPNaUG1-xnDmYx9ynl2qc_UdrWVhiRdlReGILEPBm00)

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
participant "AnaliseCoerenciaService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "TopicoPlanoRepository" as RepoTopico
participant "ConteudoRepository" as RepoConteudo
end box

' --- Carregamento inicial da página ---
User -> Front : acessar página do candidato
activate Front
Front --> User : exibe interface inicial
deactivate Front

' --- Requisição dos dados de coerência ---
User -> Front : solicitar análise de coerência
activate Front

Front -> Ctrl : GET /api/candidatos/{id}/coerencia
activate Ctrl

Ctrl -> Service : calcularIndice(candidatoId)
activate Service

Service -> RepoTopico : listarPorPlano(planoId)
activate RepoTopico
RepoTopico --> Service : List<TopicoPlano>
deactivate RepoTopico

Service -> RepoConteudo : listarPorCandidato(candidatoId)
activate RepoConteudo
RepoConteudo --> Service : List<PosicionamentoPublico>
deactivate RepoConteudo

note over Service
Algoritmo que cruza
promessas do plano
com posicionamentos públicos
para calcular o índice
de coerência do candidato
end note

Service --> Ctrl : IndiceCoerencia
deactivate Service

Ctrl --> Front : 200 OK + JSON
deactivate Ctrl

Front --> User : renderiza gráficos de coerência
deactivate Front

@enduml
```
