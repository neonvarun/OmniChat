# OmniChat platform readiness and implementation plan

Research reviewed 6 October 2026. This document records what works in the current static app, the official account/API gates found during research, and the steps needed for real integrations.

## Product scope and promise

The priority set is LinkedIn, YouTube, Instagram, WhatsApp, and Facebook. LinkedIn, YouTube, Instagram, and Facebook are treated as publishing destinations. WhatsApp is a business messaging inbox with different consent and delivery rules.

The app currently runs as a browser-only GitHub Pages site. It can safely provide content planning, local drafts, a local outbox, schedules that become ready when the app is open, local comment-reply drafts, a sample WhatsApp inbox, workspace backup/restore, and a cached offline shell. It cannot sign into providers, sync real comments, publish, send WhatsApp messages, retrieve account analytics, deliver while closed, or sync data across devices.

No provider keys are embedded in the client. Provider tokens belong in a server-side integration with encrypted storage and explicit account authorization. A browser-only site cannot protect a secret shipped to every visitor.

## Current offline implementation

| Capability | Current behavior |
| --- | --- |
| Workspace data | IndexedDB stores posts, attachments, schedules, settings, comment drafts, contacts, and local message transcripts on this browser. |
| Backup and restore | Settings exports/imports JSON including attachments. Backups contain private content and consent fields; handle them like sensitive data. |
| Posting | Compose supports LinkedIn, Facebook, Instagram, and YouTube. Draft saves are local. “Add to outbox” stores a local queue item; it does not post. |
| Platform-aware checks | Instagram needs image/video in the local composer. YouTube needs a title and video file. Final eligibility still depends on the official API and account at integration time. |
| Scheduling | Future items stay scheduled locally. When the app is opened or focused after their scheduled time, they move to the outbox. They are never auto-sent. |
| WhatsApp | Sample threads exercise opted-in, expired-window, and opted-out states. Added contacts record whether explicit opt-in was captured. In-window freeform and out-of-window template examples can be saved as local drafts. |
| Analytics | Counts come from local workspace records. Reach, views, followers, and engagement remain unavailable until authorized platform data is connected. |
| Offline shell | A service worker caches the app shell and same-origin assets after the app has been visited online. IndexedDB data is available offline on the same browser/device. |

The service worker is a browser cache, not a reliable scheduler. Browsers may stop service workers and Background Sync support varies; provider delivery must be driven by a server queue for dependable schedules and retries.

## Official platform requirements

### LinkedIn

- The Posts API supports organic text and media posts, including images, videos, and documents. The app must use the current `Linkedin-Version` header and Rest.li protocol header; do not pin a version from this research note because LinkedIn versions sunset regularly.
- Member posting requires the relevant member social-write permission (`w_member_social`). Organization posting requires organization social-write access and an appropriate organization role, such as administrator/content-admin or the applicable sponsored-content role.
- Community Management API access has development and standard tiers. Standard use requires an application and review; access is not granted merely by creating an app.
- For an implementation, decide whether the product needs member publishing, organization publishing, or both, then apply for the minimum scopes.

