# firebase-leaky

L5 was added after the first blind runs: all three found it, and it's a real problem I hadn't listed.

## Must flag
| ID | File | Line | Label |
| --- | --- | --- | --- |
| L1 | src/service-account.json or src/adminTools.ts | 5, or 3 | seen in the code, not confirmed in the live app |
| L2 | firestore.rules | 5 | seen in the code, not confirmed in the live app |
| L5 | src/adminTools.ts | 8 to 9 (deleteMember has no caller check) | seen in the code, not confirmed in the live app |
| L4 | src/upload.ts or firebase.json | 6, or 1 to 4 (no storage.rules file) | seen in the code, not confirmed in the live app, or likely |

## Must not flag
- The Firebase web API key in src/firebase.ts as L1 (no Gemini in this app)
- L6, L7

## Must be in "couldn't check from code"
- Whether these rules are the ones deployed (L2)
- Sign-in settings (L8)
- T8 (Google API key restrictions), T9, T10, T11

## Result sentence
"The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure."
