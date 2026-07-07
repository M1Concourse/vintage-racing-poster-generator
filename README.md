[README.md](https://github.com/user-attachments/files/29747313/README.md)
# ASF Vintage Racing Poster Generator

Fan-facing AI experience for the American Speed Festival at M1 Concourse.
Fans upload a photo, pick a poster era (Le Mans '66, Monaco GP, Mille Miglia,
Indy '58, Targa Florio), and get an illustrated vintage racing poster
starring themselves — ready to download or print.

Companion app to the AI Fan Selfie Generator, same fal.ai pipeline.

## How it's structured

- `index.html` — the entire front end (no build step, no framework).
- `api/fal/[...path].js` — a Vercel serverless function that proxies calls
  to fal.ai and attaches the API key **server-side**. The browser never
  sees the key — it only ever calls `/api/fal/...`.

This split matters: the key can't leak through view-source, browser dev
tools, or a public GitHub repo, because it's never sent to the browser at
any point in this version.

## 1. Push to GitHub

```bash
git init
git add .
git commit -m "Vintage racing poster generator"
git branch -M main
git remote add origin https://github.com/M1Concourse/vintage-racing-poster-generator.git
git push -u origin main
```

(Swap in whatever org/repo name you actually create — adjust the remote URL
to match.)

Before your first commit, double check `git status` doesn't show `.env` or
`.env.local` — they're git-ignored, but worth a sanity check the first time.

## 2. Deploy to Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Other** (it's a static site + one serverless
   function — no build command needed).
3. Before deploying, add the environment variable:
   - **Name:** `FAL_KEY`
   - **Value:** your fal.ai API key (from `fal.ai/dashboard/keys`)
   - **Environments:** Production, Preview, and Development
4. Deploy.

Your app will be live at `<project-name>.vercel.app`. Rename the project
in Vercel settings if you want a specific subdomain
(e.g. `vintage-racing-poster-generator.vercel.app`).

## 3. Local development (optional)

```bash
npm install -g vercel   # if you don't already have the CLI
cp .env.example .env.local
# fill in FAL_KEY in .env.local
vercel dev
```

`vercel dev` runs both the static file and the `/api/fal/*` serverless
function locally, so the generation flow works exactly like production.

## Notes / next steps

- **Print resolution:** the poster canvas currently renders at 1000×1400px
  (5:7 ratio). Bump the `width`/`height` on `#poster-canvas` in `index.html`
  if you need higher-res files for actual merch/print — the fal.ai output
  resolution should be checked first so we're not just upscaling a blurry
  source image.
- **Photo retention:** per the in-app disclosure, uploaded photos are only
  used in-memory for the generation request and aren't persisted anywhere
  in this codebase. If you add logging/analytics later, make sure that
  disclosure still holds true.
- **Style prompts:** the five era prompts in `POSTER_STYLES` in `index.html`
  are a first pass. Easy to retune wording once you've seen print-shop
  output quality.
