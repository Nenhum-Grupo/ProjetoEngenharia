# Visualizar Resumo de Plano de Governo


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

box "View (Presentation Layer)" #MintCream
participant "CandidatoPerfilView" as View
end box

box "Interfaces (Inbound)" #GhostWhite
participant "CandidatoDetalheController" as Ctrl
end box

box "Application Layer" #AliceBlue
participant "PlanoGovernoService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "PlanoRepository" as Repo <<interface>>
participant "IAResumoPort" as IA <<interface>>
end box


User -> View : exibirPlano(candidatoId)
activate View

View -> Ctrl : verPlano(candidatoId)
activate Ctrl

Ctrl -> Service : gerarOuBuscarResumo(candidatoId)
activate Service

Service -> Repo : buscarPorCandidatoId(candidatoId)
activate Repo
Repo --> Service : PlanoDeGoverno
deactivate Repo

alt resumo já existe
    Service --> Ctrl : String (Resumo)
else resumo inexistente
    Service -> IA : gerarResumo(plano)
    activate IA
    IA --> Service : String (Novo resumo)
    deactivate IA

    Service -> Repo : salvar(plano)
end

Service --> Ctrl : String (Resumo)
deactivate Service

Ctrl --> View : String
deactivate Ctrl

View --> User : renderizar resumo do plano
deactivate View

@enduml
```
