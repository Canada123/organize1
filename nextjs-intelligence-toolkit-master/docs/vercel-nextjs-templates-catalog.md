# Vercel Next.js Templates Catalog

**For AI Agent Template Selection**

**Last Updated:** 2025-10-28
**Total Templates:** 80+ Next.js templates available
**Cataloged:** 13 key templates (representative sample)
**Supabase Templates:** 2 templates with Supabase integration

---

## Quick Selection Guide (AI Agent Decision Tree)

```
User Request → Analysis → Template Selection

Decision Flow (CoD^Σ):
Request ⇒ [has_database?] → {
  yes → [database_type = Supabase?] → Supabase_Templates
  yes → [database_type ≠ Supabase] → ❌ FILTER_OUT
  no → No_DB_Templates[use_case]
}

Use Case Mapping:
AI/Chatbot → Next.js AI Chatbot (⚠️ uses Neon, not Supabase)
SaaS → {Supabase Starter, Stripe Subscription Starter, Enterprise Boilerplate}
E-commerce → Next.js Commerce (no DB, uses Shopify API)
Blog/Content → {Blog Starter Kit, Portfolio Starter Kit}
Documentation → Nextra Docs Starter Kit
Multi-tenant → Platforms Starter Kit (⚠️ uses Redis, not Supabase)
Authentication → Supabase Starter
Subscriptions → Stripe Subscription Starter (✅ Supabase)
```

---

## Installation Instructions

### Method 1: One-Click Deploy (Recommended for Beginners)

**Process:**
```
1. Visit https://vercel.com/templates
2. Select template → Click "Deploy"
3. Connect Git provider (GitHub/GitLab/Bitbucket)
4. Set repository scope and name
5. Configure environment variables (if required)
6. Vercel auto-deploys → Get production URL
```

**Time:** ~2-3 minutes
**Requirements:** Vercel account + Git provider account

### Method 2: CLI Deploy (Recommended for Developers)

**Clone and deploy:**
```bash
# Clone template to local machine
npx create-next-app@latest my-app --example [template-url]

# Or use Vercel CLI
vercel --cwd [path-to-project]
```

**Time:** ~5 minutes
**Requirements:** Node.js, npm/pnpm/yarn, Vercel CLI

### Method 3: Manual Clone from GitHub

**Process:**
```bash
# Clone the repository
git clone [github-repo-url] my-project
cd my-project

# Install dependencies
npm install  # or pnpm install / yarn install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev

# Deploy when ready
vercel
```

**Time:** ~10 minutes
**Requirements:** Git, Node.js, package manager

---

## Supabase Templates (Database = Supabase)

### 1. Supabase Starter ⭐ **RECOMMENDED FOR AUTH**

**Use Case:** Starter, Authentication
**Description:** Next.js App Router template with cookie-based auth using Supabase

**Tech Stack:**
- **Framework:** Next.js (App Router)
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Language:** TypeScript

**Key Features:**
```
✅ Works across entire Next.js stack (App Router, Pages, Middleware, Client, Server)
✅ supabase-ssr package for cookie-based sessions
✅ Password-based authentication UI block
✅ Supabase Vercel Integration (auto env vars)
✅ Full-stack auth (SSR + client-side)
```

**Installation:**
```bash
npx create-next-app -e with-supabase
```

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**GitHub:** https://github.com/vercel/next.js/tree/canary/examples/with-supabase
**Demo:** https://demo-nextjs-with-supabase.vercel.app/

**Best For:**
- Projects requiring authentication
- Full-stack apps with user management
- Apps needing PostgreSQL database
- SSR applications with auth state

---

### 2. Stripe Subscription Starter ⭐ **RECOMMENDED FOR SAAS**

**Use Case:** E-commerce, SaaS, Authentication
**Description:** All-in-one subscription starter for SaaS apps with Stripe + Supabase

