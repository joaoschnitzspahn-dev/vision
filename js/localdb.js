/*
  Banco de dados local (localStorage)
  Tabelas: cursos, inscrições, administradores, mensagens_contato
*/

const STORAGE_KEYS = {
  cursos: "visao_nobre_cursos",
  inscricoes: "visao_nobre_inscricoes",
  admins: "visao_nobre_admins",
  mensagens: "visao_nobre_mensagens_contato",
  adminSession: "visao_nobre_admin_session",
};

const DEFAULT_ADMIN = {
  id: "admin_1",
  nome: "Administrador",
  email: "admin@visaonobre.com.br",
  senha: "123456",
};

async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function readTable(key) {
  const raw = localStorage.getItem(key);
  const parsed = raw ? JSON.parse(raw) : [];
  return Array.isArray(parsed) ? parsed : [];
}

function writeTable(key, items) {
  localStorage.setItem(key, JSON.stringify(items));
}

const LocalDB = {
  init() {
    this.seedCursos();
    this.seedAdmins();
  },

  seedCursos() {
    const existing = readTable(STORAGE_KEYS.cursos);
    if (existing.length) return;

    const cursos = COURSES_CATALOG.map((course) => ({
      id: course.id,
      nome: course.nome,
      slug: course.slug,
      descricao: course.descricao_curta,
      idade_minima: course.idade_minima,
      imagem: course.imagem,
      ativo: course.ativo,
    }));
    writeTable(STORAGE_KEYS.cursos, cursos);
  },

  async seedAdmins() {
    const existing = readTable(STORAGE_KEYS.admins);
    if (existing.length) return;

    const senha_hash = await hashPassword(DEFAULT_ADMIN.senha);
    writeTable(STORAGE_KEYS.admins, [
      {
        id: DEFAULT_ADMIN.id,
        nome: DEFAULT_ADMIN.nome,
        email: DEFAULT_ADMIN.email,
        senha_hash,
      },
    ]);
  },

  getCursos(onlyActive = true) {
    const cursos = readTable(STORAGE_KEYS.cursos);
    return onlyActive ? cursos.filter((c) => c.ativo) : cursos;
  },

  getCursoBySlug(slug) {
    const catalog = COURSES_CATALOG.find((c) => c.slug === slug && c.ativo);
    if (!catalog) return null;
    const db = readTable(STORAGE_KEYS.cursos).find((c) => c.slug === slug);
    return db ? { ...catalog, ...db } : catalog;
  },

  getCursoById(id) {
    const catalog = COURSES_CATALOG.find((c) => c.id === id && c.ativo);
    if (!catalog) return null;
    const db = readTable(STORAGE_KEYS.cursos).find((c) => c.id === id);
    return db ? { ...catalog, ...db } : catalog;
  },

  listInscricoes() {
    return readTable(STORAGE_KEYS.inscricoes).sort(
      (a, b) => new Date(b.data_inscricao) - new Date(a.data_inscricao)
    );
  },

  getInscricao(id) {
    return this.listInscricoes().find((item) => String(item.id) === String(id)) || null;
  },

  addInscricao(payload) {
    const items = readTable(STORAGE_KEYS.inscricoes);
    const duplicateCpf = items.some(
      (item) =>
        item.cpf === payload.cpf && String(item.curso_id) === String(payload.curso_id)
    );
    if (duplicateCpf) {
      throw new Error("Este CPF já está inscrito neste curso.");
    }

    const record = {
      id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      nome: payload.nome,
      data_nascimento: payload.data_nascimento,
      cpf: payload.cpf,
      telefone: payload.telefone,
      whatsapp: payload.whatsapp,
      email: payload.email,
      cidade: payload.cidade,
      estado: payload.estado,
      curso_id: payload.curso_id,
      data_inscricao: new Date().toISOString(),
    };

    items.unshift(record);
    writeTable(STORAGE_KEYS.inscricoes, items);
    return record;
  },

  deleteInscricao(id) {
    const items = readTable(STORAGE_KEYS.inscricoes);
    writeTable(
      STORAGE_KEYS.inscricoes,
      items.filter((item) => String(item.id) !== String(id))
    );
  },

  addMensagemContato(payload) {
    const items = readTable(STORAGE_KEYS.mensagens);
    const record = {
      id: `${Date.now()}_${Math.floor(Math.random() * 100000)}`,
      ...payload,
      data_envio: new Date().toISOString(),
    };
    items.unshift(record);
    writeTable(STORAGE_KEYS.mensagens, items);
    return record;
  },

  getStatsInscricoes() {
    const inscricoes = this.listInscricoes();
    const porCurso = {};

    COURSES_CATALOG.forEach((course) => {
      porCurso[course.id] = {
        nome: course.nome,
        total: 0,
      };
    });

    inscricoes.forEach((item) => {
      if (!porCurso[item.curso_id]) {
        porCurso[item.curso_id] = { nome: item.curso_id, total: 0 };
      }
      porCurso[item.curso_id].total += 1;
    });

    return {
      total: inscricoes.length,
      porCurso,
      recentes: inscricoes.slice(0, 5),
    };
  },

  async loginAdmin(email, password) {
    await this.seedAdmins();
    const admins = readTable(STORAGE_KEYS.admins);
    const admin = admins.find(
      (item) => item.email.toLowerCase() === (email || "").trim().toLowerCase()
    );
    if (!admin) throw new Error("E-mail ou senha inválidos.");

    const senha_hash = await hashPassword(password);
    if (senha_hash !== admin.senha_hash) {
      throw new Error("E-mail ou senha inválidos.");
    }

    sessionStorage.setItem(
      STORAGE_KEYS.adminSession,
      JSON.stringify({ id: admin.id, email: admin.email, nome: admin.nome })
    );
  },

  logoutAdmin() {
    sessionStorage.removeItem(STORAGE_KEYS.adminSession);
  },

  isAdminLoggedIn() {
    return !!sessionStorage.getItem(STORAGE_KEYS.adminSession);
  },

  getAdminSession() {
    const raw = sessionStorage.getItem(STORAGE_KEYS.adminSession);
    return raw ? JSON.parse(raw) : null;
  },
};

LocalDB.init();
