const { getSupabase, isCloudEnabled } = require("../_lib/supabase");
const { requireAdmin } = require("../_lib/auth");
const { setCors, handleOptions } = require("../_lib/cors");

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (!isCloudEnabled()) {
    return res.status(503).json({ error: "Banco na nuvem não configurado.", fallback: true });
  }

  const session = requireAdmin(req, res);
  if (!session) return;

  const supabase = getSupabase();

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("inscricoes")
      .select("*")
      .order("data_inscricao", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Erro ao carregar inscrições." });
    }

    return res.status(200).json(data);
  }

  return res.status(405).json({ error: "Método não permitido." });
};
