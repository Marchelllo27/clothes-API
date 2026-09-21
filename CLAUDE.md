# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Small Express backend for a clothes e-commerce frontend, deployed to Vercel. Plain CommonJS JavaScript, no build step, no tests, no linter.

Endpoints (all wired in `api/index.js`):
- `GET /` — health check
- `GET /get-all-products` — returns `{ products }`
- `POST /create-checkout-session` — body `{ items: [{ id, quantity }] }`, returns `{ url }` for a Stripe Checkout page

## Commands

- `npm start` — runs `node ./api/index.js` (listens on `PORT` or 3001)
- `npm run dev` — **broken**: it runs `nodemon server.js`, but there is no `server.js`. Use `npx nodemon api/index.js` instead, or fix the script.
- `npm test` — placeholder that exits 1; there is no test suite.

Copy `.env-example` to `.env` and set `STRIPE_PRIVATE_KEY` (also `CLIENT_URL`, used for Stripe success/cancel redirects; `SERVER_URL` is listed but not read by any code).

## Architecture

- **Vercel entrypoint:** `vercel.json` rewrites every path to `/api`, so `api/index.js` is the single serverless function. It builds the Express app, calls `app.listen(...)` *and* exports the app (`module.exports = app`) so it works both as a plain Node server and on Vercel.
- **Controllers** in `controllers/` are one file per route, exporting a single async handler. Shared logic lives in `controllers/lib/helpers.js`.
- **Product catalog is not stored here.** `fetchAllProducts()` in `helpers.js` fetches `https://fakestoreapi.com/products` on every call and keeps only "men's clothing" and "women's clothing". Both controllers depend on it.
- **Checkout flow trusts the server, not the client:** `createSessionController` re-fetches the catalog, looks each requested `item.id` up in it, and builds Stripe `line_items` from the server-side title and price (USD, converted to cents). The client only supplies ids and quantities. Preserve this when changing the handler.

## Gotchas

- In `create-session-controller.js`, `require("stripe")(process.env.STRIPE_PRIVATE_KEY)` runs at module load, before `dotenv` is configured. `api/index.js` requires the controllers first and calls `dotenv.config()` afterwards, so with only a `.env` file the Stripe client is created with an undefined key. It works on Vercel because the variables are already in the environment. Locally, export the variable in the shell or move `dotenv.config()` above the controller requires.
- `createSessionController` does not handle an `item.id` that isn't in the catalog: `storeItem` is `undefined`, the resulting `TypeError` is caught, and the client gets the generic 500 response.
