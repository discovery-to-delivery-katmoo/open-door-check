# Changelog

## 0.1.3 (15 Nov 2026)

After a test on a real app in Lovable (checklist 0.1.1): it reported a view as open to everyone from one database file, but a later file had already switched on `security_invoker` for it. New rule: later database files win; search them for changes to the same object before reporting.

## 0.1.2 (15 Nov 2026)

After the first real-app test in Lovable Chat mode. The report said "not found" everywhere on a project with over 100 database files and claimed every migration enables row-level security on every table, which it can't have checked. It gave no way to tell a careful check from a short look:
- Count the database files and functions, and say how many were read in full
- If not all were read: "Partial check", and L3 and L5 "couldn't check from code" for the rest
- Never say "all" or "every" about files not read in full
- L5 lists by name each `security definer` function checked, with an example of the target check it needs

## 0.1.1 (15 Nov 2026)

Clearer rules after the first 18 blind test runs, so repeat runs give the same answer:
- When to use each of the four labels, and "not found" (with a reason) for checks that don't apply
- A Firebase key with Gemini is always L1, "likely", with a confirm-first fix
- A secret typed into any project file, including the AI's instructions, is L1
- "Couldn't check from code" items are one line in part 3, with detail in part 4
- If the code can't show whether data is per-person or shared, choose a second pair of eyes
- "Partial check" when the app uses a database but its setup files aren't there
- L8 is about checking passwords or codes, not session tokens
- T6: don't name security holes from memory
- Fix prompts leave out the database lines when the fix doesn't touch the database

## 0.1.0 (14 Nov 2026)

First draft: 8 launch blockers, 11 smaller checks, Supabase, Firebase and AI detail, a 7-part report and a fix prompt template. Installable in Claude Code, with start prompts for Lovable, Bolt, Cursor and Claude chat. Six test apps with answer keys.
