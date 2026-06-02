const { getSession } = require("../_lib/auth");
const { isCloudEnabled } = require("../_lib/supabase");
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

  const session = getSession(req);
  if (!session) {
    return res.status(401).json({ error: "Não autorizado." });
  }

  return res.status(200).json({
    id: session.sub,
    email: session.email,
    nome: session.nome,
  });
};
