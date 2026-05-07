/*
  SISTEMA LOCAL (SEM SUPABASE)
  --------------------------------
  Este projeto funciona 100% no navegador usando localStorage.
  Assim, não depende de banco externo para começar a usar.

  IMPORTANTE:
  - Os dados ficam salvos somente no navegador/dispositivo atual.
  - Se limpar cache/localStorage, os dados serão apagados.
  - O login admin local é prático, mas não é seguro para produção real.
*/

const STORAGE_KEYS = {
  inscricoes: "visao_nobre_inscricoes",
  adminSession: "visao_nobre_admin_session",
};

/*
  CREDENCIAIS DO ADMIN LOCAL
  --------------------------------
  Troque estes dados para os que você quiser usar no admin.html.
*/
const ADMIN_CREDENTIALS = {
  email: "admin@visaonobre.com.br",
  password: "123456",
};

const LocalDB = {
  listInscricoes() {
    const raw = localStorage.getItem(STORAGE_KEYS.inscricoes);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  },

  saveInscricoes(items) {
    localStorage.setItem(STORAGE_KEYS.inscricoes, JSON.stringify(items));
  },

  addInscricao(payload) {
    const items = this.listInscricoes();
    const duplicateCpf = items.some((item) => item.cpf === payload.cpf);
    if (duplicateCpf) {
      throw new Error("Este CPF já foi inscrito.");
    }

    const record = {
      ...payload,
      id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      created_at: new Date().toISOString(),
    };
    items.unshift(record);
    this.saveInscricoes(items);
    return record;
  },

  deleteInscricao(id) {
    const items = this.listInscricoes();
    const filtered = items.filter((item) => String(item.id) !== String(id));
    this.saveInscricoes(filtered);
  },

  loginAdmin(email, password) {
    const validEmail = (email || "").trim().toLowerCase() === ADMIN_CREDENTIALS.email;
    const validPassword = password === ADMIN_CREDENTIALS.password;
    if (!validEmail || !validPassword) {
      throw new Error("E-mail ou senha inválidos.");
    }
    sessionStorage.setItem(STORAGE_KEYS.adminSession, "1");
  },

  logoutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
  },

  isAdminLoggedIn() {
    return sessionStorage.getItem(STORAGE_KEYS.adminSession) === "1";
  },
};
