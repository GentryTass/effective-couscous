# Fit Before Buy

A working replacement-filter checker that answers one question: does the reviewed manufacturer record identify this genuine filter SKU for this exact appliance model?

## Run

Serve `dist/` with any static HTTP server. No dependencies, API keys, accounts or build step are needed. Run `node tests/verify.mjs` and `node tests/flows.mjs` from this directory to check decisions and application flow contracts.

## Product choice

Replacement filters are a narrow, testable niche where a tiny model suffix can change the recommendation. The current evidence covers genuine Winix America Filter A 115115 and Filter H 116130: 12 exact model relationships, two product pages and three corroborating manuals. Broader demand remains a hypothesis.

## Rules

Preserve suffixes and region. Every affirmative result includes a source locator. Missing models remain unknown. Multiple positive SKUs request review; only explicit positive/negative disagreement is a conflict. Dates must be real calendar dates, not future dates, and within the 30-day review window. A documentary match is not physical testing or a certification claim.

## Current verification

30 decision checks passed. Ten application flow contracts passed with a simulated DOM, including failed evidence loading, clipboard denial and JSON exports. No visual, keyboard, mobile or real-browser download testing has been completed. Filter A was re-read on October 7, 2026. Filter H refresh returned HTTP 429; its previously reviewed snapshot was retained with the failed attempt recorded visibly and in exports. Three manual records remain from the previous reviewed snapshot; they were not re-read during this update.

## What AI does here

AI proposes the niche, reviews public evidence, drafts the data and code, checks its work and records corrections. Exact matching runs deterministically. Another AI's answer is never accepted as manufacturer evidence. The product does not claim measured returns, conversion, revenue or customer demand.

## Next decision

Before adding more models, observe five people completing exact-match, extra-suffix, wrong-SKU and unknown-region tasks. Record correctness, completion time and misunderstood wording. Those are planned usability measurements, not current results. Measure commercial outcomes only after a seller supplies actual exposure, order, support and return denominators, with return lag accounted for.
