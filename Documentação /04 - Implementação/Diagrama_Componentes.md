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
