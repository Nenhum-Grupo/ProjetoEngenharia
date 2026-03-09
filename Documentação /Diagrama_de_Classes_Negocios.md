# Diagrama de Classes de Negócios
[![](https://img.plantuml.biz/plantuml/svg/VLAn3i8W4Dtv2jBHf8ExGvDgZ8D91-EES34ab6iATVBZnGe44Er2tjsxT_TUsXdBPhkCYX2kc36qPrf8mInwF2YcSGz7VC2iG_62a-IujW8DZUGIDHj1MnoMctA488dQmYBmB8LaldQL0f9Po-umUdXo1t3e4MRGF0uSp0JSpZYWaZRLzhJFIOHao-ZksRP-LwKH5vFecZRRXhhM-ocivp0IDqqMHqNACUhnLAlfM9vS_SglOEgqCjK2UsfOMuIQ6CpFotd__FnGxa2BzUzBlXS0)](https://editor.plantuml.com/uml/VLAn3i8W4Dtv2jBHf8ExGvDgZ8D91-EES34ab6iATVBZnGe44Er2tjsxT_TUsXdBPhkCYX2kc36qPrf8mInwF2YcSGz7VC2iG_62a-IujW8DZUGIDHj1MnoMctA488dQmYBmB8LaldQL0f9Po-umUdXo1t3e4MRGF0uSp0JSpZYWaZRLzhJFIOHao-ZksRP-LwKH5vFecZRRXhhM-ocivp0IDqqMHqNACUhnLAlfM9vS_SglOEgqCjK2UsfOMuIQ6CpFotd__FnGxa2BzUzBlXS0)

---
## Codificação de diagrama
```plantuml
@startuml

class Candidato
class PlanoDeGoverno
class TopicoPlano
class PosicionamentoPublico
class ConteudoMidia
class Video
class Postagem
class IndiceCoerencia
class EspectroPolitico
class CoerenciaTopico

ConteudoMidia <|-- Video
ConteudoMidia <|-- Postagem

Candidato "1" -- "1" PlanoDeGoverno
PlanoDeGoverno "1" -- "*" TopicoPlano

Candidato "1" -- "*" PosicionamentoPublico
PosicionamentoPublico "1" -- "*" ConteudoMidia

Candidato "1" -- "1" EspectroPolitico

Candidato "1" -- "1" IndiceCoerencia
IndiceCoerencia "1" -- "*" CoerenciaTopico

TopicoPlano "1" -- "*" CoerenciaTopico
PosicionamentoPublico "1" --- "*" CoerenciaTopico

@enduml
```
