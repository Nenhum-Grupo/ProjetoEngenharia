# Buscar Candidatos
[![](https://img.plantuml.biz/plantuml/svg/XPFDRben48NtblmE8xeXYqXjrLM4K0ABAXAHKAiswy6UmgZ6lhLzAVHr-YXziOuDbyjFaswGqSntpimPtVkKCUPsxRHAtzat674DAUySoMzaSrMY7orvGq-K4YxfmV7IWo6VAPwspKMK3JVeynojPR-43szVQ7XY_ymsh-3TUSiaR3lslHIqGfD3XC6KBTe_lyC0CC6NL8orMeGj3Buo_OJXF5AIWJ1py3337SMR0RmHbpoDX6kjcjvRrD1R4SnXnYaNWIfR7bgHjo32H_t7ikOtD9HW-EWNeVMsI7zSXPIVLvpfGdlI9eD7WsdmEGRdA5QBQOxkskAXQHoRazb5Nq8sD77jfRm8fjRbtk4pnOsqLld3-zfX7cAkytUxb1Lck96-4kM_m_b4JKWiyU-gUFaBen5t6kFncOzMvInmEwuvmXtGbXSSIyBzi6buKq_A6ynq25oh2WXOqX7G5II-mEmJrAhs2dDO-N_OCHcjEaBWkb97dlMNYbQrVdlcKlOP7Kqa0aiNq8b3lzDhsCbi-wtw35_3kYJswGbJyx-3M8_Alp22mMWJM997bygPH7U0Uq7ac_yB)](https://editor.plantuml.com/uml/XPFDRben48NtblmE8xeXYqXjrLM4K0ABAXAHKAiswy6UmgZ6lhLzAVHr-YXziOuDbyjFaswGqSntpimPtVkKCUPsxRHAtzat674DAUySoMzaSrMY7orvGq-K4YxfmV7IWo6VAPwspKMK3JVeynojPR-43szVQ7XY_ymsh-3TUSiaR3lslHIqGfD3XC6KBTe_lyC0CC6NL8orMeGj3Buo_OJXF5AIWJ1py3337SMR0RmHbpoDX6kjcjvRrD1R4SnXnYaNWIfR7bgHjo32H_t7ikOtD9HW-EWNeVMsI7zSXPIVLvpfGdlI9eD7WsdmEGRdA5QBQOxkskAXQHoRazb5Nq8sD77jfRm8fjRbtk4pnOsqLld3-zfX7cAkytUxb1Lck96-4kM_m_b4JKWiyU-gUFaBen5t6kFncOzMvInmEwuvmXtGbXSSIyBzi6buKq_A6ynq25oh2WXOqX7G5II-mEmJrAhs2dDO-N_OCHcjEaBWkb97dlMNYbQrVdlcKlOP7Kqa0aiNq8b3lzDhsCbi-wtw35_3kYJswGbJyx-3M8_Alp22mMWJM997bygPH7U0Uq7ac_yB)

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
participant "CandidatoListView" as View
end box

box "Interfaces (Inbound)" #GhostWhite
participant "BuscaCandidatoController" as Ctrl
end box

box "Application Layer" #AliceBlue
participant "ConsultaCandidatoService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "CandidatoRepository" as Repo <<interface>>
end box


User -> View : exibirListaCandidatos()
activate View

View -> Ctrl : listarCandidatos()
activate Ctrl

Ctrl -> Service : listarCandidatos()
activate Service

Service -> Repo : listar()
activate Repo
Repo --> Service : List<Candidato>
deactivate Repo

Service --> Ctrl : List<Candidato>
deactivate Service

Ctrl --> View : List<Candidato>
deactivate Ctrl

View --> User : renderizar cards de candidatos
deactivate View

@enduml
```
