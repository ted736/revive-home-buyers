// ────────────────────────────────────────────────────────────────────────────
// buyers-create Supabase Edge Function
//
// WHAT: Receives buyer-list signup POST from revivebuyers.com QuickCaptureForm
// (and any other buyer-facing form), inserts into public.buyers, fires
// Telegram + Slack notifications.
//
// CHANGED 2026-06-17 (Iris): Now accepts + persists gclid + utm_source /
// utm_medium / utm_campaign / utm_content / utm_term + landing_page +
// referrer so the CRM can attribute buyer signups back to specific Google
// Ads campaigns / cities / keywords. Schema migration adding those columns:
// supabase/migrations/20260617_buyers_utm_gclid.sql.
//
// DEPLOY: `supabase functions deploy buyers-create --no-verify-jwt`
// (run the migration FIRST or the insert will 400 on unknown columns).
// ────────────────────────────────────────────────────────────────────────────

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID") ?? "7872962153";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") ?? "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

async function sendTelegram(message: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: "Markdown",
    }),
  }).catch(() => {});
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  try {
    const body = await req.json();
    const {
      first_name,
      last_name,
      email,
      phone,
      tier,
      source,
      // ── attribution fields (added 2026-06-17) ──
      gclid,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_content,
      utm_term,
      landing_page,
      referrer,
    } = body;

    if (!first_name?.trim()) {
      return new Response(JSON.stringify({ error: "First name required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!email?.trim()) {
      return new Response(JSON.stringify({ error: "Email required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!phone?.trim()) {
      return new Response(JSON.stringify({ error: "Phone required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from("buyers")
      .insert({
        first_name: first_name.trim(),
        last_name: last_name?.trim() ?? null,
        email: email.toLowerCase().trim(),
        phone: phone.trim(),
        tier: tier ?? "interested",
        source: source ?? "revivebuyers.com",
        // ── attribution (NULL when organic / direct) ──
        gclid: gclid?.toString().trim() || null,
        utm_source: utm_source?.toString().trim() || null,
        utm_medium: utm_medium?.toString().trim() || null,
        utm_campaign: utm_campaign?.toString().trim() || null,
        utm_content: utm_content?.toString().trim() || null,
        utm_term: utm_term?.toString().trim() || null,
        landing_page: landing_page?.toString().trim() || null,
        referrer: referrer?.toString().trim() || null,
      })
      .select("id")
      .single();
    if (error) {
      // Duplicate email is expected — surface as 200 + duplicate=true so the
      // client treats it as success (don't punish a buyer for re-submitting).
      if (error.code === "23505") {
        return new Response(
          JSON.stringify({ success: true, duplicate: true }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      throw error;
    }

    // Telegram to Ted — include campaign/city if known so the alert is actionable
    const attrLine = utm_campaign
      ? `\n📊 ${utm_campaign}${utm_term ? ` · "${utm_term}"` : ""}`
      : "";
    const tgMsg = `💰 *New Buyer Signup — Revive Buyers*

*${first_name}${last_name ? " " + last_name : ""}*
📧 ${email}
📱 ${phone}
🏷 Tier: ${tier ?? "interested"}${source ? `\n📍 Source: ${source}` : ""}${attrLine}`;
    await sendTelegram(tgMsg);

    // Slack #Website Leads (buyer segment)
    const slackWebhook = Deno.env.get("SLACK_WEBSITE_LEADS_WEBHOOK");
    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text:
            `💰 New buyer signup: *${first_name}${last_name ? " " + last_name : ""}* (${email}, ${phone})` +
            `\nTier: ${tier ?? "interested"}${source ? ` · Source: ${source}` : ""}` +
            (utm_campaign ? `\nCampaign: ${utm_campaign}${utm_term ? ` · ${utm_term}` : ""}` : ""),
        }),
      }).catch(() => {});
    }

    // TODO: POST to REI Reply once REI_REPLY_API_KEY in env
    // Tag: 'revivebuyers-buyer'

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("buyers-create error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
