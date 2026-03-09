# Visualizar Resumo do Plano de Governo

[![](https://img.plantuml.biz/plantuml/svg/RP9DQiCm48Nt1jzXyBRa0bcKb59AeD3Y9WUOI4CGs9AGvD3hTDbrZ-2BLN-MVvgbf7dVl3UZWtLetD1tTLLNo9moSBO36g72XVPlWWcDqa7pCNvVXKJW2fvHSi7HgGRGmlcugLm_bzEMrw5Km0bUrOsCJCNnSbDu6d-rO2eqZi-nyAJ2NJ2P_SBkqJk1FNnIHqmexxHfoGvz5EgfsJKtYsd53Hr5_nvp38HYDe1Kvpqu_2TUQ1VXwceMUrAAjuSdHjOMXW8sAmebf-PqdvjG2-RxnOq_FPWKJniXmwowLMqQa2zkYGsQ389BSxHb7Wi7ypYpRhTezoRyBmdv2u6fgRjTsPunsSUqb7PZ5HuclNTZ2tW5orD9gmcWlEWzl7o92qtnxsntXKdhFP3a_fl_0G00)](https://editor.plantuml.com/uml/RP9DQiCm48Nt1jzXyBRa0bcKb59AeD3Y9WUOI4CGs9AGvD3hTDbrZ-2BLN-MVvgbf7dVl3UZWtLetD1tTLLNo9moSBO36g72XVPlWWcDqa7pCNvVXKJW2fvHSi7HgGRGmlcugLm_bzEMrw5Km0bUrOsCJCNnSbDu6d-rO2eqZi-nyAJ2NJ2P_SBkqJk1FNnIHqmexxHfoGvz5EgfsJKtYsd53Hr5_nvp38HYDe1Kvpqu_2TUQ1VXwceMUrAAjuSdHjOMXW8sAmebf-PqdvjG2-RxnOq_FPWKJniXmwowLMqQa2zkYGsQ389BSxHb7Wi7ypYpRhTezoRyBmdv2u6fgRjTsPunsSUqb7PZ5HuclNTZ2tW5orD9gmcWlEWzl7o92qtnxsntXKdhFP3a_fl_0G00)

---
## Descrição do Diagrama

O fluxo começa quando o usuário, na página do candidato, seleciona a seção “Resumo do plano de governo”. A interface então acessa o plano de governo do candidato, que fornece o resumo principal e os tópicos do plano com seus respectivos resumos. Em seguida, o sistema retorna essas informações para a página do candidato, que exibe ao usuário o resumo geral do plano e os principais tópicos discutidos, incluindo também os tópicos menos abordados.

---
## Codificação do Diagrama
```plantuml
@startuml

actor Usuario

participant "Página do Candidato" as UI
participant "Candidato" as Candidato
participant "Plano de Governo" as Plano
participant "Tópico do Plano" as Topico

Usuario -> UI : Seleciona "Resumo do plano de governo"
activate UI

UI -> Candidato : Solicita plano de governo
activate Candidato

Candidato -> Plano : Acessa plano do candidato
activate Plano
deactivate Candidato

Plano -> Plano : Obtém resumo principal

Plano -> Topico : Recupera tópicos do plano
activate Topico

Topico --> Plano : Lista de tópicos com resumos
deactivate Topico

Plano --> UI : Resumo principal + resumos dos tópicos
deactivate Plano

UI --> Usuario : Exibe resumo do plano de governo
deactivate UI

@enduml
```
