# Visualizar Resumo do Plano de Governo

[![](https://img.plantuml.biz/plantuml/svg/bP0n3i8m34NtIBc3bRqNw82wC7G5zG0cDIXI6aU9Mt4lZi35IAeoLC30Pjd-xt-xou99vibhfHLQuGH3dZ4vherOPiwwY470z44eNT6I0Smmz7LXsuNcK1hGmfayMSS1mPmepnF3o10zXb8Gt7YX5DYiJcv1eHLJb4q5RAmMZdTt8KW_0LgDj2Dy2SA-11TyKs8vJ9wFw2pdl-ptmWzVhJeAO_dV2m00)](https://editor.plantuml.com/uml/bP0n3i8m34NtIBc3bRqNw82wC7G5zG0cDIXI6aU9Mt4lZi35IAeoLC30Pjd-xt-xou99vibhfHLQuGH3dZ4vherOPiwwY470z44eNT6I0Smmz7LXsuNcK1hGmfayMSS1mPmepnF3o10zXb8Gt7YX5DYiJcv1eHLJb4q5RAmMZdTt8KW_0LgDj2Dy2SA-11TyKs8vJ9wFw2pdl-ptmWzVhJeAO_dV2m00)

---
## Descrição do Diagrama

Este diagrama de sequência ilustra o fluxo de interação entre um usuário e uma interface para consulta de dados políticos. O processo foca na experiência de navegação, onde o usuário solicita primeiro uma visão geral do plano de governo e, logo em seguida, opta por uma visualização mais organizada e segmentada por tópicos, destacando a capacidade do sistema de entregar informações de forma direta e estruturada.

---
## Codificação do Diagrama
```plantuml
@startuml

actor Usuario

participant "Interface" as UI

Usuario -> UI : Seleciona "Resumo do plano de governo"
activate UI
UI --> Usuario : Exibe resumo do plano de governo
deactivate UI

Usuario -> UI : Solicita resumo por tópicos
activate UI
UI --> Usuario : Exibe resumo por tópicos
deactivate UI


@enduml
```
