function setCors(res, req) {
  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-Credentials", "true");
}

function handleOptions(req, res) {
  if (req.method === "OPTIONS") {
    setCors(res, req);
    res.status(204).end();
    return true;
  }
  return false;
}

module.exports = { setCors, handleOptions };
