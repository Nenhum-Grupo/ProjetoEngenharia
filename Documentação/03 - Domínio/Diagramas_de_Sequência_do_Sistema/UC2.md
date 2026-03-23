# Visualizar Índices de Coerência

[![](https://img.plantuml.biz/plantuml/svg/XP71IWCn48RlUOfXYz0U2fwBbDP5Ia514F4W7gR9xEvWDbcJhFObV8Z5W-3LHyYBEMilLG-UP_vlllnPnOGXzQrLyP5TXm5RY0qQ_yAkXWfjfEC9FVNaD5rHZ5ZJsdBjG9DB59H2dNo0ecI39h_v0Z32RQG0aqkkctHkUrA2IQovGvUWs8wv2ZN1z3eFDJi4uw54PmIH_En0sC9aq_YOxXfE95Vwv5tVxeHRdEsMzwSFXLBVP-RBSNa1fMMD8B18-Lr4e5YxF5YE18QWz1JoXzECnMZCpvX8SagYyv4maXPmiUSTGNuL5Vqh1XiAQ65wCbE6ZWa_BMwyQ72I9r52ss0hBNdefA54BSP_RzSX3nLh7u6WOaDsh9KEWFpPoGIcj9TjxPrl6V_OhCWP-TSl)](https://editor.plantuml.com/uml/XP71IWCn48RlUOfXYz0U2fwBbDP5Ia514F4W7gR9xEvWDbcJhFObV8Z5W-3LHyYBEMilLG-UP_vlllnPnOGXzQrLyP5TXm5RY0qQ_yAkXWfjfEC9FVNaD5rHZ5ZJsdBjG9DB59H2dNo0ecI39h_v0Z32RQG0aqkkctHkUrA2IQovGvUWs8wv2ZN1z3eFDJi4uw54PmIH_En0sC9aq_YOxXfE95Vwv5tVxeHRdEsMzwSFXLBVP-RBSNa1fMMD8B18-Lr4e5YxF5YE18QWz1JoXzECnMZCpvX8SagYyv4maXPmiUSTGNuL5Vqh1XiAQ65wCbE6ZWa_BMwyQ72I9r52ss0hBNdefA54BSP_RzSX3nLh7u6WOaDsh9KEWFpPoGIcj9TjxPrl6V_OhCWP-TSl)

---

## Descrição do Diagrama

O processo de análise de fidelidade tem início quando o Cidadão, já na página de um candidato específico, seleciona a seção "Análise de Coerência". A Interface processa a solicitação e apresenta de imediato o Índice de Coerência Geral, representado por uma porcentagem que reflete o alinhamento global entre o discurso público e as promessas oficiais.

Para uma investigação mais aprofundada, o usuário solicita o detalhamento por temas. Nesse momento, o sistema processa os dados comparativos e gera visualizações específicas para cada área (como Saúde, Educação ou Economia). O fluxo se encerra com a exibição de gráficos de fidelidade por tópico, permitindo que o cidadão identifique em quais assuntos o candidato mantém maior ou menor consistência em relação ao seu plano de governo.

---

## Codificação do Diagrama
```plantuml
@startuml
skinparam shadowing false
skinparam sequenceMessageAlign center

actor "Cidadão" as User #LightBlue
participant "Interface (Página do Candidato)" as UI #GhostWhite

autonumber "<b>[0]"

User -> UI : Clica na seção "Análise de Coerência"
activate UI
UI --> User : Exibe Índice de Coerência Geral (%)
deactivate UI

User -> UI : Solicita detalhamento por temas
activate UI
note right of UI #FFFFFF: Gera comparativos e índices
UI --> User : Exibe gráficos e fidelidade por tópico (ex: Economia)
deactivate UI

@enduml
```
