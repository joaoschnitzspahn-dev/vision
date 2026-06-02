function renderTopBar() {
  const bar = document.getElementById("topBar");
  if (!bar) return;
  bar.innerHTML = `Projeto social em Navegantes, SC · Bairro São Paulo · <a href="${SITE_CONFIG.redes.instagram}" target="_blank" rel="noopener noreferrer">@projetovisaonobre</a>`;
}

function renderHeadMeta(options = {}) {
  const {
    title = SITE_CONFIG.titulo,
    description = SITE_CONFIG.descricao,
    path = "",
    image = `${SITE_CONFIG.url}/assets/logo.png`,
    type = "website",
  } = options;

  const url = `${SITE_CONFIG.url}${path}`;
  document.title = title;

  const setMeta = (selector, content) => {
    let el = document.querySelector(selector);
    if (!el) {
      el = document.createElement("meta");
      const isProperty = selector.includes("property");
      if (isProperty) {
        el.setAttribute("property", selector.replace('meta[property="', "").replace('"]', ""));
      } else {
        el.setAttribute("name", selector.replace('meta[name="', "").replace('"]', ""));
      }
      document.head.appendChild(el);
    }
    el.setAttribute("content", content);
  };

  setMeta('meta[name="description"]', description);
  setMeta('meta[property="og:title"]', title);
  setMeta('meta[property="og:description"]', description);
  setMeta('meta[property="og:image"]', image);
  setMeta('meta[property="og:url"]', url);
  setMeta('meta[property="og:type"]', type);
  setMeta('meta[property="og:locale"]', "pt_BR");
  setMeta('meta[name="twitter:card"]', "summary_large_image");
  setMeta('meta[name="twitter:title"]', title);
  setMeta('meta[name="twitter:description"]', description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function renderSiteHeader(activePage = "") {
  const header = document.getElementById("siteHeader");
  if (!header) return;

  const links = [
    { href: "/", label: "Início", id: "home" },
    { href: "/cursos", label: "Cursos", id: "cursos" },
    { href: "/contato", label: "Contato", id: "contato" },
  ];

  header.innerHTML = `
    <div class="container header-inner">
      <a href="/" class="brand" aria-label="Projeto Social Visão Nobre - Página inicial">
        <img
          src="assets/logo.png"
          alt="Logo Projeto Social Visão Nobre"
          class="brand-logo"
          width="200"
          height="72"
          loading="eager"
          decoding="async"
        />
      </a>
      <button class="nav-toggle" aria-label="Abrir menu" aria-expanded="false" aria-controls="siteNav">
        <span></span><span></span><span></span>
      </button>
      <nav id="siteNav" class="site-nav" aria-label="Navegação principal">
        ${links
          .map(
            (link) =>
              `<a href="${link.href}" class="${activePage === link.id ? "active" : ""}">${link.label}</a>`
          )
          .join("")}
        <a href="/cursos#inscricao" class="btn btn-primary btn-sm nav-cta">Inscreva-se</a>
      </nav>
    </div>`;

  initMobileNav();
}

function renderSiteFooter() {
  const footer = document.getElementById("siteFooter");
  if (!footer) return;

  footer.innerHTML = `
    <div class="footer-top">
      <div class="container footer-grid">
        <div class="footer-brand">
          <img
            src="assets/logo.png"
            alt="Logo Projeto Social Visão Nobre"
            class="footer-logo"
            width="200"
            height="60"
            loading="lazy"
            decoding="async"
          />
          <p>Projeto social em Navegantes (SC) que ajuda pessoas em situação de necessidade e oferece cursos gratuitos.</p>
        </div>
        <div>
          <h3>Navegação</h3>
          <ul class="footer-links">
            <li><a href="/">Início</a></li>
            <li><a href="/cursos">Cursos</a></li>
            <li><a href="/contato">Contato</a></li>
          </ul>
        </div>
        <div>
          <h3>Contato</h3>
          <ul class="footer-contact">
            <li><span class="icon">${getIconSvg("whatsapp")}</span> ${SITE_CONFIG.whatsapp_display}</li>
            <li><span class="icon">${getIconSvg("email")}</span> ${SITE_CONFIG.email}</li>
            <li><span class="icon">${getIconSvg("location")}</span> ${SITE_CONFIG.endereco}</li>
          </ul>
        </div>
        <div>
          <h3>Redes sociais</h3>
          <div class="social-links">
            <a href="${SITE_CONFIG.redes.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram @projetovisaonobre">${getIconSvg("instagram")}</a>
            <a href="${SITE_CONFIG.redes.facebook}" target="_blank" rel="noopener noreferrer" aria-label="Facebook">${getIconSvg("facebook")}</a>
            <a href="${SITE_CONFIG.redes.whatsapp}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">${getIconSvg("whatsapp")}</a>
          </div>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container">
        <p>&copy; ${new Date().getFullYear()} Projeto Social Visão Nobre. Todos os direitos reservados.</p>
      </div>
    </div>`;
}

function renderCourseCard(course, options = {}) {
  const { showAge = true, buttonLabel = "Saiba Mais" } = options;
  const tag = course.gratuito ? "Gratuito" : "Projeto Social";

  return `
    <article class="course-card reveal">
      <div class="course-card-image">
        <span class="course-card-tag">${tag}</span>
        <img
          src="${course.imagem}"
          alt="${course.imagem_alt || course.nome}"
          loading="lazy"
          decoding="async"
          width="640"
          height="400"
          onerror="this.onerror=null;this.src='assets/cursos/placeholder.svg';"
        />
      </div>
      <div class="course-card-body">
        <h3>${course.nome}</h3>
        <div class="course-card-meta">
          ${showAge ? `<span class="badge badge-brand">Idade mínima: ${course.idade_minima} anos</span>` : ""}
          ${course.duracao ? `<span class="badge">${course.duracao}</span>` : ""}
        </div>
        <p>${course.descricao_curta || course.descricao}</p>
        <a href="/curso/${course.slug}" class="btn btn-outline">${buttonLabel}</a>
      </div>
    </article>`;
}

function renderInstagramFeed(containerId = "instagramFeed") {
  const el = document.getElementById(containerId);
  if (!el) return;

  const perfil = SITE_CONFIG.instagram_perfil || {};
  const galeria = SITE_CONFIG.instagram_galeria || [];
  const igUrl = SITE_CONFIG.redes.instagram;

  const tiles = galeria
    .map((item, i) => {
      const link = item.link || igUrl;
      const inner = item.imagem
        ? `<img src="${item.imagem}" alt="${item.label || "Post Instagram"}" loading="lazy" decoding="async" width="400" height="400" />`
        : `<div class="ig-tile-placeholder">${getIconSvg("instagram")}<span>${item.label || "Ver post"}</span></div>`;

      return `
        <a href="${link}" class="ig-tile reveal" target="_blank" rel="noopener noreferrer" aria-label="${item.label || "Ver no Instagram"}" style="transition-delay:${i * 0.05}s">
          ${inner}
          <span class="ig-tile-overlay">Ver no Instagram</span>
        </a>`;
    })
    .join("");

  el.innerHTML = `
    <div class="instagram-block reveal">
      <div class="instagram-profile">
        <div class="instagram-profile-icon">${getIconSvg("instagram")}</div>
        <h3>Projeto Social Visão Nobre</h3>
        <p class="handle">@${perfil.handle || "projetovisaonobre"}</p>
        <p>${perfil.bio || "Acompanhe nosso trabalho nas redes."}</p>
        <a href="${igUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-gold btn-full">Seguir no Instagram</a>
      </div>
      <div class="instagram-grid">${tiles}</div>
    </div>`;
}

function initLayout(activePage) {
  renderTopBar();
  renderSiteHeader(activePage);
  renderSiteFooter();
}
