const { getSupabase, isCloudEnabled } = require("./_lib/supabase");
const { setCors, handleOptions } = require("./_lib/cors");

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

  if (!body.nome || !body.email || !body.telefone || !body.mensagem) {
    return res.status(400).json({ error: "Preencha todos os campos." });
  }

  const { data, error } = await supabase
    .from("mensagens_contato")
    .insert({
      nome: body.nome.trim(),
      email: body.email.trim().toLowerCase(),
      telefone: body.telefone.trim(),
      mensagem: body.mensagem.trim(),
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: "Erro ao enviar mensagem." });
  }

  return res.status(201).json(data);
};
