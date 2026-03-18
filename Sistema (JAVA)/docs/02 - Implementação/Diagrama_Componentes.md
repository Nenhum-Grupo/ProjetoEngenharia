# Diagrama de Componente
[![](https://img.plantuml.biz/plantuml/svg/ZPB1JiCm44JlaV8FgvpWq5z0hSeb9mu8JbmMPvDQTTQMlGPLY7_73eKODLMGRwEPv_78so3e9Owchl89HyqEFOxWK1rne4Sv6G9FIf07GwN3Q2OvEGBhvM3hob0l81Qy7Wu2dSuXRJbZbHsTPMA1vbdJUmCVMOMVIw1voshMFhzx586MXNoFYi8BtxJyQYDtiElG9JdSNgBqhty65hYTSqOhpCqIxoaGx37G4WXdvoBftewe6VRMqsKuERJegKEXkZJLSgsMUuz1V5GIFQLc3r7-yTGoD7FF8sysTwlp9VFQm1Fcwcm9S7tIALhkbDn_PZjNN7zxNMs9k_HFlm00)](https://editor.plantuml.com/uml/ZPB1JiCm44JlaV8FgvpWq5z0hSeb9mu8JbmMPvDQTTQMlGPLY7_73eKODLMGRwEPv_78so3e9Owchl89HyqEFOxWK1rne4Sv6G9FIf07GwN3Q2OvEGBhvM3hob0l81Qy7Wu2dSuXRJbZbHsTPMA1vbdJUmCVMOMVIw1voshMFhzx586MXNoFYi8BtxJyQYDtiElG9JdSNgBqhty65hYTSqOhpCqIxoaGx37G4WXdvoBftewe6VRMqsKuERJegKEXkZJLSgsMUuz1V5GIFQLc3r7-yTGoD7FF8sysTwlp9VFQm1Fcwcm9S7tIALhkbDn_PZjNN7zxNMs9k_HFlm00)

---
## Diagrama de Componentes

O diagrama de componentes mostra **os grandes módulos do sistema** e como os pacotes estão organizados dentro deles:

- **View** – contém o pacote `view` 
- **Interfaces (Inbound Adapters)** – contém o pacote `interfaces`.  
- **Application (Use Cases)** – contém o pacote `application`.  
- **Domain Core** – contém os pacotes `entities` e `ports`, representando o núcleo do domínio.  
- **Infrastructure (Outbound Adapters)** – contém o pacote `infrastructure`, implementando as portas definidas no domínio.

---

## Codificação do Diagrama
```plantuml
@startuml


skinparam packageStyle rectangle
skinparam linetype ortho
left to right direction

component "View" {

  package "view"

}


component "Interfaces\n(Inbound Adapters)" {

  package "interfaces"

}

component "Application\n(Use Cases)" {

  package "application"

}

component "Domain Core" {

  package "entities"
  package "ports"

}

component "Infrastructure\n(Outbound Adapters)" {

  package "infrastructure"

}

"View" --> "Interfaces\n(Inbound Adapters)"
"Interfaces\n(Inbound Adapters)" --> "Application\n(Use Cases)"
"Application\n(Use Cases)" --> "Domain Core"
"Domain Core" --> "Infrastructure\n(Outbound Adapters)"
@enduml
```
