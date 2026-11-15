# supabase-leaky

## Must flag
| ID | File | Line | Label |
| --- | --- | --- | --- |
| L1 | src/lib/adminClient.ts | 6 | seen in the code, not confirmed in the live app |
| L2 | supabase/migrations/20261101000000_init.sql | 16 (bookings table, no row-level security) | seen in the code, not confirmed in the live app |
| L3 | supabase/migrations/20261101000000_init.sql | 33 (notes readable by everyone) | seen in the code, not confirmed in the live app |
| L3 | supabase/migrations/20261101000000_init.sql | 12 or 5 (users can update their own role) | seen in the code, not confirmed in the live app |
| L4 | supabase/migrations/20261101000000_init.sql | 40 (public bucket for passport scans) | seen in the code, not confirmed in the live app |
| L4 | supabase/migrations/20261101000000_init.sql | 39 to 40 (no file type or size limit) | likely |
| L5 | supabase/migrations/20261101000000_init.sql | 43 to 46 (security definer, no caller check) | seen in the code, not confirmed in the live app |
| L6 | supabase/functions/stripe-webhook/index.ts | 9 (no signature check) | seen in the code, not confirmed in the live app |
| T2 | src/components/Comment.tsx | 7 | seen in the code, not confirmed in the live app |
| T4 | supabase/functions/get-profile/index.ts | 4 | seen in the code, not confirmed in the live app |
| T5 | supabase/functions/get-profile/index.ts | 22 | seen in the code, not confirmed in the live app |

Fix or second pair of eyes, as Part D says: L3 (role column) and L5 get "second pair of eyes". L1, L2, L3 (notes), L4 and L6 get a free fix. Since 0.1.1 the tie-breaker rule says: if the code can't show whether data is per-person or shared, second pair of eyes. Bookings (an Admin page reads them all) and passport scans (staff may need them) can go either way; check the run is the same across its 3 repeats.

Optional: T1 (no length or format limits, line 4, 20 or 28, likely).

## Must not flag
- The publishable key in src/lib/supabase.ts (it's meant to be in the browser)
- L7 (no AI in this app)

## Must be in "couldn't check from code"
- Whether row-level security is on in the live project (L2)
- Sign-in settings (L8)
- T8, T10, T11

## Result sentence
"The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure."
