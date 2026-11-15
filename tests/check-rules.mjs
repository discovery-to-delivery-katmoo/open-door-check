// Checks that SECURITY-CHECK.md still follows its own rules.
// Run: node tests/check-rules.mjs
import { readFileSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const checklist = read("SECURITY-CHECK.md");
const failures = [];
const check = (ok, message) => {
  if (!ok) failures.push(message);
};

// Part A has exactly 13 numbered rules, 1 to 13 in order.
const partA = checklist.split("## Part A")[1]?.split("\n## Part B")[0] ?? "";
const ruleNumbers = [...partA.matchAll(/^(\d+)\. /gm)].map((m) => Number(m[1]));
check(
  ruleNumbers.length === 13 && ruleNumbers.every((n, i) => n === i + 1),
  `Part A should have rules 1 to 13, found: ${ruleNumbers.join(", ") || "none"}`
);

// Every launch blocker is a heading once; every smaller check is a table row once.
for (let i = 1; i <= 8; i++) {
  const count = checklist.match(new RegExp(`^### L${i} · `, "gm"))?.length ?? 0;
  check(count === 1, `L${i} should appear once as a heading, found ${count}`);
}
for (let i = 1; i <= 11; i++) {
  const count = checklist.match(new RegExp(`^\\| T${i} \\|`, "gm"))?.length ?? 0;
  check(count === 1, `T${i} should appear once as a table row, found ${count}`);
}

// The four labels, spelled exactly.
for (const label of [
  "seen in the code, not confirmed in the live app",
  "likely",
  "couldn't check from code",
  "not found",
]) {
  check(checklist.includes(`"${label}"`), `Label missing or misspelled: "${label}"`);
}

// Fixed sentences.
for (const sentence of [
  "Nothing was found in what could be checked. This isn't a guarantee that your app is secure.",
  "The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure.",
  "Report complete (7 of 7 parts)",
  "I'll read your project only. I won't change anything.",
]) {
  check(checklist.includes(sentence), `Fixed sentence missing: "${sentence}"`);
}

// Never "is secure" as a claim outside the two fixed sentences.
const withoutFixed = checklist.replaceAll("This isn't a guarantee that your app is secure.", "");
check(!/\b(app|project) is secure\b/i.test(withoutFixed.replace("Never say the app is secure", "")),
  'The checklist says an app "is secure" outside the fixed sentences');

// No em or en dashes in anything people read.
const peopleRead = ["SECURITY-CHECK.md", "README.md", "fixtures/README.md"];
for (const f of readdirSync(join(root, "start"))) peopleRead.push(`start/${f}`);
for (const rel of peopleRead) {
  const lines = read(rel).split("\n");
  lines.forEach((line, i) => {
    if (/[–—]/.test(line)) failures.push(`Dash in ${rel}, line ${i + 1}`);
  });
}

// Short enough for every tool's chat box.
const words = checklist.split(/\s+/).filter(Boolean).length;
check(words < 4000, `SECURITY-CHECK.md has ${words} words; the limit is 4,000`);

// Generated files match the source.
try {
  execFileSync("node", [join(root, "scripts/build-skill"), "--check"], { stdio: "pipe" });
} catch (err) {
  failures.push(`build-skill --check failed: ${String(err.stderr || err.message).trim()}`);
}

if (failures.length) {
  console.error(`${failures.length} problem(s):\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`All checks passed (${words} words).`);
