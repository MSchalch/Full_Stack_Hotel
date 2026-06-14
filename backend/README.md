# Hotel Management System - Backend

Este é o backend do sistema de gerenciamento de hotel, desenvolvido em Java com o framework Spring Boot.

## Tecnologias e Arquitetura

O projeto utiliza uma stack robusta para o desenvolvimento de APIs RESTful:

- **Java 17+**
- **Spring Boot 3** (Web, Data JPA, Validation)
- **PostgreSQL** (Banco de dados relacional)
- **Flyway** (Controle de versionamento do banco de dados)
- **Hibernate** (Mapeamento Objeto-Relacional / ORM)
- **Maven** (Gerenciamento de dependências e build)

### Arquitetura em Camadas
O sistema adota os padrões de projeto estruturais **Facade** e **Strategy**, dividindo as responsabilidades de forma clara:
- `controller`: Expõe os endpoints da API REST (ex: `CtrlHospede`).
- `facade`: Ponto central (`Fachada`) que orquestra as regras de negócio antes de acionar a camada de persistência.
- `strategy`: Classes que encapsulam regras de validação e de negócio específicas (ex: validação de CPF, recálculo de status de pagamento).
- `dao`: Classes responsáveis pela interação direta com o banco de dados via JPA.
- `domain`: As entidades do sistema (Hóspede, Quarto, Reserva, etc.).

## Configuração e Execução

### Pré-requisitos
- JDK 17 ou superior
- Maven 3.8+
- PostgreSQL rodando localmente (ou via Docker)

### Banco de Dados
Crie um banco de dados vazio no PostgreSQL chamado `hotel_db`.
Configure as variáveis de ambiente necessárias antes de rodar o projeto (ou preencha-as no seu `application.properties`):
- `DB_HOST` (ex: `localhost:5432`)
- `DB_USER` (ex: `postgres`)
- `DB_PASSWORD` (ex: `sua-senha`)

### Executando a Aplicação
Pelo terminal, na pasta raiz do backend, execute:
```bash
mvn spring-boot:run
```
O Flyway cuidará de criar e popular as tabelas automaticamente usando os scripts de migração (pasta `db/migration`).
O servidor iniciará, por padrão, na porta `8080`.

## Estrutura de Migrações (Flyway)
- `V1__create_tables.sql`: Criação das tabelas base.
- `V2__insert_data.sql`: Carga de dados iniciais (Quartos, Promoções, etc) para facilitar o desenvolvimento e testes.

## Integrações
- **ViaCEP:** A aplicação consome a API do ViaCEP para buscar automaticamente o endereço a partir do CEP informado no cadastro do hóspede.

## ✒️ Autor / Contato

Desenvolvido por **Matheus Schalch**. Sinta-se à vontade para entrar em contato:

## 🌐 Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-schalch-79aab6189/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MSchalch)
[![E-mail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:matheus.schalch@gmail.com)
