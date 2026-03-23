# Diagrama de Componente
[![](https://img.plantuml.biz/plantuml/svg/ZPB1JiCm44JlaV8FgvpWq5z0hSeb9mwedBWipYQrwgmjUmsg4F-E7LHYr5H4lercdiUJR8EWbpYQkiedd3Gxz3Y2GtN2WPxbR0WyAK4U39KEevdax0YibwEjAqEzW5ZmUZWAT3g7jEMCLNPqbea5cXTD7mryPXKkbq3pdjMiVVtqA08j2_aU5OLNlclvpKRkODUXItAulqRfN_yCB70xvunMc9ibtY4Gx37G4WXdvoBfqOwe6VRMqtKuERJegKEXkZJLSgsMUuz1V5GIFQLcJr5MFBKCpTn_Dzj4jtcuV8ir_ko-kLm2t5vrYfPJ9VUVvIR3ckVNrPQuIx_gDm00)](https://editor.plantuml.com/uml/ZPB1JiCm44JlaV8FgvpWq5z0hSeb9mwedBWipYQrwgmjUmsg4F-E7LHYr5H4lercdiUJR8EWbpYQkiedd3Gxz3Y2GtN2WPxbR0WyAK4U39KEevdax0YibwEjAqEzW5ZmUZWAT3g7jEMCLNPqbea5cXTD7mryPXKkbq3pdjMiVVtqA08j2_aU5OLNlclvpKRkODUXItAulqRfN_yCB70xvunMc9ibtY4Gx37G4WXdvoBfqOwe6VRMqtKuERJegKEXkZJLSgsMUuz1V5GIFQLcJr5MFBKCpTn_Dzj4jtcuV8ir_ko-kLm2t5vrYfPJ9VUVvIR3ckVNrPQuIx_gDm00)

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

"Interfaces\n(Inbound Adapters)" -up-> "View" 
"Interfaces\n(Inbound Adapters)" --> "Application\n(Use Cases)"
"Application\n(Use Cases)" --> "Domain Core"
"Domain Core" --> "Infrastructure\n(Outbound Adapters)"
@enduml
```
