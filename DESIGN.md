# Design System — Absolute Event & Travel Services

Status: **formalized from what's already shipped** (Aug 2026). This documents the
system live in `styles.css` / `index.html` / `fleet.html` / `visa.html` and used
consistently across all mockups (`hero_header_mockup.html`, `parallax_mockup.html`,
`true_2d5_image_depth.html`, `_mockup-founder.html`). Nothing here is a proposed
change unless flagged "NEW" — this is the contract for anything built from now on.

## Positioning this system serves

11+ year Delhi-based MICE + corporate travel + leisure house. The audience is
corporate travel buyers and event planners, not budget backpackers — the visual
language needs to read as an established, trustworthy operator, not a startup.
**Memorable thing:** warm, editorial luxury — champagne gold and deep navy on a
porcelain page, not glossy/corporate-blue SaaS.

## Typography

```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400;1,600&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Caveat:wght@600;700&display=swap');

--font-serif: 'Playfair Display', Georgia, serif;
--font-sans:  'Plus Jakarta Sans', sans-serif;
--font-hand:  'Caveat', cursive;
```

| Family | Role | Where |
|---|---|---|
| **Playfair Display** | All headings (h1–h4), section titles, pull quotes, badge text | Editorial weight — this is what makes the site feel curated rather than templated |
| **Plus Jakarta Sans** | Body copy, nav, buttons, labels, forms | Workhorse UI font — clean, high legibility at small sizes |
| **Caveat** | Rare handwritten accent (signature-style flourishes) | Use sparingly — 1 per page max, it loses impact if overused |

**Weights in practice:** headings run 700–800 (700 for subheads, 800 for hero/major
titles); body runs 400, with 600 for emphasis/nav-active states.

**Sizes are not on a rigid scale** — they're hand-tuned per component (hero
headline 3.6–5rem down to 2.2rem mobile, section titles 2–3rem, body 0.9–1.05rem).
When building something new, match the nearest existing component's size rather
than inventing a new value — check `styles.css` for the closest analog first.

## Color

```css
--bg-body:         #FAF8F5;  /* Warm porcelain — page background */
--bg-surface:       #FFFFFF; /* Cards, panels, pure white */
--bg-subtle:        #F3EFEA; /* Soft sand — section fills */
--bg-dark-accent:   #0F172A; /* Deep navy — dark sections */

--color-gold:        #C5A059; /* Champagne gold — DECORATIVE ONLY, fails WCAG as text */
--color-gold-hover:  #8A6A2E; /* Darkened gold — WCAG AA safe for text/links */
--color-gold-dark:   #B38B3F; /* NEW: darkened gold for gradient end-stops */
--color-gold-light:  #F7F3E9;
--color-emerald:     #0F766E; /* Secondary accent (success states, subtle contrast) */
--color-navy:        #0F172A; /* = --bg-dark-accent, same value, semantic alias */
--color-error:        #B91C1C; /* NEW: promoted to a token, was hardcoded */

--text-main:   #1E293B;
--text-muted:  #64748B;
--text-light:  #94A3B8;

--border-light: #EBE6DC;
--border-gold:  rgba(197, 160, 89, 0.4);
```

**Hard rule:** `--color-gold` (#C5A059) is decorative fills/icons only — it does
not meet WCAG AA as text on the light backgrounds. Text/links in gold use
`--color-gold-hover` (#8A6A2E). This distinction already exists in the code;
don't collapse it back to one gold variable.

**Intentional exception — WhatsApp button:** the floating concierge button uses
`#10B981` (bright emerald), not `--color-emerald` (#0F766E). This matches
WhatsApp's own brand green so the icon reads correctly against its familiar
color; it's deliberate, not drift. Leave it hardcoded.

**Pure white (`#FFFFFF`):** used both as `--bg-surface` (cards) and raw inline
(text-on-navy, e.g. footer headings). Same value, different intent — not worth
tokenizing further; the 30 raw occurrences are all "white text on a dark
background," which doesn't need a semantic name.

## Fixes applied while formalizing this doc

Two small spots had drifted from the token system — both fixed in `styles.css`:

1. **Gold gradients had three different end-stops** (`#B38B3F`, `#9A752B`,
   `#D4AF37`) doing the same job — "darkened gold" — in `.btn-gold` and
   `.wax-seal-badge`. Consolidated to one new token, `--color-gold-dark:
   #B38B3F`, used in both. Visually the two are indistinguishable side by
   side, so this is not a visible change — it just stops the values from
   silently diverging further as more components get added.
2. **`.modal-status.error`** used a bare `#B91C1C` while its sibling
   `.modal-status.success` already referenced `var(--color-emerald)`.
   Promoted to `--color-error` for consistency.

## Open question for you

Nothing else in the audit needs a decision — the system is coherent as shipped.
If you want to revisit anything specific (a color that's bugging you, a font
pairing doubt), say so and we'll treat it as a targeted change against this
baseline rather than a redesign.
