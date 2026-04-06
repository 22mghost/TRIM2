# TrIM — Project Constitution (gemini.md)

> **This file is LAW.** All schemas, rules, and architecture defined here govern the entire project.
> Only update when: a schema changes, a rule is added, or architecture is modified.

---

## 1. Project Identity

| Key | Value |
|-----|-------|
| **Brand** | TrIM — Nigerian Craft Furniture |
| **Type** | Single-page portfolio + enquiry converter |
| **North Star** | Visitor lands → understands brand → submits enquiry form |
| **Tone** | Luxury editorial · warm · tactile · craft-led |
| **Anti-Tone** | Never corporate · never budget · never clinical |

---

## 2. Design Tokens

### Color Palette
```
--warm-white:  #FAF7F2   (page background)
--terracotta:  #A0674A   (primary accent / CTA)
--bark:        #5C3D2E   (headings / dark elements)
--gold:        #B8975A   (highlights / borders)
--sand:        #E8DDD0   (secondary backgrounds / cards)
```

### Typography
```
--font-heading: 'Cormorant Garamond', serif   (weight: 300)
--font-body:    'Jost', sans-serif             (weight: 300–400)
```

### Shape
```
--radius-sm:  4px
--radius-md:  8px
--radius-lg:  16px
```

---

## 3. Data Schemas

### Contact Form Payload (Formspree)

```json
{
  "name":         "string (required)",
  "email":        "string, email format (required)",
  "phone":        "string (optional)",
  "project_type": "enum: ['Dining', 'Living', 'Bedroom', 'Office', 'Custom Piece'] (required)",
  "budget":       "enum: ['Under ₦500K', '₦500K – ₦2M', '₦2M – ₦5M', '₦5M+'] (optional)",
  "message":      "string (required)"
}
```

### Portfolio Item Schema (hardcoded in HTML)

```json
{
  "id":          "string",
  "title":       "string",
  "category":    "enum: ['Dining', 'Living', 'Bedroom', 'Office']",
  "material":    "string",
  "image":       "string (relative path)",
  "alt":         "string (accessibility)"
}
```

---

## 4. Page Architecture (Single Page)

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Nav** | Fixed minimal nav · logo left · CTA right |
| 2 | **Hero** | Full-viewport editorial split · brand statement |
| 3 | **About** | Brand origin story · Nigerian craft heritage |
| 4 | **Portfolio** | Masonry grid of furniture pieces |
| 5 | **Process** | 3-step journey: Design → Craft → Deliver |
| 6 | **Testimonials** | Client social proof |
| 7 | **Contact** | Formspree enquiry form (the conversion point) |
| 8 | **Footer** | Minimal · social links · copyright |

---

## 5. Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| **Formspree** | Contact form backend | ✅ `https://formspree.io/f/xlgonyza` |
| **Vercel** | Hosting / deployment | 🟡 Needs CLI setup |
| **GitHub** | Version control | 🟡 Needs repo init |
| **Google Fonts** | Cormorant Garamond + Jost | ✅ CDN link ready |

---

## 6. Behavioral Rules

1. All images must have descriptive `alt` text
2. Page must score 90+ on Lighthouse Performance
3. Contact form must validate client-side before Formspree POST
4. All animations must respect `prefers-reduced-motion`
5. Mobile-first responsive design (breakpoints: 375px, 768px, 1280px)
6. No JavaScript frameworks — vanilla only
7. No placeholder images in production — all generated or real

### DO Rules

- DO keep the site as a single HTML file — no build tools, no frameworks, no dependencies beyond Google Fonts
- DO ensure the form works without JavaScript (Formspree native POST fallback)
- DO keep all images optimised under 200kb each (WebP preferred)
- DO maintain mobile responsiveness at 375px, 768px, and 1280px breakpoints
- DO include a honeypot field on forms to block spam

### DO NOT Rules

- DO NOT add a CMS, database, or any backend
- DO NOT use JavaScript frameworks (no React, no Vue) — vanilla JS only
- DO NOT use cool-toned greys, pure white (#FFFFFF), or pure black (#000000) anywhere
- DO NOT use font weights above 400 for body text or above 600 for headings
- DO NOT add pages — everything lives on one scrollable page
- DO NOT add animations that don't respect prefers-reduced-motion

---

## 7. Maintenance Log

| Date | Change | Author |
|------|--------|--------|
| 2026-04-01 | Initial constitution created | System Pilot |
