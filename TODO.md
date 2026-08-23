# TODO — Absolute Event & Travel Services

Open work as of **2026-08-23**. Grouped by priority, not by effort.

**Current state:** site is live on Firebase Hosting at <https://absolute-events.web.app>
(project `absolute-events`, account `anandsumit625@gmail.com`). The real domain
`absolutetravels.com` is **not yet pointed at it** — the old single-page version is
still being served by Netlify until DNS is cut over.

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

`og:image` updated to `images/og-image.png` in all three pages.

**Not done / flagged, not silently changed:** the header/footer still use the CSS
"A" stamp (`.stamp-logo`, `index.html:81`), not the real logo image now available.
That's a bigger visual change than this fix — decide separately whether to swap it in.

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
- **Deploy file count went up.** Four new images landed in `/images` (favicon,
  apple-touch-icon, founder.jpg, og-image.png) — expect `found 14 files`, not 10,
  on the next deploy. Recheck the ignore list if the jump is bigger than that.
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
