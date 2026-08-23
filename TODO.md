# TODO — Absolute Event & Travel Services

Open work as of **2026-08-23**. Grouped by priority, not by effort.

**Current state:** site is live on Firebase Hosting at <https://absolute-events.web.app>
(project `absolute-events`, account `anandsumit625@gmail.com`). The real domain
`absolutetravels.com` is **not yet pointed at it** — the old single-page version is
still being served by Netlify until DNS is cut over.

---

## Recently shipped — new home hero (2026-08-23)

`index.html` now opens with a full-bleed image hero (`images/hero-banner.webp`, the
Ain Dubai wheel with "ABSOLUTE / Event & Travel Services" baked into the pixels —
client-supplied, from `Absolute Event & Travel Services/hero.png`, 7.7MB PNG resized
to 2200px wide and converted with `sharp-cli`, 253KB). Design was iterated as a
standalone prototype first: `hero_header_mockup.html` (untracked, ignored by
`**/*mockup*.html`) — that history is worth skimming if this section needs more
changes, it records two failed approaches (CSS clip-path skyline masking, then
`background-clip:text`) before landing on "just use the client's pre-composited PNG."

- **No PNG fallback shipped** — WebP-only. Support is universal enough on evergreen
  browsers now; a lossless PNG fallback at this resolution was 5.9MB, which defeats
  the point.
- **`object-fit:contain`, not `cover`** — the image is a fixed ~1.79:1 composition
  with text baked in, and `cover` was cropping "A"/"E" off the wordmark. `contain` +
  a matching near-black backdrop (`#070611`) keeps the whole graphic intact.
- **Mobile doesn't get a full-viewport hero** — forcing 100vh + `contain` on a
  portrait phone left huge dead black bars. Below 768px the hero is sized to the
  image's own aspect ratio instead (`55.8vw` tall) — full-bleed banner, no crop, but
  not edge-to-edge full-screen. If that's ever wanted, it needs a separate
  portrait-cropped export of the source graphic, not a CSS fix.
- **Nav is now `position:fixed`, transparent, and solidifies on scroll** —
  `initHomeHero()` in `script.js` toggles a `.scrolled` class. Scoped to
  `body.hero-nav-page` (index.html only, see next point) so it can't affect
  visa.html/fleet.html's plain sticky navbar — verified with Playwright, unaffected.
- **The top announcement bar (phone/email strip) is gone from `index.html` only** —
  wasn't part of the approved nav design (transparent nav directly on the hero image).
  Phone/email are still in the footer and the floating WhatsApp button; **visa.html
  and fleet.html still have it** — home's header chrome now deliberately differs
  from the sub-pages'.
- **Old hero content didn't get deleted** — the headline/description/inquiry-pill
  form/staggered gallery (`.hero-editorial`) moved to its own section right after the
  image hero, id changed from `#home` to `#plan` (`#home` now belongs to the image
  hero). Nothing about the lead-capture form itself changed.
- **Page now has exactly one `<h1>`** — a visually-hidden one carrying "Absolute
  Event & Travel Services" (the image hero has no real text). The old
  `.hero-headline` ("We Don't Just Book Trips...") was demoted from `h1` to `h2`
  accordingly.
- **Deploy file count goes up again** — `images/hero-banner.webp` is new and not in
  any ignore pattern, so it *will* deploy. Expect **`found 16 files`**, not 15.

---

## P0 — Losing money right now

### 1. Web3Forms is delivering leads to the old mailbox
- **Where:** dashboard at <https://web3forms.com>, access key `988f6dc3-a239-4a34-829d-a376a994d386`
  (appears in `index.html`, `visa.html`, `fleet.html`)
- **Problem:** the key routes email to whatever address it was registered against —
  almost certainly `ops@absolutetravels.in`. The site's `mailto:` links were changed to
  `.com`, but **that has no effect on where form submissions land.**
- **Result:** every contact-form lead is silently arriving in a mailbox nobody reads.
  No error, no bounce. The WhatsApp path is unaffected.
- **Fix:** log in, update the delivery address to `ops@absolutetravels.com`, then submit
  the live form once and confirm it arrives.
- **Cannot be verified from the codebase** — it's a dashboard setting.

---

## P1 — Broken in production

### 2. ~~Three referenced images return 404~~ — DONE 2026-08-23
Real assets (`founder.png`, `Logo.png`, `Full Logo.png`) supplied in
`Absolute Event & Travel Services/` (gitignored source masters, kept out of the
Firebase deploy too — see `firebase.json` ignore list). Processed and dropped into
`/images`:

| File | Source | Notes |
|---|---|---|
| `images/founder.jpg` | `founder.png` | Resized to 1000×1000, JPEG q85 (89 KB) |
| `images/favicon.png` | `Logo.png` (cropped to the "A" mark) | Transparent, 512×512 master (69 KB) |
| `images/apple-touch-icon.png` | same mark, on navy `#0F172A` | 180×180, opaque per iOS convention (7 KB) |
| `images/og-image.png` | `Full Logo.png` + tagline | 1200×630 branded share card on cream `#F7F3E9` (123 KB) |
| `images/logo-mark.png` | `Logo.png`, tight-cropped, no padding | 300×171, transparent, for the header/footer badge |

`og:image` updated to `images/og-image.png` in all three pages.

**Header/footer logo — also done.** `.stamp-logo` (`index.html:81` + footer) swapped
from the CSS "A" text badge to the real mark (`images/logo-mark.png`) inside a white
circular chip with the existing gold border. White chip (not navy) deliberately, so
the mark's own navy tone doesn't disappear against the navy footer background —
verified with a Playwright screenshot of both header (white bg) and footer (navy bg)
before committing.

