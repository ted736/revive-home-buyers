-- ────────────────────────────────────────────────────────────────────────────
-- Add UTM + GCLID + landing-page attribution columns to public.buyers
--
-- WHY: Mirror of supabase/migrations/20260617_leads_utm_gclid.sql for the
-- buyer-side QuickCaptureForm. The Google Ads 63-ad-group launch (2026-06-17)
-- drives BOTH seller and buyer traffic; without these columns the buyer
-- pipeline has no way to attribute which campaign / city / keyword produced
-- a given list signup. The client form (QuickCaptureForm.tsx) reads GCLID +
-- UTM from localStorage (90-day TTL, set on first ad-click page load by
-- analytics.ts → captureUtmFromUrl) and POSTs them to the buyers-create
-- Edge Function which then writes to these columns.
--
-- All columns nullable + default NULL — safe rollback is `git revert`; no data
-- migration needed since existing rows keep NULL and new rows populate going
-- forward.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.buyers
  add column if not exists gclid          text,
  add column if not exists utm_source     text,
  add column if not exists utm_medium     text,
  add column if not exists utm_campaign   text,
  add column if not exists utm_content    text,
  add column if not exists utm_term       text,
  add column if not exists landing_page   text,
  add column if not exists referrer       text;

-- Indexes for the two most common attribution queries:
--   (a) "how many buyer signups from utm_campaign X this week?"
--   (b) "did this gclid ever produce a buyer signup?" (for offline-conversion uploads)
create index if not exists buyers_utm_campaign_idx
  on public.buyers (utm_campaign)
  where utm_campaign is not null;

create index if not exists buyers_gclid_idx
  on public.buyers (gclid)
  where gclid is not null;

comment on column public.buyers.gclid          is 'Google Ads click ID, captured from ?gclid= URL param at page load. 90-day TTL on client.';
comment on column public.buyers.utm_source     is 'utm_source from URL at first page load (localStorage, 90-day TTL).';
comment on column public.buyers.utm_medium     is 'utm_medium from URL at first page load.';
comment on column public.buyers.utm_campaign   is 'utm_campaign from URL — maps to Google Ads campaign name.';
comment on column public.buyers.utm_content    is 'utm_content from URL — Google Ads {_creative} ID.';
comment on column public.buyers.utm_term       is 'utm_term from URL — matched keyword for paid search.';
comment on column public.buyers.landing_page   is 'Pathname of the page where the signup form was submitted (e.g. /).';
comment on column public.buyers.referrer       is 'document.referrer at submit (organic source if no UTM).';
