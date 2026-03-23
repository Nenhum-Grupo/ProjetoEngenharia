# Consultar Resumos de Interação na Mídia
[![](https://img.plantuml.biz/plantuml/svg/bLMzRjim4Du5w1qExb1bCFg3JaPWH57SL80T2tRITAN5gqrK9bMISfEk7VeWdViKVh4UQScHRATe5qEcxlkvuqVgmbYcRRKkmi1y4R9acgt1sCS2wLUB_EWLVgrGvZX1OzWIuq8i9UGeBUfsMKQa8XSbapPZd0kvX7UldocO27alk5t1csx9fNfei6_fHHYmt2eDlKHmnhU_L0-OWJlZXCDWeHwWzr7WDuWoZOOCCIkKX35xH7tMWnUaOXEDR1q6vPCsiJ79YT2g3FLdKJWAJ-mUmW0b1wBUAwIkqSyiHmDHAXUgajoHNw-KiVShOV4vzYkqh5XXegJLgYXGUv74wk9O92xBGkGj_wH0WyxnigWE1MPeghNAbA4L9TcQ6bTpr1kgzWhryx58fhJrJJGDkJx6R4DrRgBTBiWrLbpDi2GXseH7p-t-mlcvQ2Y6mmDS6ZVsjFM8D3wiRzbw2Vr-7zARsz4itlxS_fZISvgayHYkHX0de_by2b7o8Px4Lx5Voj8p1ma35mBe3_quOG39YgqPPy3HrK1qFRg5LsLdHERCnqbicCLw5yB0mud6nsW0GXA05U8xqsubQaDswV25_ITXZJGRgO2qTmKS3n2D266ywG6G6urBTXBJ6DjDvltuxjCKfhFqEhtP3IMRJTrOuidevdRQ7KNT0pw8XT2dGcAYlCbcoezRQvhRzxR1_wCv76eTH69QL2PdDPdvHxPzZCEW8I9E7y015C9TOXIo_MbxZiO1mi33-XrFOw8uxth9gWMTEJNixCYEe6E2CZs09UgcfUWlIKlZCA3whlQSxbcwuwBvzZUT38CK1GE2es0Esn9tw9Rqqzuq33i3m9M1OnCjejOqzt6i0xEZEfd2VThhv6f_LRZZKRk5ah3kx0jpCleN1A3FoHy0)](https://editor.plantuml.com/uml/bLMzRjim4Du5w1qExb1bCFg3JaPWH57SL80T2tRITAN5gqrK9bMISfEk7VeWdViKVh4UQScHRATe5qEcxlkvuqVgmbYcRRKkmi1y4R9acgt1sCS2wLUB_EWLVgrGvZX1OzWIuq8i9UGeBUfsMKQa8XSbapPZd0kvX7UldocO27alk5t1csx9fNfei6_fHHYmt2eDlKHmnhU_L0-OWJlZXCDWeHwWzr7WDuWoZOOCCIkKX35xH7tMWnUaOXEDR1q6vPCsiJ79YT2g3FLdKJWAJ-mUmW0b1wBUAwIkqSyiHmDHAXUgajoHNw-KiVShOV4vzYkqh5XXegJLgYXGUv74wk9O92xBGkGj_wH0WyxnigWE1MPeghNAbA4L9TcQ6bTpr1kgzWhryx58fhJrJJGDkJx6R4DrRgBTBiWrLbpDi2GXseH7p-t-mlcvQ2Y6mmDS6ZVsjFM8D3wiRzbw2Vr-7zARsz4itlxS_fZISvgayHYkHX0de_by2b7o8Px4Lx5Voj8p1ma35mBe3_quOG39YgqPPy3HrK1qFRg5LsLdHERCnqbicCLw5yB0mud6nsW0GXA05U8xqsubQaDswV25_ITXZJGRgO2qTmKS3n2D266ywG6G6urBTXBJ6DjDvltuxjCKfhFqEhtP3IMRJTrOuidevdRQ7KNT0pw8XT2dGcAYlCbcoezRQvhRzxR1_wCv76eTH69QL2PdDPdvHxPzZCEW8I9E7y015C9TOXIo_MbxZiO1mi33-XrFOw8uxth9gWMTEJNixCYEe6E2CZs09UgcfUWlIKlZCA3whlQSxbcwuwBvzZUT38CK1GE2es0Esn9tw9Rqqzuq33i3m9M1OnCjejOqzt6i0xEZEfd2VThhv6f_LRZZKRk5ah3kx0jpCleN1A3FoHy0)

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
participant "ResumoPosicionamentoService" as Service
end box

box "Ports (Interfaces)" #Lavender
participant "ConteudoRepository" as Repo <<interface>>
participant "IAResumoPort" as IA <<interface>>
end box

' --- INTERAÇÃO INICIAL DE ACESSO (CHAMADA DE API) ---
User -> Ctrl : Chamada de API (GET /posicionamentos)
activate Ctrl

Ctrl -> View : inicializarView()
activate View
View --> Ctrl : retorno da View
deactivate View

Ctrl --> User : entrega da View
deactivate Ctrl

' --- FLUXO ORIGINAL DE PROCESSAMENTO ---
User -> View : exibirResumoPosicionamentos(candidatoId)
activate View

View -> Ctrl : verResumoPosicionamentos(candidatoId)
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

Ctrl --> View : String
deactivate Ctrl

View --> User : renderizar ideias principais
deactivate View

@enduml
```
