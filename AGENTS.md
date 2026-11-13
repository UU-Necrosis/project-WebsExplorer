# Agent Guidance: Visitor Roles

## Role definitions

- **Guest** means an unauthenticated, unknown visitor. Guests may browse public discovery pages and access sign-up or login.
- **User** means a visitor with a customer account who has successfully signed in. User-only pages include the member home, profile, and website submission.
- **Admin** is a separate role. An admin session must never be treated as a customer User session.

## Authentication and routing

- Use `AuthContext` as the frontend source of truth: `isUserLoggedIn` is based on `customer_token`; `isAdminLoggedIn` is based on `admin_token`.
- Keep customer-only routes behind `UserLayout` and admin-only routes behind `AdminLayout`.
- Keep API-backed submission data out of Guest routes; `ClientSubmissionProvider` is scoped to authenticated layouts, and only Admin sessions load the submission and saved-site lists.
- The root route is public: show the Guest landing page when there is no customer session and the User home when a customer is signed in.
- Guest browsing and auth routes remain public. Do not expose account-only features to Guests.
- Customer login and sign-up must call `loginCustomer`; writing a token to local storage alone does not update React auth state.
- Do not infer customer authentication from an admin token or from a display name/account record.
- Frontend route guards improve navigation but do not replace backend authorization; protected API operations must validate the appropriate token server-side.

## Design themes

- Client-facing experience should follow the dark, high-trust telemetry direction: `Apex Alpine Telemetry` and `Telemetry Trust`.
- Admin-facing experience should follow `Admin System one`: a light, clean operational dashboard style with soft off-white surfaces, emerald accents, crisp boundaries, and strong readability for moderation and analytics workflows.
- Keep the theme consistent by using the app-level theme tokens in `frontend/src/index.css` and wrapping pages in the matching `data-theme` value (`client` for customer pages, `admin`/`admin-auth` for admin pages as applicable).
- Do not mix the admin light palette into customer pages or the client dark telemetry palette into admin pages.

## Full design system reference (source of truth)

### 1) Client theme: Apex Alpine Telemetry / Telemetry Trust

This is the visual language for all customer-facing pages. It is dark, premium, and technical, with a forensic / verification feel.

#### Brand and style
- The design targets an authoritative, high-trust telemetry experience for digital customers, enterprise evaluators, and financial-service buyers.
- The aesthetic blends dark technical minimalism with refined glassmorphism and restrained green luminescence.
- The interface is defined by deep navy-slate backdrops, precise data density, and low-glare surfaces to emphasize trust, transparency, and confidence.

#### Color system
- Base canvas: deep midnight slate (`#0a0e17`, `#0f131c`, `#0f131b`)
- Surface layers: translucent slate and glass cards (`rgba(16, 24, 39, 0.72)`, `rgba(19, 27, 38, 0.7)`, `rgba(23, 33, 54, 0.85)`)
- Primary accent: verification emerald (`#00b67a`, `#4edf9f`, `#10b981`)
- Secondary accent: mint / teal (`#10b981`, `#4edea3`)
- Tertiary accent: technical cyan (`#38bdf8`, `#7bd0ff`)
- Neutral text: `#dfe2ef`, `#dfe2ed`, `#e2e8f0`
- Muted text: `#bbcabf`, `#bdc8d1`, `#94a3b8`
- Outlines: `rgba(255, 255, 255, 0.08)` and `rgba(255, 255, 255, 0.12)`
- Warning / critical states: amber (`#f59e0b`, `#ffb4ab`) and crimson (`#ef4444`, `#dc2626`)
- Active / focus glow: `rgba(0, 182, 122, 0.25)` and `rgba(0, 182, 122, 0.45)`

#### Typography
- Headlines: `Space Grotesk` for titles, section labels, and strong brand statements
- Body copy: `Inter` for readable narrative copy and general interface text
- Quantitative telemetry: `JetBrains Mono` for performance numbers, star scores, timestamps, counts, and verification metadata
- Core hierarchy should feel precise, technical, and structured, not playful or decorative

#### Layout and spacing
- Use a strong 12-column desktop grid, 8-column tablet grid, and 4-column mobile grid
- Desktop gutters: 24px; mobile gutters: 16px; desktop margins: 48px
- Vertical rhythm follows an 8px baseline system with tight but breathable spacing
- Use generous but controlled density for dashboard, discovery, and marketplace surfaces

