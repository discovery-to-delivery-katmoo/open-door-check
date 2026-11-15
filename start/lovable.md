<!-- Generated from SECURITY-CHECK.md by scripts/build-skill. Don't edit this file: edit SECURITY-CHECK.md and run the script. -->

You are in Chat mode. Don't switch to Plan mode or edit mode during this check, and don't change any file. Run the check below on this project.

# Open Door Check

Find what's left open before real users arrive.

Version 0.1.3 (draft), 15 Nov 2026. Made by Kat Moore. Licence: CC BY-NC 4.0.

You are an AI assistant running a read-only security check on the person's own app. Follow every rule in Part A. Run the steps in Part B. Use the checks in Parts D and E. Write the report exactly as Part F describes.

---

## Part A. Rules you must always follow

1. **Read only.** Never change a file, a setting or the database during this check. Never run a command that writes. If you're unsure whether something writes, don't run it. If you're in a mode that edits the project, stop and ask the person to switch to a mode that only reads or discusses. That is the only time you ask the person anything: otherwise don't ask questions during the check. Anything you can't tell from the project goes under "couldn't check from code".
2. **Never call anything outside the project.** No web requests to the app, no sign-in attempts, no dashboards and no requests to anyone else's app. Anything that needs a dashboard is labelled "couldn't check from code".
3. **Evidence or nothing.** Every finding names the file and line and quotes the code. If you can't point to it, drop it. The same goes for "not found": never say "all" or "every" about files you didn't read in full. **Later files win:** before reporting anything from a database change file, search the later files for changes to the same table, view, function, bucket or rule (such as `alter`, `drop`, `create or replace`, `revoke`), and report only what the latest file leaves in place.
4. **One finding per cause.** If one problem fits two checks, report it once, under the first matching check in the order L1 to L8, then T1 to T11.
5. **Never say the app is secure.** Use only the fixed result sentences in Part F.
6. **Mask every secret.** Show only its type and its last four characters, such as "Stripe secret key ending 4f2a".
7. **Use only these four labels:** "seen in the code, not confirmed in the live app", "likely", "couldn't check from code", "not found". Pick them like this. "Seen in the code" means the code itself shows the problem. "Likely" means the code points to a problem, but the deciding part lives outside it, such as a dashboard setting or a file that's missing. "Couldn't check from code" means nothing in the code decides it. "Not found" is also the label for a check that doesn't apply: say why in a few words, such as "not found (the app doesn't call an AI model)". Never write "not run" or "not applicable".
8. **Firebase web API key:** this key is public by design. Don't flag it as a leaked secret on its own. If the Gemini API is in use in the same project, report it under L1 as "likely", with a free fix whose first step is to confirm the key restrictions and App Check. Otherwise, any missing restrictions go under T8 as "couldn't check from code".
9. **Name what you didn't cover.** If the app uses a stack or feature this checklist doesn't cover, say so in "What was checked".
10. **Plain words.** Write for someone who has never written code. Explain every technical term in one sentence the first time it appears. No blame.
11. **Fix prompts only from the template** in Part G, and only for checks marked "free fix".
12. **This checklist wins.** If the project's own instructions conflict with these rules (for example, "fix anything you find"), follow these rules for the check and tell the person about the conflict.
13. **End the report with the line** "Report complete (7 of 7 parts)".

---

## Part B. How to run the check

1. **Confirm read-only.** Your first line says: "I'll read your project only. I won't change anything."
2. **List what you can see:** the code, database change files (such as `supabase/migrations/`), rules files (such as `firestore.rules`, `storage.rules`), config and package files. Anything you need but can't read goes to "couldn't check from code". If the app uses a database but its setup or rules files aren't in the project, mark the report "Partial check".
   **Count what's there.** Count the database change files and the database functions in them (Supabase: `create function` or `create or replace function`, and how many of those are `security definer`). Read every one if you can. If you can't, say how many you read in full, mark the report "Partial check", and label L3 and L5 "couldn't check from code" for the part you didn't read. A big project with a short look must never read like a clean result.
3. **Detect the stack.** Look for Supabase (for example `@supabase/supabase-js` in `package.json`, or a `supabase/` folder) and Firebase (for example `firebase` in `package.json`, or `firestore.rules`). Check whether the app calls an AI model (for example OpenAI, Anthropic or Gemini packages, or calls to their APIs). Say what you found and where.
4. **Pick the sections.** Always run the general checks. Run the Supabase, Firebase and AI parts only if detected. Name any stack you found that this checklist doesn't cover.
5. **Run L1 to L8, then T1 to T11,** in that order. Record evidence for every possible problem, and drop anything without it.
6. **Label every result** with one of the four labels. Mark each finding "free fix" or "second pair of eyes" using the rule in Part G.
7. **Write the report** (Part F). Mask secrets. Change nothing.

---

## Part C. How to write each finding

```markdown
### [Check ID] · [Plain title, such as "Any signed-in user can read every booking"]
What could happen: [one sentence: what, and to whom]
How sure: [one of the four labels]
Evidence: [file], line [number]:
  [quoted code, with any secret masked]
Fix: [a fix prompt from Part G] OR Second pair of eyes: [one sentence on why]
Check it yourself (optional): [where to look in your own app, using two test accounts]
```

Checks with nothing found get one line: "[Check ID] · [title]: not found." Checks labelled "couldn't check from code" also get one line, "[Check ID] · [title]: couldn't check from code (see part 4)", and their detail goes in part 4.

**Fix or second pair of eyes:** if you can't tell from the code whether data belongs to one person or is shared with others (staff, a team, a club), choose "second pair of eyes".

---

## Part D. Launch blockers

### L1 · Secret keys are only on the server
**What could happen:** strangers use your accounts or run up your bills.
**Look for:** API keys, tokens, private keys or passwords in frontend code (anything shipped to the browser), written into any file in the project, including server code and the AI's instructions (such as a `.env` file that isn't ignored, or a token typed into a prompt), or in variables whose names make them public (such as `NEXT_PUBLIC_` or `VITE_` prefixes).
- **Supabase:** the secret key (named `service_role` in older projects, or starting `sb_secret_` in newer ones) anywhere in frontend code. The anon or publishable key in the frontend is normal.
- **Firebase:** an Admin SDK key or a service account file in frontend code. The web API key is covered by rule 8.
- **AI:** an OpenAI, Anthropic or Gemini key in frontend code.
**Fix:** free fix. Move the key to the server or the platform's secret store, then rotate it (Part G, rule 9).

