# Test run summary

Each run was done by a separate AI helper that got only the checklist and the test app, in a folder with a neutral name. None of them saw the answer keys. I (the AI that wrote the checklist and the keys) compared their reports with the keys afterwards.

## Round 1: checklist 0.1.0, 18 runs (15 Nov 2026)

| App | Run 1 | Run 2 | Run 3 | Same answer 3 times? |
| --- | --- | --- | --- | --- |
| supabase-leaky | Pass | Pass | Pass | Yes for every launch blocker. Fix or second pair of eyes differed for L2 and L4 |
| firebase-leaky | Pass* | Pass* | Pass* | Yes |
| firebase-gemini | Pass | Pass | Pass | **No.** L1 was "likely" twice and "seen in the code" once; L7 and T3 labels also changed |
| firebase-key-only | Pass | Pass | Pass | Yes for launch blockers. T3 label changed |
| clean-app | Pass | Pass | Pass | Yes: no launch blockers, right result sentence every time |
| ai-actions | Pass* | Pass* | Mixed | **No.** The admin token was L1 in 3 of 4 reports and T7 in 1. "Partial check" came and went. One run flagged L8 for a session token check |

\* After correcting the answer key, see below.

**What the runs got right:** every launch blocker put in on purpose was found in every run (18 of 18). No launch blocker was reported on the two apps with none. The Firebase web key was never called a leak when Gemini wasn't in use. Every report had all 7 parts, masked every secret, and used the right result sentence.

**Where my answer keys were wrong:**
- firebase-leaky: all three runs found a real L5 (the "delete member" action has no check of who is asking) that I hadn't listed. Added to the key.
- supabase-leaky: all three runs also flagged missing file size and type limits on the passport bucket (L4, "likely"). Real; added.
- ai-actions: I'd put the admin token under T7. The checklist's own L1 text (secrets in any project file) and rule 4 (first matching check) both point to L1. Key corrected.

**Changes made to the checklist (0.1.1):** see CHANGELOG.md. Each one targets a difference seen above.

## Round 2: checklist 0.1.1, 9 runs (15 Nov 2026)

Re-ran the three apps that had differences.

| App | Run 1 | Run 2 | Run 3 | Same answer 3 times? |
| --- | --- | --- | --- | --- |
| supabase-leaky | Pass | Pass | Pass | Yes, including fix or second pair of eyes for L2 and L4 (public bucket) |
| firebase-gemini | Pass | Pass | Pass | Yes: L1 "likely" with a confirm-first fix, L7 "likely", T3 "couldn't check from code" every time |
| ai-actions | Pass | Pass | Pass | Yes: token under L1, "Partial check", L8 "couldn't check from code" every time |

**Still differing (small, all in the "when you have time" part or in fix wording):**
- T1 (input checked on the server) on supabase-leaky: "likely" once, "not found" twice. It's a judgment call on whether a missing length limit counts.
- L4 upload limits on supabase-leaky: free fix twice, second pair of eyes once.
- T2 on firebase-gemini and T8 on ai-actions: "couldn't check from code" once, "not found" twice.
- Fix prompts differ in wording and numbers (10 MB or 5 MB, 10 or 20 messages). Expected: the fix template fixes the shape, not the exact values.

## Where I may have been helped

- I wrote both the test apps and the checklist, so the apps fit the checks closely. Real apps will be messier. The next tests are real apps with their own private answer keys, and then people outside.
- I judged pass or fail myself, with the answer keys in front of me, and I changed three keys after seeing the runs. Each change is written down above with its reason; all three were problems the runs found that I had missed or misfiled, not lowered bars.
- All helpers were the same AI model. Other models (in Lovable, Bolt, Cursor) may behave differently and haven't been tested.
- One helper (ai-actions, round 1, run 3) returned two different reports. Both are counted above.


## Round 3: real apps

The checklist was also tested on two real apps, run once in Lovable Chat mode and once by a blind helper. Those results stay private with each app, because they describe its weak spots. What they changed in the checklist is in CHANGELOG.md (0.1.2 and 0.1.3).
