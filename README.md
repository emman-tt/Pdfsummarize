## PDF Summarizer AI

AI-powered PDF summarization web app. Upload a PDF, it extracts text in the browser and summarizes it using the Hugging Face `facebook/bart-large-cnn` model via a serverless API.

### Key features
- Extracts text client-side with PDF.js (no file upload to your server)
- Splits text into chunks and summarizes each chunk server-side
- Friendly, animated UI (GSAP + Lottie)
- Works with local files (falls back to a deployed API base when served from file:// or localhost)

---

## Tech stack
- Frontend: HTML, Tailwind CSS, PDF.js, GSAP, Lottie
- Styling: Tailwind built via PostCSS/Autoprefixer
- API: Serverless functions (Vercel/Netlify) in Node.js
- Model: Hugging Face Inference API `facebook/bart-large-cnn`

---

## Project structure
```
pdf/
  ENV.example                 # Template for server env var(s)
  netlify/
    functions/
      summarize.js           # Netlify serverless function (/ .netlify/functions/summarize)
  netlify.toml               # Netlify config (functions dir, publish dir)
  package.json               # Tailwind build scripts
  pdfsummarize/
    api/
      summarize.js           # Vercel serverless function (handles POST /api/summarize)
    index.html               # App UI
    script.js                # Frontend logic (PDF text extraction, chunking, API calls)
    style.css                # Built Tailwind CSS output
    src/input.css            # Tailwind input
    custom.css, ceiling-lamp.png
  postcss.config.js
  tailwind.config.js
```

---

## Quick start
1) Install dependencies (for Tailwind build):
```bash
npm install
```
2) Build styles during development:
```bash
npm run build
```
3) Deploy the serverless API (choose one):
- Vercel: uses `pdfsummarize/api/summarize.js`
- Netlify: uses `netlify/functions/summarize.js`

4) Open the app UI:
- Open `pdf/pdfsummarize/index.html` in your browser (double-click or use a static server).
- When served from `file://` or `localhost`, the app will call `PROD_API_BASE` from `pdfsummarize/script.js` for the API.

> Tip: Update `PROD_API_BASE` in `pdfsummarize/script.js` to point at your deployed API base URL.

---

## Environment variables
Server functions require:
```
HF_API_KEY=<your_hugging_face_token>
```
Use `ENV.example` as a reference. Set this in your hosting platform’s project settings (do not expose it in the client).

---

## Local development
- Frontend only: run the Tailwind watcher and open `pdfsummarize/index.html` directly.
  - The app will try `POST /api/summarize` relative to the current origin.
  - If running from `file://` or `localhost`, it falls back to `PROD_API_BASE`.
- API locally:
  - Vercel: you can configure the project root as `pdfsummarize/` and run `vercel dev` (ensure env var is set). 
  - Netlify: install Netlify CLI and run `netlify dev` (ensure `HF_API_KEY` is set). Consider setting `publish = "pdfsummarize"` in `netlify.toml` for a cleaner setup.

---

## Deployment
### Vercel
1) Create a new Vercel project and set the root directory to `pdf/pdfsummarize`.
2) Set env var `HF_API_KEY` in Vercel project settings.
3) Deploy. The function will be available at `/api/summarize`, and the static app will be served from the same deployment.

### Netlify
1) Ensure `netlify/functions/summarize.js` is present.
2) In `netlify.toml`, set:
   - `functions = "netlify/functions"`
   - Optionally set `publish = "pdfsummarize"` so the site serves `index.html` directly.
3) Set the `HF_API_KEY` environment variable in the site settings.
4) Deploy (via Git or Netlify CLI).

---

## Usage
1) Click “Choose PDF File” and select a PDF (≤ 50 MB).
2) The app extracts text locally via PDF.js.
3) Text is chunked client-side and each chunk is summarized via the serverless API.
4) Summaries are combined and shown under “AI Summary”.

---

## Configuration & limits
- File size limit: 50 MB (see `pdfsummarize/script.js`).
- Model: `facebook/bart-large-cnn` with `max_length` and `min_length` set in server code.
- If the PDF is scanned images with no extractable text, the app will report it can’t process.

---

## Scripts
```bash
npm run build       # Tailwind dev build with watch
npm run build:prod  # Minified production build
```

---

## Security notes
- Do not expose `HF_API_KEY` in client code. Keep it in serverless function env vars only.
- The browser never uploads the raw PDF; only extracted text chunks are sent to your API.

---

## License
ISC

---

## GitHub setup (optional)
Create a new (private or public) GitHub repo and push:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
