const form = document.getElementById("inscricaoForm");
const submitBtn = document.getElementById("submitBtn");
const cpfInput = document.getElementById("cpf");
const telefoneInput = document.getElementById("telefone");
const whatsappInput = document.getElementById("whatsapp");

function showToast(message, type = "success") {
  const container = document.getElementById("toastContainer");
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3500);
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

function setLoading(isLoading) {
  const spinner = submitBtn.querySelector(".spinner");
  const label = submitBtn.querySelector(".btn-label");
  submitBtn.disabled = isLoading;
  spinner.classList.toggle("hidden", !isLoading);
  label.textContent = isLoading ? "Enviando..." : "Enviar inscrição";
}

function isValidCPF(cpf) {
  const numbers = onlyDigits(cpf);
  if (numbers.length !== 11 || /^(\d)\1+$/.test(numbers)) return false;
  return true;
}

function validateForm(data) {
  const requiredFields = [
    "nome",
    "cpf",
    "idade",
    "nascimento",
    "telefone",
    "whatsapp",
    "email",
    "cidade",
    "bairro",
  ];

  for (const field of requiredFields) {
    if (!String(data[field] || "").trim()) {
      return `${field.toUpperCase()} é obrigatório.`;
    }
  }

  if (!isValidCPF(data.cpf)) return "CPF inválido.";
  if (onlyDigits(data.telefone).length < 10) return "Telefone inválido.";
  if (onlyDigits(data.whatsapp).length < 10) return "WhatsApp inválido.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) return "E-mail inválido.";
  if (Number(data.idade) < 10 || Number(data.idade) > 99) return "Idade inválida.";
  return null;
}

cpfInput?.addEventListener("input", (event) => {
  event.target.value = applyCpfMask(event.target.value);
});

telefoneInput?.addEventListener("input", (event) => {
  event.target.value = applyPhoneMask(event.target.value);
});

whatsappInput?.addEventListener("input", (event) => {
  event.target.value = applyPhoneMask(event.target.value);
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nome: form.nome.value.trim(),
    cpf: applyCpfMask(form.cpf.value),
    idade: Number(form.idade.value),
    nascimento: form.nascimento.value,
    telefone: applyPhoneMask(form.telefone.value),
    whatsapp: applyPhoneMask(form.whatsapp.value),
    email: form.email.value.trim().toLowerCase(),
    cidade: form.cidade.value.trim(),
    bairro: form.bairro.value.trim(),
  };

  const formError = validateForm(payload);
  if (formError) {
    showToast(formError, "error");
    return;
  }

  setLoading(true);
  try {
    LocalDB.addInscricao(payload);
    form.reset();
    showToast("Inscrição enviada com sucesso!");
  } catch (err) {
    showToast(err.message || "Erro ao enviar inscrição.", "error");
  } finally {
    setLoading(false);
  }
});
