-- Seed data for projects table
-- Run after 20260522_projects_gallery.sql

-- Storage base URL
-- All photo URLs: https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/{path}

INSERT INTO public.projects (
  slug, status, property_type, city, state, year_completed,
  scope_summary, scope_tags, before_photo_urls, after_photo_urls, during_photo_urls,
  arv, rehab_cost_range, final_outcome, display_order, display_mode, project_type,
  story_situation, story_action, story_outcome, community_impact, was_code_violation,
  days_to_sell, offer_count, visible
) VALUES

-- 1. Bigfork MT
(
  'bigfork-mt-highway-83', 'sold', 'single-family', 'Bigfork', 'MT', 2025,
  'Full gut-rehab of a dated single-family home on MT-83 — new kitchen, bathrooms, flooring, exterior repaint, and landscaping.',
  ARRAY['kitchen','bathrooms','flooring','exterior','landscaping','paint'],
  ARRAY[]::text[],
  ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-01.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-02.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-03.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-04.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-05.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-06.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-07.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/bigfork-mt/after-08.jpg'
  ],
  ARRAY[]::text[],
  485000, '$80K–$110K', 'Sold to local family', 1, 'after_only', 'ahr_fix_flip',
  'A family in Bigfork needed to move quickly — the home had sat vacant for over a year and deferred maintenance had piled up.',
  'We acquired the property and completed a full gut-rehab over the off-season: new kitchen cabinets and countertops, refinished hardwood floors throughout, both bathrooms retiled, full exterior repaint, and fresh landscaping to restore curb appeal.',
  'Listed at $485K and sold to a local Flathead Valley family in under 30 days. The sellers relocated without the burden of managing a distressed property.',
  'One of the more visibly neglected homes on the street — now a turnkey asset that raised comps for three neighboring properties.',
  false, 28, null, true
),

-- 2. Shelby MT
(
  'shelby-mt-2nd-st', 'sold', 'single-family', 'Shelby', 'MT', 2024,
  'End-of-life estate sale in Shelby — full interior refresh, structural repairs, and exterior restoration bringing a long-neglected home back to retail condition.',
  ARRAY['structural','interior refresh','exterior','roof','paint'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  185000, '$45K–$60K', 'Sold to investor in 11 days, 3 offers', 2, 'after_only', 'ahr_fix_flip',
  'A family in Shelby was dealing with end-of-life circumstances and needed to quickly and compassionately sell a home that had been in the family for decades. Years of deferred maintenance had left it in rough condition.',
  'We acquired the property and brought it back to life — structural repairs, full interior refresh, new roof sections, and a complete exterior repaint.',
  'Listed at $185K and sold to an investor in 11 days with 3 competing offers.',
  'This home had been a code-violation eyesore on the block for 3 years. It now contributes $185K to the local property tax base.',
  true, 11, 3, true
),

-- 3. Columbia Falls MT
(
  'columbia-falls-mt-10th-ave', 'sold', 'single-family', 'Columbia Falls', 'MT', 2024,
  'Cosmetic renovation of a Columbia Falls single-family — fresh finishes, updated kitchen, and landscaping on a property with strong bones.',
  ARRAY['kitchen','paint','flooring','landscaping'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  320000, '$35K–$50K', 'Sold to local buyer', 3, 'after_only', 'ahr_fix_flip',
  'A motivated seller in Columbia Falls needed a fast, hassle-free close — the property needed cosmetic work that was beyond what they could manage.',
  'We focused on the finishes that matter most to buyers: updated kitchen, new flooring throughout, fresh paint inside and out, and clean landscaping.',
  'Sold to a local buyer who was thrilled with the turnkey condition.',
  'Transformed from a dated, unkempt property into a neighborhood showpiece that raised the bar on the block.',
  false, null, null, true
),

-- 4. Rexburg ID (before/after)
(
  'rexburg-id-6300-s', 'sold', 'single-family', 'Rexburg', 'ID', 2024,
  'Full rehab of a Rexburg single-family — complete kitchen remodel, new baths, HVAC replacement, flooring, and exterior siding.',
  ARRAY['kitchen','bathrooms','HVAC','flooring','siding','windows'],
  ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/before-01.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/before-02.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/before-03.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/before-04.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/before-05.jpg'
  ],
  ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/after-01.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/after-02.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/after-03.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/after-04.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/rexburg-id/after-05.jpg'
  ],
  ARRAY[]::text[],
  295000, '$70K–$90K', 'Sold above asking', 4, 'before_after', 'ahr_fix_flip',
  'A Rexburg homeowner facing financial hardship needed a fast exit from a home that required significant work.',
  'Full kitchen remodel with new cabinets and quartz countertops, two bathroom renovations, HVAC replacement, LVP flooring throughout, new exterior siding and windows.',
  'Listed at $289K and sold above asking — one of the fastest-moving properties in that Rexburg zip code that quarter.',
  'An aging, underperforming property converted into a quality family home.',
  false, 19, 4, true
),