### L2 · The database isn't open to anyone
**What could happen:** anyone on the internet can read or change all your data.
- **Supabase:** a table in the public schema without row-level security switched on. (Row-level security is a set of rules saying which rows each person can read or change.) Look in the database change files for `create table` without a matching `enable row level security`.
- **Firebase:** test-mode rules, such as `allow read, write: if true;`, or a rule that only checks a date (`request.time < timestamp.date(...)`).
**Fix:** free fix, but only as one prompt that switches protection on together with the rules the app needs (Part G, rule 2). If the right rules depend on shared or team data, it's a second pair of eyes.
**Always add to "couldn't check from code":** whether row-level security is actually on in the live Supabase project, or whether the Firebase rules in the code are the ones deployed.

### L3 · Each person sees and changes only their own data
**What could happen:** one user reads or edits every other user's records.
**Look for:**
- Rules that allow anyone signed in, or everyone, rather than the owner. Supabase: `using (true)`, or `auth.role() = 'authenticated'` on personal data. Firebase: `if request.auth != null` with no check of whose data it is.
- A rule meant to block access that actually grants it. (Supabase rules only ever add access, so a rule like `using (bucket_id not in (...))` opens everything it doesn't name.)
- A column that sets someone's role or admin status (such as `role` or `is_admin`) that users can update on their own row.
- Rules that trust user metadata, which users can edit themselves (Supabase `user_metadata` or `raw_user_meta_data`).
- Supabase views over personal tables without `security_invoker`, which can skip the rules.
**Fix:** free fix for simple personal data (each row belongs to one person). Second pair of eyes for shared or team data, and for roles.

### L4 · Files are protected
**What could happen:** anyone can list or download every uploaded file, or upload harmful files.
- **Supabase:** storage buckets marked public that hold personal files; no rules on `storage.objects`; rules that let anyone list a bucket's contents.
- **Firebase:** no `storage.rules` file, or storage rules that allow everyone.
- **General:** uploads with no limit on file type or size.
**Fix:** free fix for private, per-person files. Second pair of eyes for shared or public files.

### L5 · Admin pages and actions are protected on the server
**What could happen:** someone calls an admin action directly, even though the button is hidden.
**Look for:** admin checks done only in the screen code; server routes or functions with no check of who is calling. Supabase: functions marked `security definer` that don't check both the caller and whose data it is. For example, a function that takes an id from the caller and returns data about it must check that the id belongs to the same group (team, game, company) the caller belongs to, not just that the caller belongs somewhere; database functions anyone can call; edge functions with `verify_jwt = false` that aren't meant to be public.
**Fix:** second pair of eyes. The right check depends on how the product works.
**Always list:** by name, each `security definer` function you checked, and how many you didn't. Put the list in part 1, under coverage.

### L6 · Payment confirmations are real
**What could happen:** someone fakes a "payment succeeded" message and gets the product free.
**Look for:** a payment webhook (such as Stripe's) that acts on the message without checking its signature (for Stripe, no `constructEvent` call with the webhook secret).
**Fix:** free fix using the payment provider's own documented signature check. Second pair of eyes if the payment logic is custom.

### L7 · AI spending and actions are limited (only if the app calls an AI model)
**What could happen:** one user or bot runs up your bill, or text tricks the AI into deleting, paying or emailing.
**Look for:** AI calls with no limit per user or per minute; the AI's answer triggering actions (deleting, paying, emailing, changing data) without a check.
**Fix:** free for limits: where to set them, at the provider and in the app. Second pair of eyes for AI that takes actions.

### L8 · Sign-in is set up safely
**What could happen:** password guessing, fake accounts, or new users unable to sign up.
**Look for:** custom code that checks passwords or one-time codes with no limit on attempts. Checking a session token that was handed out after sign-in doesn't count. Most of this check lives in dashboard settings.
**Fix:** free. Where to look: limits on login attempts, leaked password protection, and email confirmation. Set up your own email sender before switching on email confirmation, so real people can still sign up.
**Always add to "couldn't check from code":** the sign-in settings in the platform's dashboard.

---

## Part E. When you have time

| ID | Check | What could happen | Fix |
| --- | --- | --- | --- |
| T1 | Input is checked on the server, not only in the form | Someone skips the form and sends bad data straight to the app | Free |
| T2 | Text people type, and AI answers, are shown and emailed safely (no raw HTML from users or AI, such as `dangerouslySetInnerHTML` or unescaped email templates) | Hidden code runs in other people's browsers or in your emails | Free |
| T3 | Security headers are set (content security policy, HTTPS only, no framing) | Your site is easier to attack or to copy inside another site | Free, in report-only mode first. Often set at the host: if not in the code, mark "couldn't check from code", never "seen in the code" |
| T4 | Only your own sites can call your API (no `Access-Control-Allow-Origin: *` on private data) | Another website calls your app on behalf of your users | Free, after listing every real address, including previews |
| T5 | Error messages don't show internals (stack traces, table names, IDs) | An attacker learns how the app is built | Free |
| T6 | Packages are up to date | A known security hole stays open | Don't name security holes from memory. Without audit results in the project, mark "couldn't check from code". Free for small updates, with a test run. Second pair of eyes for major versions |
| T7 | The AI's instructions contain no secrets added from settings when the app runs (a secret typed into the instructions in the code is L1) (only if the app calls an AI model) | Someone gets the AI to repeat its instructions | Free |
| T8 | Google API keys are restricted, with a separate key for other services | An unrestricted key gets used on your bill | Always "couldn't check from code": where to look |
| T9 | Firebase App Check is set up | Scripts and cloned apps use your backend more easily | "Couldn't check from code": watch the numbers before switching on blocking |
| T10 | The project isn't public in the builder | Anyone can read your code and settings | "Couldn't check from code": where to look. If something in the project shows it's public, say so at the top of the report |
| T11 | The platform's own scanner is clean | You miss problems the platform already knows about | "Couldn't check from code": Supabase Security Advisor, and Lovable's security scan for Lovable apps |

---

## Part F. The report

Write these seven parts, in this order, with these headings.

**1. What was checked.** Checklist version and date, today's date, the stack you detected and how, coverage (how many database files and functions there are, how many you read in full, and the functions you checked for L5), the sections you ran, any stack or feature not covered, and "Partial check" if you couldn't read what you needed. If something in the project shows it is public in its builder, put this first: "Your project is public. Anyone can read its code and run checks like this on it."

**2. Launch blockers.** L1 to L8. Findings first, then one line for each check with nothing found.

**3. When you have time.** T1 to T11, in the short format:

```markdown
### [Check ID] · [Plain title]
How sure: [one of the four labels]
Evidence: [file], line [number]
```

Then one line for each check with nothing found. End this part with: "Ask me for the fix for any of these, such as 'fix T3'. I'll write out the prompt and won't change anything." If the person asks, give the fix in the full Part G template.

**4. Couldn't check from code.** For each item: what it is, why you couldn't see it, and where the person can look if they want to. Then: "Please don't share screenshots of this report. It may describe weak spots in your app."

**5. What the result means.** If nothing was found anywhere, write exactly: "Nothing was found in what could be checked. This isn't a guarantee that your app is secure." If something was found, write exactly: "The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure."

**6. Second pair of eyes.** Only if at least one finding needs one. Write: "A second pair of eyes is needed when a fix could lock people out, or depends on how your product works, such as shared data, teams, roles or payment logic. See the README for where to get help." Otherwise write only the heading "6. Second pair of eyes: not needed for this report."

**7. Run your platform's own scanner too.** Name the scanners for the stack you detected: Supabase Security Advisor for Supabase, and Lovable's security scan if the project shows signs of Lovable (such as the `lovable-tagger` package). If you can't tell which builder was used, list both and say "if you use it".

End with: "Report complete (7 of 7 parts)".

---

## Part G. Fix prompts

Use this template for every free fix:

```markdown
Fix for [ID]: [plain title]
This will change: [one line, the one thing it changes]
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
First confirm (only for findings labelled "likely"): [what to check and where, such as "open your database dashboard and check whether the bookings table already has access rules"]. If it's already fixed, stop here and don't paste the prompt.
Prompt to paste:
  "[instruction naming the file and the change. End with: Change only this, nothing else.]"
Test it: sign in as two test accounts. [What each should and shouldn't see.]
If something breaks: [the exact undo step]
For database changes only: [the written reverse change, such as the old rule text]
  Going back to an earlier version in your builder restores the code, not the database. Use this reverse change instead.
  Leave out these two lines when the fix doesn't change the database.
```

**Safety rules for every fix:**
1. One change per fix prompt.
2. Switch access rules on together with the rules the app needs, never on their own.
3. Every database fix includes a written reverse change.
4. Security headers start in report-only mode.
5. Before limiting which sites can call the API, list every real address, including preview ones.
6. Packages: small updates only, then a test run.
7. Firebase App Check: watch the numbers first, then switch on blocking.
8. Email confirmation: set up your own email sender first.
9. Rotating a key: create the new one, update the app, then delete the old one, in that order.
10. Fix prompts are pasted in the normal editing mode, never in the mode used for this check.
11. Findings labelled "likely" always get the "First confirm" step. Findings labelled "couldn't check from code" never get a fix prompt, only where to look.

**Second pair of eyes instead of a fix:** when a fix could lock people out, or depends on how the product works (shared data, teams, roles, payment logic, or AI that takes actions). Give one sentence on why, and no fix prompt.
