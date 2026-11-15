# Test apps

Six small apps with open doors put in on purpose, used to test Open Door Check. They don't run; they only need enough code for each check to find (or not find) something.

| App | What it tests |
| --- | --- |
| supabase-leaky | Supabase: secret key in the browser, a table with no protection, rules open to everyone, users changing their own role, a public bucket of passport scans, an unchecked database function, a fake-able Stripe webhook, raw HTML, open CORS, error details |
| firebase-leaky | Firebase: test-mode rules, no storage rules, an Admin SDK key in the browser |
| firebase-gemini | A Firebase web API key with Gemini in use (must be a launch blocker), and no AI limits |
| firebase-key-only | A Firebase web API key with no Gemini (must not be a launch blocker) |
| clean-app | A Supabase app with everything done right, including a checked Stripe webhook. Must find no launch blockers |
| ai-actions | AI that deletes and emails without a check, a token in the AI's instructions, AI answers shown as raw HTML |

The answer keys are in `tests/answer-keys/`, kept apart so a test run can be given an app without its answers.

## Every secret here is fake

None of these values work anywhere. Each one contains FAKE or EXAMPLE so it's obvious, while still looking like the real thing to the check.

| App | File | Value |
| --- | --- | --- |
| supabase-leaky | src/lib/supabase.ts | `sb_publishable_FAKE_EXAMPLE_not_a_real_key_9c1d` |
| supabase-leaky | src/lib/adminClient.ts | `sb_secret_FAKE_EXAMPLE_not_a_real_key_4f2a` |
| firebase-leaky | src/firebase.ts | `AIzaSyFAKE_EXAMPLE_not_real_01` |
| firebase-leaky | src/service-account.json | private key `FAKE-EXAMPLE-NOT-A-REAL-KEY`, key id `FAKEEXAMPLE...` |
| firebase-gemini | src/firebase.ts | `AIzaSyFAKE_EXAMPLE_not_real_02` |
| firebase-key-only | src/firebase.ts | `AIzaSyFAKE_EXAMPLE_not_real_03` |
| ai-actions | server/assistant.js | `admintoken_FAKE_EXAMPLE_not_real_7b3e` |

Project ids, URLs and email addresses are made up too (`abcdefghijklmnop.supabase.co`, `*-demo`, `example.com`).
