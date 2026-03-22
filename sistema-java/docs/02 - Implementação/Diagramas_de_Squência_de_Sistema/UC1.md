# Visualizar Espectro Político
[![](https://img.plantuml.biz/plantuml/svg/ZLInRjim4Dq5w1yExb1dCDAXan4OKPqq4E34WjiaNS_InIPAaof9kKcBJXtw8Ptx0rtzOpqoaYB5DTf582M-z-xUFUhKEZIksiWuiX-5Aj7W1gnxaCHF8_AzJ_If8fNJ9LcBAqgaM2d8IJaotMCPaufSbAXSXaKXr0fUlugZECBSQGE3gIYmsFtK0q0BrzQ3usYfxs5m8-Wp33D3badH2QrWXWzaZWRmub8eDpM4cpWgdmIO3LN1X4vdPEw4z1I1s2_YY5G1JDqgfBxOEyp9mZ1LIrsfmfDVhBLrjslXw13x6JcKQvfgvOoMaamGcJeZzqMIifGYxzJF2cnMJczajISWqLfnnyTprEUsf9pvtv7Pyl4WKQ_tLJ9jNEYYwSWtCiCjd_EMzbMuRAeAlQ1IMy5JU0ZSVWid9wAXc4nwCYzXD1h1rVmcWVJg_VaYsVtOVP_pEfscoSn_Z2C_FnXDWXCm1b-7HGFNYnaSbs4Ynrz5yIqCNspHKUrP70K48yFGno0KLujIV47ZtmoFEf37MOQ3eoUjwHetM20K14cMnb51pm2D1aD2cMFWM1bQ8VmbD3ryK-EZ0szdrn_cC5-a5-aLzpticd6Mm4rwVdlKTwFkYUx5KfXcgiEyKKsB_UwQ_jhsjlHFv7ChwwmmE6zZPGw1ss35KODZYX29CKZX_mqSiTQfGpGUu3a2SDGhOiOa9na7BkURW1isNsVLaY-2dlJSRYYKvetclfzgInH7mY9e2sMFYFUxtu7BCfU6jZeW3WJdUICKWgsGtM6DbJO26pipBGNV3VqOTg_QCw6JiCF8JlaT8zkyrG7uFu9cZ6t0wxIQS9NzZG2gyUo2tFtQOsWYTCe8_cd_0G00)](https://editor.plantuml.com/uml/ZLInRjim4Dq5w1yExb1dCDAXan4OKPqq4E34WjiaNS_InIPAaof9kKcBJXtw8Ptx0rtzOpqoaYB5DTf582M-z-xUFUhKEZIksiWuiX-5Aj7W1gnxaCHF8_AzJ_If8fNJ9LcBAqgaM2d8IJaotMCPaufSbAXSXaKXr0fUlugZECBSQGE3gIYmsFtK0q0BrzQ3usYfxs5m8-Wp33D3badH2QrWXWzaZWRmub8eDpM4cpWgdmIO3LN1X4vdPEw4z1I1s2_YY5G1JDqgfBxOEyp9mZ1LIrsfmfDVhBLrjslXw13x6JcKQvfgvOoMaamGcJeZzqMIifGYxzJF2cnMJczajISWqLfnnyTprEUsf9pvtv7Pyl4WKQ_tLJ9jNEYYwSWtCiCjd_EMzbMuRAeAlQ1IMy5JU0ZSVWid9wAXc4nwCYzXD1h1rVmcWVJg_VaYsVtOVP_pEfscoSn_Z2C_FnXDWXCm1b-7HGFNYnaSbs4Ynrz5yIqCNspHKUrP70K48yFGno0KLujIV47ZtmoFEf37MOQ3eoUjwHetM20K14cMnb51pm2D1aD2cMFWM1bQ8VmbD3ryK-EZ0szdrn_cC5-a5-aLzpticd6Mm4rwVdlKTwFkYUx5KfXcgiEyKKsB_UwQ_jhsjlHFv7ChwwmmE6zZPGw1ss35KODZYX29CKZX_mqSiTQfGpGUu3a2SDGhOiOa9na7BkURW1isNsVLaY-2dlJSRYYKvetclfzgInH7mY9e2sMFYFUxtu7BCfU6jZeW3WJdUICKWgsGtM6DbJO26pipBGNV3VqOTg_QCw6JiCF8JlaT8zkyrG7uFu9cZ6t0wxIQS9NzZG2gyUo2tFtQOsWYTCe8_cd_0G00)

---
## Codificação do Diagrama
```plantuml
@startuml
skinparam style strictuml
skinparam sequenceMessageAlign center
skinparam ParticipantPadding 40

actor "Cidadão" as User

box "View (Presentation Layer)" #MintCream
participant "CandidatoPerfilView" as View
end box

box "Interfaces (Inbound)" #GhostWhite
participant "CandidatoDetalheController" as Ctrl
end box

box "Application Layer" #AliceBlue
participant "ClassificacaoEspectroService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "ConteudoRepository" as Repo <<interface>>
end box

' --- NOVA INTERAÇÃO INICIAL ---
User -> Ctrl : acessar URL /perfil/{id}
activate Ctrl

Ctrl -> View : inicializarView()
activate View
View --> Ctrl : Chamada de API
deactivate View

Ctrl --> User : entrega CandidatoPerfilView
deactivate Ctrl

' --- FLUXO ORIGINAL (INTERAÇÃO DA VIEW) ---
User -> View : exibirEspectro(candidatoId)
activate View

View -> Ctrl : verEspectro(candidatoId)
activate Ctrl

Ctrl -> Service : classificar(candidatoId)
activate Service

Service -> Repo : listarPorCandidato(candidatoId)
activate Repo

Repo --> Service : List<PosicionamentoPublico>
deactivate Repo

note over Service
Analisa os posicionamentos públicos
do candidato e determina sua
CategoriaEspectroPolitico
end note

Service --> Ctrl : CategoriaEspectroPolitico
deactivate Service

Ctrl --> View : CategoriaEspectroPolitico
deactivate Ctrl

View --> User : renderizar espectro político
deactivate View

@enduml
```
