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
    imagem_alt: "Aluno do Projeto Social Visão Nobre em aula prática de barbeiro",
    descricao_curta:
      "Curso gratuito oferecido pelo projeto social. Aprenda corte, barba e atendimento para ingressar no mercado.",
    descricao:
      "O Curso de Barbeiro do Projeto Social Visão Nobre é uma oportunidade gratuita de capacitação para jovens e adultos. Com aulas teóricas e práticas, formamos profissionais preparados para o mercado, com foco em dignidade, técnica e transformação de vidas.",
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
      "Professores com experiência de mercado",
      "Preparação para oportunidades reais de trabalho",
    ],
    aprendizado: [
      "Realizar cortes masculinos clássicos e modernos",
      "Executar acabamentos e degradês profissionais",
      "Trabalhar barba com técnicas seguras",
      "Atender clientes com excelência",
      "Organizar e higienizar o ambiente de trabalho",
    ],
    mercado_trabalho:
      "O setor de barbearias segue em crescimento. Com a formação do Visão Nobre, você pode buscar oportunidades em barbearias, salões masculinos ou até empreender com seu próprio negócio.",
    destaque: true,
    ativo: true,
  },
  {
    id: "manicure",
    slug: "manicure",
    nome: "Curso de Manicure",
    idade_minima: 16,
    imagem: "assets/cursos/manicure.svg",
    imagem_alt: "Aluna do Projeto Social Visão Nobre em aula prática de manicure",
    descricao_curta:
      "Capacitação oferecida pelo projeto social. Aprenda manicure, pedicure e técnicas essenciais para atuar na área.",
    descricao:
      "O Curso de Manicure do Projeto Social Visão Nobre abre portas para quem busca uma nova oportunidade. O programa combina técnica, criatividade e atendimento humanizado, com aulas práticas e acompanhamento de perto.",
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
      "Aplicar esmaltes e técnicas básicas avançadas",
      "Executar nail art e decorações",
      "Garantir higiene e segurança no atendimento",
      "Atender clientes com postura profissional",
    ],
    mercado_trabalho:
      "Salões de beleza, spas e atendimento domiciliar demandam profissionais qualificadas. A formação do Visão Nobre prepara você para buscar essas oportunidades ou empreender.",
    destaque: true,
    ativo: true,
  },
];

const SITE_CONFIG = {
  nome: "Projeto Social Visão Nobre",
  titulo: "Projeto Social Visão Nobre",
  descricao:
    "Projeto social que transforma vidas por meio de cursos gratuitos de Barbeiro e Manicure. Capacitação prática, certificado e oportunidades reais.",
  url: "https://vision-zeta-eight.vercel.app",
  email: "contato@visaonobre.com.br",
  whatsapp: "5511999999999",
  whatsapp_display: "(11) 99999-9999",
  endereco: "São Paulo, SP — Brasil",
  redes: {
    instagram: "https://www.instagram.com/projetovisaonobre/",
    facebook: "https://www.facebook.com/projetovisaonobre",
    whatsapp: "https://wa.me/5511999999999",
  },
  missao:
    "Transformar vidas por meio da educação profissional gratuita, criando oportunidades reais para jovens e adultos em situação de vulnerabilidade social.",
  sobre:
    "O Projeto Social Visão Nobre nasceu para gerar impacto real na comunidade. Oferecemos cursos gratuitos de barbeiro e manicure, unindo técnica, acolhimento e disciplina para abrir portas no mercado de trabalho e no empreendedorismo.",
  valores: [
    { titulo: "Impacto social", descricao: "Transformação de vidas por meio da educação acessível." },
    { titulo: "Gratuidade", descricao: "Cursos oferecidos sem custo para quem precisa de uma chance." },
    { titulo: "Acolhimento", descricao: "Ambiente humano, respeitoso e focado no desenvolvimento de cada aluno." },
    { titulo: "Oportunidade", descricao: "Preparação prática para o mercado de trabalho e autonomia." },
  ],
  diferenciais: [
    { icone: "certificado", titulo: "Certificado", descricao: "Certificado de conclusão ao final do curso." },
    { icone: "professor", titulo: "Professores qualificados", descricao: "Instrutores com experiência e vocação social." },
    { icone: "pratica", titulo: "Aulas práticas", descricao: "Aprendizado real, com exercícios supervisionados." },
    { icone: "mercado", titulo: "Transformação de vidas", descricao: "Capacitação que gera oportunidades concretas." },
  ],
  stats: [
    { valor: "100%", label: "Gratuito" },
    { valor: "2", label: "Cursos ativos" },
    { valor: "+", label: "Vidas transformadas" },
  ],
  depoimentos: [],
};
