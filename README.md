# 🏨 Sistema de Gestão Hoteleira (Full-Stack)

Bem-vindo ao repositório principal do **Projeto Full Stack Hotel**. 
Este sistema é uma plataforma de ponta a ponta desenvolvida para cobrir todo o ciclo operacional de um hotel, combinando um Backend robusto e escalável em Java com uma interface Frontend moderna, rápida e multi-idioma (i18n).

## 🚀 Arquitetura do Projeto

O repositório está dividido em dois projetos principais:

- 📁 [**Backend**](./backend/README.md): Uma API RESTful construída com **Java 17+** e **Spring Boot 3**. Utiliza **PostgreSQL** para o banco de dados (gerenciado via **Flyway**) e implementa Padrões de Projeto maduros como *Facade*, *Strategy* e *DAO* para as regras de negócio de hóspedes, reservas e faturamento.
- 📁 [**Frontend**](./frontend/README.md): Uma Single Page Application (SPA) construída com **React 19** e **Vite**. Conta com paginação de dados otimizada, design moderno (com **CSS puro e variáveis**), chamadas HTTP via **Axios** e internacionalização multi-idioma dinâmica via **i18next**.

Para entender a fundo a implementação, visualizar como instalar as dependências e como rodar cada parte, **acesse o `README.md` específico dentro das pastas listadas acima.**

## 🎯 Principais Funcionalidades

A plataforma oferece painéis dedicados com paginação ágil no banco de dados para:
- **Hóspedes**: Controle de cadastros (com integração automática de CEP via ViaCEP) e acompanhantes.
- **Quartos**: Inventário, capacidades (adultos/crianças) e preços base.
- **Políticas e Promoções**: Motor de regras flexíveis de descontos, multas e possibilidade de estorno de valores em horas definidas.
- **Reservas**: Gestão inteligente de status (Proposta, Estadia, Checkout, Cancelada) atrelando quartos, hóspedes e calculando ocupações automaticamente.
- **Pagamentos**: Modulo financeiro abrangente rastreando cada transação e seus estornos.

## ✒️ Autor / Contato

Desenvolvido por **Matheus Schalch**. Sinta-se à vontade para entrar em contato:

## 🌐 Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-schalch-79aab6189/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MSchalch)
[![E-mail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:matheus.schalch@gmail.com)
