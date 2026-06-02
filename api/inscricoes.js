const { getSupabase, isCloudEnabled } = require("./_lib/supabase");
const { setCors, handleOptions } = require("./_lib/cors");

function calcAge(birthDate) {
  const today = new Date();
  const birth = new Date(`${birthDate}T12:00:00`);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age -= 1;
  return age;
}

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!isCloudEnabled()) {
    return res.status(503).json({ error: "Banco na nuvem não configurado.", fallback: true });
  }

  const supabase = getSupabase();
  const body = req.body || {};

  const required = [
    "nome", "data_nascimento", "cpf", "telefone",
    "whatsapp", "email", "cidade", "estado", "curso_id",
  ];

  for (const field of required) {
    if (!String(body[field] || "").trim()) {
      return res.status(400).json({ error: `Campo obrigatório: ${field}` });
    }
  }

  const { data: curso } = await supabase
    .from("cursos")
    .select("idade_minima")
    .eq("id", body.curso_id)
    .eq("ativo", true)
    .maybeSingle();

  const minAge = curso?.idade_minima || 16;
  const age = calcAge(body.data_nascimento);

  if (age === null || age < minAge) {
    return res.status(400).json({
      error: `É necessário ter no mínimo ${minAge} anos para se inscrever neste curso.`,
    });
  }

  const { data, error } = await supabase
    .from("inscricoes")
    .insert({
      nome: body.nome.trim(),
      data_nascimento: body.data_nascimento,
      cpf: body.cpf.trim(),
      telefone: body.telefone.trim(),
      whatsapp: body.whatsapp.trim(),
      email: body.email.trim().toLowerCase(),
      cidade: body.cidade.trim(),
      estado: body.estado.trim(),
      curso_id: body.curso_id,
    })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      return res.status(409).json({ error: "Este CPF já está inscrito neste curso." });
    }
    return res.status(500).json({ error: "Erro ao salvar inscrição." });
  }

  return res.status(201).json(data);
};
