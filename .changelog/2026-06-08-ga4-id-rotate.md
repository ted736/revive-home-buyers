# 2026-06-08 — GA4 Measurement ID rotation

**Change:** Vercel env var `VITE_GA4_ID` updated from `G-W5V214RF7X` (old) to `G-DHMQVTBBBQ` (new, Ted's new GA4 property).

**Why:** Ted set up a new GA4 property `G-DHMQVTBBBQ` and was seeing "No data received from your website yet" because revivebuyers.com was still pushing data to the old `G-W5V214RF7X` ID.

**Effect:** After next deploy, GA4 events flow into the new property. Old property stops receiving from this site.

**Reference:** Telegram brief 2026-06-08 21:35 MDT.

**Run by:** Iris (orchestrator), commit auto-staged.
