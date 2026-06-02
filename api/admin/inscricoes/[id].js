const { getSupabase, isCloudEnabled } = require("../../_lib/supabase");
const { requireAdmin } = require("../../_lib/auth");
const { setCors, handleOptions } = require("../../_lib/cors");

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (!isCloudEnabled()) {
    return res.status(503).json({ error: "Banco na nuvem não configurado.", fallback: true });
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  const { id } = req.query;
  const supabase = getSupabase();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("inscricoes")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return res.status(404).json({ error: "Inscrição não encontrada." });
    }

    return res.status(200).json(data);
  }

  if (req.method === "DELETE") {
    const { error } = await supabase.from("inscricoes").delete().eq("id", id);

    if (error) {
      return res.status(500).json({ error: "Erro ao excluir inscrição." });
    }

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: "Método não permitido." });
};
