const slug = getCourseSlugFromUrl();
const course = slug ? LocalDB.getCursoBySlug(slug) : null;

if (!course) {
  document.getElementById("courseContent").classList.add("hidden");
  document.getElementById("courseNotFound").classList.remove("hidden");
  initLayout("cursos");
  renderSiteFooter();
} else {
  initLayout("cursos");

  renderHeadMeta({
    title: `${course.nome} | Projeto Social Visão Nobre`,
    description: course.descricao_curta,
    path: `/curso/${course.slug}`,
    image: `${SITE_CONFIG.url}/${course.imagem}`,
  });

  document.getElementById("courseBannerImg").src = course.imagem;
  document.getElementById("courseBannerImg").alt = course.imagem_alt || course.nome;
  document.getElementById("courseTitle").textContent = course.nome;
  document.getElementById("courseSubtitle").textContent = course.descricao_curta;
  document.getElementById("courseFreeBadge").textContent = course.gratuito ? "Curso gratuito" : "Projeto social";
  document.getElementById("courseAgeBadge").textContent = `Idade mínima: ${course.idade_minima} anos`;
  document.getElementById("courseDescription").textContent = course.descricao;
  document.getElementById("courseDuration").textContent = `Duração: ${course.duracao}`;
  document.getElementById("courseMarket").textContent = course.mercado_trabalho;

  document.getElementById("courseLearnings").innerHTML = course.aprendizado
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("courseProgram").innerHTML = course.conteudo_programatico
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("courseBenefits").innerHTML = course.beneficios
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("courseRequirements").innerHTML = `
    <li>Ter no mínimo ${course.idade_minima} anos</li>
    <li>Documento de identidade e CPF</li>
    <li>Comprometimento com as aulas práticas</li>`;

  const form = document.getElementById("inscricaoForm");
  const submitBtn = document.getElementById("submitBtn");
  populateStateSelect(document.getElementById("estado"));
  populateCourseSelect(document.getElementById("curso_id"), course.id);
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

    const error = validateInscricao(payload, course.idade_minima);
    if (error) {
      showToast(error, "error");
      return;
    }

    setButtonLoading(submitBtn, true, "Enviando...", "Enviar inscrição");
    try {
      await VisaoDB.addInscricao(payload);
      form.reset();
      populateCourseSelect(document.getElementById("curso_id"), course.id);
      showToast("Inscrição enviada com sucesso!");
    } catch (err) {
      showToast(err.message || "Erro ao enviar inscrição.", "error");
    } finally {
      setButtonLoading(submitBtn, false, "Enviando...", "Enviar inscrição");
    }
  });

  initRevealAnimations();
}
