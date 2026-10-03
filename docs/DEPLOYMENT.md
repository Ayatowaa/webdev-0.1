# Deployment and operations

## Prepared deployment: Sites + Cloudflare Workers

The application uses a Worker entrypoint, static client assets and one D1 database. `.openai/hosting.json` declares the logical binding `DB`; it contains no secrets. The registered Site ID ties this checkout to its deployment.

1. Install using the committed lockfile (`npm ci`).
2. Run `npm run typecheck` and `npm run test:unit`.
3. Run `npm run build`.
4. Publish the built Worker and assets through the Sites hosting workflow. Generated `drizzle/*.sql` migrations are included and applied by the platform before activation.
5. Verify that the deployment reports success, then verify the intended audience in the site's sharing settings.

The default initial audience is **owner-private**. A portfolio must be made public before prospective clients can view it. Public access does not grant access to another visitor's Orbit records: every data operation checks the signed-in user.

Do not use `npm start` as a deployment command: it is a **local production preview**. Do not deploy this application to GitHub Pages; static hosting cannot execute its API routes.

## Authentication boundary

The hosted application uses dispatch-owned Sign in with ChatGPT. `/signin-with-chatgpt`, `/signout-with-chatgpt` and `/callback` are platform routes, not routes implemented by this app.

The dispatcher verifies identity and injects `oai-authenticated-user-id` and `oai-authenticated-user-email`. The application checks both on every Orbit API request and scopes SQL reads, updates and deletes to that user ID.

If you later deploy outside Sites, replace `app/chatgpt-auth.ts` with a verified authentication integration and block direct access that could spoof these headers. A raw Worker deployment that trusts client-supplied identity headers is **not an equivalent secure deployment**. Do not enable development mock authentication in production.

## Local database

After the first build, run:

```bash
npm run db:migrate:local
```

The script uses Wrangler's local D1 migration journal. It applies only pending files in `drizzle/`. The local state is isolated from the production database.

To change the schema, edit `db/schema.ts`, run `npm run db:generate`, inspect the generated SQL, and commit both SQL and metadata. Never edit a migration already applied in production. Append a new migration instead.

## Configuration

- `lib/profile.ts`: name, email, verified GitHub and optional LinkedIn URLs.
- `lib/site.ts`: canonical origin. Update when attaching a custom domain.
- `.openai/hosting.json`: platform Site identity and logical bindings.
- No email, payment or external database secrets are required for the demo.

## Data and demo limits

- Orbit: at most 100 projects per user; user-scoped prepared statements and server-side validation.
- Cart: browser session cookie, HttpOnly, SameSite=Lax, Secure in production, 30-day expiry. The application ignores lines older than 30 days.
- Orders: demo records contain product IDs, quantities, integer-cent totals and random session identifiers, never payment details or addresses.
- Checkout retries use idempotency keys; totals are computed from the server catalog.
- The demo does not include billing, inventory reservations, taxation, password recovery, transactional email, team roles or backups management.
- Before broad public use beyond a low-traffic portfolio, add platform abuse controls/rate limits and a data-retention policy. This project intentionally collects minimal data.

## Portability

All four experiences share one runtime to minimize maintenance and hosting overhead. Route modules can be split into separate applications later, but Orbit and Form require their API routes, schema, runtime bindings and authorization boundary. Do not copy only their page components and expect persistence or authentication to work.
