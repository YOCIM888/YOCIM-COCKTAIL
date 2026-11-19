[English](README.md) | [中文](README.zh-CN.md)

# YOCIM · Private Cocktail Menu

A typography-first, no-photo cocktail menu with 22 drinks — originals, remixes and classics.

- Live site: https://cocktail.yocim.top/
- Chinese: https://cocktail.yocim.top/ · English: https://cocktail.yocim.top/en/

## Features

- Dark editorial layout with no images — type, gradients and grain only
- Search, category filters and a detail modal with full recipes
- Chinese and English editions with a header language switch
- SEO-ready: `robots.txt`, `sitemap.xml`, canonical and hreflang tags
- Automatic deployment to GitHub Pages via GitHub Actions

## Structure

```text
index.html                 Chinese menu
en/index.html              English menu
assets/css/style.css       Shared styles
assets/js/data.js          Chinese recipe data
assets/js/data-en.js       English recipe data
assets/js/app.js           Search / filters / modal / animations
robots.txt                 Crawler rules
sitemap.xml                Sitemap with hreflang alternates
CNAME                      Custom domain: cocktail.yocim.top
.nojekyll                  Disable Jekyll processing
.github/workflows/         GitHub Pages deployment workflow
```

## Local preview

Serve the folder over HTTP, because the language links use `/` and `/en/`:

```bash
python -m http.server 8080
```

Open http://localhost:8080/.

## Editing the menu

Add or edit drinks in `assets/js/data.js` (Chinese) and `assets/js/data-en.js` (English). Keep the same `id` and `num` in both files.

## Deployment

Push to `main`. The workflow copies the static site into `_site` and deploys it to GitHub Pages. In repository Settings → Pages, the custom domain is `cocktail.yocim.top`; keep "Enforce HTTPS" enabled.

## Disclaimer

Not a professional menu. Please drink responsibly. Not for minors. Don't drink and drive.
