# Signal Copilot - AI Trading Terminal

## Project Overview

**Signal** (branded as "Signal" in marketing) is an AI-native trading workspace built on Next.js 16 (App Router) with React 19. The app combines conversational AI chat with real-time market data visualization in a resizable split-pane interface. Core value prop: AI finds setups, explains why they work, and backtests instantly with AWS automation.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui (New York style), Radix UI primitives, Framer Motion, Recharts, Vercel AI SDK, Supabase (PostgreSQL + Auth + Realtime), Stripe (billing/subscriptions).

## Documentation References

AI agents should reference these official documentation sources when working on specific features:

### Core Framework & Language
- **Next.js 16 App Router:** https://nextjs.org/docs/app
  - File-based routing: https://nextjs.org/docs/app/building-your-application/routing
  - Server & Client Components: https://nextjs.org/docs/app/building-your-application/rendering/server-components
  - API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- **React 19:** https://react.dev/blog/2024/04/25/react-19
- **TypeScript:** https://www.typescriptlang.org/docs/

### UI Components & Styling
- **shadcn/ui (New York style):** https://ui.shadcn.com
  - Installation: https://ui.shadcn.com/docs/installation/next
  - CLI usage: https://ui.shadcn.com/docs/cli
  - Components reference: https://ui.shadcn.com/docs/components
- **Radix UI Primitives:** https://www.radix-ui.com/primitives/docs/overview/introduction
  - DropdownMenu: https://www.radix-ui.com/primitives/docs/components/dropdown-menu
  - Dialog: https://www.radix-ui.com/primitives/docs/components/dialog
  - Tooltip: https://www.radix-ui.com/primitives/docs/components/tooltip
- **Tailwind CSS v4:** https://tailwindcss.com/docs
  - Dark mode: https://tailwindcss.com/docs/dark-mode
  - Theme configuration: https://tailwindcss.com/docs/theme
- **Lucide React Icons:** https://lucide.dev/guide/packages/lucide-react

### State & Data Management
- **next-themes (Dark mode):** https://github.com/pacocoursey/next-themes
- **React Context API:** https://react.dev/reference/react/useContext
- **react-resizable-panels:** https://github.com/bvaughn/react-resizable-panels

### Animation & Visualization
- **Framer Motion:** https://www.framer.com/motion/
  - Animation examples: https://www.framer.com/motion/examples/
- **Recharts:** https://recharts.org/en-US/api

### AI & API Integration
- **Vercel AI SDK:** https://sdk.vercel.ai/docs
  - Getting started: https://sdk.vercel.ai/docs/getting-started
  - AI/UI streaming: https://sdk.vercel.ai/docs/ai-sdk-ui/overview
  - Core concepts: https://sdk.vercel.ai/docs/ai-sdk-core
  - Providers: https://sdk.vercel.ai/providers
- **OpenAI API Reference:** https://platform.openai.com/docs/api-reference
  - Chat completions: https://platform.openai.com/docs/api-reference/chat
- **OpenRouter (API proxy):** https://openrouter.ai/docs

### Database & Backend
- **Supabase:** https://supabase.com/docs
  - Next.js integration: https://supabase.com/docs/guides/getting-started/quickstarts/nextjs
  - Auth: https://supabase.com/docs/guides/auth
  - Database: https://supabase.com/docs/guides/database
  - Realtime: https://supabase.com/docs/guides/realtime
  - Storage: https://supabase.com/docs/guides/storage
- **Supabase JavaScript Client:** https://supabase.com/docs/reference/javascript/introduction

### Payments & Billing
- **Stripe:** https://stripe.com/docs
  - Next.js integration: https://stripe.com/docs/payments/checkout/how-checkout-works
  - Webhooks: https://stripe.com/docs/webhooks
  - Subscriptions: https://stripe.com/docs/billing/subscriptions/overview
  - Customer portal: https://stripe.com/docs/customer-management/integrate-customer-portal
- **Stripe Node.js SDK:** https://stripe.com/docs/api?lang=node

### Form Handling
- **React Hook Form:** https://react-hook-form.com/get-started
- **Zod validation:** https://zod.dev

### Best Practices
- **Next.js Best Practices:** https://nextjs.org/docs/app/building-your-application/configuring/mdx
- **React Server Components:** https://react.dev/reference/rsc/server-components
- **TypeScript with React:** https://react.dev/learn/typescript

## Architecture Patterns

