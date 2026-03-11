# Diagrama de Classes de Negócios

[![](https://img.plantuml.biz/plantuml/svg/TLH1RXin3Bph5K8kFQLFAEBQHU530IFj1rY9QnFHYW95fGYAVgZVwCSgEzvTAV5Uzi0PaJCSQH-oWcWPWp4cFr5C833QG17r9Q5bqHERW8DQPIjqFAdr9EYKE3O7yWay_w9uj0E4ZCOaS4zmH7j7KL46S9Zlx6zZh7K1ShQVItQmXUZ9W_AMemg7W38JPco72k643SNyQVf3Ie4SdFLq0oe_bw3BZEyep-Hm9Xm2HFxApoZn7RQ942ZNcIWO7S5RV7l-qb3dEk0lETLzoDoaa-Tv18eVCIeflTd1BAtNjCEhghdyWnCvle0BbJEvQXh6sfiFvMVT0hVk5OldR-G9vkg-pdEBguPzhRmEgdMCPQpw58yi19F30uVgeX9kMKprhap-vj0NZu-Ogc9bUUdmYwaLhB6zmfXihi3xpIFcCbRTehrcYeD0LYbEY-3jL9Qc-p65FgCLxARYZl5USGTFYZSUabwl-WUxmuJH__jxZYZNR5JGLYkic8rP7fYzl_zac_TWUfSNk0tBDDmMd2xh6lvws3nKJUSVnty0)](https://editor.plantuml.com/uml/TLH1RXin3Bph5K8kFQLFAEBQHU530IFj1rY9QnFHYW95fGYAVgZVwCSgEzvTAV5Uzi0PaJCSQH-oWcWPWp4cFr5C833QG17r9Q5bqHERW8DQPIjqFAdr9EYKE3O7yWay_w9uj0E4ZCOaS4zmH7j7KL46S9Zlx6zZh7K1ShQVItQmXUZ9W_AMemg7W38JPco72k643SNyQVf3Ie4SdFLq0oe_bw3BZEyep-Hm9Xm2HFxApoZn7RQ942ZNcIWO7S5RV7l-qb3dEk0lETLzoDoaa-Tv18eVCIeflTd1BAtNjCEhghdyWnCvle0BbJEvQXh6sfiFvMVT0hVk5OldR-G9vkg-pdEBguPzhRmEgdMCPQpw58yi19F30uVgeX9kMKprhap-vj0NZu-Ogc9bUUdmYwaLhB6zmfXihi3xpIFcCbRTehrcYeD0LYbEY-3jL9Qc-p65FgCLxARYZl5USGTFYZSUabwl-WUxmuJH__jxZYZNR5JGLYkic8rP7fYzl_zac_TWUfSNk0tBDDmMd2xh6lvws3nKJUSVnty0)

---
## Codificação do Diagrama
```
@startuml


skinparam linetype ortho
left to right direction
skinparam shadowing false

package "interfaces" {

  class BuscaCandidatoController
  class CandidatoDetalheController

}

package "application" {

  class ConsultaCandidatoService
  class PlanoGovernoService
  class AnaliseCoerenciaService
  class ClassificacaoEspectroService

}

package "domain.entities" {

  class Candidato
  class PlanoDeGoverno
  class TopicoPlano
  class PosicionamentoPublico
  class ConteudoMidia
  class IndiceCoerencia
  class CoerenciaTopico
  enum CategoriaEspectroPolitico

}

package "domain.ports" {

  interface CandidatoRepository
  interface PlanoRepository
  interface TopicoPlanoRepository
  interface ConteudoRepository
  interface IAResumoPort

}

package "infrastructure" {

  class CandidatoRepositoryImpl
  class PlanoRepositoryImpl
  class TopicoPlanoRepositoryImpl
  class ConteudoRepositoryImpl
  class IAResumoAdapter

}

' Dependências entre pacotes

interfaces --> application
infrastructure --> domain.ports
application --> domain.entities
application --> domain.ports

@enduml
```
