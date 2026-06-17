// ────────────────────────────────────────────────────────────────────────────
// leads-create Supabase Edge Function
//
// WHAT: Receives lead-form POST from revivebuyers.com, inserts into
// public.leads, fires Telegram + Slack notifications.
//
// CHANGED 2026-06-17 (Iris): Now accepts + persists gclid + utm_source /
// utm_medium / utm_campaign / utm_content / utm_term + landing_page +
// referrer so the CRM can attribute leads back to specific Google Ads
// campaigns / cities / keywords. Schema migration adding those columns:
// supabase/migrations/20260617_leads_utm_gclid.sql.
//
// DEPLOY: `supabase functions deploy leads-create --no-verify-jwt`
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
      address,
      name,
      phone,
      email,
      situation,
      timeline,
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

    if (!name?.trim()) {
      return new Response(JSON.stringify({ error: "Name required" }), {
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
      .from("leads")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        email: email?.toLowerCase().trim() ?? null,
        address: address?.trim() ?? null,
        situation: situation ?? null,
        timeline: timeline ?? null,
        source: "revivebuyers.com lead form",
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
    if (error) throw error;

    // Telegram to Ted — include campaign/city if known so the alert is actionable
    const attrLine = utm_campaign
      ? `\n📊 ${utm_campaign}${utm_term ? ` · "${utm_term}"` : ""}`
      : "";
    const tgMsg = `🏡 *New Seller Lead — Revive Home Buyers*

*${name}*
📱 ${phone}${email ? `\n📧 ${email}` : ""}${address ? `\n📍 ${address}` : ""}${situation ? `\n🔑 Situation: ${situation}` : ""}${timeline ? `\n⏱ Timeline: ${timeline}` : ""}${attrLine}`;
    await sendTelegram(tgMsg);

    // Slack #Website Leads (seller segment)
    const slackWebhook = Deno.env.get("SLACK_WEBSITE_LEADS_WEBHOOK");
    if (slackWebhook) {
      await fetch(slackWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text:
            `🏡 New seller lead: *${name}* (${phone}${email ? ", " + email : ""})` +
            (address ? `\nProperty: ${address}` : "") +
            (situation ? `\nSituation: ${situation}` : "") +
            (timeline ? ` · Timeline: ${timeline}` : "") +
            (utm_campaign ? `\nCampaign: ${utm_campaign}${utm_term ? ` · ${utm_term}` : ""}` : ""),
        }),
      }).catch(() => {});
    }

    // TODO: POST to REI Reply once REI_REPLY_API_KEY in env
    // Tag: 'revivebuyers-seller'

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("leads-create error:", err);
    return new Response(JSON.stringify({ error: "Server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
