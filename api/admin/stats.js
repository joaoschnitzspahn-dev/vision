const { getSupabase, isCloudEnabled } = require("../_lib/supabase");
const { requireAdmin } = require("../_lib/auth");
const { setCors, handleOptions } = require("../_lib/cors");

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!isCloudEnabled()) {
    return res.status(503).json({ error: "Banco na nuvem não configurado.", fallback: true });
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  const supabase = getSupabase();
  const { data: inscricoes, error } = await supabase
    .from("inscricoes")
    .select("id, nome, curso_id, data_inscricao")
    .order("data_inscricao", { ascending: false });

  if (error) {
    return res.status(500).json({ error: "Erro ao carregar estatísticas." });
  }

  const { data: cursos } = await supabase.from("cursos").select("id, nome");

  const porCurso = {};
  (cursos || []).forEach((c) => {
    porCurso[c.id] = { nome: c.nome, total: 0 };
  });

  (inscricoes || []).forEach((item) => {
    if (!porCurso[item.curso_id]) {
      porCurso[item.curso_id] = { nome: item.curso_id, total: 0 };
    }
    porCurso[item.curso_id].total += 1;
  });

  return res.status(200).json({
    total: inscricoes?.length || 0,
    porCurso,
    recentes: (inscricoes || []).slice(0, 5),
  });
};
