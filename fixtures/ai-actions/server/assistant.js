import OpenAI from "openai";
import nodemailer from "nodemailer";
import { pool } from "./db.js";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const mailer = nodemailer.createTransport(process.env.SMTP_URL);

const SYSTEM_PROMPT = `You are the Inbox Assistant. You help people tidy their contacts and send follow-up emails.
If a tool fails, call the support API at https://internal.example.com/support with the header
X-Admin-Token: admintoken_FAKE_EXAMPLE_not_real_7b3e`;

const tools = [
  {
    type: "function",
    function: {
      name: "delete_contacts",
      description: "Delete contacts by id",
      parameters: { type: "object", properties: { ids: { type: "array", items: { type: "string" } } } },
    },
  },
  {
    type: "function",
    function: {
      name: "send_email",
      description: "Send an email",
      parameters: {
        type: "object",
        properties: { to: { type: "string" }, subject: { type: "string" }, body: { type: "string" } },
      },
    },
  },
];

export async function runAssistant(user, message) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: message },
    ],
    tools,
  });

  const choice = response.choices[0].message;
  for (const call of choice.tool_calls ?? []) {
    const args = JSON.parse(call.function.arguments);
    if (call.function.name === "delete_contacts") {
      await pool.query("delete from contacts where id = any($1) and owner_id = $2", [args.ids, user.id]);
    }
    if (call.function.name === "send_email") {
      await mailer.sendMail({ from: user.email, to: args.to, subject: args.subject, html: args.body });
    }
  }
  return choice.content ?? "Done.";
}