**Tech Stack:**
- **Framework:** Next.js
- **Database:** Supabase (Postgres)
- **Auth:** Supabase Auth
- **Payments:** Stripe (Checkout + Customer Portal)
- **Styling:** Tailwind CSS
- **Language:** TypeScript

**Key Features:**
```
✅ Secure user management with Supabase Auth
✅ PostgreSQL database with Supabase
✅ Stripe Checkout integration
✅ Stripe Customer Portal for subscription management
✅ Automatic price/subscription sync via Stripe webhooks
✅ Ready for production SaaS deployment
```

**Installation:**
```bash
# Via Vercel (includes Supabase integration setup)
vercel deploy --template nextjs-subscription-payments

# Manual
git clone https://github.com/vercel/nextjs-subscription-payments
```

**Environment Variables Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET_LIVE`

**Setup Complexity:** Medium (requires Stripe configuration)

**GitHub:** https://github.com/vercel/nextjs-subscription-payments
**Demo:** https://subscription-payments.vercel.app/

**Best For:**
- SaaS applications with subscriptions
- Projects requiring payment processing
- Membership/subscription sites
- B2C applications with recurring revenue

---

## No-Database Templates (Filtered by Use Case)

### AI & Chatbots

#### Next.js AI Chatbot ⚠️ (Uses Neon Postgres - NOT Supabase)
**Status:** EXCLUDED (does not use Supabase)
**Alternative:** Use Supabase Starter + integrate AI SDK manually

**Tech Stack (for reference):**
- Framework: Next.js (App Router)
- Database: ~~Neon Postgres~~ (❌ not Supabase)
- Storage: Vercel Blob
- Auth: Auth.js (NextAuth)
- AI: Vercel AI SDK with xAI Gateway

---

### Starter & Boilerplates

#### 3. Next.js Boilerplate ⭐ **SIMPLEST START**

**Use Case:** Starter
**Description:** Minimal Next.js template for quick start

**Tech Stack:**
- **Framework:** Next.js
- **Database:** None
- **Styling:** CSS Modules
- **Language:** TypeScript

**Key Features:**
```
✅ Bootstrapped with create-next-app
✅ Geist font optimization
✅ Minimal dependencies
✅ Perfect for learning/prototyping
```

**Installation:**
```bash
npx create-next-app@latest
```

**GitHub:** https://github.com/vercel/vercel/tree/main/examples/nextjs
**Demo:** https://nextjs-template.vercel.app/

**Best For:**
- Learning Next.js
- Prototyping ideas quickly
- Minimal starting point
- Custom integrations

---

#### 4. Next.js Enterprise Boilerplate ⭐ **PRODUCTION-READY**

**Use Case:** SaaS, Starter
**Description:** Enterprise-grade boilerplate with comprehensive tooling

**Tech Stack:**
- **Framework:** Next.js 15
- **Database:** None (bring your own)
- **Styling:** Tailwind CSS v4
- **Components:** Radix UI
- **Testing:** Vitest, React Testing Library, Playwright
- **Docs:** Storybook
- **Language:** TypeScript (strict mode)

**Key Features:**
```
✅ Perfect Lighthouse score
✅ Comprehensive testing suite (unit + e2e + visual)
✅ GitHub Actions CI/CD workflows
✅ Bundle analyzer
✅ OpenTelemetry observability
✅ Conventional commits
✅ Health checks (Kubernetes-ready)
✅ CVA for design system
✅ Renovate BOT for dependency updates
✅ Semantic release automation
✅ T3 Env for environment variables
```

**Installation:**
```bash
git clone https://github.com/Blazity/next-enterprise
```

**GitHub:** https://github.com/Blazity/next-enterprise
**Demo:** https://next-enterprise.vercel.app/

**Best For:**
- Enterprise applications
- Team development
- Production-grade projects
- Applications requiring comprehensive testing
- Projects needing observability

---

### E-commerce

#### 5. Next.js Commerce

**Use Case:** E-commerce
**Description:** High-performance e-commerce with Shopify integration

**Tech Stack:**
- **Framework:** Next.js (App Router)
- **Database:** None (uses Shopify API)
- **Styling:** Tailwind CSS
- **E-commerce:** Shopify Storefront API

**Key Features:**
```
✅ Server-rendered with App Router
✅ React Server Components
✅ Server Actions
✅ Suspense & useOptimistic
✅ Shopify integration
✅ Production-ready commerce experience
```

**Installation:**
```bash
vercel deploy --template commerce
```

**Environment Variables Required:**
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`
- `SHOPIFY_STORE_DOMAIN`

