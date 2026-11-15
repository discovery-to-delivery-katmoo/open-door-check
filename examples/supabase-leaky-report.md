<!-- A real, unedited Open Door Check report, from a blind test run on 15 Nov 2026 on the supabase-leaky test app in fixtures/. The app has open doors put in on purpose; every key in it is fake. The run used the 0.1.1 rules before the version line was updated, so the report says 0.1. -->

I'll read your project only. I won't change anything.

# Open Door Check report

## 1. What was checked

- **Checklist:** Open Door Check, version 0.1 (draft), 14 Nov 2026.
- **Date of this check:** 15 Nov 2026.
- **What I could see:** 7 files.
  - `package.json`, the list of packages the app uses.
  - One database change file, `supabase/migrations/20261101000000_init.sql`. A database change file is a script that sets up tables and access rules.
  - Two edge functions, `supabase/functions/stripe-webhook/index.ts` and `supabase/functions/get-profile/index.ts`. An edge function is a small piece of code that runs on Supabase's servers instead of in the visitor's browser.
  - Three screen code files: `src/lib/supabase.ts`, `src/lib/adminClient.ts` and `src/components/Comment.tsx`.
  - There is no `supabase/config.toml`, no lock file and no `.gitignore`.
- **Stack detected:**
  - **Supabase.** `@supabase/supabase-js` is in `package.json` line 7, and the project has a `supabase/` folder with database changes and edge functions.
  - **React, Vite and TypeScript** for the screens (`package.json` lines 8 to 11).
  - **Stripe** payments, through a webhook in `supabase/functions/stripe-webhook/index.ts`. A webhook is an address another service calls to tell your app that something happened, such as a payment.
  - **No Firebase.** There is no `firebase` package and no `firestore.rules`.
  - **No AI model.** There are no OpenAI, Anthropic or Gemini packages or calls.
- **Sections run:** the general checks and the Supabase parts. The Firebase and AI parts were not run because the app doesn't use them.
- **Not fully covered:** this checklist looks at Stripe only for the webhook signature check (L6). Other Stripe settings, such as which events your account sends, are outside it.
- **Builder:** nothing in the project shows which builder made it, and nothing shows that the project is public.

## 2. Launch blockers

### L1 · The Supabase secret key is in the browser code
What could happen: anyone who opens your site can copy this key and read, change or delete everything in your database, for every user, ignoring all access rules.
How sure: seen in the code, not confirmed in the live app
Evidence: `src/lib/adminClient.ts`, line 6:
  `"[Supabase secret key ending 4f2a]"`
  (line 3 says: `// Used by the Admin page to list every booking.`)
A secret key is a password your app uses to talk to Supabase with full power. Anything in `src/` is sent to every visitor's browser, so anyone can read it there.
Fix:
```markdown
Fix for L1: The Supabase secret key is in the browser code
This will change: the admin booking list moves from the browser to a server function, so the secret key leaves the browser code.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode. Then, in your Supabase dashboard under API keys, create a new secret key, and save it as an edge function secret named SUPABASE_SERVICE_ROLE_KEY. Don't delete the old key yet.
Prompt to paste:
  "Remove src/lib/adminClient.ts from the browser code. Move listAllBookings into a new Supabase edge function called list-all-bookings. It reads the secret key only from Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), and it returns bookings only when the signed-in caller is an admin, checked on the server. Make the Admin page call this function instead of using a key in the browser. Change only this, nothing else."
Test it: sign in as two test accounts, one admin and one ordinary member. The admin should still see the booking list on the Admin page. The member should get a refusal from the new function and see no bookings. Then search your site's code in the browser for "sb_secret": it should not be found. Only after that, delete the old secret key ending 4f2a in the Supabase dashboard. Order: create the new key, update the app, then delete the old one.
If something breaks: go back to the version before this change in your builder. Don't bring the old key back into the code. Keep the new key, and keep the Admin page off until the server function works.
```
Note: the admin check in this fix depends on who counts as an admin. Right now users can change their own role (see the second L3 finding below), so sort that out first or at the same time.
Check it yourself (optional): open your live site, open the browser's developer tools (Sources tab) and search for "sb_secret". With two test accounts, compare what the Admin page shows to a member and to an admin.