### Route Groups & Layouts
Three distinct route groups define the app structure:
- `(marketing)` - Public pages (landing, pricing, docs) with minimal layout
- `(auth)` - Login/signup/onboarding flows
- `(shell)` - Main app with sidebar + top nav + resizable panels (20/80 split)

**Critical:** The `(shell)` layout is client-side only (`"use client"`) and manages a complex ResizablePanel system. Left panel renders child routes (e.g., `/chat`), right panel uses query parameter navigation (`?view=screener`) to switch content while keeping left panel consistent.

**URL Patterns:**
- Right pane navigation uses query parameter: `/chat?view=screener`, `/chat?view=charts`, etc.
- Screener tabs also use query parameters: `/chat?view=screener&tab=Valuation&P/E=Under+15&Sector=Technology`
- Left panel route stays consistent (e.g., `/chat`, `/settings`) while right panel changes via `?view=` parameter
- All filters are reflected in URL for backend integration and shareable links

### Component Organization
```
components/
├── layout/          # Sidebar, TopNav, RightPaneContext
├── ui/              # shadcn/ui primitives (never edit directly)
├── theme-provider   # next-themes wrapper
└── theme-toggle     # Dark mode switcher
```

**shadcn/ui convention:** All `components/ui/*` are CLI-generated. To modify, extend in parent components or create variants. Use `npx shadcn@latest add <component>` to install new ones.

### State Management
No external state library. Uses React Context for cross-component concerns:
- `RightPaneContext` (`components/layout/right-pane-context.tsx`) - Manages right pane tool state (mode, heading, payload) in shell layout
- Theme handled by `next-themes` via `ThemeProvider`

**Pattern:** Chat page detects keywords in user input/assistant responses and calls `setToolState()` to update the right pane dynamically (e.g., "screener" → shows filtered stocks).

### Styling Philosophy
- **Tailwind v4** with CSS theme variables (`@theme inline` in `globals.css`)
- **New York style** from shadcn (rounded corners, subtle shadows)
- **Dark mode:** CSS variable overrides in `.dark` class
- **Spacing:** `px-3 py-2` for compact UI, `px-5 py-6` for content areas
- **Colors:** Neutral palette (neutral-50 to neutral-950) with semantic theme vars (--background, --foreground, --primary, etc.)

### Client vs Server Components
**Default:** Server Components (Next.js 16 App Router)  
**Use `"use client"` when:**
- State hooks (useState, useContext, useReducer)
- Event handlers (onClick, onChange, etc.)
- Browser APIs (localStorage, window, etc.)
- Third-party hooks (Framer Motion, next-themes)

**Example:** `TopNav` is client-side for notification state/dropdown interactions. Simple marketing pages are server-rendered.

## API Integration

### Chat API (`app/api/chat/route.ts`)
- **POST only** endpoint proxying to OpenAI-compatible providers
- Expects `{ model: string, messages: Array<{role, content}> }` body
- Auto-injects system prompt if missing (Signal Copilot persona)
- Returns `{ message: { role: "assistant", content: string } }`
- Error handling: Sanitizes upstream errors, returns 502 on provider failures
- **Vercel AI SDK:** Use for streaming responses and tool/function calling when implementing advanced features

**Environment vars:**
- `OPENAI_API_KEY` - Required (crashes with 500 if missing)
- `OPENAI_BASE_URL` - Optional (defaults to OpenAI, supports proxies like OpenRouter)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key (server-side only)
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key (client-side)

**Models used:** Frontend shows `signal-mini/core/pro/ultra` as branded tiers, but these map to real model IDs (e.g., `gpt-4o-mini`). Update `activeModel` state in `chat/page.tsx` if adding new models.

### Database (Supabase)
- **PostgreSQL database** for persistent data (users, chat history, saved searches, preferences)
- **Auth:** Email/password, OAuth (Google, GitHub), magic links
- **Realtime subscriptions** for live market data updates and collaborative features
- **Row Level Security (RLS)** policies to protect user data
- **Storage buckets** for user-uploaded files (charts, screenshots)

**Client patterns:**
- Server Components: Use `createClient()` from `@supabase/ssr` for server-side queries
- Client Components: Use `createBrowserClient()` for client-side queries
- API Routes: Use service role client for admin operations