### 3. Fleet capacity/baggage figures are unverified estimates
- **Where:** `fleet.html:210` (marked with a `VERIFY` comment), table below it
- **Why it matters:** these are my estimates, published on a page built specifically to
  attract group bookers. Wrong seat counts in front of exactly the audience that cares
  is the worst place to be wrong. Tempo Traveller capacity varies by configuration.
- **Fix:** confirm every row against the actual fleet before relying on it.

### 4. Placeholder social proof is live
- **Testimonials:** `index.html:455` — all three are invented
  ("Rajesh Kumar, VP HR, Tech Corporation"). Reads as fabricated to the corporate buyer
  being targeted. Either get three permissioned real quotes, or delete the section.
  Half-measure: keep one real quote, drop the other two.
- **Case study:** `index.html:283` — the Dubai / 180-delegate engagement is a template,
  not a real one. `index.html:301` needs real details + client permission.
- **Proof stats:** `index.html:253` — numbers are unverified.

---

## P2 — Finish the hosting migration

### 5. Point `absolutetravels.com` at Firebase
1. Firebase console → Hosting → add custom domain `absolutetravels.com`
2. **Wait for the SSL cert to provision** before touching DNS — switching early gives
   visitors a window of certificate errors on the live site
3. Update DNS records
4. Verify `https://absolutetravels.com/visa.html` and `/fleet.html` load
5. Only then decommission the Netlify site

### 6. Two live copies of the site currently exist
Netlify still serves the old single-page version. `netlify.toml` was removed from the
repo, but that only removes build config — **the Netlify site itself still exists on
their side.** Only one host should ever hold the real domain, or SEO splits between them.

---

## P3 — Performance

### 7. 4.4 MB of PNGs
| File | Size |
|---|---|
| `images/mice_light.png` | 1.1 MB |
| `images/mice.png` | 920 KB |
| `images/holiday.png` | 916 KB |
| `images/hero_light.png` | 852 KB |
| `images/hero.png` | 724 KB |

Converting to WebP (~120 KB each) would do more for real-world load time on Indian
mobile than any hosting change. **No CDN saves you from a 1 MB hero image.**
Note `hero.png` and `mice.png` appear to be unused — confirm before deleting.

### 8. No analytics installed
Worth adding (Plausible or GA4) so future decisions — especially whether the
page split is working — are driven by data rather than guesswork.

---

## P4 — Parked, waiting on assets

### 9. Founder signature + client logo marquee
- **Where:** `_mockup-founder.html` (untracked, not deployed — in `firebase.json` ignore)
- **Status:** built, reviewed and approved on screen. Not merged into production.
- **Blocked on:**
  - Founder portrait (real photo of Pravesh; on-site beats a studio headshot)
  - Real client names + logo files (SVG or high-res transparent PNG)
  - Whether client logos have permission — if thin, fall back to sector descriptors
    ("leading BFSI, pharma and IT groups") rather than named marks
  - Real numbers for the three scale stats (largest delegation / offsites / years)
- **To merge:** move the two CSS blocks into `styles.css`, swap the `signature-block`
  in `index.html`, drop the clients section in.
- The signature is a hand-drawn SVG. Swapping in a real scan later is one line:
  replace the `<svg>` with `<img src="images/signature.svg">`.

---

## Notes / decisions already made

- **3 pages, not 1:** `index.html` (home + MICE + founder + testimonials),
  `visa.html`, `fleet.html`. Split so visa and car-rental can rank for their own
  search intent. Home keeps teaser cards linking to both.
- **Header/footer are duplicated across the three files**, deliberately — a build step
  isn't worth it at this size. The cost is that contact details live in three places.
  **Revisit at 5+ pages** (Astro or 11ty).
- **`cleanUrls` is `false`** in `firebase.json`. Turning it on serves `/visa` and
  301-redirects `/visa.html`, which would point canonicals at a redirecting URL.
  If you flip it, flip the three canonicals in the same commit — or neither.
- **`firebase.json` ignore list matters.** `public` is the repo root, so anything not
  ignored ships. An earlier deploy published the whole `.git` directory because
  `**/.*` doesn't match files *nested inside* dot-directories. Fixed in `c5e53ce`.
  Deploy should report **`found 10 files`** — if that number jumps, check the ignore list
  before pushing it live.
- **Untracked local experiments** kept out of the deploy: `parallax_mockup.html`,
  `true_2d5_image_depth.html`, `_mockup-founder.html`. Say so if any should go live.
- **`Absolute Event & Travel Services/`** holds the raw brand-asset masters (source
  `founder.png`, `Logo.png`, `Full Logo.png`) — gitignored and excluded from the
  Firebase deploy. Processed derivatives live in `/images`; go back to the masters
  if a different crop/size is ever needed.
- **Deploy file count went up.** Five new images landed in `/images` (favicon,
  apple-touch-icon, founder.jpg, og-image.png, logo-mark.png) — expect
  `found 15 files`, not 10, on the next deploy. Recheck the ignore list if the
  jump is bigger than that.
- **`script.js` is shared across all three pages** and needs no per-page variants —
  every init null-guards or uses `querySelectorAll`.

## Deploy

```bash
firebase deploy --only hosting     # account is bound to this directory
```

Verify after any deploy:
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://absolute-events.web.app/.git/config
# must be 404
```
