# Tech Portal API - AI Agent Instructions

## Project Overview
This is a Cloudflare Worker API that aggregates tech news from RSS feeds, translates content to Turkish using Gemini AI, and serves a tech portal with categories like 3D printing, technology, and AI.

## Architecture
- **Main Entry**: `src/index.js` - Single Cloudflare Worker handling all routes and scheduled tasks
- **Database**: Cloudflare D1 (SQLite) with posts table storing bilingual content (English + Turkish)
- **External APIs**: Gemini for translations, RSS feeds from tech sources
- **Scheduling**: Cron job every 6 hours to fetch and process new RSS items

## Key Components
- **RSS Sources**: Hardcoded `RSS_SOURCES` object mapping categories to arrays of feed URLs
- **RSS Processing**: Custom regex-based parser in `parseRSS()` - extracts title, link, description from XML
- **Translation**: `translateWithGemini()` with specific prompts for title (natural news language) vs summary (2-3 sentence news summary)
- **Slug Generation**: URL-friendly slugs from Turkish titles using regex replacement
- **Admin Auth**: Basic auth for `/admin/*` routes using `X-ADMIN-SECRET` header matching `ADMIN_SECRET` env var

## Development Workflow
- **Local Dev**: `npm run dev` (wrangler dev) - runs worker locally with hot reload
- **Testing**: `npm test` (vitest) - uses Cloudflare's vitest pool for worker testing
- **Deployment**: `npm run deploy` (wrangler deploy) - publishes to Cloudflare Workers
- **Database**: Schema in `schema.sql`, initial data in `insert.sql` - migrate with wrangler d1 commands

## Code Patterns
- **Error Handling**: Silent failure on duplicate posts (unique constraints on slug/source_url)
- **Data Flow**: RSS fetch → parse → translate → save to DB → serve via REST endpoints
- **API Endpoints**: JSON responses with UTF-8 charset headers
- **Environment**: All secrets (GEMINI_API_KEY, ADMIN_SECRET) via Cloudflare env vars

## API Endpoints
- `GET /api/health` - Health check returning JSON status
- `GET /api/posts` - Latest 20 posts across all categories
- `GET /api/search?q=term` - Search posts by Turkish title/summary
- `GET /api/featured` - Featured posts (is_featured=1)
- `GET /api/home` - Categorized posts (5 per category)
- `GET /admin/posts` - Admin view of all posts (requires X-ADMIN-SECRET header)

## Database Schema
- `title_en/summary_en/content_en` - Original English content
- `title_tr/summary_tr/content_tr` - Turkish translations
- `slug` (unique) - URL slug from Turkish title
- `category` - One of: "3d-baski", "teknoloji", "yapay-zeka"
- `source_url` (unique) - Original RSS link
- `is_featured` - Boolean flag for featured posts (0/1)

## Testing Notes
- Tests in `test/index.spec.js` use Cloudflare test helpers
- Mock env vars and D1 bindings for isolated testing
- Update test snapshots when changing response formats

## Deployment Checklist
- Set `GEMINI_API_KEY` and `ADMIN_SECRET` in Cloudflare dashboard
- Create D1 database: `wrangler d1 create tech-portal-db`
- Run migrations: `wrangler d1 execute tech-portal-db --file=schema.sql`