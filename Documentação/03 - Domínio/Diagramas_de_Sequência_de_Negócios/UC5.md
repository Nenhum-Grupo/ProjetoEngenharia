# Buscar Candidatos

[![](https://img.plantuml.biz/plantuml/svg/ZPBHIcCn48Rl1TzXY1TMMC5haM8jYnJqoYqAYnVJP7ewc9CSCvEkhoC-Wq_G5zj92u8YAha9ORx_d_advw9OjFPnV-yGve9GUr3g4H8ghpC8zqCa0O95JgmPHikQFEVKAg17peKH0WgigSZcbUHeVwyTUU0qOC4UX1uh9K_N988TJI9t2JmbfVAkR8KX_-FKmHAZKDD0hxc0ctB0i7d93incBbJWu8gxbLx4QcL6AtiUC2cuMLDTeYSO_Q68Hpja1WUNgonwksBT2LVDgVOBat9dY_7VatlNdhVQn-C6dCB4jtu1OTWyTsp3SZ8RZDksU8rALcVC38uRqj1J-Ft42u8bHorPO3H9-HTCiNJPKWdq3lnWTqEHThawe-3EMUG-iaUW7jn55O_5VUbznRPBC5kFALXaQbTZZGks7PQABDzrCTqwcd-Z853x3czoFvXyiFGv6gWOspu_yJkd5Eo__GS0)](https://editor.plantuml.com/uml/ZPBHIcCn48Rl1TzXY1TMMC5haM8jYnJqoYqAYnVJP7ewc9CSCvEkhoC-Wq_G5zj92u8YAha9ORx_d_advw9OjFPnV-yGve9GUr3g4H8ghpC8zqCa0O95JgmPHikQFEVKAg17peKH0WgigSZcbUHeVwyTUU0qOC4UX1uh9K_N988TJI9t2JmbfVAkR8KX_-FKmHAZKDD0hxc0ctB0i7d93incBbJWu8gxbLx4QcL6AtiUC2cuMLDTeYSO_Q68Hpja1WUNgonwksBT2LVDgVOBat9dY_7VatlNdhVQn-C6dCB4jtu1OTWyTsp3SZ8RZDksU8rALcVC38uRqj1J-Ft42u8bHorPO3H9-HTCiNJPKWdq3lnWTqEHThawe-3EMUG-iaUW7jn55O_5VUbznRPBC5kFALXaQbTZZGks7PQABDzrCTqwcd-Z853x3czoFvXyiFGv6gWOspu_yJkd5Eo__GS0)

---

## Descrição do Diagramma

O processo de navegação tem início quando o Cidadão acessa a Página Inicial da plataforma. A Interface disponibiliza de imediato os filtros de contexto, como o Ano da Eleição e o Cargo desejado, para que a pesquisa seja precisa.

Ao definir os parâmetros (como o "Ano X") e acionar a busca, o sistema processa a solicitação e retorna uma galeria organizada de cards visuais, contendo as informações rápidas de cada candidato (foto, nome e partido). O fluxo se encerra quando o usuário seleciona um candidato específico ao clicar em seu card, sendo então redirecionado pela interface para o Perfil Detalhado, onde terá acesso às análises de plano de governo e índices de coerência.

---

## Codificação do Diagrama
```plantuml
@startuml

skinparam sequenceMessageAlign center
skinparam shadowing false

actor "Cidadão" as User #LightBlue
participant "Interface (Tela)" as UI #GhostWhite

autonumber "<b>[0]"

User -> UI : Acessa a página inicial
activate UI
UI --> User : Exibe filtros (Ano, Cargo)
deactivate UI

User -> UI : Seleciona "Ano X" e clica em "Buscar"
activate UI
UI --> User : Lista os candidatos em cards visuais
deactivate UI

User -> UI : Clica no card de um candidato
activate UI
UI --> User : Exibe perfil detalhado
deactivate UI

@enduml
```
