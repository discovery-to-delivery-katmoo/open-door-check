# Answer keys

One file per test app in `fixtures/`. They live here, away from the test apps, so a test run can be given the app without its answer key.

A run passes when:
- every "Must flag" item appears with the same check ID, a matching file, a line within 3 of one listed, and one of the labels listed
- nothing under "Must not flag" appears as a finding
- every "Must be in couldn't check from code" item appears in part 4 of the report
- the result sentence matches the one listed
- the report ends with "Report complete (7 of 7 parts)"

Across the 3 runs of one app, each finding must keep the same ID, file and label (line within 3).
