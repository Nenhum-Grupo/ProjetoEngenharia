# Visualizar Índices de Coerência

[![](https://img.plantuml.biz/plantuml/svg/TLJRZjem47sFb7yOWLJ1m_x0gbfjIjiL4gkYNjGNNWPx0EyQJsexQEdVLFsK_R6EdG2Xi7cm0fuvvyoPcTo7Y3usMriMuTcu6Zrk8SIz9JczKHTNzAiXf-YHGi0rLTQi7IXoaNnPb0Mgo1u64wDHl_xb0M207o7TBVa51jCKjq950KPJj-J6wV40XWyR3l7dnaGg2v17gA9HfaON1GkT5hZ87ocYtT32JTX5pzQIp_YJw4KYEGt2qH5LTMsDmcZOmGptAN8eMXLziCqraigXDO4cJ5wgCxXmtyZl93upTE__aypPnm3lOEfM7iMjHjpoaZ6SuKuYKzKNHD-vDehd5Xqlt5UgEHXnR9zfqi_s_feDKZGr-dhMez46U_BA8faEDtVP7BY57VbZRIDrS7IgnxbbPeUHEX_B8gT8QbUrP2kqgh7efvAdwAtyeqjbSKWLb5DH0YGUoxY9Rzc0KPtESv2-1xtKcpCzCu5vttFohYmqNOMua9ATwYivZjTRPVNyFG5SqNDeK0wuLDH1b8LZ-OUb8Js0ogxPcxXbq0JADxznAoiblPRJ4ymzRzE-oTQqXOMnN44by6dHqZOTsCTdDPy6e6tTSGPWz6NvH365ztJsEjWEWUJdGRg5JozcIV3WN_-i4d_I-Tbeifd_3AGTetkPHVbq_0C0)](https://editor.plantuml.com/uml/TLJRZjem47sFb7yOWLJ1m_x0gbfjIjiL4gkYNjGNNWPx0EyQJsexQEdVLFsK_R6EdG2Xi7cm0fuvvyoPcTo7Y3usMriMuTcu6Zrk8SIz9JczKHTNzAiXf-YHGi0rLTQi7IXoaNnPb0Mgo1u64wDHl_xb0M207o7TBVa51jCKjq950KPJj-J6wV40XWyR3l7dnaGg2v17gA9HfaON1GkT5hZ87ocYtT32JTX5pzQIp_YJw4KYEGt2qH5LTMsDmcZOmGptAN8eMXLziCqraigXDO4cJ5wgCxXmtyZl93upTE__aypPnm3lOEfM7iMjHjpoaZ6SuKuYKzKNHD-vDehd5Xqlt5UgEHXnR9zfqi_s_feDKZGr-dhMez46U_BA8faEDtVP7BY57VbZRIDrS7IgnxbbPeUHEX_B8gT8QbUrP2kqgh7efvAdwAtyeqjbSKWLb5DH0YGUoxY9Rzc0KPtESv2-1xtKcpCzCu5vttFohYmqNOMua9ATwYivZjTRPVNyFG5SqNDeK0wuLDH1b8LZ-OUb8Js0ogxPcxXbq0JADxznAoiblPRJ4ymzRzE-oTQqXOMnN44by6dHqZOTsCTdDPy6e6tTSGPWz6NvH365ztJsEjWEWUJdGRg5JozcIV3WN_-i4d_I-Tbeifd_3AGTetkPHVbq_0C0)

---
## Codificação do Diagrama
```plantuml
@startuml
skinparam style strictuml
skinparam sequenceMessageAlign center

actor "Cidadão" as User
box "Interfaces (Inbound)" #GhostWhite
    participant "CandidatoDetalhe\nController" as Ctrl
end box
box "Application Layer" #AliceBlue
    participant "AnaliseCoerencia\nService" as Service
end box
box "Ports & Infrastructure" #Lavender
    participant "TopicoPlano\nRepository" as RepoTopico
    participant "Conteudo\nRepository" as RepoMidia
end box

User -> Ctrl : verCoerencia(candidatoId)
activate Ctrl

Ctrl -> Service : calcularIndice(candidatoId)
activate Service

Service -> RepoTopico : listarPorPlano(planoId)
activate RepoTopico
RepoTopico --> Service : List<TopicoPlano>
deactivate RepoTopico

Service -> RepoMidia : listarPorCandidato(candidatoId)
activate RepoMidia
RepoMidia --> Service : List<ConteudoMidia>
deactivate RepoMidia

note over Service : Algoritmo de cruzamento\nentre Promessas (Topicos)\ne Atividades (Conteudo)

Service --> Ctrl : IndiceCoerencia (Objeto)
deactivate Service

Ctrl --> User : Exibe Gráficos de Fidelidade
deactivate Ctrl
@enduml
```
