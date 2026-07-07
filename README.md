[README.md](https://github.com/user-attachments/files/29747887/README.md)
# Vintage Racing Poster Generator

Fan-facing AI experience for the American Speed Festival at M1 Concourse.
Fans upload a photo, pick a poster era (Le Mans '66, Monaco GP, Mille Miglia,
Indy '58, Targa Florio), and get an illustrated vintage racing poster
starring themselves — ready to download or print.

Companion app to the AI Fan Selfie Generator, same fal.ai pipeline and
architecture: a single static `index.html`, no build step, calling fal.ai
directly from the browser.

## Before deploying

Open `index.html` and find this line near the top of the `<script>` block:

```js
const FAL_KEY = 'PASTE-YOUR-FAL-AI-KEY-HERE';
```

Replace the placeholder with your real fal.ai API key
(from `fal.ai/dashboard/keys`).

**Heads up:** this key will be visible to anyone who views this page's
source — same tradeoff the Fan Selfie Generator already makes. If you'd
rather keep the key server-side instead, that's a quick change (a small
serverless proxy function) — just ask.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Vintage racing poster generator"
git branch -M main
git remote add origin https://github.com/M1Concourse/vintage-racing-poster-generator.git
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Other** (it's a static site, no build command
   needed, no environment variables required).
3. Deploy.

Your app will be live at `<project-name>.vercel.app`.

## Notes / next steps

- **Print resolution:** the poster canvas currently renders at 1000×1400px
  (5:7 ratio). Bump the `width`/`height` on `#poster-canvas` in `index.html`
  if you need higher-res files for actual merch/print — the fal.ai output
  resolution should be checked first so we're not just upscaling a blurry
  source image.
- **Photo retention:** per the in-app disclosure, uploaded photos are only
  used in-memory for the generation request and aren't persisted anywhere
  in this codebase.
- **Style prompts:** the five era prompts in `POSTER_STYLES` in `index.html`
  are a first pass. Easy to retune wording once you've seen print-shop
  output quality.
