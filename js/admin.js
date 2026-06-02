const adminLoginCard = document.getElementById("adminLoginCard");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const statsContainer = document.getElementById("statsContainer");
const recentList = document.getElementById("recentList");
const tableBody = document.getElementById("inscricoesTableBody");
const searchInput = document.getElementById("searchInput");
const filterCurso = document.getElementById("filterCurso");
const filterDataInicio = document.getElementById("filterDataInicio");
const filterDataFim = document.getElementById("filterDataFim");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");
const exportCsvBtn = document.getElementById("exportCsvBtn");
const exportExcelBtn = document.getElementById("exportExcelBtn");
const modalContainer = document.getElementById("modalContainer");

let allInscricoes = [];

function getCursoNome(cursoId) {
  const curso = LocalDB.getCursoById(cursoId);
  return curso ? curso.nome : cursoId;
}

function enrichInscricao(item) {
  return {
    ...item,
    idade: calcAge(item.data_nascimento),
    curso_nome: getCursoNome(item.curso_id),
  };
}

async function renderStats() {
  const stats = await VisaoDB.getStatsInscricoes();
  const porCursoHtml = Object.values(stats.porCurso)
    .map((c) => `<small>${c.nome}: <strong>${c.total}</strong></small>`)
    .join("");

  statsContainer.innerHTML = `
    <div class="card stat-card">
      <span>Total de inscritos</span>
      <strong>${stats.total}</strong>
    </div>
    <div class="card stat-card">
      <span>Inscrições por curso</span>
      <div style="display:grid;gap:4px">${porCursoHtml}</div>
    </div>`;
}

async function renderRecent() {
  const stats = await VisaoDB.getStatsInscricoes();
  if (!stats.recentes.length) {
    recentList.innerHTML = '<p style="color:var(--muted);font-size:0.9rem">Nenhuma inscrição recente.</p>';
    return;
  }

  recentList.innerHTML = stats.recentes
    .map((item) => {
      const enriched = enrichInscricao(item);
      return `
        <div class="recent-item">
          <span>${enriched.nome} — ${enriched.curso_nome}</span>
          <button type="button" data-view-id="${item.id}">Ver detalhes</button>
        </div>`;
    })
    .join("");
}

function getFilteredInscricoes() {
  const term = (searchInput?.value || "").toLowerCase().trim();
  const curso = filterCurso?.value || "";
  const dataInicio = filterDataInicio?.value || "";
  const dataFim = filterDataFim?.value || "";

  return allInscricoes.filter((item) => {
    const enriched = enrichInscricao(item);

    if (curso && item.curso_id !== curso) return false;

    if (dataInicio) {
      const inscricaoDate = new Date(item.data_inscricao);
      const start = new Date(`${dataInicio}T00:00:00`);
      if (inscricaoDate < start) return false;
    }

    if (dataFim) {
      const inscricaoDate = new Date(item.data_inscricao);
      const end = new Date(`${dataFim}T23:59:59`);
      if (inscricaoDate > end) return false;
    }

    if (!term) return true;

    const byName = item.nome.toLowerCase().includes(term);
    const byCpf = item.cpf.replace(/\D/g, "").includes(term.replace(/\D/g, ""));
    const byEmail = item.email.toLowerCase().includes(term);
    return byName || byCpf || byEmail;
  });
}

