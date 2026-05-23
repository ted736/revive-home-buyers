-- Gallery Phase 1.5 — Whitefish before_after upgrade + new project inserts
-- Applied 2026-05-23 via REST API; this file keeps migrations in sync

-- 1. Upgrade Whitefish MT to before_after with 5 before photos (Zillow screenshots)
UPDATE public.projects
SET
  display_mode = 'before_after',
  before_photo_urls = ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/before-01.png',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/before-02.png',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/before-03.png',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/before-04.png',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/before-05.png'
  ]
WHERE slug = 'whitefish-mt-moose-trail';

-- 2. Insert new projects (all start visible=false; set true after photos are finalized)

INSERT INTO public.projects (
  slug, status, property_type, city, state, year_completed,
  scope_summary, scope_tags, before_photo_urls, after_photo_urls, during_photo_urls,
  arv, rehab_cost_range, final_outcome, display_order, display_mode, project_type,
  story_situation, story_action, story_outcome, community_impact, was_code_violation,
  days_to_sell, offer_count, visible
) VALUES

-- 9. Pueblo CO — full before/after (before photos pending import)
(
  'pueblo-co-bragdon-ave', 'sold', 'single-family', 'Pueblo', 'CO', 2024,
  'Full gut-rehab of a distressed Pueblo home — complete interior renovation, new kitchen and baths, flooring, and exterior improvements.',
  ARRAY['kitchen','bathrooms','flooring','exterior','paint','structural'],
  ARRAY[]::text[],
  ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-01.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-02.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-03.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-04.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-05.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-06.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-07.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/pueblo-co/after-08.jpg'
  ],
  ARRAY[]::text[],
  null, null, null, 9, 'before_after', 'ahr_fix_flip',
  'A distressed Pueblo property with significant deferred maintenance — the sellers needed a fast, cash close with no repairs.',
  'We acquired the property and completed a full interior and exterior renovation: new kitchen, updated bathrooms, fresh flooring throughout, and exterior improvements that transformed the curb appeal.',
  'Sold at a price that rewarded the full scope of the rehab and delivered a turnkey home to the next buyer.',
  'A neglected Pueblo home brought back to life as a fully renovated, move-in-ready property.',
  false, null, null, false
),

-- 10. Belgrade MT — after_only (photos pending import)
(
  'belgrade-mt-cross-town-ct', 'sold', 'single-family', 'Belgrade', 'MT', 2024,
  'Full renovation of a Belgrade MT single-family — complete interior and exterior rehab in one of Montana''s fastest-growing communities near Bozeman.',
  ARRAY['kitchen','bathrooms','flooring','exterior','paint'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  null, null, null, 10, 'after_only', 'ahr_fix_flip',
  'A distressed property in fast-growing Belgrade MT — just minutes from Bozeman — that needed a complete renovation to reach retail value.',
  'We acquired the property off-market and completed a full renovation: new kitchen and bath finishes, updated flooring, fresh exterior paint, and landscaping that restored curb appeal in a neighborhood with strong buyer demand.',
  'Sold to a buyer entering the Gallatin Valley market at a price that reflected a fully finished, move-in-ready home.',
  'A Belgrade property transformed from distressed to desirable in one of Montana''s highest-demand markets.',
  false, null, null, false
),

-- 11. Kalispell MT — Genesis Construction mid-rehab story (photos pending import)
(
  'kalispell-mt-10th-ave-w', 'sold', 'single-family', 'Kalispell', 'MT', 2025,
  'Major renovation in Kalispell — full structural and cosmetic rehab of a distressed single-family near downtown, with Genesis Construction as the lead GC.',
  ARRAY['structural','kitchen','bathrooms','flooring','exterior','windows','HVAC'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  null, null, null, 11, 'before_after', 'ahr_fix_flip',
  'A severely distressed Kalispell property that required full structural and cosmetic remediation — the kind of deal most investors walk away from.',
  'We partnered with Genesis Construction on a comprehensive rehab: structural repairs, full kitchen and bath gut, new windows, HVAC replacement, flooring throughout, and complete exterior restoration.',
  'Transformation documented from distressed shell to fully finished home.',
  'Bringing one of Kalispell''s more distressed properties back to full retail condition in a market with strong buyer demand.',
  false, null, null, false
);
