# Diagrama de Classe de Implementação

[![](https://img.plantuml.biz/plantuml/svg/dLXDRXit5DuRy1q8RI87S81kXS288Ws20T9QbTsYku2QUPA9SCW1oN5hjDxs0Br5pj6Rz2GbEJyaPyYH42E0bVVxlLy-wuDKMAYcejTNrrVoAs4r5hX2DIw-uXCyg1SAI42XC3jHy2KeOQ1UQa1Sg2T-VKNXg93YI93Jaq8bCKg4CsEsCuOMlnBuVO7-DBI2OYdH1hEIb5ZnpqGgmpLCrFqKd2d1AGMnGXyRMU11UZDmdBJx17-G0n76ejEGonid8852eR5XqV5BnPUaN272L2VsQZ1Q427E7OWZeND81z4jA4oVu1AiEuePNnQzPXv0SMAPh7LInGMI6mu2M47mUT4zoARYEow9JKa5p6GheMRJyXhKD6TAvmGN8D4oPmVUi1AjIrnhghm9YfsgeSsaJg5ig5Un1n3Ff02Tq0J7LkXWR8g1vLUHcWOGOGUyHbflKYUBfpOb6J3O0dtYpo2OSu-WguU3QYoJ8obmWNaMScsCNLK6XJN36YPiHWmRcdQMxWlDdEq6pP_l0IrmSUKZLL_NDTLXcWb7d_4BY72i4oLhAzqJzr1htugB5szg776slfv6jDGhPER__K2w2seVAQShkWzh5nAq2C5zseHQeNpj_kVXJTIjixU5phMMFu70uhwnez4L9ARte0HXfo26HElOE1IlIS5tusWUO-HszXGqPLYG2St6Ls1QD1IBN4Ci80QrvGommfcRcOz-2roCPB0bOZ0sMC692u9xDpjEYTBX1u1Y8_0zUD1G-jQY74qLkd2ijhp299oeWPSnfGC06Nz0BTnkElGdnYjmRQEVSw58oJtAWV2Jm4U2FPhkYuo2pYZlpP2mc6Y5ZfHZDHsceQT7E3JaXlf-XSsFHz3WyQuvqBOfLcYh2nVOzxhsdF4IP25Q_4c7FlAWI2s8YG-ey1aF9e8UDpgQxeXw6xBO1ZJsOucUrJRrOSA1DLMwiwt5xBV7VVRZ-alsyFClsNwxDYJtSPFzzBY__pAXEDOstsVve-6uJxtDWVBQ__FQqwn0UmBqvq3_-9EU4blo5dEtDBd8oza5drxhpiTekuNsDsu8BzhE4jDdxTO-2sFspSHrTBrQ02ry3Q1z6AmzvzQ6v2bFWvgkdD2iUnyZKLdpqLQVElBVC-l2la_TknHFmwZNnyVXKM2fH5EeHW1QtZTgxaACD4XUrJJOD75MDFU-m3I5FhUFkuCr1F86zIVjVt__WxoZnp2Jz-pjxTtirJfpUXhLwB5vHcV-yZoZdBn2p-ZDl9vjylmhqIJGxWYRWTI1Q6E9tuAnesr8bo-Q4WoFjPHKuaYwlaeTN3DASohnisRsGef6UrOZvcZkxlbUdV4jR1gWVHHCwSDD44o1jzNU__NkNNeBZ5UhbOxEV7mLM_cPJH5PiosWnEu8jgMLZEoHDwWxwWHGEmdoYTGoI01Q_B3GARI_qg_x2cdliY7eBg4wEiJcvTyk4kUFhzQbtDaqscyxTVykMzbB-TzlbT7n6Rx2-03obE9GBbGsERRVoEpx30VP7RvQCasQ_XufzXLFi8qYt-Tep_PK7pphlmDYVnhVDhMsv2vue_a1MDbKz7y0)](https://editor.plantuml.com/uml/dLXDRXit5DuRy1q8RI87S81kXS288Ws20T9QbTsYku2QUPA9SCW1oN5hjDxs0Br5pj6Rz2GbEJyaPyYH42E0bVVxlLy-wuDKMAYcejTNrrVoAs4r5hX2DIw-uXCyg1SAI42XC3jHy2KeOQ1UQa1Sg2T-VKNXg93YI93Jaq8bCKg4CsEsCuOMlnBuVO7-DBI2OYdH1hEIb5ZnpqGgmpLCrFqKd2d1AGMnGXyRMU11UZDmdBJx17-G0n76ejEGonid8852eR5XqV5BnPUaN272L2VsQZ1Q427E7OWZeND81z4jA4oVu1AiEuePNnQzPXv0SMAPh7LInGMI6mu2M47mUT4zoARYEow9JKa5p6GheMRJyXhKD6TAvmGN8D4oPmVUi1AjIrnhghm9YfsgeSsaJg5ig5Un1n3Ff02Tq0J7LkXWR8g1vLUHcWOGOGUyHbflKYUBfpOb6J3O0dtYpo2OSu-WguU3QYoJ8obmWNaMScsCNLK6XJN36YPiHWmRcdQMxWlDdEq6pP_l0IrmSUKZLL_NDTLXcWb7d_4BY72i4oLhAzqJzr1htugB5szg776slfv6jDGhPER__K2w2seVAQShkWzh5nAq2C5zseHQeNpj_kVXJTIjixU5phMMFu70uhwnez4L9ARte0HXfo26HElOE1IlIS5tusWUO-HszXGqPLYG2St6Ls1QD1IBN4Ci80QrvGommfcRcOz-2roCPB0bOZ0sMC692u9xDpjEYTBX1u1Y8_0zUD1G-jQY74qLkd2ijhp299oeWPSnfGC06Nz0BTnkElGdnYjmRQEVSw58oJtAWV2Jm4U2FPhkYuo2pYZlpP2mc6Y5ZfHZDHsceQT7E3JaXlf-XSsFHz3WyQuvqBOfLcYh2nVOzxhsdF4IP25Q_4c7FlAWI2s8YG-ey1aF9e8UDpgQxeXw6xBO1ZJsOucUrJRrOSA1DLMwiwt5xBV7VVRZ-alsyFClsNwxDYJtSPFzzBY__pAXEDOstsVve-6uJxtDWVBQ__FQqwn0UmBqvq3_-9EU4blo5dEtDBd8oza5drxhpiTekuNsDsu8BzhE4jDdxTO-2sFspSHrTBrQ02ry3Q1z6AmzvzQ6v2bFWvgkdD2iUnyZKLdpqLQVElBVC-l2la_TknHFmwZNnyVXKM2fH5EeHW1QtZTgxaACD4XUrJJOD75MDFU-m3I5FhUFkuCr1F86zIVjVt__WxoZnp2Jz-pjxTtirJfpUXhLwB5vHcV-yZoZdBn2p-ZDl9vjylmhqIJGxWYRWTI1Q6E9tuAnesr8bo-Q4WoFjPHKuaYwlaeTN3DASohnisRsGef6UrOZvcZkxlbUdV4jR1gWVHHCwSDD44o1jzNU__NkNNeBZ5UhbOxEV7mLM_cPJH5PiosWnEu8jgMLZEoHDwWxwWHGEmdoYTGoI01Q_B3GARI_qg_x2cdliY7eBg4wEiJcvTyk4kUFhzQbtDaqscyxTVykMzbB-TzlbT7n6Rx2-03obE9GBbGsERRVoEpx30VP7RvQCasQ_XufzXLFi8qYt-Tep_PK7pphlmDYVnhVDhMsv2vue_a1MDbKz7y0)

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

#### 6. View

 - Classes que representam a interface gráfica do usuário

---

## Codificação do Diagrama
```plantuml
@startuml

skinparam packageStyle rectangle
skinparam linetype ortho
left to right direction

package "View" {

class CandidatoListView {
        controller: BuscaCandidatoController
        
        exibirListaCandidatos()
        selecionarCandidadto(id: int)
    }

    class CandidatoPerfilView {
        controller: CandidatoDetalheController
        
        exibirPlano(candidatoId: int)
        exibirEspectro(candidatoId: int)
        exibirCoerencia(candidatoId: int)
        exibirResumoPosicionamentos(candidatoId: int)
    }

}

package "Interfaces (Inbound Adapters)" {

class BuscaCandidatoController {
 consultaCandidatoService: ConsultaCandidatoService

 buscarCandidato(id: int)
 listarCandidatos()
}

class CandidatoDetalheController {
 planoService: PlanoGovernoService
 espectroService: ClassificacaoEspectroService
 coerenciaService: AnaliseCoerenciaService

 verPlano(candidatoId: int)
 verEspectro(candidatoId: int)
 verCoerencia(candidatoId: int)
 verResumoPosicionamentos(candidatoId: int)
}

}

package "Application Layer" {

class ConsultaCandidatoService {
 candidatoRepository: CandidatoRepository

 buscarCandidato(id: int): Candidato
 listarCandidatos(): List<Candidato>
}

class PlanoGovernoService {
 planoRepository: PlanoRepository
 iaResumoPort: IAResumoPort

 buscarPlano(candidatoId: int): PlanoDeGoverno
 gerarOuBuscarResumo(candidatoId: int): String
}

class AnaliseCoerenciaService {
 topicoPlanoRepository: TopicoPlanoRepository
 conteudoRepository: ConteudoRepository

 calcularIndice(candidatoId: int): IndiceCoerencia
}

class ClassificacaoEspectroService {
 conteudoRepository: ConteudoRepository

 classificar(candidatoId: int): CategoriaEspectroPolitico
}

class ResumoPosicionamentoService {
 conteudoRepository: ConteudoRepository
 
 buscarResumosPosicionamentos (candidatoId: int)
}

}

package "Domain Layer" {

package "Entities" {

class Candidato {
 id: int
 nome: String
 partido: String
 biografia: String
 anoEleicao: int
 indiceCoerencia : float
}

class PlanoDeGoverno {
 id: int
 titulo: String
 resumo: String
 dataPublicacao: Date
}

class TopicoPlano {
 id: int
 titulo: String
 descricao: String
 resumo: String
}

class PosicionamentoPublico {
 id: int
 tema: String
 descricao: String
 data: Date
 fonte: String
}

class CoerenciaTopico {
 id: int
 topico: String
 indice: float
}

enum CategoriaEspectroPolitico {
 EXTREMA_ESQUERDA
 ESQUERDA
 CENTRO_ESQUERDA
 CENTRO
 CENTRO_DIREITA
 DIREITA
 EXTREMA_DIREITA
}
}
}

package "Ports (Interfaces)" {

interface CandidatoRepository {
 buscarPorId(id: int): Candidato
 listar(): List<Candidato>
}

interface PlanoRepository {
 buscarPorCandidatoId(candidatoId: int): PlanoDeGoverno
 salvar(plano: PlanoDeGoverno)
}

interface TopicoPlanoRepository {
 listarPorPlano(planoId: int): List<TopicoPlano>
}

interface ConteudoRepository {
 listarPorCandidato(candidatoId: int): List<PosicionamentoPublico>
}

interface IAResumoPort {
 gerarResumo(plano: PlanoDeGoverno): String
}

}

package "Infrastructure (Outbound Adapters)" {

class CandidatoRepositoryImpl
class PlanoRepositoryImpl
class TopicoPlanoRepositoryImpl
class ConteudoRepositoryImpl
class IAResumoAdapter

}

' Inbound → Application

BuscaCandidatoController --> ConsultaCandidatoService

CandidatoDetalheController --> PlanoGovernoService
CandidatoDetalheController --> ClassificacaoEspectroService
CandidatoDetalheController --> AnaliseCoerenciaService
CandidatoDetalheController --> ResumoPosicionamentoService

' Application → Ports

ConsultaCandidatoService --> CandidatoRepository

PlanoGovernoService --> PlanoRepository
PlanoGovernoService --> IAResumoPort
PlanoGovernoService --> TopicoPlanoRepository

AnaliseCoerenciaService --> TopicoPlanoRepository
AnaliseCoerenciaService --> ConteudoRepository

ClassificacaoEspectroService --> PlanoRepository
ClassificacaoEspectroService --> ConteudoRepository
ResumoPosicionamentoService --> ConteudoRepository
ResumoPosicionamentoService --> IAResumoPort


' Ports → Infrastructure

CandidatoRepository <|.. CandidatoRepositoryImpl
PlanoRepository <|.. PlanoRepositoryImpl
TopicoPlanoRepository <|.. TopicoPlanoRepositoryImpl
ConteudoRepository <|.. ConteudoRepositoryImpl
IAResumoPort <|.. IAResumoAdapter

' Domain relationships

Candidato "1" -- "1" CategoriaEspectroPolitico : possui >
Candidato "1" -- "1" PlanoDeGoverno : possui >
Candidato "1" -- "*" PosicionamentoPublico : possui >

PlanoDeGoverno "1" *-- "*" TopicoPlano : contém

TopicoPlano "1" *-- "*" CoerenciaTopico : contém
PosicionamentoPublico "1" *-- "*" CoerenciaTopico : contém

' View Relations

CandidatoListView --> BuscaCandidatoController
CandidatoPerfilView --> CandidatoDetalheController

'Layer Relation 
"Application Layer" -up-> "Entities"

@enduml
```
