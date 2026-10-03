# Form Supply

A fictional e-commerce experience with product discovery, a persistent cart and a simulated checkout.

**Personal demonstration by Allefy Resende. Not commissioned by a real client.**

![Form Supply desktop screenshot](../../../public/screenshots/form-desktop.webp)

## Features

- Six products with individual detail pages
- Search, category filtering and price sorting
- Server-persisted anonymous cart with quantity and stock validation
- Integer-cent totals computed from the server catalog
- Idempotent simulated order creation without payment data

## Run

From the repository root:

```bash
npm ci
npm run build
npm run db:migrate:local
npm run dev
```

Open `/demos/form` on the local URL printed by the server. This module is part of the shared application; commands run from the root, not this directory.

## Publish

Run `npm run typecheck`, `npm run test:unit` and `npm run build`, then publish the repository through Sites with its D1 `DB` binding. Follow the [deployment guide](../../../docs/DEPLOYMENT.md). Keep the existing Site identity when updating this deployment. The full application requires a Worker runtime and cannot be deployed as a GitHub Pages static site.

## Main files

- `app/demos/form/catalog.tsx`
- `app/demos/form/store-provider.tsx`
- `app/api/store/cart/route.ts`
- `app/api/store/checkout/route.ts`
- `lib/catalog.ts`
- `lib/store-server.ts`

## Scope

No real purchase, payment processing, tax calculation, delivery or fulfillment. Catalog entries and prices are fictional. Photography is illustrative and does not imply manufacturer affiliation. The cart is tied to a browser session.

## Verification

See the [QA report](../../../docs/QA.md). Screenshots come from the implemented app, including a 390 × 844 mobile viewport.

![Form Supply mobile screenshot](../../../public/screenshots/form-mobile.webp)

## Stack and credits

React, TypeScript, Vinext/Vite, responsive CSS and accessible Radix/Shadcn components. Orbit and Form use server-side APIs, Zod validation and Cloudflare D1 with Drizzle migrations. See [image credits](../../../docs/ASSETS.md) and the [root README](../../../README.md).
