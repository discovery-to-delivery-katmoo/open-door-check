<!-- A real, unedited Open Door Check report, from a blind test run on 15 Nov 2026 with checklist 0.1.4, on the supabase-leaky test app in fixtures/. The app has open doors put in on purpose; every key in it is fake. -->

I'll read your project only. I won't change anything.

## 1. What was checked

- **Checklist:** Open Door Check version 0.1.4 (draft), 15 Nov 2026. **Today's date:** 15 Nov 2026.
- **What the project uses:** Supabase, a hosted database with sign-in, file storage and small pieces of server code. I could tell from `package.json`, line 7 (`"@supabase/supabase-js"`), and from the `supabase` folder, which holds one database change file and two server functions. I found no Firebase. The app doesn't call an AI model: there are no AI packages and no calls to OpenAI, Anthropic or Gemini. It does take payments through Stripe (`supabase/functions/stripe-webhook/index.ts`).
- **Which builder:** nothing in the project shows which builder made it. There is no `lovable-tagger` and no `@lovable.dev` package.
- **What the project contains:** 7 files. These are `package.json`; the database change file `supabase/migrations/20261101000000_init.sql`; two server functions, `supabase/functions/stripe-webhook/index.ts` and `supabase/functions/get-profile/index.ts`; and three browser files, `src/lib/supabase.ts`, `src/lib/adminClient.ts` and `src/components/Comment.tsx`. I read all 7 in full.
- **Coverage:** Read in full: 1 of 1 database files, 1 of 1 functions. A "security definer" function is a database function that runs with full rights and skips the access rules. I checked the only one for L5, `cancel_booking`, and left 0 unchecked.
- **Sections run:** the general checks, plus the Supabase parts. The Firebase and AI parts were skipped because neither is used.
- **Not covered:** the Admin page and the screen where people upload passport scans aren't in the project, so I couldn't read them. There's no settings file for the server functions, so I couldn't see which ones require sign-in. Beyond that, nothing obvious, but this checklist doesn't cover everything.

## 2. Launch blockers

