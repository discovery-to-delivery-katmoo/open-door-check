# firebase-gemini

## Must flag
| ID | File | Line | Label |
| --- | --- | --- | --- |
| L1 | src/firebase.ts | 7 (web API key, with Gemini in use at line 18) | likely (rule 8), free fix with a "First confirm" step |
| L7 | src/chat.ts or src/firebase.ts | 5, or 18 to 19 (no limit on AI calls) | seen in the code, not confirmed in the live app, or likely |

Optional: T1 (firestore.rules line 5, no check of what is saved).

## Must not flag
- L2, L3, L4 (the rules are owner-only, with size and type limits on uploads)
- L6

## Must be in "couldn't check from code"
- Sign-in settings (L8)
- T9 (App Check), T10, T11

## Result sentence
"The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure."