function renderTable(data) {
  tableBody.innerHTML = "";
  if (!data.length) {
    tableBody.innerHTML = `<tr><td colspan="9">Nenhum inscrito encontrado.</td></tr>`;
    return;
  }

  tableBody.innerHTML = data
    .map((item) => {
      const enriched = enrichInscricao(item);
      return `
        <tr>
          <td>${enriched.nome}</td>
          <td>${enriched.idade ?? "-"}</td>
          <td>${enriched.curso_nome}</td>
          <td>${enriched.telefone}</td>
          <td>${enriched.whatsapp}</td>
          <td>${enriched.email}</td>
          <td>${enriched.cidade}</td>
          <td>${formatDateTime(enriched.data_inscricao)}</td>
          <td>
            <div class="row-actions">
              <button class="btn-view" data-view-id="${item.id}">Ver</button>
              <button class="btn-delete" data-id="${item.id}">Excluir</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

function filterAndRender() {
  renderTable(getFilteredInscricoes());
}

function populateCursoFilter() {
  if (!filterCurso) return;
  const cursos = COURSES_CATALOG.filter((c) => c.ativo);
  filterCurso.innerHTML =
    '<option value="">Todos</option>' +
    cursos.map((c) => `<option value="${c.id}">${c.nome}</option>`).join("");
}

function showInscricaoModal(id) {
  const item = allInscricoes.find((i) => String(i.id) === String(id));
  if (!item) {
    showToast("Inscrição não encontrada.", "error");
    return;
  }

  const enriched = enrichInscricao(item);
  modalContainer.innerHTML = `
    <div class="modal-overlay" id="modalOverlay" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
      <div class="card modal">
        <button class="modal-close" id="modalClose" aria-label="Fechar">&times;</button>
        <h2 id="modalTitle">Detalhes do inscrito</h2>
        <div class="detail-grid">
          <div class="detail-item"><span>Nome</span><strong>${enriched.nome}</strong></div>
          <div class="detail-item"><span>Idade</span><strong>${enriched.idade ?? "-"} anos</strong></div>
          <div class="detail-item"><span>Data de nascimento</span><strong>${formatDate(enriched.data_nascimento)}</strong></div>
          <div class="detail-item"><span>CPF</span><strong>${enriched.cpf}</strong></div>
          <div class="detail-item"><span>Telefone</span><strong>${enriched.telefone}</strong></div>
          <div class="detail-item"><span>WhatsApp</span><strong>${enriched.whatsapp}</strong></div>
          <div class="detail-item"><span>E-mail</span><strong>${enriched.email}</strong></div>
          <div class="detail-item"><span>Cidade</span><strong>${enriched.cidade}</strong></div>
          <div class="detail-item"><span>Estado</span><strong>${enriched.estado}</strong></div>
          <div class="detail-item"><span>Curso</span><strong>${enriched.curso_nome}</strong></div>
          <div class="detail-item full"><span>Data da inscrição</span><strong>${formatDateTime(enriched.data_inscricao)}</strong></div>
        </div>
      </div>
    </div>`;

  document.getElementById("modalClose").addEventListener("click", closeModal);
  document.getElementById("modalOverlay").addEventListener("click", (e) => {
    if (e.target.id === "modalOverlay") closeModal();
  });
}

function closeModal() {
  modalContainer.innerHTML = "";
}

function prepareExportRows(data) {
  return data.map((item) => {
    const enriched = enrichInscricao(item);
    return {
      Nome: enriched.nome,
      Idade: enriched.idade ?? "",
      "Data Nascimento": formatDate(enriched.data_nascimento),
      CPF: enriched.cpf,
      Telefone: enriched.telefone,
      WhatsApp: enriched.whatsapp,
      Email: enriched.email,
      Cidade: enriched.cidade,
      Estado: enriched.estado,
      Curso: enriched.curso_nome,
      "Data Inscrição": formatDateTime(enriched.data_inscricao),
    };
  });
}

async function loadInscricoes() {
  allInscricoes = await VisaoDB.listInscricoes();
  await renderStats();
  await renderRecent();
  filterAndRender();
}

async function checkAuthAndInitialize() {
  if (!(await VisaoDB.isAdminLoggedIn())) {
    adminLoginCard.classList.remove("hidden");
    adminDashboard.classList.add("hidden");
    return;
  }

  adminLoginCard.classList.add("hidden");
  adminDashboard.classList.remove("hidden");
  populateCursoFilter();

  try {
    await loadInscricoes();
  } catch (err) {
    showToast(err.message || "Erro ao carregar inscritos.", "error");
  }
}

adminLoginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const email = document.getElementById("adminEmail").value.trim().toLowerCase();
  const password = document.getElementById("adminPassword").value;

  if (!email || !password) {
    showToast("Informe e-mail e senha.", "error");
    return;
  }

  setButtonLoading(loginBtn, true, "Entrando...", "Entrar");
  try {
    await VisaoDB.loginAdmin(email, password);
    showToast("Login realizado com sucesso!");
    adminLoginForm.reset();
    await checkAuthAndInitialize();
  } catch (err) {
    showToast(err.message || "Erro ao realizar login.", "error");
  } finally {
    setButtonLoading(loginBtn, false, "Entrando...", "Entrar");
  }
});

logoutBtn?.addEventListener("click", async () => {
  await VisaoDB.logoutAdmin();
  showToast("Sessão finalizada.");
  adminDashboard.classList.add("hidden");
  adminLoginCard.classList.remove("hidden");
});

[searchInput, filterCurso, filterDataInicio, filterDataFim].forEach((el) => {
  el?.addEventListener("input", filterAndRender);
  el?.addEventListener("change", filterAndRender);
});

exportCsvBtn?.addEventListener("click", () => {
  const data = getFilteredInscricoes();
  if (!data.length) {
    showToast("Nenhum dado para exportar.", "error");
    return;
  }
  exportToCSV(prepareExportRows(data), `inscricoes_${Date.now()}.csv`);
  showToast("CSV exportado com sucesso!");
});

exportExcelBtn?.addEventListener("click", () => {
  const data = getFilteredInscricoes();
  if (!data.length) {
    showToast("Nenhum dado para exportar.", "error");
    return;
  }
  exportToExcel(prepareExportRows(data), `inscricoes_${Date.now()}.xls`);
  showToast("Excel exportado com sucesso!");
});

document.addEventListener("click", async (event) => {
  const viewBtn = event.target.closest("[data-view-id]");
  if (viewBtn) {
    showInscricaoModal(viewBtn.getAttribute("data-view-id"));
    return;
  }

  const deleteBtn = event.target.closest(".btn-delete");
  if (!deleteBtn) return;

  const id = deleteBtn.getAttribute("data-id");
  if (!id) return;

  const confirmed = window.confirm("Deseja realmente excluir esta inscrição?");
  if (!confirmed) return;

  try {
    await VisaoDB.deleteInscricao(id);
    showToast("Inscrição excluída com sucesso.");
    await loadInscricoes();
  } catch (err) {
    showToast(err.message || "Erro ao excluir inscrição.", "error");
  }
});

checkAuthAndInitialize();
