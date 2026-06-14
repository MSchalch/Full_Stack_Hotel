# 🏨 Visão Geral do Sistema Hoteleiro

Este documento fornece um resumo completo sobre as funcionalidades e arquitetura técnica do Sistema de Gestão Hoteleira desenvolvido, detalhando as capacidades de negócio e a stack de tecnologias.

---

## 🎯 Funcionalidades do Sistema (Módulos)

O sistema é dividido em diversos módulos de gestão interligados, permitindo uma administração fluida e completa de um hotel:

### 1. Gestão de Hóspedes (CRUD)
- **Funcionalidades:** Cadastro, edição, listagem e inativação de hóspedes (soft delete).
- **Dados Coletados:** Informações pessoais (Nome, CPF, Data de Nascimento), Contato (E-mail, Telefone) e Endereço completo.
- **Destaque:** Ordenação inteligente, apresentando hóspedes ativos no topo organizados em ordem alfabética.

### 2. Gestão de Quartos (CRUD)
- **Funcionalidades:** Controle total do inventário de quartos do hotel.
- **Dados:** Número do quarto, Tipo (Standard, Luxo, Suíte, etc.), Preço base e Capacidades (Máximo de adultos e crianças suportado).

### 3. Gestão de Políticas de Cancelamento e Promoções
- **Políticas:** Definição de regras que estipulam um limite de antecedência para cancelamentos (em horas) e se permitem estorno do valor. Em caso de multa, cobra-se a porcentagem configurada.
- **Promoções:** Cadastro de campanhas promocionais ativas que aplicam descontos no valor da reserva.

### 4. Gestão de Reservas (Core do Negócio)
- **Funcionalidades:** O módulo mais complexo, que une todas as outras entidades.
- **Mecânica:** 
  - Exige a seleção de um **Hóspede principal**.
  - Permite a vinculação de **Múltiplos Acompanhantes** (identificando automaticamente através da data de nascimento quem é adulto ou criança).
  - Associa a reserva a um Quarto, Política de Cancelamento e Promoção.
  - Define Período de Check-in e Check-out.
- **Estados (Status):** Gerencia o ciclo de vida da reserva através dos status: `PROPOSTA` (Aguardando Pagamento), `ESTADIA` (Em andamento), `CHECKOUT` (Finalizada), `CANCELADA` e `NO SHOW`.

### 5. Gestão Financeira (Pagamentos)
- **Funcionalidades:** Lançamento de transações atreladas às Reservas.
- **Mecânica:** Suporta múltiplos métodos de pagamento (Pix, Cartão de Crédito/Débito, Boleto, Dinheiro) e acompanha o ciclo financeiro através de status (`PENDENTE`, `APROVADO`, `ESTORNADO`).
- **Automação:** Ao estornar um pagamento, emite um alerta que as reservas podem ser canceladas.

### 6. Infraestrutura Cross-Cutting
- **Tradução (i18n):** O sistema web possui suporte multi-idioma integrado (Português e Inglês).
- **Paginação:** As listagens suportam massas colossais de dados devido a paginação *Server-Side*, melhorando drásticamente o desempenho.

---

## 🛠 Tecnologias Utilizadas

A aplicação foi construída com tecnologias e padrões de projetos amplamente adotados na indústria (Stack Java + React).

### Backend (Servidor & API)
- **Linguagem:** Java (versão 17+ recomendada).
- **Framework Principal:** Spring Boot (Módulos: Spring Web, Spring Data JPA).
- **Banco de Dados:** PostgreSQL (Configurado localmente).
- **Migrations:** Flyway (Versionamento das tabelas do banco de dados e dados iniciais).
- **Mapeamento Objeto-Relacional (ORM):** Hibernate.
- **Boilerplate Reduction:** Lombok (Reduz getters, setters e construtores verbosos).
- **Arquitetura (Design Patterns):** 
  - **Facade Pattern** (`IFacade` e `Fachada`): Centraliza as chamadas de toda a aplicação em um único ponto de entrada para os controladores.
  - **Strategy Pattern** (`IStrategy`): Implementação de validações flexíveis e regras de negócio antes de salvar no banco de dados.
  - **DAO Pattern** (`IDAO`): Classes que encapsulam a comunicação direta com o Entity Manager e banco de dados.

### Frontend (Interface Web)
- **Linguagem:** JavaScript (EcmaScript).
- **Framework Principal:** React 19.
- **Ferramenta de Build/Tooling:** Vite (Proporcionando tempo de carregamento e HMR instantâneos).
- **Roteamento:** React Router DOM v7 (Navegação SPA).
- **Estilização:** CSS Vanilla com forte utilização de Variáveis CSS (Tema Escuro/Clean, Design Responsivo, Flexbox e Grid).
- **Consumo de APIs:** Axios (Com interceptadores de requisição base url).
- **Internacionalização:** i18next & react-i18next (Gerencia os dicionários JSON para múltiplos idiomas).
- **Ícones:** Lucide React (Biblioteca de ícones vetoriais modernos e otimizados).
