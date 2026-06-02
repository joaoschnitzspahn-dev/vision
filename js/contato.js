initLayout("contato");

const icons = document.querySelectorAll(".contact-info-item .icon");
if (icons[0]) icons[0].innerHTML = getIconSvg("whatsapp");
if (icons[1]) icons[1].innerHTML = getIconSvg("email");
if (icons[2]) icons[2].innerHTML = getIconSvg("location");

const whatsappLink = document.getElementById("contactWhatsapp");
whatsappLink.href = SITE_CONFIG.redes.whatsapp;
whatsappLink.textContent = SITE_CONFIG.whatsapp_display;

const emailLink = document.getElementById("contactEmail");
emailLink.href = `mailto:${SITE_CONFIG.email}`;
emailLink.textContent = SITE_CONFIG.email;

document.getElementById("contactAddress").textContent = SITE_CONFIG.endereco;

const form = document.getElementById("contatoForm");
const submitBtn = document.getElementById("submitBtn");
const telefoneInput = form.querySelector('[name="telefone"]');

telefoneInput?.addEventListener("input", (e) => {
  e.target.value = applyPhoneMask(e.target.value);
});

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nome: form.nome.value.trim(),
    email: form.email.value.trim().toLowerCase(),
    telefone: applyPhoneMask(form.telefone.value),
    mensagem: form.mensagem.value.trim(),
  };

  if (!payload.nome || !payload.email || !payload.telefone || !payload.mensagem) {
    showToast("Preencha todos os campos.", "error");
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    showToast("E-mail inválido.", "error");
    return;
  }
  if (onlyDigits(payload.telefone).length < 10) {
    showToast("Telefone inválido.", "error");
    return;
  }

  setButtonLoading(submitBtn, true, "Enviando...", "Enviar mensagem");
  try {
    await VisaoDB.addMensagemContato(payload);
    form.reset();
    showToast("Mensagem enviada com sucesso!");
  } catch (err) {
    showToast(err.message || "Erro ao enviar mensagem.", "error");
  } finally {
    setButtonLoading(submitBtn, false, "Enviando...", "Enviar mensagem");
  }
});

initRevealAnimations();
