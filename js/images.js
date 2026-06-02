/**
 * Carregamento seguro de imagens com fallback automático
 */
const IMAGE_FALLBACKS = {
  curso: "assets/cursos/placeholder.svg",
};

function safeImg(attrs) {
  const {
    src,
    alt = "",
    className = "",
    width,
    height,
    loading = "lazy",
    decoding = "async",
    fallback = IMAGE_FALLBACKS.curso,
    fetchpriority,
  } = attrs;

  const fp = fetchpriority ? ` fetchpriority="${fetchpriority}"` : "";
  return `<img
    src="${src}"
    alt="${alt}"
    class="${className}"
    width="${width || ""}"
    height="${height || ""}"
    loading="${loading}"
    decoding="${decoding}"${fp}
    onerror="this.onerror=null;this.src='${fallback}';"
  />`;
}

function coursePicture(course) {
  const png = course.imagem_png || "";
  const svg = course.imagem || IMAGE_FALLBACKS.curso;
  const alt = course.imagem_alt || course.nome;

  if (png) {
    return `<picture>
      <source srcset="${png}" type="image/png" />
      <img src="${svg}" alt="${alt}" loading="lazy" decoding="async" width="640" height="400"
        onerror="this.onerror=null;this.src='${IMAGE_FALLBACKS.curso}';" />
    </picture>`;
  }

  return safeImg({
    src: svg,
    alt,
    width: 640,
    height: 400,
    fallback: IMAGE_FALLBACKS.curso,
  });
}

function initImageFallbacks() {
  document.querySelectorAll("img[data-fallback]").forEach((img) => {
    img.addEventListener("error", () => {
      const fb = img.getAttribute("data-fallback");
      if (fb && img.src !== fb) img.src = fb;
    }, { once: true });
  });
}

document.addEventListener("DOMContentLoaded", initImageFallbacks);
