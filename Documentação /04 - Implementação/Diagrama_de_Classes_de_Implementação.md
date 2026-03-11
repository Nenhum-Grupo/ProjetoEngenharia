# Diagrama de Classe de Implementação


---

### Descrição 

O sistema é organizado em camadas:

#### 1. Interfaces (Inbound Adapters)

  - Controllers expõem endpoints para busca de candidatos e detalhes de seus planos, espectro político e coerência.

  - Exemplo: BuscaCandidatoController delega chamadas para ConsultaCandidatoService.

#### 2. Application Layer

  - Contém services que implementam a lógica de aplicação, coordenando a comunicação entre os repositórios, adaptadores e entidades de domínio.

  - Exemplo: PlanoGovernoService busca planos e gera resumos via IA (IAResumoPort).

#### 3. Domain Layer

  - Define as entidades centrais (Candidato, PlanoDeGoverno, TopicoPlano, etc.) e enums (CategoriaEspectroPolitico), representando o núcleo do negócio.

  - As entidades mantêm relacionamentos importantes, como cada candidato possuindo um plano de governo, índice de coerência e categoria política.

#### 4. Ports (Interfaces)

  - Interfaces que abstraem dependências externas, como repositórios de dados e adaptadores de IA.

  - Permitem que a Application Layer não dependa diretamente da implementação de infraestrutura.

#### 5. Infrastructure (Outbound Adapters)

  - Implementações concretas das interfaces de portas (RepositoryImpl, IAResumoAdapter) que interagem com bancos de dados ou serviços externos.

### 6. View

 - Classes que representam a interface gráfica do usuário

---

## Codificação do Diagrama
```plantuml
@startuml


skinparam linetype ortho
left to right direction
skinparam shadowing false

package "
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
domain.ports --> infrastructure
application --> domain.entities
application --> domain.ports

@enduml
```
