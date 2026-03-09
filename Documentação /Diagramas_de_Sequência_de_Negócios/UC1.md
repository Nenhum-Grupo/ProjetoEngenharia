# Visualizar Espectro Político

[![](https://img.plantuml.biz/plantuml/svg/VP6nIWD148RxGDvXk3G9668T94JZeG65D6eX5fFToTtWPkVStOl1jn4BgrG-mhsOSsSL4QjTPlc_-MPd7XE6L6zTlnUVsLSOS0knH2klx0lOe8jqz4GlDNb3jnGZ5dJkkF1Wo2SA_Lw_XoP9W6p15ctp8HbWXBj80GOtN9JfmjLAKr9YmnNw1DcoZMxG40nNUc4tMM2mev_a4WPNfSJqK7AYZbydyVLshSJiR3rxF7tAsdBNOZnh0rEuvrYZupS4eoIGMiyrDP_eIW4hK7LjEbVUOI9DAM49unRGWgQmj3eHRzWWL1BLLJnkjIGgsSfRcLnpJCrNO2EZVi_I4UoNqCAr82_G78nuWYoF5PaK15RYceF-XMJ_wkHxNXCKeNbN9O5TDo0CyxsorIh8E8-wbc3n12uv42VyIsfEtkgclm40)](https://editor.plantuml.com/uml/VP6nIWD148RxGDvXk3G9668T94JZeG65D6eX5fFToTtWPkVStOl1jn4BgrG-mhsOSsSL4QjTPlc_-MPd7XE6L6zTlnUVsLSOS0knH2klx0lOe8jqz4GlDNb3jnGZ5dJkkF1Wo2SA_Lw_XoP9W6p15ctp8HbWXBj80GOtN9JfmjLAKr9YmnNw1DcoZMxG40nNUc4tMM2mev_a4WPNfSJqK7AYZbydyVLshSJiR3rxF7tAsdBNOZnh0rEuvrYZupS4eoIGMiyrDP_eIW4hK7LjEbVUOI9DAM49unRGWgQmj3eHRzWWL1BLLJnkjIGgsSfRcLnpJCrNO2EZVi_I4UoNqCAr82_G78nuWYoF5PaK15RYceF-XMJ_wkHxNXCKeNbN9O5TDo0CyxsorIh8E8-wbc3n12uv42VyIsfEtkgclm40)

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
UI --> User : Identifica posicionamento (Partido/Histórico)
deactivate UI

User -> UI : Clica no ícone "Espectro Político"
activate UI
note right of UI #FFFFFF: Renderiza mapa ideológico
UI --> User : Exibe gráfico visual (Ex: Centro-Esquerda, Direita)
deactivate UI

@enduml
```
