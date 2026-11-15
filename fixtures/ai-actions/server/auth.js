import { pool } from "./db.js";

export async function requireUser(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  const { rows } = await pool.query("select id, email from users where session_token = $1", [token]);
  if (!rows[0]) return res.status(401).json({ error: "Please sign in." });
  req.user = rows[0];
  next();
}
