# OmniChat

OmniChat is a local-first social content workspace for LinkedIn, YouTube, Instagram, Facebook, and WhatsApp Business messaging. It runs as a static React app and stores its workspace in the browser. No provider account is connected and no external post or message is sent.

The current implementation supports local drafts, platform-aware compose checks, a local outbox, browser-open scheduling, a consent-aware WhatsApp example inbox, offline app-shell caching, and workspace backup/restore. Real publishing, message delivery, comment synchronization, and account analytics need server-side API integrations and provider approval.

## Platform capabilities

| Platform | Local workflow now | Live integration status |
| --- | --- | --- |
| LinkedIn | Compose, draft, schedule, local outbox | Requires member/organization permissions and LinkedIn app access |
| YouTube | Video title/description and file checks; local outbox | Requires Google OAuth, upload scope, and project audit |
| Instagram | Image/video requirement and local outbox | Requires a Business/Creator account, Meta app permissions, and media hosting |
| Facebook | Compose, draft, schedule, local outbox | Intended for Pages; requires Page access, permissions, and Meta review |
| WhatsApp | Local inbox, opt-in/opt-out, 24-hour-window and template examples | Requires WhatsApp Business Platform, webhooks, approved templates, and consent |

Read [the platform research and implementation plan](docs/platform-readiness.md) for official sources, constraints, and the later server/API sequence.

## Local development

Requirements: Node.js 20.19+ or 22.12+, and npm.

```sh
npm ci
npm run dev
```

Open the URL printed by Vite. To build and preview the GitHub Pages base path locally:

```sh
npm run build
npm run preview
```

The production build uses `/OmniChat/` as its base path. A GitHub Actions workflow builds and deploys only when changes reach `main`; this working copy does not publish itself.

## Local data and offline use

- IndexedDB holds posts, media attachments, schedules, settings, comment drafts, and WhatsApp contacts/transcripts on this browser and device.
- Settings can export and restore a JSON backup, including media. Backups contain private content and consent fields.
- The PWA service worker caches the app shell and same-origin assets after a successful online visit. Local data remains on that browser/device; it does not sync between devices.
- Scheduled posts move into the local outbox when the app is open after their due time. A static browser page cannot reliably publish while closed, and an outbox item is never treated as delivered.
- Do not place provider API secrets in frontend code or browser storage. Future access tokens need a server-side integration.

## Commands

```sh
npm run dev       # Start Vite development server
npm run build     # Type-check and create the production bundle
npm run preview   # Serve the production bundle locally
npm run lint      # Run ESLint
```
