# firebase-key-only

## Must flag
Nothing as a launch blocker.

## Must not flag
- The Firebase web API key in src/firebase.ts as L1 (rule 8: no Gemini in this app)
- L2, L3, L4 (owner-only rules)
- L6, L7

## Must be in "couldn't check from code"
- T8 (Google API key restrictions)
- Sign-in settings (L8)
- T9, T10, T11

## Result sentence
"Nothing was found in what could be checked. This isn't a guarantee that your app is secure."
(If a run flags a T check, the other sentence is right for that run, but the T finding itself must be checked against the code.)
