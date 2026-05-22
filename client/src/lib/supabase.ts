/**
 * Supabase client — public-safe config (anon key is designed for client-side use).
 * Row Level Security is enabled on all tables.
 * Service role key is NEVER stored here — only in Edge Function secrets.
 */

export const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ??
  "https://scnpwjyjbcmbjzwgivlu.supabase.co";

export const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjbnB3anlqYmNtYmp6d2dpdmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc4NTI1MjIsImV4cCI6MjA5MzQyODUyMn0.iNcpzLoKzwzTac8YNLpW66Z7bqJDijS_TUOL19Y7cmI";

export const BUYERS_EDGE_FN = `${SUPABASE_URL}/functions/v1/buyers-create`;