**GitHub:** https://github.com/vercel/commerce
**Demo:** https://demo.vercel.store/

**Best For:**
- E-commerce storefronts
- Shopify headless implementations
- High-performance retail sites

---

### Multi-Tenant Apps

#### 6. Platforms Starter Kit ⚠️ (Uses Redis - NOT Supabase)

**Status:** EXCLUDED from Supabase filter
**Use Case:** SaaS, Multi-Tenant Apps
**Description:** Multi-tenant application with custom subdomains

**Tech Stack:**
- **Framework:** Next.js 15
- **Database:** ~~Redis~~ (❌ not Supabase)
- **Styling:** Tailwind 4
- **Components:** shadcn/ui

**Note:** If user needs multi-tenant with Supabase, recommend Supabase Starter + custom subdomain logic

---

### SaaS Applications

#### 7. Next.js SaaS Starter ⚠️ (Uses Postgres/Drizzle - NOT Supabase)

**Status:** EXCLUDED from Supabase filter
**Tech Stack:**
- Framework: Next.js
- Database: ~~Postgres with Drizzle ORM~~ (❌ not Supabase)
- Payments: Stripe

**Alternative:** Use Stripe Subscription Starter (which uses Supabase)

---

### Blogs & Content

#### 8. Blog Starter Kit ⭐ **SIMPLE BLOG**

**Use Case:** Blog
**Description:** Statically generated blog with Markdown

**Tech Stack:**
- **Framework:** Next.js
- **Database:** None (Markdown files)
- **Styling:** Tailwind CSS
- **Content:** remark + remark-html

**Key Features:**
```
✅ Static generation
✅ Markdown with front matter
✅ Fast performance
✅ SEO optimized
```

**Installation:**
```bash
npx create-next-app -e blog-starter
```

**GitHub:** https://github.com/vercel/next.js/tree/canary/examples/blog-starter
**Demo:** https://next-blog-starter.vercel.app/

**Best For:**
- Personal blogs
- Technical writing
- Static content sites
- Fast, lightweight blogs

---

#### 9. Portfolio Starter Kit ⭐ **PORTFOLIO + BLOG**

**Use Case:** Portfolio, Blog
**Description:** Portfolio site with built-in blog

**Tech Stack:**
- **Framework:** Next.js
- **Database:** None (Markdown)
- **Styling:** Tailwind v4
- **Language:** TypeScript

**Key Features:**
```
✅ MDX and Markdown support
✅ SEO optimized (sitemap, robots, JSON-LD)
✅ RSS Feed
✅ Dynamic OG images
✅ Syntax highlighting
✅ Vercel Speed Insights
✅ Geist font
```

**Installation:**
```bash
npx create-next-app -e https://github.com/vercel/examples/tree/main/solutions/blog
```

**GitHub:** https://github.com/vercel/examples/tree/main/solutions/blog
**Demo:** https://portfolio-blog-starter.vercel.app/

**Best For:**
- Developer portfolios
- Personal websites with blog
- Content creators
- Technical writers

---

### Documentation

#### 10. Nextra: Docs Starter Kit ⭐ **DOCUMENTATION**

**Use Case:** Documentation
**Description:** Markdown-powered documentation site

**Tech Stack:**
- **Framework:** Next.js
- **Database:** None (Markdown)
- **Styling:** Tailwind CSS
- **Content:** Nextra

