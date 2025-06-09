# Bias Lens

A tool to check news articles for bias using GPT-4.1 Mini via OpenAI API. This application scrapes article content from URLs and provides AI-powered bias analysis with structured JSON responses including bias labels, reasoning, and confidence scores.

**Live Demo**: [https://bias-lens-self.vercel.app/](https://bias-lens-self.vercel.app/)

**GitHub Repository**: [https://github.com/larosafrancesco289/bias-lens](https://github.com/larosafrancesco289/bias-lens)

## Features

- **Smart Article Extraction**: Uses Mozilla's Readability library (same as Firefox Reader View) to extract clean article content
- **Fallback Scraping**: Automatically falls back to Playwright for JavaScript-heavy sites
- **AI Bias Analysis**: Powered by OpenAI's GPT-4.1 Mini for objective bias assessment
- **Modern UI**: Clean, responsive interface with dark/light theme support
- **Detailed Results**: Shows bias label, confidence score, reasoning, and article metadata

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **AI**: OpenAI GPT-4.1 Mini
- **Scraping**: JSDOM + Mozilla Readability, Playwright (fallback)
- **Styling**: Tailwind CSS with theme support

## Getting Started

### Prerequisites

- Node.js 18+ 
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/larosafrancesco289/bias-lens.git
cd bias-lens
```

2. Install dependencies:
```bash
npm install
```

3. Install Playwright browsers (for JavaScript-heavy sites):
```bash
npx playwright install chromium
```

4. Set up environment variables:
```bash
cp env.example .env.local
```

Edit `.env.local` and add your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the application.

## How It Works

1. **URL Input**: Enter a news article URL
2. **Content Extraction**: 
   - First attempts extraction using JSDOM + Readability (fast, efficient)
   - Falls back to Playwright for JavaScript-heavy sites (slower but more thorough)
3. **AI Analysis**: Sends extracted content to GPT-4.1 Mini for bias analysis
4. **Results Display**: Shows bias assessment with reasoning and confidence score

## Article Extraction Process

The tool uses a two-tier approach for maximum compatibility:

### Primary Method: JSDOM + Readability
- Fetches raw HTML via standard HTTP request
- Creates DOM clone using JSDOM
- Extracts article content using Mozilla Readability
- Fast and efficient for most news sites

### Fallback Method: Playwright
- Launches headless Chromium browser
- Allows JavaScript to execute and page to hydrate
- Extracts content from fully rendered page
- Handles paywalls, infinite scroll, and dynamic content

## API Endpoints

### POST `/api/analyze`
Analyzes a news article for bias.

**Request Body:**
```json
{
  "url": "https://example.com/news-article"
}
```

**Response:**
```json
{
  "title": "Article Title",
  "byline": "Author Name",
  "wordCount": 1250,
  "analysis": {
    "label": "Moderate Left Bias",
    "reasoning": "Analysis explanation...",
    "confidence": 0.78,
    "categories": ["Political", "News"]
  }
}
```

## Development

### Project Structure
```
src/
├── app/
│   ├── api/analyze/       # Bias analysis API route
│   ├── components/        # UI components
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
```

### Key Dependencies
- `@mozilla/readability` - Article content extraction
- `jsdom` - DOM manipulation for scraping
- `playwright` - Headless browser fallback
- `openai` - AI bias analysis
- `lucide-react` - Icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Deployment

Deploy to Vercel, Netlify, or any platform supporting Next.js:

```bash
npm run build
npm start
```

Make sure to set the `OPENAI_API_KEY` environment variable in your deployment platform.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Mozilla's Readability library for clean article extraction
- OpenAI for providing the GPT-4.1 Mini API
- The Next.js team for the excellent framework
