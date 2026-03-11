# Diagrama de Classes de Negócios
[![](https://img.plantuml.biz/plantuml/svg/ZP91QiCm44Nt0jr1U1a8f8jiiYY1D7JhHIymaOTcY3mZD7Blb7FaOh6JsYXk8Ds9F_zz_WpQQeQKkpPOOusUY2CaQ1rBWuhHhLUbce1FesgD3w3gTi0DDP1b5Ee0B1_uAJ-OU5A_99ANssmoYf8dOMYHizJT8VIESRZNY3udgILGBlITO4Bs1FV0eSVKm5LlbLic-ZxcvUqz3t4R5qMr8_V-1xiJZ-LV-1VLynqUC6jccGEz-CMBg_IG5ywNSpimvQ04PkkNqFCg_uIjsI8t_JUu0W00)](https://editor.plantuml.com/uml/ZP91QiCm44Nt0jr1U1a8f8jiiYY1D7JhHIymaOTcY3mZD7Blb7FaOh6JsYXk8Ds9F_zz_WpQQeQKkpPOOusUY2CaQ1rBWuhHhLUbce1FesgD3w3gTi0DDP1b5Ee0B1_uAJ-OU5A_99ANssmoYf8dOMYHizJT8VIESRZNY3udgILGBlITO4Bs1FV0eSVKm5LlbLic-ZxcvUqz3t4R5qMr8_V-1xiJZ-LV-1VLynqUC6jccGEz-CMBg_IG5ywNSpimvQ04PkkNqFCg_uIjsI8t_JUu0W00)

---
## Codificação do Diagrama
```plantuml
@startuml

skinparam nodesep 50
skinparam ranksep 50

class Candidato
class PlanoDeGoverno
class TopicoPlano
class PosicionamentoPublico
class EspectroPolitico
class CoerenciaTopico

Candidato "1" -right- "1" EspectroPolitico : possui >
Candidato "1" -- "1" PlanoDeGoverno : possui >
Candidato "1" -- "*" PosicionamentoPublico : possui >

PlanoDeGoverno "1" *-- "*" TopicoPlano : contém

TopicoPlano "1" *-- "*" CoerenciaTopico : contém
PosicionamentoPublico "1" *-- "*" CoerenciaTopico : contém

@enduml
```

TopicoPlano "1" -down- "*" CoerenciaTopico
PosicionamentoPublico "1" -- "*" CoerenciaTopico

@enduml
```
