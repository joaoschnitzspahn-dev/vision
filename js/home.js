initLayout("home");

document.getElementById("missaoText").textContent = SITE_CONFIG.missao;

document.getElementById("valuesList").innerHTML = SITE_CONFIG.valores
  .map(
    (v) => `
    <div class="value-item">
      <strong>${v.titulo}</strong>
      <p>${v.descricao}</p>
    </div>`
  )
  .join("");

const featured = COURSES_CATALOG.filter((c) => c.ativo && c.destaque);
document.getElementById("featuredCourses").innerHTML = featured
  .map((course) => renderCourseCard(course))
  .join("");

document.getElementById("differentialsGrid").innerHTML = SITE_CONFIG.diferenciais
  .map(
    (d) => `
    <div class="card diff-card reveal">
      <div class="diff-icon">${getIconSvg(d.icone)}</div>
      <h3>${d.titulo}</h3>
      <p>${d.descricao}</p>
    </div>`
  )
  .join("");

const testimonialsEl = document.getElementById("testimonialsContainer");
if (SITE_CONFIG.depoimentos.length) {
  testimonialsEl.innerHTML = `
    <div class="testimonials-grid">
      ${SITE_CONFIG.depoimentos
        .map(
          (t) => `
        <div class="card testimonial-card reveal">
          <blockquote>"${t.texto}"</blockquote>
          <cite>— ${t.autor}</cite>
        </div>`
        )
        .join("")}
    </div>`;
} else {
  testimonialsEl.innerHTML = `
    <div class="testimonials-empty reveal">
      Em breve compartilharemos depoimentos de nossos alunos.
    </div>`;
}

initRevealAnimations();
