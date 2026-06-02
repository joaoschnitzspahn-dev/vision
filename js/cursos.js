initLayout("cursos");

const courses = COURSES_CATALOG.filter((c) => c.ativo);
document.getElementById("coursesList").innerHTML = courses.length
  ? courses.map((c) => renderCourseCard(c)).join("")
  : '<p class="reveal">Nenhum curso disponível no momento.</p>';

const form = document.getElementById("inscricaoForm");
const submitBtn = document.getElementById("submitBtn");
const estadoSelect = document.getElementById("estado");
const cursoSelect = document.getElementById("curso_id");

populateStateSelect(estadoSelect);

const preselected = new URLSearchParams(window.location.search).get("curso");
populateCourseSelect(cursoSelect, preselected);
setupMasks(form);

form?.addEventListener("submit", async (event) => {
  event.preventDefault();

  const payload = {
    nome: form.nome.value.trim(),
    data_nascimento: form.data_nascimento.value,
    cpf: applyCpfMask(form.cpf.value),
    telefone: applyPhoneMask(form.telefone.value),
    whatsapp: applyPhoneMask(form.whatsapp.value),
    email: form.email.value.trim().toLowerCase(),
    cidade: form.cidade.value.trim(),
    estado: form.estado.value,
    curso_id: form.curso_id.value,
  };

  const error = validateInscricao(payload);
  if (error) {
    showToast(error, "error");
    return;
  }

  setButtonLoading(submitBtn, true, "Enviando...", "Enviar inscrição");
  try {
    await VisaoDB.addInscricao(payload);
    form.reset();
    populateCourseSelect(cursoSelect);
    showToast("Inscrição enviada com sucesso!");
  } catch (err) {
    showToast(err.message || "Erro ao enviar inscrição.", "error");
  } finally {
    setButtonLoading(submitBtn, false, "Enviando...", "Enviar inscrição");
  }
});

initRevealAnimations();
