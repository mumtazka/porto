# Deploy Guide: Turso + Cloudflare Pages

This project was migrated from Supabase/PostgreSQL to Turso/LibSQL with Cloudflare Pages Functions as the server-side API layer.

## Architecture

- React/Vite frontend: `src/`
- Turso API proxy: `functions/api/**`
- Luna AI function: `functions/chat-luna/index.ts`
- GitHub contributions function: `functions/github-contributions/index.ts`
- Admin login function: `functions/admin-login/index.ts`
- Turso schema: `turso_schema.sql`
- Turso seed data: `turso_seed.sql`

The frontend never stores `TURSO_AUTH_TOKEN`. All database access happens inside Cloudflare Pages Functions.

## 1. Install dependencies

```bash
npm install
```

## 2. Create a Turso database

Install/login to the Turso CLI:

```bash
npm install -g @turso/cli
turso auth login
```

Create a database:

```bash
turso db create mumtaz-portfolio
```

Apply schema and seed data:

```bash
turso db shell mumtaz-portfolio < turso_schema.sql
turso db shell mumtaz-portfolio < turso_seed.sql
```

Get the database URL and auth token:

```bash
turso db show mumtaz-portfolio
turso db tokens create mumtaz-portfolio
```

Save these values:

```bash
TURSO_DATABASE_URL=libsql://mumtaz-portfolio-your-org.turso.io
TURSO_AUTH_TOKEN=eyJhbGciOiJ...
```

## 3. Prepare environment variables

Copy the example file locally:

```bash
cp .env.example .env
```

For local development, keep:

```bash
VITE_TURSO_CONFIGURED=true
VITE_API_BASE=http://localhost:8788
```

For production Cloudflare Pages, `VITE_API_BASE` should be empty or omitted. The production API calls use relative paths like `/api/projects`.

## 4. Required Cloudflare Pages variables/secrets

In Cloudflare Pages project settings, add these environment variables/secrets:

```bash
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
GEMINI_API_KEY
GITHUB_TOKEN
ADMIN_EMAIL
ADMIN_PASSWORD
VITE_TURSO_CONFIGURED=true
```

Recommended:

- Mark these as secrets where possible: `TURSO_AUTH_TOKEN`, `GEMINI_API_KEY`, `GITHUB_TOKEN`, `ADMIN_PASSWORD`.
- `VITE_*` variables are public because Vite exposes them to the browser.
- Do not commit `.env`.

## 5. Local development

Start Cloudflare Pages Functions with Wrangler:

```bash
npx wrangler pages dev . -- vite --port 5173
```

This starts the Vite dev server and proxies:

- `/api/*`
- `/chat-luna`
- `/github-contributions`
- `/admin-login`

Open:

```text
http://localhost:5173
```

If you run only `npm run dev`, make sure Wrangler is already running on `http://localhost:8788`, because `vite.config.ts` proxies API requests there.

## 6. Build and lint

Run before deploy:

```bash
npm run lint
npm run build
```

Expected result:

- `npm run lint` should finish with no errors.
- `npm run build` should produce `dist/`.

## 7. Deploy to Cloudflare Pages with Git integration

Recommended flow:

1. Push this repository to GitHub/GitLab.
2. Create a Cloudflare Pages project.
3. Connect the Git repository.
4. Set build command:

   ```bash
   npm run build
   ```

5. Set build output directory:

   ```text
   dist
   ```

6. Add the environment variables/secrets from section 4.
7. Deploy.

Cloudflare Pages will automatically include `functions/` as Pages Functions.

## 8. Deploy to Cloudflare Pages with Wrangler CLI

Login:

```bash
npx wrangler login
```

Build:

```bash
npm run build
```

Deploy:

```bash
npx wrangler pages deploy dist
```

If Wrangler asks for a project name, use your Cloudflare Pages project name.

Optional direct command:

```bash
npx wrangler pages deploy dist --project-name=your-pages-project-name
```

## 9. Admin login

The admin panel uses `/admin-login`.

Set these in Cloudflare Pages environment variables:

```bash
ADMIN_EMAIL=your-admin-email@example.com
ADMIN_PASSWORD=your-strong-password
```

Then log in with the same email/password in the admin page.

## 10. Verify deployment

After deployment, check these endpoints:

```bash
curl https://YOUR_PROJECT.pages.dev/api/tech-stack
curl https://YOUR_PROJECT.pages.dev/api/projects
```

Expected: JSON arrays from Turso.

Check AI function:

```bash
curl -X POST https://YOUR_PROJECT.pages.dev/chat-luna \
  -H 'Content-Type: application/json' \
  -d '{"userMessage":"hello","systemPrompt":"You are a test assistant."}'
```

Expected: JSON response with `text`.

Check GitHub contributions:

```bash
curl -X POST https://YOUR_PROJECT.pages.dev/github-contributions
```

Expected: GitHub GraphQL JSON.

## 11. Troubleshooting

### API returns 404

Make sure Cloudflare Pages has the `functions/` directory and the deployed build includes Pages Functions.

### API returns 500

Check Wrangler/Cloudflare logs and verify:

```bash
TURSO_DATABASE_URL
TURSO_AUTH_TOKEN
```

### Chat returns fallback responses

Verify:

```bash
GEMINI_API_KEY
```

### GitHub contributions fail

Verify `GITHUB_TOKEN` has access to GitHub GraphQL API.

### Admin cannot log in

Verify:

```bash
ADMIN_EMAIL
ADMIN_PASSWORD
```

Also confirm the frontend can reach `/admin-login`.
