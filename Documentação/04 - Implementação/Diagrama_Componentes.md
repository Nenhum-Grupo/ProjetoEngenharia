# Diagrama de Componente
[![](https://img.plantuml.biz/plantuml/svg/ZP8nJyCm48NtIFaFfqmmz2-WLcN9n83OMAxE9JtLELldor2X_dViID000Iflv-yzttloDXcgJQElgtBIYIMYuWWHtGa7UhQp9r1oXZ9uMXAUXUmS2OBQCTILfzx00YWFHuEEYuY355iNnXY4nA1fnKXxT9HUvQwLGvYaWrs7CO_JVGDlXOUFvw7XJxufDvTlThiOFJii3sM_bqImnqHhHdWbLvqUmuWii0zAFyMPOEDvXyKqvkJhQxNIAoRJoTcab3Txcko6g4lHrVVVpZQRXp-Qo0Q_jpHBbz4p_QM96RWbJbrjIRhyazu1)](https://editor.plantuml.com/uml/ZP8nJyCm48NtIFaFfqmmz2-WLcN9n83OMAxE9JtLELldor2X_dViID000Iflv-yzttloDXcgJQElgtBIYIMYuWWHtGa7UhQp9r1oXZ9uMXAUXUmS2OBQCTILfzx00YWFHuEEYuY355iNnXY4nA1fnKXxT9HUvQwLGvYaWrs7CO_JVGDlXOUFvw7XJxufDvTlThiOFJii3sM_bqImnqHhHdWbLvqUmuWii0zAFyMPOEDvXyKqvkJhQxNIAoRJoTcab3Txcko6g4lHrVVVpZQRXp-Qo0Q_jpHBbz4p_QM96RWbJbrjIRhyazu1)

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
"Domain Core" --> "Infrastructure\n(Outbound Adapters)"
@enduml
```