### L2 · The bookings table has no access rules switched on
What could happen: anyone on the internet who has your public Supabase address and publishable key (both are in the browser code) can read, change or delete every booking, including guests' names and email addresses.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/migrations/20261101000000_init.sql`, line 16:
  `create table public.bookings (`
  ...
  `guest_name text,`
  `guest_email text,`
There is no `alter table public.bookings enable row level security;` anywhere in the file. Row-level security is a set of rules saying which rows each person can read or change. Without it, the table is open to everyone.
Second pair of eyes: the Admin page lists every booking (`src/lib/adminClient.ts` line 3), so staff need to see bookings that aren't their own. The right rules depend on how you handle staff and guests, and wrong rules could lock people out.
Check it yourself (optional): in the Supabase dashboard, open Table Editor, then bookings, and see whether row-level security is shown as on. With two test accounts, make a booking as one and check whether the other can see it.

### L3 · Every private note can be read by everyone
What could happen: any person, signed in or not, can read every note every other person has written about their bookings.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/migrations/20261101000000_init.sql`, lines 32 to 33:
  `create policy "Notes are readable" on public.notes`
  `for select using (true);`
A policy is one access rule. `using (true)` means "allow everyone", even though line 24 calls these "Private notes each person writes".
Fix:
```markdown
Fix for L3: Every private note can be read by everyone
This will change: each person can read only their own notes.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
Prompt to paste:
  "Add a new database change file that drops the policy "Notes are readable" on public.notes and creates a policy "Read own notes" on public.notes for select using (auth.uid() = user_id). Change only this, nothing else."
Test it: sign in as two test accounts. Each writes a note. Each should see only their own note, never the other person's. Signed out, you should see no notes at all.
If something breaks: run the reverse change below in the Supabase SQL editor.
For database changes only:
  drop policy "Read own notes" on public.notes;
  create policy "Notes are readable" on public.notes for select using (true);
  Going back to an earlier version in your builder restores the code, not the database. Use this reverse change instead.
```
Check it yourself (optional): with two test accounts, write a note as the first, then sign in as the second and see whether that note shows up anywhere.

### L3 · People can change their own role, including to "paid"
What could happen: any signed-in person can set their own role to "paid" (or any other role, such as "admin") and get paid features or extra powers without paying.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/migrations/20261101000000_init.sql`, line 5 and lines 12 to 13:
  `role text not null default 'member'`
  `create policy "Update own profile" on public.profiles`
  `for update using (auth.uid() = id);`
This rule lets each person edit any part of their own profile row, and the `role` column sits in that row. The payment webhook relies on that same column (`role: "paid"` in `supabase/functions/stripe-webhook/index.ts` line 13).
Second pair of eyes: roles decide who can do what, and moving them or locking them down could lock out paying customers or admins, so the right change depends on how your product works.
Check it yourself (optional): with two test accounts, sign in as an unpaid one and look in the Supabase dashboard (Table Editor, then profiles) to see whether its role could be changed by that person. Compare with an account that paid in Stripe test mode.

