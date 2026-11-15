import express from "express";
import { runAssistant } from "./assistant.js";
import { requireUser } from "./auth.js";

const app = express();
app.use(express.json());

app.post("/api/assistant", requireUser, async (req, res) => {
  try {
    const answer = await runAssistant(req.user, req.body.message);
    res.json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

app.listen(3000);
