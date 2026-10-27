# Prisim Wellness

React + TypeScript storefront and staff panel backed by FastAPI/MySQL. Email templates share the main frontend dependencies and lockfile.

## Setup and checks

From `Frontend`:

```sh
npm install
npm run dev
npm run typecheck
npm run lint
npm run build             # website + self-contained Node email renderer
npm run email:build       # only dist-email/render.cjs
npm run email:preview     # all 21 HTML previews in email-preview/
```

Set `VITE_API_BASE_URL=http://localhost:8000` in `Frontend/.env.local`. From `Backend`, install `requirements.txt` in a virtual environment, configure your private `.env` using `.env.example`, then run:

```sh
python create_tabel.py
uvicorn main:app --host 127.0.0.1 --port 8000
```

The additive email schema migration also runs at application startup. On existing databases, run the migration once before launching multiple backend processes. It adds verification/session fields, order email snapshots and ownership, refund totals, and notification tables; it does not reset the database. Existing MySQL integer order totals are widened to decimal amounts so new orders/refunds preserve cents.

## Account activation

Signup creates an inactive, unverified account and queues a verification email. It does not set a login cookie or send a welcome email. The backend requires verification for login, account access, product access and order placement.

Verification links are single-use and expire after 24 hours. Customers can request a six-digit OTP instead; codes expire after ten minutes and allow five attempts. Resends invalidate previous links/codes, have a one-minute cooldown and are limited to ten challenge requests per account per hour. Successful verification activates the account, queues one welcome event and lets the customer sign in normally.

New accounts still unverified after 48 hours are deleted by the maintenance worker. Existing accounts also need verification, but their deletion clock starts only when they request verification. Historical accounts are not deleted merely because this feature was installed. The migration does not infer verification of old email addresses. Verified inactive accounts remain blocked.

Reset links are single-use and valid for one hour. Password and confirmed email changes invalidate existing customer sessions. Email changes require the current password and verification of the new address; the security notice goes to the old address. Orders stay attached to their owner after an email change.

Customer routes: `/verify-email`, `/forgot-password`, `/reset-password`, `/account`, `/unsubscribe`.

## Consolidated email structure

```text
src/email/                 21 email bodies, typed props, subject builders and PreviewProps
src/component/email/       Shared email Header, Footer, layout and table components
src/email/registry.ts       Template registry
src/email/cli.ts            Backend-only JSON stdin → subject, HTML and plain text
src/email/preview.ts        Local HTML previews
```

Mail components use table layouts and inline styles and are distinct from the website's interactive header/footer. Design tokens live in `src/email/theme.ts`. The renderer supplies the deployed website origin and support address. Product images must use absolute public URLs. Apple Mail/iOS can load the webfonts; Gmail/Outlook fall back to Georgia/Helvetica.

Deploy `Frontend/dist-email/render.cjs` alongside the Python backend, with Node available to the backend process. Set `EMAIL_RENDERER_PATH` and `NODE_BINARY` if paths differ. Templates/rendering code and provider credentials are never imported into the browser bundle.

## Backend mail settings

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend key; never expose it in a `VITE_` variable |
| `EMAIL_FROM` | Sender address on a Resend-verified domain |
| `FRONTEND_URL` | Public website origin used in email links |
| `SUPPORT_EMAIL` | Reply-to address and support links |
| `COOKIE_SECURE` | `true` for production HTTPS, `false` for local HTTP |
| `EMAIL_WORKER_ENABLED` | Defaults to `true`; set `false` in processes that should not send |

While the backend is running, maintenance runs every 30 seconds, expires accounts/challenges, schedules reminders and processes the transactional outbox. Business changes and email events are committed together. Failed sends retry with backoff and become `failed` after 12 attempts. Resend idempotency keys reduce duplicate sends after interruption. Row locks support MySQL 8+; use one sending worker on databases without `SKIP LOCKED` support. Maintenance catches up after backend downtime.

When the API key or sender is missing, messages remain pending. Staff inspect the latest 200 events at `/admin/emails` and can retry failed messages after fixing configuration. `sent` means provider acceptance, not guaranteed inbox delivery. Expired/used verification emails are cancelled; single-use secrets are removed from cancelled and successfully sent payloads.

## All 21 email cases

| Template | Trigger |
| --- | --- |
| ContactFormConfirmation | Contact inquiry saved; sent to the submitter |
| VerifyEmail | Signup, resend, or verification of a new account email |
| OtpCode | Customer requests a verification code |
| WelcomeSignup | First successful signup verification |
| PasswordResetRequest | Recovery requested for an active verified account |
| PasswordChanged | Password reset or authenticated password change |
| EmailChanged | Changed email verified; notice sent to the previous address |
| SubscriptionConfirmed | New newsletter subscription, with signed unsubscribe link |
| OrderOnHold | Order created unpaid or placed on hold |
| OrderConfirmation | Staff confirms payment received |
| OrderShipped | Staff records dispatch, carrier, tracking and estimated delivery |
| OutForDelivery | Staff records carrier's out-for-delivery update |
| OrderDelivered | Staff confirms delivery |
| OrderCancelled | Store cancels an order |
| RefundIssued | Staff records a refund amount and unique transaction reference |
| PaymentFailed | Staff records a payment failure |
| ReturnReceived | Staff approves a return, with return number and label URL |
| CustomerNote | Staff sends an order note |
| AbandonedCart | Verified checkout inactive for one hour; once per cart, within two days |
| BackInStock | Customer chooses Notify me and staff restocks that product |
| ReviewRequest | Three days after confirmed delivery, linked to an account review form |

Record fulfillment/payment/refund events in the order editor's **Customer email & order event** section. Repeated events do not send duplicates; notes, returns and partial refunds use unique staff references. Cumulative refunds cannot exceed the remaining order amount. Generic shipment status changes require previously recorded tracking details.

These controls record externally confirmed events; they do not charge cards, move money or fetch carrier updates. A future provider integration can use the same event adapter after verifying the provider's webhook signature. Payment-review and failed-payment pages use live order data and the same event controls.

## Backend tests

```sh
pip install -r requirements-dev.txt
python -m pytest tests -q
```

Tests use isolated in-memory SQLite, disable live delivery and mock the provider. They never connect to MySQL or send real emails. Coverage includes signup gating, links, OTP limits, resend cooldowns, cleanup, recovery/session revocation, changed-email order ownership, contact/newsletter recipients, admin authentication, event deduplication, retries and repeatable schema migration.
