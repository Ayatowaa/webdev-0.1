# Professional portfolio

English-language portfolio for Allefy Resende, an early-career Full Stack Developer seeking initial freelance collaborations.

## Included

- Professional introduction, honest background and project-based capabilities.
- Three personal demos with individual case studies and desktop/mobile screenshots.
- Direct email contact and real GitHub links.
- Responsive navigation, reduced-motion support, metadata, sitemap and favicon.
- Data-driven project catalog in `lib/projects.ts`.

## Run and publish

From the repository root, run `npm ci`, `npm run build`, `npm run db:migrate:local`, then `npm run dev`. Open `/` at the printed address. Run `npm run typecheck` and `npm run test:unit` before publishing through the prepared Sites/Cloudflare Worker workflow. See [deployment instructions](../../DEPLOYMENT.md).

## Personalize

Edit `lib/profile.ts` for name, email and verified social links. LinkedIn is intentionally not shown until the user supplies a real URL. Edit `lib/projects.ts` to add new projects, and `lib/site.ts` when changing the canonical domain. Do not add fabricated experience, certificates or client outcomes.

## Contact behavior

The contact CTA opens the visitor’s email application. It does not send a message automatically. A copy-email action includes a manual-copy fallback.

## Screenshot

![Portfolio](../../../public/screenshots/portfolio-desktop.webp)
