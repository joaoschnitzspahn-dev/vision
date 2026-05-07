const adminLoginCard = document.getElementById("adminLoginCard");
const adminDashboard = document.getElementById("adminDashboard");
const adminLoginForm = document.getElementById("adminLoginForm");
const totalInscritosEl = document.getElementById("totalInscritos");
const tableBody = document.getElementById("inscricoesTableBody");
const searchInput = document.getElementById("searchInput");
const logoutBtn = document.getElementById("logoutBtn");
const loginBtn = document.getElementById("loginBtn");

let allInscricoes = [];

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
}

function setLoginLoading(isLoading) {
  const spinner = loginBtn.querySelector(".spinner");
  const label = loginBtn.querySelector(".btn-label");
  loginBtn.disabled = isLoading;
  spinner.classList.toggle("hidden", !isLoading);
  label.textContent = isLoading ? "Entrando..." : "Entrar";
}

function formatDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("pt-BR");
}

function renderTable(data) {
  tableBody.innerHTML = "";
  if (!data.length) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="11">Nenhum inscrito encontrado.</td>
      </tr>
    `;
    return;
  }

  const rows = data
    .map(
      (item) => `
      <tr>
        <td>${item.nome}</td>
        <td>${item.cpf}</td>
        <td>${item.idade}</td>
        <td>${formatDate(item.nascimento)}</td>
        <td>${item.telefone}</td>
        <td>${item.whatsapp}</td>
        <td>${item.email}</td>
        <td>${item.cidade}</td>
        <td>${item.bairro}</td>
        <td>${formatDate(item.created_at)}</td>
        <td>
          <button class="btn-delete" data-id="${item.id}">Excluir</button>
        </td>
      </tr>
    `
    )
    .join("");

  tableBody.innerHTML = rows;
}

function filterAndRender() {
  const term = (searchInput.value || "").toLowerCase().trim();
  if (!term) {
    renderTable(allInscricoes);
    return;
  }

  const filtered = allInscricoes.filter((item) => {
    const byName = item.nome.toLowerCase().includes(term);
    const byCpf = item.cpf.replace(/\D/g, "").includes(term.replace(/\D/g, ""));
    return byName || byCpf;
  });
  renderTable(filtered);
}

async function loadInscricoes() {
  const { data, error } = await supabaseClient
    .from("inscricoes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  allInscricoes = data || [];
  totalInscritosEl.textContent = String(allInscricoes.length);
  filterAndRender();
}

async function checkAuthAndInitialize() {
  if (!supabaseClient || SUPABASE_URL.includes("COLE_AQUI")) {
    showToast("Configure o Supabase em supabase.js antes de usar o painel.", "error");
    return;
  }

  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    showToast("Erro ao validar sessão.", "error");
    return;
  }

  const user = data?.session?.user || null;
  if (!user) {
    adminLoginCard.classList.remove("hidden");
    adminDashboard.classList.add("hidden");
    return;
  }

  if (!isAdminEmail(user.email)) {
    await supabaseClient.auth.signOut();
    adminLoginCard.classList.remove("hidden");
    adminDashboard.classList.add("hidden");
    showToast("Acesso negado: usuário não autorizado como administrador.", "error");
    return;
  }

  adminLoginCard.classList.add("hidden");
  adminDashboard.classList.remove("hidden");

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

  setLoginLoading(true);
  try {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    if (!isAdminEmail(data.user?.email)) {
      await supabaseClient.auth.signOut();
      throw new Error("Usuário não está autorizado como administrador.");
    }

    showToast("Login realizado com sucesso!");
    adminLoginForm.reset();
    await checkAuthAndInitialize();
  } catch (err) {
    showToast(err.message || "Erro ao realizar login.", "error");
  } finally {
    setLoginLoading(false);
  }
});

logoutBtn?.addEventListener("click", async () => {
  await supabaseClient.auth.signOut();
  showToast("Sessão finalizada.");
  adminDashboard.classList.add("hidden");
  adminLoginCard.classList.remove("hidden");
});

searchInput?.addEventListener("input", () => {
  filterAndRender();
});

tableBody?.addEventListener("click", async (event) => {
  const button = event.target.closest(".btn-delete");
  if (!button) return;

  const id = button.getAttribute("data-id");
  if (!id) return;

  const confirmed = window.confirm("Deseja realmente excluir esta inscrição?");
  if (!confirmed) return;

  try {
    const { error } = await supabaseClient.from("inscricoes").delete().eq("id", id);
    if (error) throw error;
    showToast("Inscrição excluída com sucesso.");
    await loadInscricoes();
  } catch (err) {
    showToast(err.message || "Erro ao excluir inscrição.", "error");
  }
});

checkAuthAndInitialize();
