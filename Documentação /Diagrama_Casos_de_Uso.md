### Fluxo principal:
[imagem]
### Fluxo do UC1:
[imagem]
### Fluxo do UC2:
[imagem]
### Fluxo do UC3:
[imagem]
### Fluxo do UC4:
[imagem]
### Fluxo do UC5:
[imagem]


[![](https://img.plantuml.biz/plantuml/svg/NLBDIWCn4BxdAOQz5wcjxRMuLmy5hVSXcQx1R6QPIGGL7qOy24AVOb_CR5rrsP335vBlPpwoquIISXjCe6E2n22-UKZWl91DdgFHHnyx56oXG_k83Tscvq0mN6Di0Xc3Dh50LNk7hlzWk823vlvTF5U0MWuanlozXseVCE6HfKLm17U2KOj1_nMjHzXpw4_9MwpWrK1PMScY5jgXleBhh1O5B4PNt1BhZqEzd3zTmmr92QcvPL3VTi4VYwXZABiB67dmRlY998unwzLSP0KrHysXL3HAwS3oCP5W_pdC6X7Q_kGyZXhhkSObt7lD6FnB4UbF9RUbiufb6cSUgPivTJcbadQbGIdXnu9-Ks_Dcp53nx1Od9lunwi9Na_mPeAtPaVH3H_W6m00)](https://editor.plantuml.com/uml/NLBDIWCn4BxdAOQz5wcjxRMuLmy5hVSXcQx1R6QPIGGL7qOy24AVOb_CR5rrsP335vBlPpwoquIISXjCe6E2n22-UKZWl91DdgFHHnyx56oXG_k83Tscvq0mN6Di0Xc3Dh50LNk7hlzWk823vlvTF5U0MWuanlozXseVCE6HfKLm17U2KOj1_nMjHzXpw4_9MwpWrK1PMScY5jgXleBhh1O5B4PNt1BhZqEzd3zTmmr92QcvPL3VTi4VYwXZABiB67dmRlY998unwzLSP0KrHysXL3HAwS3oCP5W_pdC6X7Q_kGyZXhhkSObt7lD6FnB4UbF9RUbiufb6cSUgPivTJcbadQbGIdXnu9-Ks_Dcp53nx1Od9lunwi9Na_mPeAtPaVH3H_W6m00)


```plantuml
@startuml
left to right direction
skinparam packageStyle rectangle

actor "Cidadão / Usuário" as User

rectangle "Plataforma de Transparência Política" {
    usecase "UC5 Buscar candidatos" as UC1
    usecase "UC4 Ler resumo simplificado do plano de governo" as UC3
    usecase "UC3 Consultar resumos de interação na mídia" as UC4
    usecase "UC2 Visualizar índices de coerência" as UC6
    usecase "UC1 Visualizar espectro político" as UC7
}

User -- UC1
User -- UC3
User -- UC4
User -- UC6
User -- UC7
@enduml
```
