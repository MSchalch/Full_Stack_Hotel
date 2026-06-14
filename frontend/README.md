# Hotel Management System - Frontend

Este é o frontend da aplicação de gerenciamento de hotel, uma Single Page Application (SPA) reativa e rica em interatividade.

## Tecnologias Utilizadas

- **React 19**
- **Vite** (Build tool extremamente rápido para projetos React modernos)
- **React Router DOM v7** (Gerenciamento de rotas e navegação da SPA)
- **Axios** (Cliente HTTP para comunicação com a API Rest do backend)
- **i18next & react-i18next** (Internacionalização da plataforma: PT-BR e EN)
- **Lucide React** (Pacote de ícones SVG modernos)
- **CSS Vanilla (Custom Properties)** (Design robusto com variáveis nativas e suporte nativo a temas visuais)

## Principais Funcionalidades

O sistema conta com um layout responsivo de navegação em barra lateral, cobrindo todo o ciclo operacional de um hotel:
- **Dashboard (Home):** Visão geral de métricas.
- **Hóspedes:** Cadastro e gestão de dados com integração de CEP automática.
- **Quartos:** Controle de ocupação e capacidades.
- **Políticas e Promoções:** Parâmetros gerenciais de flexibilidade financeira.
- **Reservas:** Motor completo calculando valores com base na estadia, quantidade de hóspedes e promoções aplicáveis.
- **Pagamentos:** Modulo financeiro com controle rigoroso de status.
- **Internacionalização:** Sistema inteligente de idiomas que traduz tanto o HTML quanto os alertas de erro oriundos do Backend dinamicamente.

## Configuração e Execução

### Pré-requisitos
- Node.js versão 18+ ou 20+ instalada
- NPM ou Yarn

### Instalação de Dependências
Para iniciar, acesse a pasta do frontend e instale os pacotes:
```bash
npm install
```

### Executando em Ambiente de Desenvolvimento
Basta usar o comando:
```bash
npm run dev
```
O Vite subirá a aplicação muito rapidamente. Acesse pelo endereço exibido no console (geralmente `http://localhost:5173`).

### Gerando Build para Produção
Para gerar a versão otimizada (minificada) para implantação em servidores estáticos:
```bash
npm run build
```

## Comunicação com a API
A integração com o servidor backend está centralizada no arquivo `src/services/api.js`. Por padrão, as requisições apontam para `http://localhost:8080/api`. Caso precise alterar a base URL em ambiente de produção, modifique a instância do Axios neste arquivo.

## ✒️ Autor / Contato

Desenvolvido por **Matheus Schalch**. Sinta-se à vontade para entrar em contato:

## 🌐 Contato

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/matheus-schalch-79aab6189/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/MSchalch)
[![E-mail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:matheus.schalch@gmail.com)
