# Diagrama de Implantação

[![](https://img.plantuml.biz/plantuml/svg/XLHDRzD04BrRydyOvL8uH155NA8gQd1eYHI943VbWeGczYIiOk-QtNMAXF9Z48UUE7BXwZ_6x6w-rGOValNil7blldnjB6fRbqKScQMG5MeimNp5N3q8kG2hQpgyqPHPb8k2u4SS0KnKBVD4QKaQNhs9etKSnT55kzs6gQcRdreeu9SuaYedQ6rjBK333eovkiff9JBgzLmyZzxW-vzII0fLvo50XTaI5nnZPsyvXDC0S07ZUbQ83D9w9ia6umvnTEUfWoKOGXxX2IhVZTvwB_vdVON2_CiC2vGPwLulEAyFcBLOeQLdg8yk0tSmFKkUN08dNx4-R1wRNye1P2OgB8AevB9VLQoBgxToWWuYx88CLBRauYPAMXIkDIvYvV7XAeJWleivPZOK7qwUJ9MLaYGjj8Pohj7mA6IsrlHPllXGsvdhFFHph2nfyx9rDW3pkOIiK9BHt7b8qD3_K0DLidnEGzDvnw5a3Pm96Ou-bEUbhVUlwwUhdt9fHVEeODZVrdpOFoZvAMeoI66iZ5reIZ-EFCIPUBRHuemJVM9ijXm65gI96ymBPs2kD4AES3zEWcCW664vOsiRRablfeBDOvv9PJpTne6drH-sV06TlcRaVVCx9sKwuy5DWB2LCx9CkF3wzfjxKzJVMOiH9JTjpcrpoWYo0ZKV_3RwtMstUtv7kl3-xcxSSJzf73cBlmc3seK9VQk5uLoRFsHSShWVRiUvSTnWkD1T7dd5lJHOSdTT5uwSN6cxa4oc0rU4tAaxkkV4kZ2jtDvs1kf1kWCF2uz8y_VKTrEtBlGp7arqlTZNj_Br3P-aRGTs_BSQLxXbZwDhaZb_G_y1)](https://editor.plantuml.com/uml/XLHDRzD04BrRydyOvL8uH155NA8gQd1eYHI943VbWeGczYIiOk-QtNMAXF9Z48UUE7BXwZ_6x6w-rGOValNil7blldnjB6fRbqKScQMG5MeimNp5N3q8kG2hQpgyqPHPb8k2u4SS0KnKBVD4QKaQNhs9etKSnT55kzs6gQcRdreeu9SuaYedQ6rjBK333eovkiff9JBgzLmyZzxW-vzII0fLvo50XTaI5nnZPsyvXDC0S07ZUbQ83D9w9ia6umvnTEUfWoKOGXxX2IhVZTvwB_vdVON2_CiC2vGPwLulEAyFcBLOeQLdg8yk0tSmFKkUN08dNx4-R1wRNye1P2OgB8AevB9VLQoBgxToWWuYx88CLBRauYPAMXIkDIvYvV7XAeJWleivPZOK7qwUJ9MLaYGjj8Pohj7mA6IsrlHPllXGsvdhFFHph2nfyx9rDW3pkOIiK9BHt7b8qD3_K0DLidnEGzDvnw5a3Pm96Ou-bEUbhVUlwwUhdt9fHVEeODZVrdpOFoZvAMeoI66iZ5reIZ-EFCIPUBRHuemJVM9ijXm65gI96ymBPs2kD4AES3zEWcCW664vOsiRRablfeBDOvv9PJpTne6drH-sV06TlcRaVVCx9sKwuy5DWB2LCx9CkF3wzfjxKzJVMOiH9JTjpcrpoWYo0ZKV_3RwtMstUtv7kl3-xcxSSJzf73cBlmc3seK9VQk5uLoRFsHSShWVRiUvSTnWkD1T7dd5lJHOSdTT5uwSN6cxa4oc0rU4tAaxkkV4kZ2jtDvs1kf1kWCF2uz8y_VKTrEtBlGp7arqlTZNj_Br3P-aRGTs_BSQLxXbZwDhaZb_G_y1)

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
```plantuml
@startuml
skinparam shadowing true
skinparam rectangle {
  RoundCorner 15
}

'--- Usuário ---
node "Usuário" as User <<device>> {
}


'--- AWS Cloud ---
package "AWS Cloud" {

    ' Public Subnet
    package "Public Subnet" as PublicSubnet {
        node "ELB" as ELB <<load_balancer>>
    }

    ' Private Subnet
    package "Private Subnet" as PrivateSubnet {
        node "EC2 - Aplicação Principal" as EC2App <<server>>{
           node "Docker Container - App" as DockerApp <<artifact>> {
                component "Infrastructure\n(Outbound Adapters)"
                component "Application\n(Use Cases)"
                component "Domain Core"
                component "Interfaces\n(Inbound Adapters)"
            }
        }
        node "EC2 - Serviço IA" as EC2IA <<server>>
        node "RDS PostgreSQL" as RDS <<database>>
    }

    ' Serviços gerenciados fora da VPC
    node "Lambda - Geração de Planos" as Lambda <<lambda>>
    node "S3 - Vídeos/PDFs" as S3 <<storage>>
}

'--- Fluxos simplificados e claros ---
User --> ELB : HTTP/HTTPS
ELB --> EC2App : Requisições da aplicação

EC2App --> EC2IA : Processamento IA
EC2App --> RDS : CRUD de dados
EC2App --> S3 : Upload/Download conteúdos
EC2App --> Lambda : Aciona geração de planos


Lambda --> RDS : Grava dados

@enduml
```
