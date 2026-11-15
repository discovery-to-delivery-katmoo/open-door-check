# ai-actions

The first version of this key put the admin token under T7. Three of four blind runs put it under L1, and the checklist's own L1 text (secrets written into any project file) agrees with them, so the key was wrong and now says L1.

The report must say "Partial check": the app uses a database but has no setup files.

## Must flag
| ID | File | Line | Label |
| --- | --- | --- | --- |
| L7 | server/assistant.js | 46 to 52 (AI's answer deletes contacts and sends email with no check) | seen in the code, not confirmed in the live app |
| T2 | src/AssistantReply.jsx | 2 (AI answer shown as raw HTML) | seen in the code, not confirmed in the live app |
| L1 | server/assistant.js | 10 (admin token typed into the AI's instructions in a project file) | seen in the code, not confirmed in the live app |

L7 must be "second pair of eyes" (AI that takes actions). A second L7 finding for no spending limit (server/index.js line 8 or server/assistant.js line 35) is correct too.
The email body at server/assistant.js line 51 (AI text sent as HTML) may be reported under T2 as part of the same finding or its own; either is fine.

## Must not flag
- L1 for the OpenAI key (it comes from an environment variable on the server)
- T7 as a separate finding for the admin token (rule 4: it's reported once, under L1)
- L8 as a finding (checking a session token isn't sign-in; since 0.1.1 L8 says so)
- T6 as "likely" from memory (since 0.1.1 T6 says not to)
- L3 (the delete is limited to the person's own contacts)
- T5 (the error message is generic)

## Must be in "couldn't check from code"
- Sign-in settings (L8), or a note that sign-in is custom
- T10, T11

## Result sentence
"The other checks found nothing in what could be checked. This isn't a guarantee that your app is secure."
