/**
 * Revive Home Buyers — OG Image Generator
 * Generates 1200x630 PNG social preview images for all 14 city pages and 5 blog posts.
 * Output: client/public/og/{slug}.png
 *
 * Usage: node scripts/generate-og.mjs
 * Requires: npm install satori @resvg/resvg-js --save-dev
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "client/public/og");

mkdirSync(OUT_DIR, { recursive: true });

// ─── Fetch fonts ──────────────────────────────────────────────────────────────
async function loadFonts() {
  console.log("Fetching fonts (WOFF) from bunny.net CDN...");

  // Outfit Regular 400
  const outfitResp = await fetch(
    "https://fonts.bunny.net/outfit/files/outfit-latin-400-normal.woff"
  );
  const outfitBuf = await outfitResp.arrayBuffer();

  // Outfit SemiBold 600
  const outfitSBResp = await fetch(
    "https://fonts.bunny.net/outfit/files/outfit-latin-600-normal.woff"
  );
  const outfitSBBuf = await outfitSBResp.arrayBuffer();

  // Cormorant Garamond 500 — display font
  const cgResp = await fetch(
    "https://fonts.bunny.net/cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff"
  );
  const cgBuf = await cgResp.arrayBuffer();

  return [
    { name: "Outfit", data: outfitBuf, weight: 400, style: "normal" },
    { name: "Outfit", data: outfitSBBuf, weight: 600, style: "normal" },
    { name: "Cormorant Garamond", data: cgBuf, weight: 500, style: "normal" },
  ];
}

// ─── OG Template ─────────────────────────────────────────────────────────────
function ogTemplate({ title, subtitle, label, state }) {
  return {
    type: "div",
    props: {
      style: {
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#3D4145",
        fontFamily: "Outfit",
        position: "relative",
        overflow: "hidden",
      },
      children: [
        // Green accent bar — left
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 8,
              backgroundColor: "#2D6A3F",
            },
          },
        },
        // Green accent bar — bottom
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              height: 8,
              backgroundColor: "#2D6A3F",
            },
          },
        },

        // Main content area
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 72px 64px 88px",
              height: "100%",
            },
            children: [
              // Top: brand mark
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                  },
                  children: [
                    // House icon (simple SVG rectangle + triangle approximation using divs)
                    {
                      type: "div",
                      props: {
                        style: {
                          width: 36,
                          height: 36,
                          backgroundColor: "#2D6A3F",
                          borderRadius: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        children: [
                          {
                            type: "div",
                            props: {
                              style: {
                                width: 20,
                                height: 20,
                                backgroundColor: "white",
                                borderRadius: 2,
                              },
                            },
                          },
                        ],
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: { display: "flex", flexDirection: "column" },
                        children: [
                          {
                            type: "span",
                            props: {
                              style: {
                                color: "white",
                                fontSize: 16,
                                fontWeight: 600,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                              },
                              children: "REVIVE",
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: {
                                color: "#2D6A3F",
                                fontSize: 10,
                                fontWeight: 600,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                                marginTop: -2,
                              },
                              children: "HOME BUYERS",
                            },
                          },
                        ],
                      },
                    },
                    // State badge
                    ...(state
                      ? [
                          {
                            type: "div",
                            props: {
                              style: {
                                marginLeft: 20,
                                paddingLeft: 16,
                                paddingRight: 16,
                                paddingTop: 4,
                                paddingBottom: 4,
                                border: "1px solid rgba(255,255,255,0.2)",
                                color: "rgba(255,255,255,0.7)",
                                fontSize: 11,
                                fontWeight: 600,
                                letterSpacing: 2,
                                textTransform: "uppercase",
                              },
                              children: state,
                            },
                          },
                        ]
                      : []),
                  ],
                },
              },

              // Middle: title
              {
                type: "div",
                props: {
                  style: { display: "flex", flexDirection: "column", gap: 12, flex: 1, justifyContent: "center" },
                  children: [
                    ...(label
                      ? [
                          {
                            type: "span",
                            props: {
                              style: {
                                color: "#3d8a55",
                                fontSize: 14,
                                fontWeight: 600,
                                letterSpacing: 3,
                                textTransform: "uppercase",
                              },
                              children: label,
                            },
                          },
                        ]
                      : []),
                    {
                      type: "div",
                      props: {
                        style: {
                          color: "white",
                          fontSize: title.length > 45 ? 52 : 62,
                          fontFamily: "Cormorant Garamond",
                          fontWeight: 500,
                          lineHeight: 1.1,
                          letterSpacing: -1,
                          maxWidth: 900,
                        },
                        children: title,
                      },
                    },
                  ],
                },
              },

              // Bottom: tagline + trust signals
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  },
                  children: [
                    {
                      type: "span",
                      props: {
                        style: {
                          color: "rgba(255,255,255,0.55)",
                          fontSize: 15,
                          fontWeight: 400,
                          letterSpacing: 0.5,
                        },
                        children: subtitle || "Fair cash offer in 24 hours · Close in 7 days · No fees",
                      },
                    },
                    {
                      type: "span",
                      props: {
                        style: {
                          color: "rgba(255,255,255,0.35)",
                          fontSize: 13,
                          fontWeight: 400,
                        },
                        children: "(801) 783-2011",
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  };
}

// ─── City data ────────────────────────────────────────────────────────────────
const CITIES = [
  { slug: "salt-lake-city-utah", title: "Sell Your Salt Lake City Home for Cash in 24 Hours", state: "Utah · UT" },
  { slug: "provo-utah", title: "Sell Your Provo Home Fast — Cash Offer, No Repairs", state: "Utah · UT" },
  { slug: "ogden-utah", title: "We Buy Houses in Ogden for Cash — Close in 7 Days", state: "Utah · UT" },
  { slug: "logan-utah", title: "Sell Your Logan Home for Cash — Cache Valley", state: "Utah · UT" },
  { slug: "st-george-utah", title: "Sell Your St. George Home for Cash — No Repairs", state: "Utah · UT" },
  { slug: "idaho-falls-idaho", title: "Sell Your Idaho Falls Home Fast — Cash Offer", state: "Idaho · ID" },
  { slug: "pocatello-idaho", title: "We Buy Houses in Pocatello for Cash", state: "Idaho · ID" },
  { slug: "twin-falls-idaho", title: "Sell Your Twin Falls Home for Cash", state: "Idaho · ID" },
  { slug: "burley-idaho", title: "Sell Your Burley Home for Cash — Cassia County", state: "Idaho · ID" },
  { slug: "rexburg-idaho", title: "We Buy Houses in Rexburg for Cash", state: "Idaho · ID" },
  { slug: "boise-idaho", title: "Sell Your Boise Home for Cash in 24 Hours", state: "Idaho · ID" },
  { slug: "billings-montana", title: "Sell Your Billings Home for Cash — Montana", state: "Montana · MT" },
  { slug: "missoula-montana", title: "Sell Your Missoula Home for Cash — Fast, Fair, Local", state: "Montana · MT" },
  { slug: "great-falls-montana", title: "We Buy Houses in Great Falls for Cash", state: "Montana · MT" },
];

const BLOG_POSTS = [
  { slug: "sell-house-fast-salt-lake-city-without-realtor", title: "How to Sell Your House Fast in Salt Lake City Without a Realtor" },
  { slug: "cash-buyers-vs-traditional-listing-utah", title: "Cash Home Buyers vs. Traditional Listing: Cost Comparison for Utah Sellers" },
  { slug: "7-day-cash-close-idaho", title: "What to Expect from a 7-Day Cash Close in Idaho" },
  { slug: "selling-inherited-property-montana", title: "Selling an Inherited Property in Montana: 4 Options Compared" },
  { slug: "utah-foreclosure-timeline-escape-paths", title: "Foreclosure Timeline in Utah + Your 3 Escape Paths" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const { default: satori } = await import("satori");
  const { Resvg } = await import("@resvg/resvg-js");

  const fonts = await loadFonts();

  let count = 0;

  // City pages
  for (const city of CITIES) {
    const svg = await satori(
      ogTemplate({ title: city.title, subtitle: null, label: "Cash Home Buyers", state: city.state }),
      { width: 1200, height: 630, fonts }
    );
    const resvg = new Resvg(svg);
    const png = resvg.render().asPng();
    const outPath = join(OUT_DIR, `${city.slug}.png`);
    writeFileSync(outPath, png);
    console.log(`✓ ${city.slug}.png`);
    count++;
  }

  // Blog posts
  for (const post of BLOG_POSTS) {
    const svg = await satori(
      ogTemplate({ title: post.title, subtitle: "Seller guide from Revive Home Buyers", label: "Seller Guide", state: null }),
      { width: 1200, height: 630, fonts }
    );
    const resvg = new Resvg(svg);
    const png = resvg.render().asPng();
    const outPath = join(OUT_DIR, `${post.slug}.png`);
    writeFileSync(outPath, png);
    console.log(`✓ ${post.slug}.png`);
    count++;
  }

  console.log(`\n✅ Generated ${count} OG images → client/public/og/`);
}

main().catch((err) => {
  console.error("Error generating OG images:", err);
  process.exit(1);
});