### L4 · Passport scans sit in a public storage bucket
What could happen: anyone who has or guesses a file's address can download guests' passport scans, without signing in.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/migrations/20261101000000_init.sql`, lines 39 to 40:
  `insert into storage.buckets (id, name, public)`
  `values ('passport-scans', 'passport-scans', true);`
A storage bucket is a folder for uploaded files. `true` here means public, so its files can be opened by anyone with the link.
Second pair of eyes: staff probably need to see passport scans at check-in, so these files may be shared rather than belonging to one person, and the right rules depend on who should see them.
Check it yourself (optional): in the Supabase dashboard, open Storage, then passport-scans, and see whether it's marked public. Upload a test file with one test account, copy its link, and open it in a private browser window where nobody is signed in.

### L4 · No limit on what can be uploaded as a passport scan
What could happen: someone could upload very large or harmful files (for example a disguised program instead of an image) into the passport bucket.
How sure: likely
Evidence: `supabase/migrations/20261101000000_init.sql`, lines 39 to 40:
  `insert into storage.buckets (id, name, public)`
  `values ('passport-scans', 'passport-scans', true);`
The bucket is created without a file size limit or a list of allowed file types. These limits can also be set in the dashboard, and the upload screen isn't in the project, so the deciding part lives outside the code.
Second pair of eyes: this is the same shared bucket as the finding above, so the limits should be decided together with who uses it.
Check it yourself (optional): in the Supabase dashboard, open Storage, then passport-scans, then its settings, and look for "Restrict file upload size" and "Allowed MIME types". With a test account, try uploading a large file that isn't an image.

### L5 · Anyone can cancel any booking
What could happen: anyone, even someone who isn't signed in, can delete any person's booking just by knowing or guessing its ID.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/migrations/20261101000000_init.sql`, lines 43 to 48:
  `create function public.cancel_booking(booking_id uuid)`
  `security definer`
  `delete from public.bookings where id = booking_id;`
A `security definer` function runs with the database owner's full power and skips the access rules. This one never checks who is calling or whose booking it is. Functions in the public schema can be called by anyone unless that's switched off.
Second pair of eyes: who may cancel (the guest, the person who booked, staff) depends on how your product works.
Check it yourself (optional): with two test accounts, make a booking as the first, then sign in as the second and try to cancel the first person's booking.

