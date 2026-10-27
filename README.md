# semantic-signal-site

The static site for **Semantic Signal**, deployed at <https://qrak.org> (and served from the
Cloudflare Pages project `semantic-signal-landing` at `semantic-signal-landing.pages.dev`).

Astro + Tailwind, no server-side code: pages are pre-rendered HTML, and the only generated file
is `dist/llms-full.txt` (a plain-text dump of every page for LLM tools, built from the HTML).

## What is here

| path | contents |
|---|---|
| `src/pages/` | one Astro page per URL: home, story, results, articles, about, contact, legal |
| `src/pages/articles/` | long-form pieces; each one cites the repository path behind its numbers |
| `src/layouts/` | `Layout.astro` (shell, nav, meta) and `ArticleLayout.astro` (article typography) |
| `src/styles/global.css` | design tokens and base styles |
| `public/` | static files served as-is: `robots.txt`, `sitemap.xml`, `llms.txt`, `project.json`, icons, `ads.txt` |
| `scripts/build-llms-full.mjs` | generates `dist/llms-full.txt` from the built pages |

## The system this site describes

- Engine, dashboard and indicators: <https://github.com/qrak/LLM_trader>
- Live dashboard: <https://semanticsignal.qrak.org>

The site is a separate repository on purpose: the dashboard (FastAPI, WebSocket, runtime state)
and this site (static HTML) have different release rhythms and different build outputs.

## Build

Requires Node.js 22+.

```bash
npm ci
npm run build        # astro build + dist/llms-full.txt
npm run dev          # local dev server
npm run preview      # preview the production build
```

## Deploy

Cloudflare Pages, direct-upload project — a push does **not** deploy it.

```bash
npm run build
npx wrangler pages deploy dist --project-name semantic-signal-landing --branch main
```

Keep `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` in the environment or use `wrangler login`.
HTML responses are cached on the edge; after a deploy, purge the changed URLs in the
Cloudflare dashboard (or via the API) before assuming a page is stale.

## Numbers on this site

Every figure in an article or on the results page is meant to be reproducible from the
`qrak/LLM_trader` repository: test counts come from a real `pytest` run, ledger figures from
`python scripts/results_report.py`. When a number changes, the page changes with it — including
the caveats around it (sample size, fees not modelled, paper trading only).

Machine-readable versions of the same facts: `public/project.json` and `public/llms.txt`.

## License

MIT — see [LICENSE.md](LICENSE.md).