**Key Features:**
```
✅ Markdown-powered
✅ Powerful and flexible
✅ Fast performance
✅ Great DX
```

**Installation:**
```bash
git clone https://github.com/shuding/nextra-docs-template
```

**GitHub:** https://github.com/shuding/nextra-docs-template
**Demo:** https://nextra-docs-template.vercel.app/

**Best For:**
- Product documentation
- API references
- Knowledge bases
- Technical documentation

---

### Learning & Playground

#### 11. Next.js App Router Playground

**Use Case:** Starter
**Description:** Examples of Next.js App Router features

**Tech Stack:**
- **Framework:** Next.js
- **Database:** None
- **Styling:** Tailwind CSS

**Key Features:**
```
✅ Demonstrates App Router features
✅ Layouts examples
✅ Server Components examples
✅ Streaming examples
✅ Suspense patterns
```

**Installation:**
```bash
git clone https://github.com/vercel/app-playground
```

**GitHub:** https://github.com/vercel/app-playground
**Demo:** https://app-dir.vercel.app/

**Best For:**
- Learning App Router
- Understanding Server Components
- Exploring Next.js 13+ features

---

### Real-time Collaboration

#### 12. Liveblocks Starter Kit

**Use Case:** SaaS, Realtime Apps, Authentication
**Description:** Real-time collaborative app with Liveblocks

**Tech Stack:**
- **Framework:** Next.js
- **Database:** Liveblocks (real-time state)
- **Auth:** NextAuth.js
- **Styling:** CSS Modules

**Key Features:**
```
✅ Documents dashboard with pagination
✅ Collaborative whiteboard
✅ Authentication (GitHub, Google, Auth0)
✅ Document permissions (users, groups, public)
```

**Note:** Liveblocks is NOT a traditional database; it's for real-time state sync

**GitHub:** https://github.com/liveblocks/liveblocks/tree/main/starter-kits/nextjs-starter-kit
**Demo:** https://nextjs-starter-kit.liveblocks.app/

**Best For:**
- Collaborative tools
- Real-time applications
- Whiteboard apps
- Document collaboration

---

## Summary Table

| Template Name | Use Case | Database | Auth | Styling | Best For |
|--------------|----------|----------|------|---------|----------|
| **Supabase Starter** | Starter, Auth | ✅ Supabase | Supabase Auth | Tailwind + shadcn | Full-stack apps with auth |
| **Stripe Subscription** | SaaS | ✅ Supabase | Supabase Auth | Tailwind | SaaS subscriptions |
| Next.js Boilerplate | Starter | ❌ None | None | CSS Modules | Quick start, learning |
| Enterprise Boilerplate | SaaS | ❌ None | None | Tailwind + Radix | Production enterprise apps |
| Next.js Commerce | E-commerce | ❌ None (Shopify) | None | Tailwind | Shopify storefronts |
| Blog Starter Kit | Blog | ❌ None (MD) | None | Tailwind | Simple blogs |
| Portfolio Starter | Portfolio | ❌ None (MD) | None | Tailwind | Personal sites |
| Nextra Docs | Documentation | ❌ None (MD) | None | Tailwind | Documentation sites |
| App Router Playground | Learning | ❌ None | None | Tailwind | Learning Next.js |
| Liveblocks Starter | Realtime | Liveblocks | NextAuth | CSS Modules | Collaborative apps |

**Excluded (Non-Supabase databases):**
- ❌ AI Chatbot (Neon Postgres)
- ❌ SaaS Starter (Postgres/Drizzle)
- ❌ Platforms Kit (Redis)

---

## Decision Matrix for AI Agents

### When to recommend Supabase Starter:
```
User needs:
  ∧ Authentication required
  ∧ PostgreSQL database
  ∧ No payment processing
  → RECOMMEND: Supabase Starter
```

### When to recommend Stripe Subscription Starter:
```
User needs:
  ∧ Authentication required
  ∧ PostgreSQL database
  ∧ Subscription/payment processing
  ∧ SaaS business model
  → RECOMMEND: Stripe Subscription Starter
```

