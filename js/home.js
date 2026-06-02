initLayout("home");

document.getElementById("sobreText").textContent = SITE_CONFIG.sobre;
document.getElementById("missaoText").textContent = SITE_CONFIG.missao;

document.getElementById("valuesList").innerHTML = SITE_CONFIG.valores
  .map(
    (v) => `
    <div class="value-pill">
      <strong>${v.titulo}</strong>
      <p>${v.descricao}</p>
    </div>`
  )
  .join("");

document.getElementById("heroStats").innerHTML = SITE_CONFIG.stats
  .map(
    (s) => `
    <div class="hero-metric">
      <strong>${s.valor}</strong>
      <span>${s.label}</span>
    </div>`
  )
  .join("");

const featured = COURSES_CATALOG.filter((c) => c.ativo && c.destaque);
document.getElementById("featuredCourses").innerHTML = featured.length
  ? featured.map((course) => renderCourseCard(course)).join("")
  : '<p class="reveal" style="color:var(--text-soft);text-align:center">Nenhum curso disponível no momento.</p>';

document.getElementById("differentialsGrid").innerHTML = SITE_CONFIG.diferenciais
  .map(
    (d) => `
    <div class="impact-card reveal">
      <div class="impact-icon">${getIconSvg(d.icone)}</div>
      <h3>${d.titulo}</h3>
      <p>${d.descricao}</p>
    </div>`
  )
  .join("");

renderInstagramFeed();
initRevealAnimations();
