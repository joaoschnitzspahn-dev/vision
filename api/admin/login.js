const { getSupabase, isCloudEnabled } = require("../_lib/supabase");
const { hashPassword, setSessionCookie } = require("../_lib/auth");
const { setCors, handleOptions } = require("../_lib/cors");

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  if (!isCloudEnabled()) {
    return res.status(503).json({ error: "Banco na nuvem não configurado.", fallback: true });
  }

  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Informe e-mail e senha." });
  }

  const supabase = getSupabase();
  const { data: admin, error } = await supabase
    .from("administradores")
    .select("id, nome, email, senha_hash")
    .eq("email", email.trim().toLowerCase())
    .maybeSingle();

  if (error || !admin) {
    return res.status(401).json({ error: "E-mail ou senha inválidos." });
  }

  const senha_hash = hashPassword(password);
  if (senha_hash !== admin.senha_hash) {
    return res.status(401).json({ error: "E-mail ou senha inválidos." });
  }

  setSessionCookie(res, admin);
  return res.status(200).json({
    id: admin.id,
    nome: admin.nome,
    email: admin.email,
  });
};
