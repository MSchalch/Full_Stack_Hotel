import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Dicionários de Tradução
const resources = {
  pt: {
    translation: {
      // Sidebar
      "menu.home": "Início",
      "menu.hospedes": "Hóspedes",
      "menu.quartos": "Quartos",
      "menu.promocoes": "Promoções",
      "menu.politicas": "Políticas",
      "menu.reservas": "Reservas",
      "menu.pagamentos": "Pagamentos",
      "menu.relatorios": "Relatórios",
      "menu.configuracoes": "Configurações",

      // Home / Dashboard
      "home.title": "Dashboard Geral",
      "home.subtitle": "Bem-vindo ao painel do Hotel do Casarão",
      "home.active_guests": "Hóspedes Ativos",
      "home.free_rooms": "Quartos Livres",
      "home.checkins_today": "Check-ins Hoje",
      "home.daily_revenue": "Faturamento Diário",

      // Hospedes
      "hospedes.title": "Gerenciar Hóspedes",
      "hospedes.subtitle": "Listagem e cadastro de hóspedes do hotel",
      "hospedes.new": "Novo Hóspede",
      "hospedes.search_placeholder": "Buscar hóspede por nome, CPF ou E-mail...",
      "hospedes.filter_age": "Filtrar por idade:",
      "hospedes.all": "Todos",
      "hospedes.adults": "Adultos (18+)",
      "hospedes.kids": "Crianças (<18)",
      "hospedes.table.name": "Nome Completo",
      "hospedes.table.cpf": "CPF",
      "hospedes.table.status": "Status",
      "hospedes.table.actions": "Ações",
      "hospedes.not_found": "Nenhum hóspede encontrado com os filtros atuais.",

      // Comuns
      "common.loading": "Carregando...",
      "common.search": "Buscar",
      "common.save": "Salvar",
      "common.cancel": "Cancelar",
      "common.new": "Novo",
      "common.edit": "Editar",
      "common.delete": "Excluir",
      "common.actions": "Ações",
      "common.status": "Status",

      // Erros do Backend (Mapeamento exato ou chaves genéricas)
      "O Nome Completo é obrigatório.": "O Nome Completo é obrigatório.",
      "O CPF é obrigatório.": "O CPF é obrigatório.",
      "CPF já cadastrado no sistema.": "CPF já cadastrado no sistema.",
      "Hóspede responsável deve ser maior de idade.": "Hóspede responsável deve ser maior de idade.",
      "O Valor do pagamento deve ser maior que zero.": "O Valor do pagamento deve ser maior que zero.",
      "Esta reserva já possui um pagamento aprovado.": "Esta reserva já possui um pagamento aprovado.",
      
      // Chaves explícitas para erros (fallback será a própria string se não achar)
      "backend_error_default": "Ocorreu um erro no servidor. Verifique os dados."
    }
  },
  en: {
    translation: {
      // Sidebar
      "menu.home": "Home",
      "menu.hospedes": "Guests",
      "menu.quartos": "Rooms",
      "menu.promocoes": "Promotions",
      "menu.politicas": "Policies",
      "menu.reservas": "Reservations",
      "menu.pagamentos": "Payments",
      "menu.relatorios": "Reports",
      "menu.configuracoes": "Settings",

      // Home / Dashboard
      "home.title": "General Dashboard",
      "home.subtitle": "Welcome to Hotel do Casarão panel",
      "home.active_guests": "Active Guests",
      "home.free_rooms": "Free Rooms",
      "home.checkins_today": "Check-ins Today",
      "home.daily_revenue": "Daily Revenue",

      // Hospedes
      "hospedes.title": "Manage Guests",
      "hospedes.subtitle": "Hotel guests list and registration",
      "hospedes.new": "New Guest",
      "hospedes.search_placeholder": "Search guest by name, CPF or E-mail...",
      "hospedes.filter_age": "Filter by age:",
      "hospedes.all": "All",
      "hospedes.adults": "Adults (18+)",
      "hospedes.kids": "Children (<18)",
      "hospedes.table.name": "Full Name",
      "hospedes.table.cpf": "CPF",
      "hospedes.table.status": "Status",
      "hospedes.table.actions": "Actions",
      "hospedes.not_found": "No guests found with the current filters.",

      // Comuns
      "common.loading": "Loading...",
      "common.search": "Search",
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.new": "New",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.actions": "Actions",
      "common.status": "Status",

      // Erros do Backend (Tradução literal das respostas do Java)
      "O Nome Completo é obrigatório.": "Full Name is required.",
      "O CPF é obrigatório.": "CPF is required.",
      "CPF já cadastrado no sistema.": "CPF is already registered.",
      "Hóspede responsável deve ser maior de idade.": "Responsible guest must be of legal age.",
      "O Valor do pagamento deve ser maior que zero.": "Payment amount must be greater than zero.",
      "Esta reserva já possui um pagamento aprovado.": "This reservation already has an approved payment.",

      "backend_error_default": "A server error occurred. Please verify your data."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'pt', // idioma padrão
    fallbackLng: 'pt',
    interpolation: {
      escapeValue: false // react já faz xss protection
    }
  });

export default i18n;
