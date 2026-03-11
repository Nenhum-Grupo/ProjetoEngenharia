# Diagrama de Componente

[![](https://img.plantuml.biz/plantuml/svg/ZL91JiD03Bpx5LPESEWNKAjooOa3ujQBsJY9rOrtjUiLggh-dGq824HgkTepuvcHjzaeMPay0EIZQAH44qPoHnhusKwUCR4pqi7p0k15sKwHCIGRmsAHH-h2c-Y0FVdCuBatj819Xj6marbCWWAuCCMWh8PDgyQf9yVve7UjleQY7UuwYdMSxniy0-2N9Mpa6zq0N7u9xMBqucW-K9LUCkEUCgybw0UtqdWC4udYFYJ-IwjxCPdlBeQnDh1sqcgVA5igpahYQkQfsCrSIygduirgDfk7Ax7XIYCVp6LO-9_fDG-sh5tze7S0)](https://editor.plantuml.com/uml/ZL91JiD03Bpx5LPESEWNKAjooOa3ujQBsJY9rOrtjUiLggh-dGq824HgkTepuvcHjzaeMPay0EIZQAH44qPoHnhusKwUCR4pqi7p0k15sKwHCIGRmsAHH-h2c-Y0FVdCuBatj819Xj6marbCWWAuCCMWh8PDgyQf9yVve7UjleQY7UuwYdMSxniy0-2N9Mpa6zq0N7u9xMBqucW-K9LUCkEUCgybw0UtqdWC4udYFYJ-IwjxCPdlBeQnDh1sqcgVA5igpahYQkQfsCrSIygduirgDfk7Ax7XIYCVp6LO-9_fDG-sh5tze7S0)

---

## Diagrama de Componentes

O diagrama de componentes mostra **os grandes módulos do sistema** e como os pacotes estão organizados dentro deles:

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
skinparam shadowing false
left to right direction

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

"Interfaces\n(Inbound Adapters)" --> "Application\n(Use Cases)"
"Application\n(Use Cases)" --> "Domain Core"
"Infrastructure\n(Outbound Adapters)" --> "Domain Core"

@enduml
```
