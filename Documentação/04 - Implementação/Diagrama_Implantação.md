# Diagrama de Implantação


### EC2s Separadas

![](https://www.plantuml.com/plantuml/png/ZLFDQjj04BxlKmm-jOTWsj9B2IQAdQI6qAfMd5mAPQITA4kaNR4_Jg7aOKeFEVK5UlMBTRIAatKmEBf8p7m_tyokZfn7wqFR27UhT8SMMt0tACsTqZLu6oXfMAeywheX-2K05YPeEJLMauLt7yMz4Df8Wj7IXVLlgym8qC7ISVVmKD9ALJIP2D5XTOirmxAh0gQD2NB4QWBuUMfTvjEdubOZ3sMZAYX2gSdt44YUmJqxFux6_6RVng3yKMA3kYBBzXli_IvngrReAL7V8NyoVGy7S6gDzgGbN54PtRWSQsp90wzwhwrqgSINMkcVC7uMEGwgaL4cbhAkOncqNbrZvPFGQV0TeOvva5uko-URJ7tfDP5cXgaMfkoEIfDzLejAGxklfC5IkVIfJDiPJRoCqPm7j0mczrs_cUlIX3wVn8xBxkre7vqtmSUDNXdDVBvAC4L7-uayJyjpy3oMHlipNbjqteRA1qliypNulK7lNtie1QzUhHyCpBFDeSopv4Xs41Up0dBZV6sf-7OUMLnYZaIF9JhQkiU9_q0_nxQKoDPdP77ziFvZWCjvWzguA3O0MA-97vD9GYu-CF5o_LUISUDyTZemkCg9lR5Oz-Pi5t_hWuD9_Cq-mUUBYxmG_1rhcv-16oVQMweHhX_lUeA9bpD2AcoLla4OOwU4sB1VmFXkEjDIVxjXSL9SY4th4JRF69HRKv5ps9Bs_SfJK5mYwooMituX4gLnQP-dvFQoQmpAySpSwVu3gZxt-jzBxB13ncULCXgXJdVTnLqBCO0IxpEBAtnqFk9jXBRv3m00)

---
## Descrição

O diagrama representa a arquitetura de implantação do sistema de democratização da informação política na AWS:

- O **usuário** acessa a aplicação via **ELB (Elastic Load Balancer)**, que distribui requisições para a **EC2 principal** na **subnet privada**.
- Na EC2, a aplicação roda em **containers Docker**:
  - **Spring Boot API** com seus componentes (autenticação, lógica de negócios, etc.).
- A aplicação interage com o **RDS PostgreSQL** para persistência de dados e com o **S3** para armazenamento de vídeos e PDFs.
- A **EC2 principal** aciona a **Lambda Function** quando é necessário gerar planos de governo, que acessa IA e banco de dados.
- A separação entre **subnets públicas e privadas** garante segurança, mantendo recursos sensíveis isolados da internet.

---
## Codificação do Diagrama
### EC2s Separadas
```plantuml
@startuml
skinparam shadowing true
skinparam rectangle {
  RoundCorner 15
}

node "Usuário" as User <<device>>

package "AWS Cloud" {

    package "VPC" {

        package "Public Subnet" {
            node "ALB" as ALB <<load_balancer>>
        }

        package "Private Subnet" {

            node "EC2 - Frontend Web" as EC2Front <<server>> {
                node "Nginx / Frontend Build" as FrontApp <<artifact>>
            }

            node "EC2 - Backend API" as EC2Back <<server>> {
                node "Docker Container - Backend" as DockerBack <<artifact>> {
                    component "Interfaces\n(Inbound Adapters)"
                    component "Application\n(Use Cases)"
                    component "Domain Core"
                    component "Infrastructure\n(Outbound Adapters)"
                }
            }

            node "EC2 - Serviço IA" as EC2IA <<server>>
            node "RDS PostgreSQL" as RDS <<database>>
        }
    }

    node "Lambda - Geração de Planos" as Lambda <<lambda>>
    node "S3 - Vídeos/PDFs" as S3 <<storage>>
}

User --> ALB : HTTPS
ALB --> EC2Front : Entrega frontend
ALB --> EC2Back : Encaminha /api

EC2Front --> EC2Back : Consome API REST
EC2Back --> EC2IA : Processamento IA
EC2Back --> RDS : CRUD de dados
EC2Back --> S3 : Upload/Download conteúdos
EC2Back --> Lambda : Aciona geração de planos

Lambda --> RDS : Grava dados

@enduml

```


