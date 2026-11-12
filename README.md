# My Birthdays — independent app source

Recovered from the user-provided `Birthday-Aura.zip` and prepared as a **standalone** Vite/React app; the original archive is not overwritten.

## Run

```sh
npm install
npm run build
npm run dev
```

Cloudflare Pages build command: `npm run build`; output directory: `dist`.

## Important restrictions before production

- **Payment purchases are intentionally disabled in this preparation package.** The old app opened a Stripe payment link but did not independently confirm payment; its `?pro=1` query parameter also activated Pro without payment verification. Both unsafe behaviors are removed/disabled.
- Existing local `mybirthdays_pro` status is retained solely for backward compatibility; it is **not** a secure payment record. Production premium entitlements need server-side verified purchase / license validation. Do not re-enable checkout until a complete verified fulfillment design is implemented.
- All birthday entries remain **local to each browser** using IndexedDB database `my-birthdays-app`, store `birthdays`. Moving the app between hostnames or origin paths may not preserve existing user data. Plan a voluntary export/import backup strategy before changing the live app's origin.
- This is the **app**, not the currently live marketing homepage at mybirthdays.online. Do not point that domain to this project without a coordinated integration plan.
- UI copy and feature lists reflect source recovery, not verified production-ready paid entitlements.

## Audit log

- Removed Vite's mandatory Replit `PORT`/`BASE_PATH`, Replit plugins, dev proxy, and Replit-only workspace dependencies.
- Flattened dependency version catalog for an independent `npm install`.
- Added standalone TypeScript and Vite configs.
- Disabled the broken/unsafe Stripe purchase button and counter/API call.
- Removed the insecure `?pro=1` client-side entitlement grant.

## Status

Source prepared; installation/build and deployment **not yet verified** in this environment. No GitHub or DNS changes have been made.
