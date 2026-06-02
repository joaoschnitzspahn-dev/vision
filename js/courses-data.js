/**
 * Catálogo de cursos — adicione novos cursos neste array.
 */
const COURSES_CATALOG = [
  {
    id: "barbeiro",
    slug: "barbeiro",
    nome: "Curso de Barbeiro",
    idade_minima: 16,
    imagem: "assets/cursos/barbeiro.svg",
    imagem_alt: "Curso de barbeiro do Projeto Social Visão Nobre",
    descricao_curta:
      "Curso gratuito para quem busca uma nova oportunidade. Aprenda corte, barba e atendimento.",
    descricao:
      "O Curso de Barbeiro do Projeto Social Visão Nobre é uma oportunidade gratuita para pessoas em situação de necessidade. Com aulas teóricas e práticas, formamos alunos preparados para ingressar no mercado de trabalho.",
    duracao: "6 meses",
    gratuito: true,
    conteudo_programatico: [
      "Fundamentos da barbearia e biossegurança",
      "Conhecimento de ferramentas e equipamentos",
      "Técnicas de corte clássico e moderno",
      "Degradê, fade e acabamentos",
      "Barba: desenho, navalha e toalha quente",
      "Higiene, esterilização e cuidados com o cliente",
      "Atendimento ao cliente e postura profissional",
      "Empreendedorismo e primeiros passos no mercado",
    ],
    beneficios: [
      "Curso gratuito — projeto social",
      "Certificado de conclusão",
      "Aulas práticas com acompanhamento",
      "Professores com experiência",
      "Preparação para o mercado de trabalho",
    ],
    aprendizado: [
      "Realizar cortes masculinos clássicos e modernos",
      "Executar acabamentos e degradês profissionais",
      "Trabalhar barba com técnicas seguras",
      "Atender clientes com excelência",
      "Organizar e higienizar o ambiente de trabalho",
    ],
    mercado_trabalho:
      "Com a formação do Visão Nobre, você pode buscar oportunidades em barbearias, salões masculinos ou empreender com seu próprio negócio.",
    destaque: true,
    ativo: true,
  },
  {
    id: "manicure",
    slug: "manicure",
    nome: "Curso de Manicure",
    idade_minima: 16,
    imagem: "assets/cursos/manicure.svg",
    imagem_alt: "Curso de manicure do Projeto Social Visão Nobre",
    descricao_curta:
      "Capacitação gratuita para quem precisa de uma chance. Aprenda manicure, pedicure e técnicas essenciais.",
    descricao:
      "O Curso de Manicure do Projeto Social Visão Nobre abre portas para pessoas em situação de necessidade. O programa combina técnica, criatividade e acolhimento, com aulas práticas e acompanhamento de perto.",
    duracao: "4 meses",
    gratuito: true,
    conteudo_programatico: [
      "Anatomia e cuidados com unhas",
      "Biossegurança e esterilização",
      "Manicure tradicional e spa",
      "Pedicure e cuidados com os pés",
      "Esmaltação e técnicas avançadas",
      "Nail art e decoração de unhas",
      "Remoção segura de materiais",
      "Atendimento e postura profissional",
    ],
    beneficios: [
      "Oportunidade via projeto social",
      "Certificado de conclusão",
      "Prática supervisionada",
      "Professores qualificados",
      "Orientação para o mercado de trabalho",
    ],
    aprendizado: [
      "Realizar manicure e pedicure com qualidade",
      "Aplicar esmaltes e técnicas avançadas",
      "Executar nail art e decorações",
      "Garantir higiene e segurança no atendimento",
      "Atender clientes com postura profissional",
    ],
    mercado_trabalho:
      "Salões de beleza, spas e atendimento domiciliar demandam profissionais qualificadas. A formação do Visão Nobre prepara você para buscar essas oportunidades.",
    destaque: true,
    ativo: true,
  },
];

const SITE_CONFIG = {
  nome: "Projeto Social Visão Nobre",
  titulo: "Projeto Social Visão Nobre",
  descricao:
    "Projeto social em Navegantes (SC) que ajuda pessoas em situação de necessidade e oferece cursos gratuitos de Barbeiro e Manicure.",
  url: "https://vision-zeta-eight.vercel.app",
  email: "contato@visaonobre.com.br",
  whatsapp: "5547999999999",
  whatsapp_display: "(47) 99999-9999",
  endereco: "Bairro São Paulo, Navegantes — SC",
  cidade: "Navegantes",
  estado: "SC",
  redes: {
    instagram: "https://www.instagram.com/projetovisaonobre/",
    facebook: "https://www.facebook.com/projetovisaonobre",
    whatsapp: "https://wa.me/5547999999999",
  },
  missao:
    "Ajudar pessoas em situação de necessidade, oferecendo acolhimento, oportunidades e cursos gratuitos de barbeiro e manicure para transformar vidas.",
  sobre:
    "O Projeto Social Visão Nobre, no Bairro São Paulo em Navegantes (SC), nasceu para apoiar quem mais precisa. Além de ações sociais na comunidade, oferecemos gratuitamente os cursos de Barbeiro e Manicure, com aulas práticas, certificado e preparo para o mercado de trabalho.",
  valores: [
    { titulo: "Solidariedade", descricao: "Apoio a quem está em situação de necessidade." },
    { titulo: "Gratuidade", descricao: "Cursos e ações sociais sem custo para a comunidade." },
    { titulo: "Acolhimento", descricao: "Ambiente humano, respeitoso e acolhedor." },
    { titulo: "Oportunidade", descricao: "Capacitação para gerar autonomia e renda." },
  ],
  diferenciais: [
    { icone: "certificado", titulo: "Certificado", descricao: "Certificado ao concluir o curso." },
    { icone: "professor", titulo: "Professores qualificados", descricao: "Instrutores com vocação social." },
    { icone: "pratica", titulo: "Aulas práticas", descricao: "Aprendizado com exercícios reais." },
    { icone: "mercado", titulo: "Projeto social", descricao: "Foco em quem mais precisa de uma chance." },
  ],
  stats: [
    { valor: "100%", label: "Gratuito" },
    { valor: "2", label: "Cursos" },
    { valor: "SC", label: "Navegantes" },
  ],
  depoimentos: [],
  instagram_perfil: {
    handle: "projetovisaonobre",
    bio: "Projeto social em Navegantes (SC). Acompanhe nosso trabalho na comunidade.",
  },
  instagram_galeria: [
    { label: "Projeto social", link: "https://www.instagram.com/projetovisaonobre/" },
    { label: "Aulas práticas", link: "https://www.instagram.com/projetovisaonobre/" },
    { label: "Comunidade", link: "https://www.instagram.com/projetovisaonobre/" },
    { label: "Barbeiro", link: "https://www.instagram.com/projetovisaonobre/" },
    { label: "Manicure", link: "https://www.instagram.com/projetovisaonobre/" },
    { label: "Navegantes", link: "https://www.instagram.com/projetovisaonobre/" },
  ],
};
