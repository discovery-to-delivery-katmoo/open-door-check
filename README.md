# Open Door Check

Find what's left open before real users arrive.

A free security check for apps built with AI tools such as Lovable, Bolt, Cursor and Claude Code. Your AI assistant reads your project, changes nothing, and tells you in plain words what could let strangers in: secret keys in the wrong place, data anyone can read, files anyone can download, admin actions anyone can call. For each problem you get a ready-made prompt to fix it, or a note that a second pair of eyes is needed.

On a small app it takes a few minutes. You don't need to know how to code, and it's free. It runs in your own AI tool, so it uses that tool's normal allowance: in Lovable, Chat mode uses your free daily chat allowance first, then a small part of a credit per message.

Built with Lovable? Your database is Supabase (Lovable calls it Lovable Cloud), which the check covers in detail.

## How to use it

You don't need to install anything. You copy one page of instructions and paste it into the tool you built your app with. Pick your tool below.

Before you start: the check only reads your project. It works in your tool's "ask questions" mode, which can't change anything. If it finds itself in a mode that could change your app, it stops and asks you to switch.

### If you built with Lovable

1. Open your project in Lovable.
2. Switch the chat to **Chat** mode. Click the mode picker next to the message box and choose **Chat** ("Ask anything, explore ideas"). Not Build, and not Plan.
3. Open the [Lovable instructions](https://raw.githubusercontent.com/discovery-to-delivery-katmoo/open-door-check/main/start/lovable.md). A page of plain text opens.
4. Copy all of it: press **Ctrl+A**, then **Ctrl+C** (on a Mac, **Cmd+A**, then **Cmd+C**).
5. Go back to Lovable, click in the message box, paste (**Ctrl+V** or **Cmd+V**) and press **Enter**.

### If you built with Bolt

1. Open your project in Bolt.
2. Click **Plan** next to the message box so it turns blue. In older versions of Bolt this is called **Discussion** mode. It can't change your code.
3. Open the [Bolt instructions](https://raw.githubusercontent.com/discovery-to-delivery-katmoo/open-door-check/main/start/bolt.md) and copy all of it (**Ctrl+A**, then **Ctrl+C**; on a Mac, **Cmd+A**, then **Cmd+C**).
4. Paste it into Bolt's message box and press **Enter**.

### If you use Cursor

1. Open your project in Cursor.
2. Start a new chat (**Ctrl+I**, or **Cmd+I** on a Mac).
3. Before you type anything, click the mode menu at the top of the chat (it usually says **Agent**) and choose **Ask**. Do this in a new chat rather than switching halfway through one, because Cursor doesn't always pick up a change of mode mid-chat.
4. Open the [Cursor instructions](https://raw.githubusercontent.com/discovery-to-delivery-katmoo/open-door-check/main/start/cursor.md), copy all of it, paste it into the chat and press **Enter**.

### If you'd rather use Claude in your browser

This works with any app, but it's a partial check: Claude sees only the files you give it, not your live settings.

1. Download your project as a zip file:
   - **Lovable, paid plans:** open the **Code** tab and click **Download codebase** at the bottom of the file list.
   - **Lovable, free plan:** connect your project to GitHub (the GitHub button at the top of Lovable), open the project on github.com, click the green **Code** button and choose **Download ZIP**.
   - **Bolt:** click your project's name at the top left, then **Export**, then **Download**.
2. Open [claude.ai](https://claude.ai) and start a new chat.
3. Click the **+** at the bottom left of the message box and upload the zip file.
4. Open the [Claude instructions](https://raw.githubusercontent.com/discovery-to-delivery-katmoo/open-door-check/main/start/claude-chat.md), copy all of it, paste it into the message box and press **Enter**.

### If you already use Claude Code

Type each line into Claude Code and press **Enter** after each one:

```
/plugin marketplace add discovery-to-delivery-katmoo/open-door-check
```

```
/plugin install open-door-check@open-door-check
```

```
/open-door-check:run
```

While the check runs, Claude Code's tools for changing files are switched off.

### What happens next

1. The assistant says it will only read your project, then works through it. It doesn't ask you questions along the way.
2. On a small app this takes a few minutes. On a big one it can take 10 minutes or more.
3. The report appears in the chat. The part called "What the result means" tells you which problems to fix first.
4. **Save the report** before you do anything else: copy it into a document of your own (Google Docs, Word, Notes). Keep it private, because it describes where your app is open.
5. **To fix something:** switch your tool back to its normal mode (Build in Lovable and Bolt, Agent in Cursor). Copy one fix prompt from the report, paste it and send it. Do one fix at a time. Then check your app still works: sign in, open the pages you use most, and try the thing the fix changed. Then do the test the report gives for that fix. In Claude Code, paste fixes into a new, normal chat.
6. **If something in the report doesn't make sense,** paste that part back into the same chat and ask "explain this in plain words".

If it stops partway, for example because you hit your tool's usage limit, wait until the limit resets and type **continue**.


## What you get back

A plain-language report in the chat. It starts with a short result like this:

> Found: 8 launch blockers (4 with a fix prompt, 4 needing a second pair of eyes). Do these first: L1, L2, L4.
>
> The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure.

Then each problem gets its own section. The technical part is evidence for a developer; you can skip it. Here is one, shortened:

```markdown
### L3 · Everyone can read every person's private notes
What could happen: anyone, even someone not signed in, can read the private notes each person writes about their bookings.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 24, 32 and 33:
  -- Private notes each person writes about their bookings
  create policy "Notes are readable" on public.notes
    for select using (true);
Latest change checked: no later changes
[The full report then gives a fix prompt to paste, a test to check the fix worked (sign in as two test accounts and check each sees only its own notes), and how to undo the fix.]
```

See a full example report: [examples/supabase-leaky-report.md](examples/supabase-leaky-report.md). It comes from a test app with open doors put in on purpose.

A report with problems can run to several pages. Every problem has the same layout, and the part called "What the result means" tells you which to fix first.

Each finding says how sure the check is:
- **Seen in the code:** the code itself shows the problem. It isn't confirmed in your live app.
- **Likely:** the code points to a problem, but the deciding part is a setting outside the code.
- **Couldn't check from code:** the answer lives in a settings page, such as your database's (Supabase or Lovable Cloud); the report says where to look.
- **Not found:** nothing turned up in what was read.

On a big app, the check may read only part of your project. Look for "Read in full: X of Y" near the top. A clean result after a short look means little.

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

## Part of Discovery to Delivery

Open Door Check is one of a set of free tools, one for each step of building a product, from first idea to release. See them all at [kathrynmoore.eu](https://www.kathrynmoore.eu/#products).

## When you need a second pair of eyes

Some fixes could lock people out, or depend on how your product works: shared data, teams, roles, payment logic, or AI that takes actions. For those, the report says so instead of giving a fix prompt, and gives you one question to ask. Send an experienced developer the finding, its evidence and a link to this checklist, with that question. A good developer can answer it in one short session.

Don't know one? Freelance sites list developers who review security for apps built on Supabase or Firebase. Ask for a short, paid review of the specific findings rather than a full audit.

## Keep your report private

The report may describe weak spots in your app. Please don't post screenshots of it.

## About

Made by Kat Moore. Version 0.1.4, November 2026. See [CHANGELOG.md](CHANGELOG.md) for what changed.

You can use it for free on your own apps, including apps for your business. You can share and adapt it, with credit. What you can't do is sell it or offer it as a paid service. Licence: [CC BY-NC 4.0](LICENSE), with this added permission from Kat Moore for use on your own business apps.
