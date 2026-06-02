const { clearSessionCookie } = require("../_lib/auth");
const { setCors, handleOptions } = require("../_lib/cors");

module.exports = async (req, res) => {
  setCors(res, req);
  if (handleOptions(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido." });
  }

  clearSessionCookie(res);
  return res.status(200).json({ ok: true });
};
