const BRAZIL_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO",
];

function showToast(message, type = "success") {
  let container = document.getElementById("toastContainer");
  if (!container) {
    container = document.createElement("div");
    container.id = "toastContainer";
    container.className = "toast-container";
    document.body.appendChild(container);
  }
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.setAttribute("role", "alert");
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

function onlyDigits(value) {
  return (value || "").replace(/\D/g, "");
}

function applyCpfMask(value) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{3})(\d)/, "$1.$2")
    .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1-$2");
}

function applyPhoneMask(value) {
  const digits = onlyDigits(value).slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{4})(\d)/, "$1-$2");
  }
  return digits
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2");
}

function isValidCPF(cpf) {
  const numbers = onlyDigits(cpf);
  if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(numbers[i], 10) * (10 - i);
  let rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  if (rest !== parseInt(numbers[9], 10)) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(numbers[i], 10) * (11 - i);
  rest = (sum * 10) % 11;
  if (rest === 10) rest = 0;
  return rest === parseInt(numbers[10], 10);
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const today = new Date();
  const birth = new Date(`${birthDate}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return null;

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age -= 1;
  }
  return age;
}

function formatDate(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate.includes("T") ? isoDate : `${isoDate}T12:00:00`);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("pt-BR");
}

function formatDateTime(isoDate) {
  if (!isoDate) return "-";
  const date = new Date(isoDate);
  return Number.isNaN(date.getTime())
    ? "-"
    : date.toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
}

function getCourseSlugFromUrl() {
  const params = new URLSearchParams(window.location.search);
  if (params.get("slug")) return params.get("slug");
  const match = window.location.pathname.match(/\/curso\/([^/]+)/i);
  return match ? decodeURIComponent(match[1]) : null;
}

function setupMasks(form) {
  const cpf = form.querySelector('[name="cpf"]');
  const telefone = form.querySelector('[name="telefone"]');
  const whatsapp = form.querySelector('[name="whatsapp"]');

  cpf?.addEventListener("input", (e) => {
    e.target.value = applyCpfMask(e.target.value);
  });
  telefone?.addEventListener("input", (e) => {
    e.target.value = applyPhoneMask(e.target.value);
  });
  whatsapp?.addEventListener("input", (e) => {
    e.target.value = applyPhoneMask(e.target.value);
  });
}

function setButtonLoading(button, isLoading, loadingText, defaultText) {
  const spinner = button.querySelector(".spinner");
  const label = button.querySelector(".btn-label");
  button.disabled = isLoading;
  if (spinner) spinner.classList.toggle("hidden", !isLoading);
  if (label) label.textContent = isLoading ? loadingText : defaultText;
}

function populateStateSelect(select) {
  if (!select) return;
  select.innerHTML =
    '<option value="">Selecione</option>' +
    BRAZIL_STATES.map((uf) => `<option value="${uf}">${uf}</option>`).join("");
}

function populateCourseSelect(select, preselectedId) {
  if (!select) return;
  const cursos = COURSES_CATALOG.filter((c) => c.ativo);
  select.innerHTML =
    '<option value="">Selecione o curso</option>' +
    cursos
      .map(
        (c) =>
          `<option value="${c.id}" ${c.id === preselectedId ? "selected" : ""}>${c.nome}</option>`
      )
      .join("");
}

function validateInscricao(data, minAge = 16) {
  const required = [
    "nome", "data_nascimento", "cpf", "telefone",
    "whatsapp", "email", "cidade", "estado", "curso_id",
  ];

  for (const field of required) {
    if (!String(data[field] || "").trim()) {
      const labels = {
        nome: "Nome completo",
        data_nascimento: "Data de nascimento",
        cpf: "CPF",
        telefone: "Telefone",
        whatsapp: "WhatsApp",
        email: "E-mail",
        cidade: "Cidade",
        estado: "Estado",
        curso_id: "Curso desejado",
      };
      return `${labels[field] || field} é obrigatório.`;
    }
  }

  if (!isValidCPF(data.cpf)) return "CPF inválido.";
  if (onlyDigits(data.telefone).length < 10) return "Telefone inválido.";
  if (onlyDigits(data.whatsapp).length < 10) return "WhatsApp inválido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "E-mail inválido.";

  const age = calcAge(data.data_nascimento);
  const curso = LocalDB.getCursoById(data.curso_id);
  const requiredAge = curso?.idade_minima || minAge;

  if (age === null) return "Data de nascimento inválida.";
  if (age < requiredAge) {
    return `É necessário ter no mínimo ${requiredAge} anos para se inscrever neste curso.`;
  }

  return null;
}

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function exportToCSV(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val) => `"${String(val ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.join(";"),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(";")),
  ];
  downloadFile("\uFEFF" + lines.join("\n"), filename, "text/csv;charset=utf-8");
}

function exportToExcel(rows, filename) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val) => String(val ?? "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const tableRows = rows
    .map(
      (row) =>
        `<tr>${headers.map((h) => `<td>${escape(row[h])}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:x="urn:schemas-microsoft-com:office:excel"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="UTF-8"></head>
    <body>
      <table border="1">
        <thead><tr>${headers.map((h) => `<th>${escape(h)}</th>`).join("")}</tr></thead>
        <tbody>${tableRows}</tbody>
      </table>
    </body></html>`;

  downloadFile(html, filename, "application/vnd.ms-excel");
}

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

function initRevealAnimations() {
  const elements = document.querySelectorAll(".reveal");
  if (!elements.length || !("IntersectionObserver" in window)) {
    elements.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elements.forEach((el) => observer.observe(el));
}

function getIconSvg(name) {
  const icons = {
    certificado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 15l-2 5 2-1 2 1-2-5z"/><rect x="3" y="4" width="18" height="14" rx="2"/></svg>',
    professor: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>',
    pratica: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7z"/></svg>',
    mercado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 9l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 21V12h6v9"/></svg>',
    whatsapp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M14 8h3V4h-3c-2.761 0-5 2.239-5 5v3H6v4h3v8h4v-8h3.5l.5-4H13V9c0-1.105.895-2 2-2z"/></svg>',
    email: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    location: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  };
  return icons[name] || "";
}
