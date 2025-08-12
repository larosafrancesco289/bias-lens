### Bias Lens

Bias Lens analyzes news article URLs and returns a structured bias assessment using the OpenAI API.

Live demo: [https://bias-lens-self.vercel.app/](https://bias-lens-self.vercel.app/)

### Why

Reading news across outlets can expose different framing and language. This tool extracts article text and produces a concise, machine readable assessment that helps you compare tone and balance.

### Features

- Smart extraction with Mozilla Readability
- Fallback to Playwright for JavaScript heavy pages
- JSON output with label, reasoning, confidence, and categories
- Simple Next.js UI with light and dark themes

### Setup

- Requirements: Node.js 18 or later, an OpenAI API key
- Clone and configure environment

```bash
git clone https://github.com/larosafrancesco289/bias-lens.git
cd bias-lens
cp env.example .env.local
# edit .env.local and set OPENAI_API_KEY
```

### Quickstart

Option A: scripts

```bash
./scripts/install.sh
./scripts/dev.sh
```

Option B: npm

```bash
npm run setup
npm run dev
```

Visit `http://localhost:3000`.

### Usage

- Web UI: paste a news article URL and run Analyze
- API: POST `/api/analyze`

Request

```json
{ "url": "https://example.com/news-article" }
```

Response

```json
{
  "title": "Article Title",
  "byline": "Author Name",
  "wordCount": 1250,
  "analysis": {
    "label": "Moderate Left Bias",
    "reasoning": "Explanation",
    "confidence": 0.78,
    "categories": ["Politics"]
  }
}
```

Curl example

```bash
curl -s -X POST http://localhost:3000/api/analyze \
  -H 'Content-Type: application/json' \
  -d '{"url":"https://example.com/news-article"}'
```

### Architecture

Code tree

```
src/
  app/
    api/
      analyze/
        route.ts        # POST /api/analyze
    components/
      theme-provider.tsx
      theme-toggle.tsx
      ui/
        Button.tsx
        Card.tsx
    globals.css
    layout.tsx
    page.tsx
```

Notes

- Primary extraction uses JSDOM and Readability
- Fallback uses Playwright and a set of common selectors
- OpenAI model is configurable via `OPENAI_MODEL` and defaults to `gpt-5-mini`

### Scripts

- `npm run setup`: install dependencies and Playwright browsers
- `npm run dev`: start the dev server
- `npm run build`: build for production
- `npm start`: run the production server
- `npm run typecheck`: TypeScript checks
- `npm run lint`: lint
- `npm run format`: lint with fixes

### License

MIT. See `LICENSE`.
