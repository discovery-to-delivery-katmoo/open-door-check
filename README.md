# Open Door Check

Find what's left open before real users arrive.

A free security check for apps built with AI tools such as Lovable, Bolt, Cursor and Claude Code. Your AI assistant reads your project, changes nothing, and tells you in plain words what could let strangers in: secret keys in the wrong place, data anyone can read, files anyone can download, admin actions anyone can call. For each problem you get a ready-made prompt to fix it, or a note that a second pair of eyes is needed.

On a small app it takes a few minutes. You don't need to know how to code.

## What you get back

```markdown
### L3 · Everyone can read every person's private notes
What could happen: anyone, even someone not signed in, can read the private notes each person writes about their bookings.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 24, 32 and 33:
  -- Private notes each person writes about their bookings
  create policy "Notes are readable" on public.notes
    for select using (true);
Latest change checked: no later changes
[The full report then gives a fix prompt in its own copy box, a two-account test and a written undo step.]
```

> Found: 8 launch blockers (4 with a fix prompt, 4 needing a second pair of eyes). Do these first: L1, L2, L4.
>
> The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure.

See a full example report: [examples/supabase-leaky-report.md](examples/supabase-leaky-report.md). It comes from a test app with open doors put in on purpose.

A report with problems can run to several pages. Every problem has the same layout, and part 5 tells you which to fix first.

Each finding says how sure the check is:
- **Seen in the code:** the code itself shows the problem. It isn't confirmed in your live app.
- **Likely:** the code points to a problem, but the deciding part is a setting outside the code.
- **Couldn't check from code:** the answer lives in a dashboard; the report says where to look.
- **Not found:** nothing turned up in what was read.

On a big app, the check may read only part of your project. Look for "Read in full: X of Y" near the top. A clean result after a short look means little.

## How to run it

Pick your tool. Each start prompt already contains the whole checklist, so you copy one file and paste it once.

| Tool | Switch to this mode first | Then |
| --- | --- | --- |
| Lovable | Chat mode (not Plan mode, which writes a file) | Copy all of [start/lovable.md](start/lovable.md) and paste it into the chat |
| Bolt | Discussion mode | Copy all of [start/bolt.md](start/bolt.md) and paste it |
| Cursor | Ask mode | Copy all of [start/cursor.md](start/cursor.md) and paste it |
| Claude Code | Nothing to switch: during the check, Claude Code's tools for changing files are switched off | Run `/plugin marketplace add discovery-to-delivery-katmoo/open-door-check`, then `/plugin install open-door-check@open-door-check`, then `/open-door-check:run` (or just ask Claude to run the Open Door Check) |
| Claude chat | Upload your project as a zip | Copy all of [start/claude-chat.md](start/claude-chat.md) and paste it. This is a partial check: Claude can't see your live settings or anything missing from the zip |

The check reads only. If it finds itself in a mode that can edit your project, it stops and asks you to switch. When you're ready to fix something, switch back to your normal editing mode and paste the fix prompt there. In Claude Code, the tools for changing files are only switched off for the check itself, so paste fixes in a new, normal chat.

On a small app the check takes a few minutes. On a big one (hundreds of database files) it can take 10 minutes or more, and it will say which parts it read in full and which it only searched.

## What it checks

**Launch blockers** (fix these before real users arrive):

- L1 · Secret keys are only on the server
- L2 · The database isn't open to anyone
- L3 · Each person sees and changes only their own data
- L4 · Files are protected
- L5 · Admin pages and actions are protected on the server
- L6 · Payment confirmations are real
- L7 · AI spending and actions are limited
- L8 · Sign-in is set up safely

**When you have time:** input checked on the server, safe display of what people type, security headers, which sites can call your app, error messages, package updates, AI instructions, Google key restrictions, Firebase App Check, whether your project is public in the builder, and your platform's own scanner.

It knows Supabase and Firebase in detail, and apps that call an AI model. If your app uses something else, the report says what it couldn't cover.

## What it doesn't do

- It doesn't prove your app is secure. It finds common open doors in your code.
- It doesn't test your live app, sign in, or contact anything outside your project.
- It can't see dashboard settings. Those go in a "couldn't check from code" list, with where to look.
- It doesn't change anything. Fixes are prompts you choose to paste.
- Testing a fix is up to you. Use test accounts and test mode only, never real people's accounts or real payments.

## When you need a second pair of eyes

Some fixes could lock people out, or depend on how your product works: shared data, teams, roles, payment logic, or AI that takes actions. For those, the report says so instead of giving a fix prompt, and gives you one question to ask. Send an experienced developer the finding, its evidence and a link to this checklist, with that question. A good developer can answer it in one short session.

## Keep your report private

The report may describe weak spots in your app. Please don't post screenshots of it.

## About

Made by Kat Moore. Version 0.1.4, November 2026. See [CHANGELOG.md](CHANGELOG.md) for what changed.

Licence: [CC BY-NC 4.0](LICENSE). You can use, share and adapt it for free, with credit, for non-commercial use.
