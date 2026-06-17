-- ────────────────────────────────────────────────────────────────────────────
-- Add UTM + GCLID + landing-page attribution columns to public.leads
--
-- WHY: Google Ads 63-ad-group launch (2026-06-17) sends utm_source / utm_medium
-- / utm_campaign / utm_content / utm_term and gclid on every ad click via the
-- campaign's tracking_url_template. The client lead form now reads those from
-- localStorage (90-day TTL) and posts them; this migration adds the receiving
-- columns plus landing_page + referrer so the CRM can attribute every lead
-- back to a specific campaign, ad group, city, and keyword.
--
-- All columns nullable + default NULL — safe rollback is `git revert`; no data
-- migration needed since existing rows keep NULL and new rows populate going
-- forward.
-- ────────────────────────────────────────────────────────────────────────────

alter table public.leads
  add column if not exists gclid          text,
  add column if not exists utm_source     text,
  add column if not exists utm_medium     text,
  add column if not exists utm_campaign   text,
  add column if not exists utm_content    text,
  add column if not exists utm_term       text,
  add column if not exists landing_page   text,
  add column if not exists referrer       text;

-- Indexes for the two most common attribution queries:
--   (a) "how many leads from utm_campaign X this week?"
--   (b) "did this gclid ever produce a lead?" (for offline-conversion uploads)
create index if not exists leads_utm_campaign_idx
  on public.leads (utm_campaign)
  where utm_campaign is not null;

create index if not exists leads_gclid_idx
  on public.leads (gclid)
  where gclid is not null;

comment on column public.leads.gclid          is 'Google Ads click ID, captured from ?gclid= URL param at page load. 90-day TTL on client.';
comment on column public.leads.utm_source     is 'utm_source from URL at first page load (localStorage, 90-day TTL).';
comment on column public.leads.utm_medium     is 'utm_medium from URL at first page load.';
comment on column public.leads.utm_campaign   is 'utm_campaign from URL — maps to Google Ads campaign name.';
comment on column public.leads.utm_content    is 'utm_content from URL — Google Ads {_creative} ID.';
comment on column public.leads.utm_term       is 'utm_term from URL — matched keyword for paid search.';
comment on column public.leads.landing_page   is 'Pathname of the page where the form was submitted (e.g. /sell/orem-ut).';
comment on column public.leads.referrer       is 'document.referrer at submit (organic source if no UTM).';