#### Elevation and depth
- Base surfaces are dark, flat, and subtle
- Cards sit on translucent glass layers with `backdrop-filter: blur(16px)` to `blur(24px)`
- Borders are fine hairlines rather than heavy shadows
- Active states use emerald glow and inner illumination, not loud primary colors
- Layers should feel premium, technical, and stable

#### Shapes
- Standard controls: 8px radius (`0.5rem`)
- Structural cards and panels: 16px radius (`1rem`)
- Large panels and modals: 24px radius (`1.5rem`)
- Pills and badges: full round `9999px`
- Micro UI should stay sharp and controlled rather than bubbly

#### Client component patterns
- Primary buttons: solid emerald fill, dark text, minimal glow, constrained hover animation
- Secondary buttons: dark glass surfaces, white text, soft border, subtle hover shift
- Search and discovery bars: elevated glass card with split fields and luminous focus border
- Verified trust badges and star telemetry: emerald-filled states and precise numeric labels
- Review cards: slate cards with nested metadata and subtle verification strips
- Category pills: dark rounded pills with softer emerald active state
- Inputs: dark recessed field surfaces with emerald focus state and light text

### 2) Admin theme: Admin System one

This is the system for admin dashboards, moderation tools, and operational workflows. It is light, crisp, and readable.

#### Brand and style
- The admin experience is clean, modern, and operationally precise.
- It balances institutional authority with clear decision-making, low-strain viewing, and easy scanning during long sessions.
- It should feel calm, disciplined, and highly readable rather than dark or dramatic.

#### Color system
- Base canvas: soft off-white (`#f8fafc`)
- Surface elevation: pure white (`#ffffff`)
- Surface containers: pale lilac / blue-gray (`#f2f3ff`, `#eaedff`, `#e2e7ff`, `#dae2fd`)
- Primary accent: emerald (`#059669`, `#10b981`)
- Secondary accent: deep teal (`#0d9488`, `#006a61`)
- Tertiary accent: indigo (`#2563eb`, `#0051d5`)
- Borders / dividers: `#e2e8f0`, `#cbd5e1`
- Text: `#0f172a`, `#131b2e`, `#334155`, `#64748b`
- Success / verified: emerald surface with light-fill backgrounds
- Warning: amber / honey fill
- Critical: crimson / warm red fill

#### Typography
- Unified typography is mostly `Space Grotesk` for strong headings and labels
- The admin system emphasizes legibility and rapid scanning for metrics, IDs, statuses, and tables
- Headings and action labels should be crisp and structured, with strong contrast on white surfaces

#### Layout and spacing
- Admin layouts use a fixed 12-column desktop system with sidebar + operational workspace
- Mobile stacks into compact single-column cards
- Tablet uses 8 columns and narrower gutters
- Spacing follows a 4px/8px scale, with generous whitespace in cards and toolbars

#### Elevation and depth
- Light-first surfaces dominate the interface
- Cards are flat but separated by thin borders and minimal shadow
- Elevation is subtle and architectural rather than dramatic
- Visual hierarchy comes from spacing and contrast, not glow-heavy effects

#### Shapes
- Default controls: 8px radius (`0.5rem`)
- Cards and metric panels: 16px radius (`1rem`)
- Larger modals and drawers: 24px radius (`1.5rem`)
- Status chips and badges: `9999px`

#### Admin component patterns
- Primary action buttons: emerald fill with white text and clear hover states
- Secondary actions: white background, subtle borders, neutral text
- Chips and badges: green for verified, amber for pending, red for action required
- Tables: header rows, clear dividers, numeric alignment, and hover-state highlight
- Search inputs: crisp white surfaces, clear borders, emerald focus ring
- Moderation and triage panels: flat cards with strong action grouping

### 3) Global rules for both themes

- Use the correct theme for the correct area: customer pages stay dark, admin pages stay light
- The dark client theme should feel premium, high-trust, and minimal; it should never feel bright or over-designed
- The admin theme should feel controlled, calm, and operational; it should never feel like a consumer app
- Buttons, badges, surfaces, and input states should align to the theme’s palette and spacing rules
- Prefer consistent tokens from `frontend/src/index.css` over ad hoc color choices
- If a new page is created, match the correct theme with the appropriate `data-theme` value and keep all styling within that system

### 4) Practical implementation rule

- Customer-facing flows: use `data-theme="client"`
- Admin auth / admin light surfaces: use `data-theme="admin-auth"` or `data-theme="admin"`
- Do not create a mixed palette across one page; one page should use one visual system only
- Theme decisions belong to the overall product system, not individual pages
