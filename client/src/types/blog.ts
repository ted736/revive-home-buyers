export type BlogSection = {
  heading: string | null;
  body: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  publishDate: string;    // ISO date string, e.g. "2026-05-01"
  readMinutes: number;
  category: string;
  citySlug?: string;      // Links to a city landing page
  cityName?: string;
  stateAbbr?: string;
  sections: BlogSection[];
};
