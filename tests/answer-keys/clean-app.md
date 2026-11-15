# clean-app

## Must flag
Nothing as a launch blocker.

## Must not flag
- L1 (keys come from environment variables; only the publishable key is in the frontend)
- L2, L3 (row-level security on every table, owner-only rules, roles in a separate table users can't change)
- L4 (private bucket, owner-only folders, size and type limits)
- L6 (Stripe signature checked with constructEventAsync at supabase/functions/stripe-webhook/index.ts line 17)
- T2 (no raw HTML), T3 (headers set in vercel.json, CSP in report-only mode), T4 (listed addresses only), T5 (generic error)

## Must be in "couldn't check from code"
- Whether row-level security is on in the live project (L2)
- Sign-in settings (L8)
- T10, T11

## Result sentence
"Nothing was found in what could be checked. This isn't a guarantee that your app is secure."