Sources: [Posts API](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2026-06), [Increasing access](https://learn.microsoft.com/en-us/linkedin/marketing/increasing-access?view=li-lms-2026-04).

### YouTube

- Video publishing uses YouTube Data API `videos.insert` with Google OAuth and the `youtube.upload` scope. OmniChat must collect a video file and a title/description before it can build a valid video upload request.
- New/unverified API projects can have uploads restricted to private visibility until the project passes YouTube's audit. That is an API project restriction, not a client-side setting.
- Quota allocation and costing are changing toward per-method quota buckets. Confirm the project's live quota allocation and current cost documentation before enabling user publishing; do not assume an old generic quota number.

Sources: [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert), [Quota calculator](https://developers.google.com/youtube/v3/determine_quota_cost), [Revision history](https://developers.google.com/youtube/v3/revision_history).

### Instagram

- The official Instagram API publishing flows are for Professional accounts (Business or Creator), not personal accounts. Available media and publishing features differ by account and login route.
- Publishing uses a media-container creation step followed by a publish step. The remote service needs to fetch the media from an externally accessible URL; a browser-local `Blob` cannot be passed as that URL. A future backend must upload/hold the media in controlled object storage or stream it through a supported upload route.
- The permission set differs between Instagram Login and Facebook Login. Choose the login model before app review and request only its current publishing and basic-account permissions. Do not bake one permissions list into the UI as universal.

Source: [Meta's Instagram API Postman collection](https://www.postman.com/meta/instagram/documentation/6yqw8pt/instagram-api).

### Facebook

- The planned target is Facebook Pages publishing, not publishing to personal profiles. The user must authorize an eligible Page and the app must obtain the current Page publishing permissions and undergo the required Meta review/access process.
- Validate exact scopes, Page task/role requirements, Page tokens, publishing formats, and app-review status against the current Meta docs at integration time. Meta permission names and access levels change and are app-dependent.

Sources: [Pages API](https://developers.facebook.com/docs/pages-api/), [Meta permissions reference](https://developers.facebook.com/docs/permissions/).

### WhatsApp Business Platform

- This is a one-to-one business messaging workflow, not a public-post channel. A real deployment needs a WhatsApp Business Platform/Cloud API setup, business phone number, recipient identifiers, webhook endpoint, and an approved Meta app configuration.
- Messages require the recipient's opt-in. Honor opt-outs and stop messages when a recipient opts out.
- A user inbound message opens/resets the 24-hour customer-service window. Freeform support messages are allowed within that window. Outside it, business-initiated messages must use approved message templates.
- Automated experiences inside the service window need a clear human escalation path. The local app stores conversation examples only and does not contact recipients.

Source: [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/policy/).

## Later API implementation sequence

1. **Choose the backend and tenancy model.** Add a server/API service and a database for users, workspaces, connected accounts, posts, jobs, consent events, webhooks, and audit events. The current one-browser workspace has no authentication or multi-user isolation.
2. **Register provider apps and complete reviews.** Create Meta, Google, and LinkedIn applications; configure allowed callback URLs, privacy policy, deletion/contact requirements, requested scopes, test users, and each provider's review/audit flow.
3. **Build OAuth and credential handling.** Use state/PKCE where supported, validate redirect state, encrypt refresh/access credentials on the server, rotate/revoke credentials, and never return provider secrets to browser JavaScript.
4. **Add provider adapters and capability checks.** Implement one adapter per publishing API and a separate WhatsApp adapter. Validate account type, content format, media, scopes, ownership, rate limits, and expiry before creating jobs. Persist remote IDs and provider errors.
5. **Move media to controlled storage.** Validate file type/size, scan/limit uploads, create expiring provider-fetchable URLs where required, and delete media per a retention policy. Do not expose public permanent media links by default.
6. **Implement server-side jobs.** Submit scheduled work to a durable queue, use idempotency keys, rate-limit by provider/account, retry transient errors with backoff, surface terminal errors, and keep per-platform results for partially successful cross-posts. The browser only creates/monitors jobs.
7. **Add inbound data and webhooks.** Verify webhook signatures, deduplicate events, persist consent/opt-out evidence, sync comments and WhatsApp messages, and provide a human escalation queue for bot-driven WhatsApp support.
8. **Add analytics from provider responses.** Store only authorized metrics that each API actually exposes. Show source and collection time; do not compare incompatible definitions as if they were identical.
9. **Security and operations review.** Add tenant authorization checks, secret redaction, audit logs, deletion/export workflows, data retention, rate-limit observability, webhook retry monitoring, backup/restore, and provider-specific abuse controls.

## Browser/offline constraints

- IndexedDB can retain structured local records and binary attachments for offline use, but browser storage is device/profile-local and can be cleared or evicted. Exported backups are the portability mechanism until a backend exists.
- A service worker can cache the shell and defer some work, but the browser may terminate it and background APIs are not universal. A static GitHub Pages app cannot reliably wake at a scheduled time to publish to a provider.
- Reliable publishing needs a server clock, durable job queue, account credentials, and provider API access. The local app deliberately turns due items into an outbox action instead of implying delivery.

Sources: [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB), [Offline and background PWA operation](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation), [Background Sync API](https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API), [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).

## Research note

Tavily was requested for web research, but its connector returned a reauthentication requirement in this environment. Official provider and browser documentation was checked through the available web-search fallback. Direct requests to some Meta developer pages were rate-limited; therefore Facebook's precise permission names and access review should be revalidated from the current official console/docs before implementation. This document avoids treating the local samples or platform access as live integrations.
