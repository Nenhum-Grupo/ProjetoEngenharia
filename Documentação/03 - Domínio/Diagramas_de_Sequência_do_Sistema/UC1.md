# Visualizar Espectro Político

[![](https://img.plantuml.biz/plantuml/svg/ZP6nJWCn38RtIdq7wxgq4bMPArGLoWagWTG56123cxXt5cby9BbIyJQ8WQaJZt0lXk-OYXYO4YNvFt-Evp5XIFNMzNlncNs50RSGIxJoohw03Rf8HrVqKfCtT4inOa7dZWiFXdoYqE_rUsYI1CWMRD4s7v81HhYB561mmqMPBbojD2KbDboXJv0js-W63S5mfHjsamK6E_f9Bc5mLKfC3oKdwlXr4bzlrqhCpjQpnzEdh3tkIendRM0AznnhTFo6O9G4KkkwfkOJNIbW1QgkJEVAEqoaAIKiOTm2Mj0KyZsl2Ig9gYaUjzgVg5_hRMLopJ4rNu6DZFezIqUSNouBnmR12pG78vuWosD59WM1bRZceDyWsJzCYj2yR_GjxBhUO9ZlbQrMGSPvr8a4YoTmoO4uuLzIS_9MX_mD)](https://editor.plantuml.com/uml/ZP6nJWCn38RtIdq7wxgq4bMPArGLoWagWTG56123cxXt5cby9BbIyJQ8WQaJZt0lXk-OYXYO4YNvFt-Evp5XIFNMzNlncNs50RSGIxJoohw03Rf8HrVqKfCtT4inOa7dZWiFXdoYqE_rUsYI1CWMRD4s7v81HhYB561mmqMPBbojD2KbDboXJv0js-W63S5mfHjsamK6E_f9Bc5mLKfC3oKdwlXr4bzlrqhCpjQpnzEdh3tkIendRM0AznnhTFo6O9G4KkkwfkOJNIbW1QgkJEVAEqoaAIKiOTm2Mj0KyZsl2Ig9gYaUjzgVg5_hRMLopJ4rNu6DZFezIqUSNouBnmR12pG78vuWosD59WM1bRZceDyWsJzCYj2yR_GjxBhUO9ZlbQrMGSPvr8a4YoTmoO4uuLzIS_9MX_mD)

---
## Descrição do Diagrama

O processo começa com o Cidadão acessando a página inicial da plataforma, onde a Interface disponibiliza filtros para refinar a pesquisa (como Ano da Eleição e Cargo). Ao definir os parâmetros e clicar em buscar, o sistema processa a solicitação e retorna uma galeria de cards visuais com os candidatos correspondentes. Por fim, o usuário seleciona o candidato desejado clicando em seu card, sendo então redirecionado para o perfil detalhado com as informações completas.

---
## Codificação do Diagrama
```plantuml
@startuml
skinparam shadowing false
skinparam sequenceMessageAlign center

actor "Cidadão" as User #LightBlue
participant "Interface (Perfil/Card)" as UI #GhostWhite

autonumber "<b>[0]"

User -> UI : Visualiza card ou cabeçalho do perfil
activate UI
UI --> User : Exibe posicionamento (Partido/Histórico)
deactivate UI

User -> UI : Clica no ícone "Espectro Político"
activate UI
note right of UI #FFFFFF: Renderiza mapa ideológico
UI --> User : Exibe gráfico visual (Ex: Centro-Esquerda, Direita)
deactivate UI

@enduml
```
