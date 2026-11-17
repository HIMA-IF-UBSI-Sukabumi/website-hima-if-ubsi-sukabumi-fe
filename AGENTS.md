# AGENTS.md

Guidelines for AI coding agents working on **website-hima-if-ubsi-sukabumi-fe** (Official Website of HIMA-IF UBSI PSDKU Sukabumi).

---

## 1. Tech Stack

- **Framework**: Next.js 16 (App Router, `reactCompiler: true`, `output: "standalone"`)
- **Language**: TypeScript (`strict: true`, path alias `@/*` → `./src/*`)
- **UI & Styling**: React 19, Tailwind CSS v4 (`@tailwindcss/postcss`, `@tailwindcss/typography`), `clsx` + `tailwind-merge` (`cn()`), `react-icons`, `nextjs-toploader`, `gsap` / `@gsap/react`
- **Data Fetching & State**: `@tanstack/react-query`, `axios`, `zustand`, `react-hook-form`, `zod`
- **Linting**: ESLint 9 (`eslint-config-next/core-web-vitals`, `eslint-config-next/typescript`)

---

## 2. Project Structure

```text
├── .docs/                      # Backend/API integration docs (e.g., Elections, NGL, SSO)
├── .agents/skills/             # Installed agent skills (React, Next.js, UI/UX guidelines)
├── ops/                        # Deployment config (Dockerfile)
├── public/assets/              # Static assets & logos (.webp)
└── src/
    ├── app/                    # Next.js App Router (thin route & metadata layer)
    │   ├── (portal)/           # Main portal routes (/, /about, /activity, /department, /project)
    │   ├── (news)/news-hub/    # News routes (mapped to `news.` subdomain)
    │   ├── (certificate)/      # Certificate preview & verification (/certificates/[code])
    │   ├── (forms)/f/          # Shortlink form routes (/f/[shortlink])
    │   ├── globals.css         # Tailwind v4 theme tokens & dark mode variant
    │   ├── layout.tsx          # Root layout, theme init script, Providers, NextTopLoader
    │   ├── not-found.tsx
    │   ├── robots.ts
    │   └── sitemap.ts
    ├── modules/                # Feature modules (portal, news, certificates, etc.)
    │   └── <module>/
    │       ├── components/     # Module-specific UI components (PascalCase.tsx)
    │       ├── pages/          # Page components (*.page.tsx) & sections (pages/section/<page>/*.tsx)
    │       └── services/api/   # Axios service functions & TypeScript interfaces (*.service.ts)
    ├── core/                   # Shared app infrastructure
    │   ├── components/         # Shared UI primitives (e.g., modal/base.modal.tsx)
    │   ├── hooks/              # Shared hooks (use-axios.ts, use-debounce.ts, use-modal.ts)
    │   └── services/           # Base request builders & pagination types (base.service.ts)
    ├── components/             # App-level components (providers.tsx, theme-toggle.tsx)
    ├── constants/              # Static domain data (bph.ts, department.ts)
    ├── lib/                    # Utilities (utils.ts, queryClient.ts, subdomain.ts)
    └── proxy.ts                # Subdomain routing & rewrite/redirect proxy
```

---

## 3. Architecture & Coding Conventions

### App Router vs. Modules
- Keep `src/app/**/page.tsx` **thin**: only export `metadata` / `generateMetadata` and render a `Module*Page` component from `src/modules/<module>/pages/`.
- Place all feature logic, page sections, components, and API services inside `src/modules/<module>/`.
- Use `src/core/` only for truly cross-module primitives, hooks, and service helpers.

### File & Symbol Naming
- **Module pages**: `kebab-case.page.tsx` (e.g., `landing.page.tsx`, `news-detail.page.tsx`), exporting `Module<Domain><Name>Page`.
- **Page sections**: `src/modules/<module>/pages/section/<page>/<section>.<page>.tsx` (e.g., `hero.landing.tsx`, `bph.about.tsx`).
- **Components**: `PascalCase.tsx` (e.g., `CardEvent.tsx`, `NewsNavbar.tsx`).
- **Services**: `kebab-case.service.ts` (e.g., `event.service.ts`), exporting a `<domain>Service` object and response/request TypeScript interfaces.
- **Hooks**: `use-kebab-case.ts` (e.g., `use-axios.ts`).

### API & Data Fetching
- **Client-side fetching**:
  - Use `useAxios()` (or `useAxiosWithCustomResponseInterceptor`) from `@/core/hooks/use-axios` with `@tanstack/react-query` (`useQuery` / `useMutation`).
  - Define API endpoints in `src/modules/<module>/services/api/*.service.ts` using helpers from `@/core/services/base.service` (`simpleRequest`, `simpleParamsRequest`, `simpleBodyRequest`, `simpleParamsBodyRequest`, `withEndpoint`, `withParamsEndpoint`).
  - Note `src/lib/queryClient.ts` sets `refetchOnMount: false`, `refetchOnWindowFocus: false`, `refetchOnReconnect: false`, `retry: false`, and `refetchInterval: 60000`. Override per-query only when needed.
- **Server-side fetching (e.g., `generateMetadata`)**:
  - Use native `fetch` with `process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL` and Next.js `next: { revalidate }` options.
- **Storage & Image URLs**:
  - Always resolve backend image paths with `resolveImageUrl()` or `getStorageUrl()` from `@/lib/utils` instead of concatenating env vars manually.

### Subdomain Routing (`src/proxy.ts` & `src/lib/subdomain.ts`)
- `SUBDOMAIN_ROUTES` maps public subdomains to internal App Router folders (currently `news` → `news-hub`).
- Requests to `/news-hub/*` on the main host are redirected to `news.<domain>/*` (or `news.localhost:3000/*` locally); requests on `news.<domain>/*` are rewritten internally to `/news-hub/*`.
- Always use `getNewsUrl()` or `getSubdomainUrl()` from `@/lib/utils` when linking to subdomain routes. Do not hardcode `/news-hub` or domain hostnames.

### Styling & Theme
- Tailwind CSS v4 is configured in `src/app/globals.css` using `@theme` tokens (`--font-poppins`, `--font-archivo`, `--color-primary`, `--color-secondary`, `--color-tertiary`, `--color-black`, `--color-smoky`). Prefer these theme tokens over arbitrary hex values.
- Use `cn()` from `@/lib/utils` to merge conditional class names.
- Dark mode uses class-based toggling (`.dark` on `<html>`, persisted under `localStorage` key `'himaif-theme'`). Ensure new UI components support both light and dark modes.
- User-facing copy, metadata, and date formatting (`id-ID` locale via `formatTimestamp` / `formatDate` in `@/lib/utils`) are in **Indonesian**.

### Environment Variables
- Refer to `.env.example`: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_STORAGE_URL`, `NEXT_PUBLIC_SITE_URL`, and server-only `API_URL`, `STORAGE_URL`.
- Never commit `.env.local` or hardcode environment-specific URLs or secrets.

---

## 4. Verification & Workflow

- **TypeScript**: Keep `strict: true` clean; avoid `any` (use typed interfaces in `*.service.ts`).
- **React Compiler**: `reactCompiler: true` is enabled in `next.config.ts`—follow standard Rules of React and avoid mutating props/state or impure render logic.
- **Checks**: After making code changes, run:
  - `bun run lint` (or `npm run lint`)
  - `bun run build` (or `npm run build`) when modifying routes, `next.config.ts`, `proxy.ts`, or shared types.
- **Docs & Skills**: Check `.docs/` for backend API specifications before implementing new integrations, and follow relevant skills in `.agents/skills/` when working on React/Next.js or UI/UX tasks.