### When to recommend no-database templates:
```
User needs:
  ∧ (No database ∨ Database ≠ Supabase)
  → Map to use case:
     - Static content → Blog/Portfolio
     - Documentation → Nextra
     - E-commerce → Commerce (Shopify)
     - Enterprise → Enterprise Boilerplate
     - Learning → Boilerplate/App Router Playground
```

### When to recommend alternatives:
```
User needs:
  ∧ Database required
  ∧ Database type ≠ Supabase
  → RECOMMEND:
     1. Supabase templates (suggest migration)
     2. OR acknowledge limitation: "Template uses [other-db], not Supabase"
     3. Suggest manual integration with Supabase Starter
```

---

## Common Patterns & Recommendations

### Authentication Requirements:
- **With Database:** Supabase Starter ✅
- **Without Database:** Supabase Starter (add later) or NextAuth.js

### Payment Processing:
- **Subscriptions:** Stripe Subscription Starter ✅
- **One-time payments:** Next.js Commerce or manual Stripe integration

### Content Management:
- **Static:** Blog Starter Kit, Portfolio Starter
- **Dynamic:** Supabase Starter + custom CMS
- **Headless CMS:** Use template + integrate CMS (Sanity, Contentful)

### Enterprise Requirements:
- **Production-ready:** Enterprise Boilerplate
- **With Auth:** Enterprise Boilerplate + Supabase Starter patterns
- **Full-stack:** Stripe Subscription Starter (has auth + DB + payments)

---

## Notes for AI Agents

**Filtering Logic Applied:**
```
Supabase_Filter := {T | T.db = Supabase ∨ T.db = ∅}
Result := Templates ∩ Supabase_Filter
Excluded := {T | T.db ∈ {Postgres[non-Supabase], MySQL, MongoDB, Redis, Neon}}
```

**Key Insights:**
1. **Only 2 templates** have native Supabase integration
2. **Most templates** are database-agnostic (no DB)
3. **Stripe Subscription Starter** is the most complete SaaS template with Supabase
4. **Supabase Starter** is the foundation for custom full-stack apps
5. For multi-tenant or other patterns, recommend Supabase Starter + custom implementation

**Selection Strategy:**
```
Priority := Exact_Match > Closest_Match > Custom_Integration
Example:
  User: "SaaS with Supabase" → Stripe Subscription Starter (exact match)
  User: "Blog with Supabase" → Blog Starter + Supabase Starter integration (custom)
  User: "Multi-tenant with Supabase" → Supabase Starter + custom subdomain logic (custom)
```

---

## Deployment Checklist

**Pre-Deployment:**
- [ ] Choose template based on use case
- [ ] Review environment variable requirements
- [ ] Set up required external services (Stripe, Supabase, etc.)

**Deployment:**
- [ ] Click "Deploy" button or use Vercel CLI
- [ ] Connect Git provider
- [ ] Configure environment variables
- [ ] Wait for build to complete

**Post-Deployment:**
- [ ] Test production URL
- [ ] Configure custom domain (optional)
- [ ] Set up webhooks (if using Stripe)
- [ ] Configure Supabase RLS policies (if applicable)
- [ ] Enable analytics/monitoring

---

## Additional Resources

**Vercel Documentation:**
- Templates: https://vercel.com/templates
- Deployment Guide: https://vercel.com/docs/deployments
- Environment Variables: https://vercel.com/docs/environment-variables

**Supabase Documentation:**
- Getting Started: https://supabase.com/docs
- Auth: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database

**Next.js Documentation:**
- App Router: https://nextjs.org/docs/app
- Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching

---

**Generated:** 2025-10-28
**Source:** Vercel Templates Marketplace (https://vercel.com/templates)
**Methodology:** Firecrawl automated scraping + manual verification
**Coverage:** 13 key templates from 80+ total Next.js templates