### L6 · Payment confirmations aren't checked
What could happen: anyone can send a fake "payment completed" message to your webhook address and turn any account into a paid one for free.
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/functions/stripe-webhook/index.ts`, lines 9 to 13:
  `const event = await req.json();`
  `if (event.type === "checkout.session.completed") {`
  `const userId = event.data.object.client_reference_id;`
  `await supabase.from("profiles").update({ role: "paid" }).eq("id", userId);`
Stripe signs every real message with a secret only you and Stripe know. The signature is like a seal on an envelope. This code never checks it (there is no `constructEvent` call).
Fix:
```markdown
Fix for L6: Payment confirmations aren't checked
This will change: the payment webhook ignores any message that isn't signed by Stripe.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode. In your Stripe dashboard, open Developers, then Webhooks, then this endpoint, and copy its signing secret. Save it as an edge function secret named STRIPE_WEBHOOK_SECRET in Supabase.
Prompt to paste:
  "In supabase/functions/stripe-webhook/index.ts, check Stripe's signature before acting on any message. Read the raw body with await req.text(), then verify it with stripe.webhooks.constructEventAsync(body, req.headers.get('stripe-signature'), Deno.env.get('STRIPE_WEBHOOK_SECRET')) from the npm:stripe package, using Stripe.createSubtleCryptoProvider(). If the check fails or the header is missing, return status 400 and change nothing. Use the verified event in place of req.json(). Change only this, nothing else."
Test it: sign in as two test accounts. The first pays with a Stripe test card in test mode and should become paid. For the second, send a message to the webhook without a valid Stripe signature (Stripe's dashboard and command-line tool can send test events). It should be refused, and the second account should stay "member".
If something breaks: go back to the version before this change in your builder, then tell whoever helps you with payments.
```
Check it yourself (optional): in Stripe's dashboard, under Developers, then Webhooks, look at recent deliveries to your endpoint. After the fix, any delivery that fails the check shows status 400.

L7 · AI spending and actions are limited: not found (the app doesn't call an AI model).
L8 · Sign-in is set up safely: not found (the app has no code of its own that checks passwords or one-time codes; it uses Supabase's sign-in). The dashboard settings are in part 4.

## 3. When you have time

### T2 · Comment text is shown as raw HTML
How sure: seen in the code, not confirmed in the live app
Evidence: `src/components/Comment.tsx`, line 7
(`dangerouslySetInnerHTML={{ __html: body }}` shows whatever a person typed as live web page code. Someone could hide a script in a comment that then runs in other people's browsers.)

### T4 · Any website can call the profile function
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/functions/get-profile/index.ts`, line 4
(`"Access-Control-Allow-Origin": "*"` is a setting that tells browsers any website may call this function, and the function returns profile data.)

### T5 · Error messages show the app's internals
How sure: seen in the code, not confirmed in the live app
Evidence: `supabase/functions/get-profile/index.ts`, line 22
(The error reply includes `stack: (err as Error).stack`. A stack trace is the app's internal record of where the code failed, and it helps an attacker learn how the app is built.)

T1 · Input is checked on the server: not found.
T3 · Security headers are set: couldn't check from code (see part 4).
T6 · Packages are up to date: couldn't check from code (see part 4).
T7 · The AI's instructions contain no secrets: not found (the app doesn't call an AI model).
T8 · Google API keys are restricted: couldn't check from code (see part 4).
T9 · Firebase App Check is set up: not found (the app doesn't use Firebase).
T10 · The project isn't public in the builder: couldn't check from code (see part 4).
T11 · The platform's own scanner is clean: couldn't check from code (see part 4).

Ask me for the fix for any of these, such as 'fix T3'. I'll write out the prompt and won't change anything.

## 4. Couldn't check from code

- **Whether row-level security is really on in your live Supabase project (L2).** Why I couldn't see it: the code only shows what was meant to be set up, and the live database can differ. Where to look: in the Supabase dashboard, open Table Editor and check that row-level security shows as on for profiles, bookings and notes.
- **Sign-in settings (L8).** Why: these live in the Supabase dashboard, not in the code. Where to look: in Supabase, open Authentication, then its settings. Check the limits on sign-in attempts, leaked password protection, and email confirmation. Set up your own email sender before switching on email confirmation, so real people can still sign up.
- **Storage access rules and limits for passport-scans (L4).** Why: the project has no rules for who can list, upload or download files, and no size or type limits, so these may live only in the dashboard. Where to look: in Supabase, open Storage, then Policies, and Storage, then passport-scans, then its settings.
- **Whether the edge functions need a signed-in caller (L5).** Why: there is no `supabase/config.toml`, so I couldn't see whether `verify_jwt` is on or off for `stripe-webhook` and `get-profile`. `verify_jwt` is the setting that makes a function refuse callers who aren't signed in. Where to look: in Supabase, open Edge Functions, then each function, then its settings.
- **Whether a Stripe webhook signing secret is saved (L6).** Why: secrets are kept in the dashboard. Where to look: Supabase, then Edge Functions, then Secrets, and Stripe, then Developers, then Webhooks.
- **Security headers (T3).** Why: these are usually set by the host, and no hosting settings are in the project. Where to look: your host's settings for headers such as Content-Security-Policy, Strict-Transport-Security and X-Frame-Options.
- **Package updates (T6).** Why: there is no lock file or audit result in the project. Where to look: ask your builder to run a package audit and show you the result.
- **Google API key restrictions (T8).** Why: key restrictions live in Google Cloud. Where to look: if you use any Google keys, open Google Cloud Console, then APIs and Services, then Credentials, and check each key's restrictions.
- **Whether the project is public in your builder (T10).** Why: that's a builder setting. Where to look: your builder's project sharing or visibility settings.
- **The platform's own scanners (T11).** Why: their results aren't in the project. Where to look: Supabase Security Advisor in the Supabase dashboard, and Lovable's security scan if you use it.

Please don't share screenshots of this report. It may describe weak spots in your app.

## 5. What the result means

The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure.

## 6. Second pair of eyes

A second pair of eyes is needed when a fix could lock people out, or depends on how your product works, such as shared data, teams, roles or payment logic. See the README for where to get help.

## 7. Run your platform's own scanner too

- **Supabase Security Advisor**, in your Supabase dashboard. This project uses Supabase.
- **Lovable's security scan**, if you use it. Nothing in the project shows which builder was used.

Report complete (7 of 7 parts)
