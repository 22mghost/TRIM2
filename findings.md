# TrIM — Findings & Research

---

## Formspree Integration

- **Endpoint format:** `https://formspree.io/f/{form_id}`
- **Method:** POST
- **Requirements:** Every input needs a `name` attribute — Formspree uses these as keys
- **Validation:** Use HTML5 `required` and `type="email"` for client-side validation
- **AJAX submission:** Can submit via `fetch()` to avoid page redirect → better UX
- **Free tier:** 50 submissions/month — sufficient for launch
- ⚠️ **Action needed:** User must create a Formspree account and provide the form endpoint ID

## Vercel Deployment

- **Static site:** No `vercel.json` needed for basic deployment
- **CLI command:** `vercel` from project root auto-detects static site
- **Clean URLs:** Enable `"cleanUrls": true` in `vercel.json` if needed
- **Custom domain:** Can be configured post-deployment via Vercel dashboard
- **Local testing:** `vercel dev` emulates production environment

## Google Fonts

- **Cormorant Garamond:** Available in weight 300 (Light) — perfect for editorial headings
- **Jost:** Available in weights 300, 400 — clean geometric sans-serif for body
- **CDN link:** `https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Jost:wght@300;400;500&display=swap`

## Design Patterns (Luxury Editorial)

- **Asymmetric layouts** break monotony and feel high-end
- **Large serif type overlapping imagery** creates editorial drama
- **Generous whitespace** signals premium positioning
- **Diagonal crop lines / angled sections** add visual energy
- **Muted color animations** (opacity, transform) feel sophisticated vs. color flashes
- **Parallax on hero** creates depth without looking gimmicky
- **Masonry grid** better than uniform grid for craft/furniture — shows scale variety

## Performance Targets

- **Lighthouse Performance:** 90+
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s
- **CLS:** < 0.1
- Strategy: lazy-load images, preload critical fonts, minimize CSS
