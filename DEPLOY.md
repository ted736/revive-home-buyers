# Revive Home Buyers — Deploy Guide

## Live URL

**https://ted736.github.io/revive-home-buyers/**

Deployed via GitHub Pages from the `gh-pages` branch.

---

## What It Is

A property-address lead capture form for Revive Home Buyers. Features:
- **Address autocomplete** using OpenStreetMap Nominatim — free, no API key required
- **Interactive Leaflet map** that flies to the selected property and pins it
- **Lead form** capturing name, phone, and email
- Revive brand colors: Charcoal (#3D4145) + Forest Green (#2D6A3F)
- Fully responsive; mobile-friendly

---

## Stack

| Layer | Tech |
|-------|------|
| Framework | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Map | Leaflet + React-Leaflet v5 |
| Geocoding | Nominatim (OpenStreetMap) — free, no key |
| Hosting | GitHub Pages (free) |

---

## Local Development

```bash
cd revive-home-buyers
npm install
npm run dev        # starts at http://localhost:5173/revive-home-buyers/
```

---

## Deploy (Manual)

Every deploy is just: build → copy dist to gh-pages branch → push.

```bash
cd revive-home-buyers

# 1. Build
npm run build

# 2. Switch to gh-pages branch and copy built files
git checkout gh-pages
cp -r dist/* .
git add index.html assets/
git commit -m "Deploy: <description>"
git push origin gh-pages

# GitHub Pages rebuilds automatically — live in ~60 seconds
```

---

## Connect to a Real Backend (CRM / GHL)

Currently the form logs to console. To wire to Go High Level / Lead Connector HQ:

1. Get the GHL webhook URL for the "Revive Home Buyers" pipeline
2. In `src/App.jsx`, replace the `handleSubmit` function:

```js
const handleSubmit = async (data) => {
  await fetch('https://your-ghl-webhook-url.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: data.name.split(' ')[0],
      lastName: data.name.split(' ').slice(1).join(' '),
      phone: data.phone,
      email: data.email,
      address: data.address?.label,
      source: 'revivehomebuyers.com',
    }),
  })
  setSubmitted(true)
}
```

3. Rebuild and redeploy (see Deploy steps above).

---

## Add a Custom Domain (revivehomebuyers.com)

1. In repo Settings → Pages → Custom domain: enter `revivehomebuyers.com`
2. At your DNS provider (GoDaddy/Cloudflare), add:
   - `A` records pointing to GitHub Pages IPs: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - Or a `CNAME` from `www` → `ted736.github.io`
3. Check "Enforce HTTPS" once DNS propagates (can take up to 24h)
4. Update `vite.config.js` base from `/revive-home-buyers/` to `/` and redeploy

---

## Monitoring

No analytics wired yet. To add:
- **Simple:** Add Google Analytics or Plausible (`<script>` tag in `index.html`)
- **Leads:** Wire `handleSubmit` to GHL webhook (see above) — leads appear in the pipeline