### Stripe Billing
- **Subscription tiers:** Free (Mini), Core, Pro, Ultra (map to AI model access)
- **Checkout flow:** Use Stripe Checkout for new subscriptions
- **Customer portal:** Redirect users to Stripe portal for managing subscriptions
- **Webhooks:** Handle `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
- **Usage-based billing:** Track AI API usage for metered billing (optional)

### No Backend Database → Supabase Migration
~~Currently all data is mock/ephemeral (notification state, chat history sidebar). Chat messages live in component state. No persistence layer yet.~~

**Migration strategy:**
- Store chat messages in `messages` table with `user_id`, `conversation_id`, `role`, `content`, `created_at`
- Store user preferences in `user_settings` table
- Store notification history in `notifications` table
- Use Supabase Realtime for live updates (new messages, price alerts)

## Key File Patterns

### `page.tsx` Components
Each route exports a default function (no named exports). Use TypeScript with proper typing:
```tsx
export default function ChatPage() {
  // Client-side logic with hooks
}
```

### Form Handling
Use controlled inputs + `onSubmit` preventDefault pattern (see `chat/page.tsx` textarea). No React Hook Form yet (despite being in dependencies).

### TypeScript Paths
`@/*` imports from project root via `tsconfig.json` paths config. Always use absolute imports:
```tsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
```

## Developer Workflows

### Development
```bash
npm install          # First time setup
npm run dev          # Start dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint check
```

**Hot reload:** Next.js 16 fast refresh works for most changes. Restart dev server if layout/middleware changes don't reflect.

### Adding shadcn Components
```bash
npx shadcn@latest add <component-name>
```
Always check `components.json` config before adding (New York style, cssVariables: true).

### Environment Setup
Create `.env.local`:
```env
# OpenAI / AI Provider
OPENAI_API_KEY=sk-...
OPENAI_BASE_URL=https://api.openai.com/v1  # Optional

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

**Note:** Never commit `.env.local` to version control. Use `.env.example` for templates.

## Common Patterns to Follow

### Theme-Aware Styling
Use semantic color classes with dark mode variants:
```tsx
<div className="bg-white text-neutral-900 dark:bg-neutral-900 dark:text-white">
```

### Icon Usage
Lucide React icons imported individually:
```tsx
import { Bell, User, Sparkles } from "lucide-react";
```

### Dropdown Menus
Radix UI DropdownMenu pattern (see `top-nav.tsx` notifications):
- Trigger with `asChild` for custom button styling
- `align="end"` for right-aligned dropdowns
- `sideOffset={8}` for spacing from trigger

### Modal/Dialog Handling
No routing-based modals. Use Radix Dialog/Sheet components for overlays.

### Animation
Framer Motion for landing page only (marketing). Keep shell UI snappy (no heavy animations). Use Tailwind transitions for hover states.

## Trading-Specific Conventions

### Right Pane Tool Modes
Five modes defined in `right-pane-context.tsx`:
- `overview` - Default market snapshot
- `screener` - Filtered equity results
- `heatmap` - Sector rotation visualization
- `news` - Live catalyst tracker
- `alerts` - Risk monitors & automation queue

Each mode has `{ mode, heading, description, payload }` structure. Payload is type-flexible (array or object).

### Mock Data Strategy
All market data is currently hardcoded (see `chat/page.tsx` `detectToolFromInput` function). When real data integration happens, replace these payload objects but keep the state shape.

## What NOT to Do

- ❌ Don't edit `components/ui/*` files directly (they're CLI-managed)
- ❌ Don't add `"use client"` unless you need it (RSC by default)
- ❌ Don't use CSS modules or styled-components (Tailwind only)
- ❌ Don't import entire icon libraries (`import * from "lucide-react"`)
- ❌ Don't hardcode colors (use theme variables or Tailwind classes)
- ❌ Don't add global state lib unless absolutely necessary

## Debugging Tips

- **Hydration errors:** Check for browser-only logic in server components
- **Theme flashing:** ThemeProvider must wrap all layout content
- **API errors:** Check `.env.local` exists and dev server was restarted
- **ResizablePanel issues:** Ensure all panels have minSize and defaultSize props
- **Dark mode broken:** Verify `suppressHydrationWarning` on `<html>` tag

## Future Enhancements (Not Yet Implemented)

These are aspirational but not active:
- ~~Database integration (messages, user settings, saved searches)~~ → Supabase migration in progress
- ~~Authentication (Clerk/NextAuth)~~ → Using Supabase Auth
- ~~Billing/subscriptions~~ → Using Stripe
- Real-time WebSocket for market data (use Supabase Realtime)
- AWS Lambda automation hooks
- Real backtesting engine
- Vercel AI SDK streaming responses for chat

When implementing these, follow the existing patterns (Context for shared state, API routes for backend calls, client components for interactive features).
