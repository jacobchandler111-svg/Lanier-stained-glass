# Lanier Stained Glass — site

Static brochure site for Lanier Stained Glass (Ricky Dorsey, Buford GA). Vanilla HTML/CSS/JS — no build step.

## Stack

- HTML5, semantic, one `index.html` per route folder so URLs stay clean (`/about/`, `/services/custom-design/`, etc.).
- Tailwind CSS via the Play CDN with an inline brand-color config — keeps the look consistent across pages with no build pipeline.
- Custom CSS for stained-glass-specific motifs (gothic arch masks, brass leading, jewel-tone tile placeholders) lives in [`css/styles.css`](css/styles.css).
- Single source of truth for NAP, services, testimonials, and portfolio in [`js/business.js`](js/business.js).
- JSON-LD schema (`ProfessionalService`, `Service`, `FAQPage`, `BreadcrumbList`, `Article`, `ContactPage`) is inlined per page for SEO.

## Local preview

Any static server works. Examples:

```sh
# Python (no install if you have Python 3)
python -m http.server 8080

# Node (if installed)
npx serve .
```

Then open <http://localhost:8080/>.

## Deploy (Netlify)

1. Push this folder to GitHub (repo: `lanier-stained-glass`).
2. In Netlify, **Add new site → Import from Git → GitHub** → pick the repo.
3. Build settings: leave **build command** empty, **publish directory** = `.`. (`netlify.toml` already declares this.)
4. Deploy. Netlify gives a `*.netlify.app` URL immediately.
5. When the real domain is purchased, point its DNS at Netlify and add it as a custom domain in the site settings.

The contact form uses [Netlify Forms](https://docs.netlify.com/forms/setup/) — works automatically once deployed (no JS, no third-party service). Submissions show up in the Netlify dashboard.

## Editing

| Want to change…                | Edit                                                |
| ------------------------------ | --------------------------------------------------- |
| Phone, email, city, hours      | `js/business.js`                                    |
| Brand colors                   | `css/styles.css` `:root` block + the Tailwind config inside each `<head>` |
| Nav links / footer             | The `<header>` / `<footer>` block in each `*.html`  |
| A service description          | `services/<slug>/index.html` plus `js/business.js`  |
| Add a portfolio entry          | `js/business.js` `portfolio` array, then add a tile to `gallery/index.html` |

## TODOs before launch

- [ ] Replace SVG `assets/og-default.svg` with a real photo (1200×630 JPG/PNG).
- [ ] Replace gradient `lsg-tile` placeholders in the gallery with real photos.
- [ ] Fill in `street`, `hours`, `yearsInBusiness` in `js/business.js`.
- [ ] Get the bio paragraph from Ricky for `about/index.html`.
- [ ] Buy the real domain (likely `lanierstainedglass.com`) and update `js/business.js` `url`, `sitemap.xml`, `robots.txt`, and the `<link rel="canonical">` blocks.
