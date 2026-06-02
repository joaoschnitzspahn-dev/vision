/**
 * Catálogo de cursos — adicione novos cursos neste array.
 * Campos obrigatórios: id, slug, nome, idade_minima, imagem, ativo
 */
const COURSES_CATALOG = [
  {
    id: "barbeiro",
    slug: "barbeiro",
    nome: "Curso de Barbeiro",
    idade_minima: 16,
    imagem: "assets/cursos/barbeiro.svg",
    imagem_alt: "Profissional realizando corte de cabelo masculino",
    descricao_curta:
      "Aprenda técnicas profissionais de corte, barba e atendimento para ingressar no mercado da beleza masculina.",
    descricao:
      "O Curso de Barbeiro da Visão Nobre forma profissionais completos para o mercado de barbearias e salões. Com aulas teóricas e práticas, você desenvolve habilidades técnicas, postura profissional e visão empreendedora para construir uma carreira sólida.",
    duracao: "6 meses",
    conteudo_programatico: [
      "Fundamentos da barbearia e biossegurança",
      "Conhecimento de ferramentas e equipamentos",
      "Técnicas de corte clássico e moderno",
      "Degradê, fade e acabamentos",
      "Barba: desenho, navalha e toalha quente",
      "Higiene, esterilização e cuidados com o cliente",
      "Atendimento ao cliente e vendas",
      "Empreendedorismo e gestão de barbearia",
    ],
    beneficios: [
      "Certificado de conclusão reconhecido",
      "Aulas práticas com acompanhamento",
      "Professores com experiência de mercado",
      "Preparação para o mercado de trabalho",
      "Networking com profissionais da área",
    ],
    aprendizado: [
      "Realizar cortes masculinos clássicos e modernos",
      "Executar acabamentos e degradês profissionais",
      "Trabalhar barba com técnicas seguras",
      "Atender clientes com excelência",
      "Organizar e higienizar o ambiente de trabalho",
    ],
    mercado_trabalho:
      "O setor de barbearias cresce constantemente no Brasil. Barbearias, salões masculinos, franquias e empreendimentos próprios buscam profissionais qualificados. Com certificação e prática, você pode atuar como barbeiro, assistente ou abrir seu próprio negócio.",
    destaque: true,
    ativo: true,
  },
  {
    id: "manicure",
    slug: "manicure",
    nome: "Curso de Manicure",
    idade_minima: 16,
    imagem: "assets/cursos/manicure.svg",
    imagem_alt: "Profissional realizando procedimento de manicure",
    descricao_curta:
      "Domine técnicas de manicure, pedicure e nail art para atuar em salões, spas e empreendimentos próprios.",
    descricao:
      "O Curso de Manicure da Visão Nobre prepara você para atuar com excelência no mercado de beleza e bem-estar. O programa combina técnica, criatividade e atendimento profissional, com foco em prática e empregabilidade.",
    duracao: "4 meses",
    conteudo_programatico: [
      "Anatomia e cuidados com unhas",
      "Biossegurança e esterilização",
      "Manicure tradicional e spa",
      "Pedicure e cuidados com os pés",
      "Esmaltação em gel e técnicas avançadas",
      "Nail art e decoração de unhas",
      "Remoção segura de materiais",
      "Atendimento, vendas e empreendedorismo",
    ],
    beneficios: [
      "Certificado de conclusão",
      "Prática supervisionada em ambiente real",
      "Professores qualificados",
      "Material didático incluso",
      "Orientação para mercado de trabalho",
    ],
    aprendizado: [
      "Realizar manicure e pedicure com qualidade",
      "Aplicar esmaltes e técnicas de alongamento básico",
      "Executar nail art e decorações",
      "Garantir higiene e segurança no atendimento",
      "Atender clientes com postura profissional",
    ],
    mercado_trabalho:
      "Salões de beleza, spas, clínicas estéticas e atendimento domiciliar demandam manicures qualificadas. O mercado de unhas e nail art segue em expansão, com oportunidades em emprego fixo, freelancing e negócio próprio.",
    destaque: true,
    ativo: true,
  },
];

const SITE_CONFIG = {
  nome: "Visão Nobre",
  titulo: "Visão Nobre | Cursos Profissionalizantes",
  descricao:
    "Cursos profissionalizantes de Barbeiro e Manicure. Capacitação prática, certificado e preparação para o mercado de trabalho.",
  url: "https://vision-zeta-eight.vercel.app",
  email: "contato@visaonobre.com.br",
  whatsapp: "5511999999999",
  whatsapp_display: "(11) 99999-9999",
  endereco: "São Paulo, SP — Brasil",
  redes: {
    instagram: "https://instagram.com/visaonobre",
    facebook: "https://facebook.com/visaonobre",
    whatsapp: "https://wa.me/5511999999999",
  },
  missao:
    "Capacitar pessoas por meio de cursos profissionalizantes de qualidade, abrindo portas para o mercado de trabalho e o empreendedorismo.",
  valores: [
    { titulo: "Excelência", descricao: "Ensino de qualidade com foco em resultados reais." },
    { titulo: "Acessibilidade", descricao: "Oportunidades para quem busca uma nova carreira." },
    { titulo: "Prática", descricao: "Aprendizado hands-on com professores experientes." },
    { titulo: "Empregabilidade", descricao: "Formação alinhada às demandas do mercado." },
  ],
  diferenciais: [
    { icone: "certificado", titulo: "Certificado", descricao: "Certificado de conclusão ao final do curso." },
    { icone: "professor", titulo: "Professores qualificados", descricao: "Instrutores com experiência no mercado." },
    { icone: "pratica", titulo: "Aulas práticas", descricao: "Aprendizado com exercícios reais e supervisionados." },
    { icone: "mercado", titulo: "Mercado de trabalho", descricao: "Preparação para atuar ou empreender na área." },
  ],
  depoimentos: [],
};