-- 5. Twin Falls ID — Baker St
(
  'twin-falls-id-baker-st', 'sold', 'single-family', 'Twin Falls', 'ID', 2024,
  'Twin Falls cosmetic-to-mid renovation — kitchen update, refinished floors, new roof, and curb-appeal landscaping.',
  ARRAY['kitchen','flooring','roof','landscaping','paint'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  245000, '$40K–$55K', 'Sold to first-time buyer', 5, 'after_only', 'ahr_fix_flip',
  'A Twin Falls owner going through a divorce needed a quick, fair cash sale to move forward.',
  'We closed in 10 days on the as-is purchase, then completed targeted renovations: kitchen refresh, refinished hardwood floors, new roof, and landscaping.',
  'Sold to a first-time buyer who got a turnkey home they could not have otherwise afforded.',
  'A neglected older home became a point of pride on Baker Street.',
  false, 34, 2, true
),

-- 6. Twin Falls ID — Monroe St
(
  'twin-falls-id-monroe-st', 'sold', 'single-family', 'Twin Falls', 'ID', 2025,
  'Gut-rehab of a distressed Twin Falls property — structural remediation, full interior replacement, new mechanical systems.',
  ARRAY['structural','kitchen','bathrooms','HVAC','electrical','flooring'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  278000, '$85K–$105K', 'Sold to investor', 6, 'after_only', 'ahr_fix_flip',
  'A foreclosure property on Monroe St that had been vacant for 2+ years — significant structural and deferred maintenance issues.',
  'Deep gut-rehab: structural remediation, full interior replacement, new HVAC and electrical panel, complete kitchen and bath overhauls.',
  'Sold to a local investor who added it to their rental portfolio.',
  'Removed a blighted vacant property — resolved 2 active code violations and restored neighborhood value.',
  true, 22, null, true
),

-- 7. Whitefish MT
(
  'whitefish-mt-moose-trail', 'sold', 'single-family', 'Whitefish', 'MT', 2024,
  'Whitefish showcase renovation — premium finishes, full kitchen and bath redesign, refinished wood floors, updated exterior in the sought-after Moose Trail neighborhood.',
  ARRAY['kitchen','bathrooms','flooring','exterior','landscaping','premium finishes'],
  ARRAY[]::text[],
  ARRAY[
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-01.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-02.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-03.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-04.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-05.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-06.jpg',
    'https://scnpwjyjbcmbjzwgivlu.supabase.co/storage/v1/object/public/project-photos/whitefish-mt/after-07.jpg'
  ],
  ARRAY[]::text[],
  720000, '$120K–$160K', 'Sold in 14 days · 6 offers', 7, 'after_only', 'ahr_fix_flip',
  'A Whitefish homeowner relocating out of state needed a certain, fast sale — the home had tremendous bones but needed updated finishes to compete in the premium Whitefish market.',
  'Full kitchen redesign with quartz and custom cabinetry, two bathroom overhauls, refinished hardwood throughout, new exterior decking, and professional landscaping.',
  'Listed at $715K and sold in 14 days with 6 competing offers.',
  'Preserved and elevated one of the more character-rich homes on Moose Trail.',
  false, 14, 6, true
),

-- 8. SLC UT — Wholesale
(
  'salt-lake-city-ut-wholesale', 'sold', 'single-family', 'Salt Lake City', 'UT', 2024,
  'AHR sourced and assigned this distressed SLC property to an investor partner who completed a full gut-rehab and listed it at market.',
  ARRAY['wholesale','full rehab','kitchen','bathrooms','flooring'],
  ARRAY[]::text[], ARRAY[]::text[], ARRAY[]::text[],
  525000, null, 'Assigned to investor · sold $520K', 8, 'after_only', 'ahr_wholesale_to_investor',
  'A distressed seller in Sugar House, SLC needed to close in 7 days — behind on payments, property in poor condition.',
  'AHR sourced the deal and assigned it to RWH Capital at $435K. RWH completed a full gut-rehab: new kitchen, two full baths, LVP flooring, fresh paint, landscaping.',
  'RWH listed at $520K and sold in 18 days. The original seller closed in under a week and avoided foreclosure.',
  'A distressed Sugar House property transformed into a quality family home.',
  false, 18, null, true
);
