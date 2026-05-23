-- Remodels Gallery — Phase 1
-- Run in Supabase dashboard: SQL Editor → New query → paste → Run

-- ─── projects table ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Marketing-facing (public-readable)
  slug text UNIQUE NOT NULL,
  status text CHECK (status IN ('sold', 'rented', 'holding', 'wip')) NOT NULL DEFAULT 'sold',
  property_type text CHECK (property_type IN ('single-family', 'multi-family', 'condo', 'commercial', 'land')) NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  year_completed int,
  scope_summary text,
  scope_tags text[] DEFAULT '{}',
  before_photo_urls text[] DEFAULT '{}',
  after_photo_urls text[] DEFAULT '{}',
  during_photo_urls text[] DEFAULT '{}',
  arv int,                     -- after-repair value in dollars (NOT cents)
  rehab_cost_range text,       -- e.g. '$80K–$110K' (public: ranges only)
  final_outcome text,
  display_order int DEFAULT 99,
  visible boolean DEFAULT true,
  display_mode text CHECK (display_mode IN ('before_after', 'after_only', 'gallery')) DEFAULT 'before_after',
  project_type text CHECK (project_type IN ('ahr_fix_flip', 'ahr_wholesale_to_investor')) NOT NULL,

  -- Story / narrative
  story_situation text,
  story_action text,
  story_outcome text,
  community_impact text,
  was_code_violation boolean DEFAULT false,

  -- Sale velocity
  days_to_sell int,
  offer_count int,

  -- GC attribution (many-to-many in project_gcs, but store lead GC name for quick display)
  lead_gc_name text,

  -- Wholesale fields (only set when project_type = 'ahr_wholesale_to_investor')
  wholesale_buyer_id uuid REFERENCES public.buyers(id),
  wholesale_buyer_consent boolean DEFAULT false,
  investor_provided_photos boolean DEFAULT false,

  -- INTERNAL (auth-gated — not exposed in public view)
  design_decisions jsonb,
  vendor_list jsonb,
  cost_breakdown jsonb,
  timeline_days int,
  lessons_learned text,
  internal_only boolean DEFAULT false,

  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- ─── GCs table ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.gcs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  website text,
  phone text,
  email text,
  bio text,
  photo_url text,
  service_area_cities text[] DEFAULT '{}',
  specialties text[] DEFAULT '{}',
  ahr_endorsed boolean DEFAULT false,
  endorsement_date date,
  active boolean DEFAULT true,
  internal_notes text,
  created_at timestamptz DEFAULT now()
);

-- ─── Project ↔ GC join table ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.project_gcs (
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  gc_id uuid REFERENCES public.gcs(id) ON DELETE RESTRICT,
  scope_on_project text,
  PRIMARY KEY (project_id, gc_id)
);

-- ─── Public view (marketing columns only — no internal data leaks) ────────────
CREATE OR REPLACE VIEW public.projects_public AS
SELECT
  id,
  slug,
  status,
  property_type,
  city,
  state,
  year_completed,
  scope_summary,
  scope_tags,
  before_photo_urls,
  after_photo_urls,
  during_photo_urls,
  arv,
  rehab_cost_range,
  final_outcome,
  display_order,
  display_mode,
  project_type,
  story_situation,
  story_action,
  story_outcome,
  community_impact,
  was_code_violation,
  days_to_sell,
  offer_count,
  lead_gc_name,
  created_at
FROM public.projects
WHERE visible = true
  AND internal_only = false
ORDER BY display_order ASC, created_at DESC;

-- ─── RLS ─────────────────────────────────────────────────────────────────────
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gcs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_gcs ENABLE ROW LEVEL SECURITY;

-- Public: read-only on visible, non-internal projects (marketing columns via view)
CREATE POLICY "projects_public_read" ON public.projects
  FOR SELECT USING (visible = true AND internal_only = false);

-- Public: read endorsed GCs only
CREATE POLICY "gcs_public_read" ON public.gcs
  FOR SELECT USING (ahr_endorsed = true AND active = true);

-- Public: read project_gcs only for visible projects
CREATE POLICY "project_gcs_public_read" ON public.project_gcs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.projects p
      WHERE p.id = project_id AND p.visible = true AND p.internal_only = false
    )
  );

-- ─── Supabase Storage bucket ──────────────────────────────────────────────────
-- Create manually in Supabase Dashboard → Storage → New bucket:
--   Name: project-photos
--   Public: YES (photos are public marketing content)
--   File size limit: 10MB
--   Allowed MIME types: image/jpeg, image/png, image/webp

-- ─── Updated_at trigger ───────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