### L1 · The database's master key is inside the website
What could happen: anyone who opens your site can find this key and use it to read, change or delete every piece of data and every file, skipping all access rules.
How sure: seen in the code, not confirmed in the live app
Evidence: src/lib/adminClient.ts, lines 3 to 6:
  // Used by the Admin page to list every booking.
  export const adminClient = createClient(
    "https://abcdefghijklmnop.supabase.co",
    "Supabase secret key ending 4f2a"
Latest change checked: no later changes
Fix:

Fix for L1: Move the database's master key off the website
This will change: the Admin page gets its booking list from a protected server function instead of using the master key in the browser.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
Prompt to paste (in its own copy box, below)

```text
In src/lib/adminClient.ts, the Supabase secret key is written into code that runs in the browser. Remove adminClient and its secret key from that file. Create a new server function called list-all-bookings that reads the secret key from the platform's secret store (never from the code) and returns the same list that listAllBookings returns today. The new function must refuse anyone who isn't signed in as an admin. If the project has no clear way to tell who is an admin on the server, stop and ask me before building it. Change listAllBookings so it calls the new server function. Change only this, nothing else.
```

Test it: sign in as two test accounts, one admin and one normal member. The admin still sees the booking list on the Admin page. The member is refused. Then replace the key, in this order: create a new secret key in your Supabase dashboard, put it in the secret store the new function uses, check the Admin page still works, then delete the old key.
If something breaks: go back to the previous version in your builder. This reopens the problem. Use it only to get people back in, then ask for help.

### L2 · The bookings table has no access rules, so anyone can read or change it
What could happen: anyone on the internet can read every guest's name and email, or change and delete any booking.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 15 to 18:
  -- Bookings: names and emails of people who booked
  create table public.bookings (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users (id),
Row-level security is a set of rules saying which rows each person can read or change. I read the whole file. It switches row-level security on for profiles (line 7) and notes (line 30) but never for bookings.
Latest change checked: no later changes (this is the only database change file)
Second pair of eyes: from the code I can't tell who should see a booking (the person who booked, the business, staff at check-in, or all of them), so the wrong rules could lock people out.
What to ask (second pair of eyes only): "Who should be able to read, add, change and cancel a booking, and what's the smallest set of rules that allows only that?"
Check it yourself (optional): in your Supabase dashboard, open the Table Editor and look at the bookings table. It shows whether row-level security is switched on.

### L3 · Everyone can read every person's private notes
What could happen: anyone, even someone not signed in, can read the private notes each person writes about their bookings.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 24, 32 and 33:
  -- Private notes each person writes about their bookings
  create policy "Notes are readable" on public.notes
    for select using (true);
Latest change checked: no later changes
Fix:

Fix for L3: Each person reads only their own notes
This will change: the rule for reading notes, so each person sees only the notes they wrote.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
Prompt to paste (in its own copy box, below)

```text
Create a new database change file that removes the access rule "Notes are readable" on the table public.notes and replaces it with a rule called "Read own notes" that allows reading only when auth.uid() = user_id. Keep the existing "Write own notes" rule as it is. Change only this, nothing else.
```

Test it: sign in as two test accounts, Alice and Bob. Each writes a note. Alice sees only her note, and Bob sees only his.
If something breaks: run the reverse change below in your database. This reopens the problem. Use it only to get people back in, then ask for help.
For database changes only: drop policy "Read own notes" on public.notes; create policy "Notes are readable" on public.notes for select using (true);
  Going back to an earlier version in your builder restores the code, not the database. Use this reverse change instead.

### L3 · People can change their own role, including making themselves "paid"
What could happen: any signed-in person can set their own role to "paid" without paying, or to any other role the app trusts.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 5, 12 and 13:
    role text not null default 'member'
  create policy "Update own profile" on public.profiles
    for update using (auth.uid() = id);
This rule lets people update every column of their own profile row, the role column included. The payment code shows the role controls paid access (supabase/functions/stripe-webhook/index.ts, line 13: `update({ role: "paid" })`).
Latest change checked: no later changes
Second pair of eyes: roles decide who pays and who has extra rights, so the fix depends on how your product works and could lock people out.
What to ask (second pair of eyes only): "How do we stop people editing the role column themselves while still letting them change their display name?"
Check it yourself (optional): ask your builder to show you which columns people can change on their own profile.

### L4 · Passport scans are in a public folder
What could happen: anyone with a file's link can download people's passport scans, without signing in.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 38 to 40:
  -- Passport scans uploaded at check-in
  insert into storage.buckets (id, name, public)
  values ('passport-scans', 'passport-scans', true);
A "bucket" is a folder for uploaded files. I read the whole file and found no access rules for uploaded files (no rules on `storage.objects`).
Latest change checked: no later changes
Second pair of eyes: staff probably need to see scans at check-in, so making the folder private needs the right sharing rules, or check-in could stop working.
What to ask (second pair of eyes only): "Who needs to see a passport scan (the guest, check-in staff, admins), and what rules make the folder private without breaking check-in?"
Check it yourself (optional): in your Supabase dashboard, open Storage and look at the passport-scans bucket. It shows whether it's marked public.

### L4 · Uploads have no limit on file type or size
What could happen: someone uploads huge or harmful files into the passport folder.
How sure: likely
Evidence: supabase/migrations/20261101000000_init.sql, lines 39 and 40:
  insert into storage.buckets (id, name, public)
  values ('passport-scans', 'passport-scans', true);
The folder is created with no size limit and no list of allowed file types. The upload screen isn't in the project, and a limit could also be set in the dashboard.
Latest change checked: no later changes
Fix:

Fix for L4: Limit passport uploads by file type and size
This will change: the passport-scans folder accepts only images and PDFs up to 10 MB. Change the numbers if your scans are bigger.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
First confirm: open your Supabase dashboard, go to Storage, open the passport-scans bucket's settings, and check whether a file size limit and allowed file types are already set. If they are, stop here and don't paste the prompt.
Prompt to paste (in its own copy box, below)

```text
Create a new database change file that updates the storage bucket 'passport-scans' in storage.buckets to set file_size_limit to 10485760 (10 MB) and allowed_mime_types to image/jpeg, image/png and application/pdf. Don't change whether the bucket is public. Change only this, nothing else.
```

Test it: sign in as a test account and upload a small JPEG or PDF test file: it works. Try a file over 10 MB, or a different file type: it's refused.
If something breaks: run the reverse change below in your database. This reopens the problem. Use it only to get people back in, then ask for help.
For database changes only: update storage.buckets set file_size_limit = null, allowed_mime_types = null where id = 'passport-scans';
  Going back to an earlier version in your builder restores the code, not the database. Use this reverse change instead.

### L5 · Anyone can cancel any booking
What could happen: anyone, even someone not signed in, can delete any booking just by knowing its id.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/migrations/20261101000000_init.sql, lines 43, 46 and 48:
  create function public.cancel_booking(booking_id uuid)
  security definer
    delete from public.bookings where id = booking_id;
The function runs with full rights. It never checks who is calling or whether the booking is theirs, and the file never limits who can run it.
Latest change checked: no later changes
Second pair of eyes: who may cancel a booking (the guest, the business or staff) depends on how your product works.
What to ask (second pair of eyes only): "Who should be able to cancel a booking, and how should cancel_booking check both the caller and that the booking belongs to them?"
Check it yourself (optional): ask your builder to show you who is allowed to run the cancel_booking function.

### L6 · Fake "payment succeeded" messages are accepted
What could happen: someone sends a made-up payment message to your app and gets "paid" access for free.
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/functions/stripe-webhook/index.ts, lines 9, 11, 12 and 13:
    const event = await req.json();
    if (event.type === "checkout.session.completed") {
      const userId = event.data.object.client_reference_id;
      await supabase.from("profiles").update({ role: "paid" }).eq("id", userId);
A "webhook" is the address Stripe sends payment messages to. This one never checks Stripe's signature, so it can't tell a real message from a fake one.
Latest change checked: no later changes
Fix:

Fix for L6: Check that payment messages really come from Stripe
This will change: the payment webhook accepts only messages carrying Stripe's valid signature.
Before you start: make a copy or a test branch, if your tool can. Switch your builder back to its normal editing mode.
Prompt to paste (in its own copy box, below)

```text
In supabase/functions/stripe-webhook/index.ts, check Stripe's signature before acting on any message, using Stripe's own documented method: add the official Stripe library, read the raw request body and the stripe-signature header, and verify them with constructEventAsync and a webhook signing secret read from the platform's secret store under the name STRIPE_WEBHOOK_SECRET (create that secret setting). If the check fails, reply with status 400 and change nothing. Only after a successful check, keep the existing checkout.session.completed handling as it is. Change only this, nothing else.
```

Test it: put the webhook signing secret from Stripe's test mode into the secret store. Then, in Stripe test mode, sign in as a test account and complete a checkout with a Stripe test card. That account becomes paid, and Stripe's dashboard shows the message delivered. A second test account that didn't pay stays a member. Test mode only, no real payments.
If something breaks: go back to the previous version in your builder. This reopens the problem. Use it only to get people back in, then ask for help.

L7 · AI spending and actions are limited: not found (the app doesn't call an AI model).
L8 · Sign-in is set up safely: couldn't check from code (see part 4).

## 3. When you have time

### T1 · Notes are accepted without any server-side check on length
How sure: likely
Evidence: supabase/migrations/20261101000000_init.sql, line 28

### T2 · Comments are shown as raw web code, so hidden code could run in other people's browsers
How sure: seen in the code, not confirmed in the live app
Evidence: src/components/Comment.tsx, line 7

### T4 · The profile server function accepts calls from any website
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/functions/get-profile/index.ts, line 4

### T5 · Errors from the profile server function show internal details
How sure: seen in the code, not confirmed in the live app
Evidence: supabase/functions/get-profile/index.ts, line 22

T3 · Security headers are set: couldn't check from code (see part 4).
T6 · Packages are up to date: couldn't check from code (see part 4).
T7 · The AI's instructions contain no secrets: not found (the app doesn't call an AI model).
T8 · Google API keys are restricted: couldn't check from code (see part 4).
T9 · Firebase App Check is set up: not found (the app doesn't use Firebase).
T10 · The project isn't public in the builder: couldn't check from code (see part 4).
T11 · The platform's own scanner is clean: couldn't check from code (see part 4).

Ask me for the fix for any of these, such as 'fix T3'. I'll write out the prompt and won't change anything.

## 4. Couldn't check from code

- **Whether row-level security is really on in your live database (L2).** The database change file shows what was meant to happen, not what's live now. To check, open your Supabase dashboard, go to the Table Editor, and look at the profiles, bookings and notes tables.
- **Sign-in settings (L8).** I found no home-made password or code checking in the project. The limits on sign-in attempts, leaked password protection and email confirmation are dashboard settings. To check, look at the Authentication settings in your Supabase dashboard. Set up your own email sender before switching on email confirmation, so real people can still sign up.
- **Which server functions require sign-in (L5).** The project has no settings file for its server functions, so I couldn't see which ones accept calls from people who aren't signed in. To check, look at the Edge Functions screen in your Supabase dashboard. The payment webhook has to stay open to Stripe; the profile function shouldn't be open.
- **The Admin page and the passport upload screen (L1, L4, L5).** These screens aren't in the project, so I couldn't see whether the Admin page checks who is an admin, or what the upload screen allows. To check, ask your builder to show you both screens' code.
- **Security headers (T3).** These are often set by the company that hosts your site, outside the code. To check, look in your hosting settings for a content security policy, HTTPS-only and a rule against showing your site inside other sites.
- **Package updates (T6).** There are no security audit results in the project. To check, ask your builder to run its package audit and show you the results.
- **Google API keys (T8).** I found no Google keys in the project, but key restrictions can only be seen in the Google Cloud console. To check, look at its "Credentials" page if you use any Google services.
- **Whether the project is public in its builder (T10).** Nothing in the code shows this. To check, look at the project's visibility or sharing settings in your builder.
- **Your platform's own scanners (T11).** I can't run these from the code. See part 7.

Please don't share screenshots of this report. It may describe weak spots in your app.

## 5. What the result means

Found: 8 launch blockers (4 with a fix prompt, 4 needing a second pair of eyes). Do these first:
- L1: the database's master key is inside the website, so anyone can read or change all data.
- L2: the bookings table has no access rules, so anyone can read or change every booking.
- L4: passport scans are in a public folder anyone can download from.

The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure.

## 6. Second pair of eyes

A second pair of eyes is needed when a fix could lock people out, or depends on how your product works, such as shared data, teams, roles or payment logic. See the README for where to get help.

## 7. Run your platform's own scanner too

- **Supabase Security Advisor:** in your Supabase dashboard. It checks the live database, including the access rules for tables and functions.
- **Lovable's security scan, if you use it:** nothing in the project shows which builder made it, so run your builder's own security scan if it has one.

Report complete (7 of 7 parts)
