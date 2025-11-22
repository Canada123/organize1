# Simple Blog Example - Next.js Intelligence Toolkit

**Example Type**: Simple Path Workflow
**Duration**: 15-30 minutes
**Complexity**: Low (Standard blog, no database, no auth)

---

## Overview

This example demonstrates the **simple path workflow** of the nextjs-project-setup skill. Perfect for:
- Personal blogs
- Portfolios with blog section
- Content-driven websites
- Learning projects

**What You'll Get**:
- Next.js 14+ Blog Starter Kit template
- Shadcn UI core components
- Basic Tailwind CSS design system
- Complete documentation

---

## Prerequisites

Before starting, ensure you have:
- ✅ Next.js Intelligence Toolkit installed (run setup.sh)
- ✅ Node.js 18+ installed
- ✅ Claude Code CLI available

---

## Step-by-Step Walkthrough

### Step 1: Navigate to Your Projects Directory

```bash
cd ~/projects  # Or wherever you keep your projects
mkdir my-blog
cd my-blog
```

### Step 2: Initialize with Claude Code

```bash
claude-code
```

### Step 3: Request Simple Blog Setup

Paste this prompt into Claude Code:

```
I want to set up a simple Next.js blog project.

Requirements:
- Personal blog
- Markdown content
- No database
- No authentication
- Simple design (use default templates)

Please set up the project using the nextjs-project-setup skill.
```

---

## Expected Workflow

Claude Code will execute the following steps automatically:

### 1. Complexity Assessment (5 seconds)

```
Analyzing requirements...

Simple Project Indicators:
✓ Standard website/blog
✓ No database required
✓ No custom authentication
✓ Single tenant
✓ Simple design requirements

Assessment: SIMPLE PATH (1/5 complex indicators)

Confirming with user: Is simple path appropriate? [yes]
```

### 2. Template Selection (2-3 minutes)

```
Phase 1: Template Selection
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [████░░░░] 12.5% (1/8 phases)

Using Vercel MCP to search templates...
Found: Blog Starter Kit
Installing: npx create-next-app@latest my-blog --example blog-starter

✓ Template installed successfully
✓ Dependencies installed (npm install)
✓ Project structure verified
```

### 3. Setup & Configuration (3-5 minutes)

```
Phase 2: Setup & Configuration
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [████████░] 25.0% (2/8 phases)

Creating environment variables...
✓ .env.local created

Configuring project...
✓ package.json updated
✓ next.config.js configured
✓ tsconfig.json validated
```

### 4. Core Components (5-7 minutes)

```
Phase 3: Core Components
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [████████████░] 37.5% (3/8 phases)

Initializing Shadcn UI...
$ npx shadcn@latest init

✓ TypeScript: Yes
✓ Style: New York
✓ Color: Slate
✓ CSS variables: Yes
✓ components.json created

Installing core components...
Following: Search → View → Example → Install

1. Button
   ✓ Searched @ui registry
   ✓ Viewed component details
   ✓ Reviewed button-demo example
   ✓ Installed: npx shadcn@latest add button

2. Card
   ✓ Searched @ui registry
   ✓ Viewed component details
   ✓ Reviewed card-demo example
   ✓ Installed: npx shadcn@latest add card

3. Separator
   ✓ Installed: npx shadcn@latest add separator

✓ All core components installed
✓ Test page created: /test-components
```

### 5. Basic Design System (3-5 minutes)

```
Phase 4: Design System
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [████████████████░] 50.0% (4/8 phases)

Configuring Tailwind CSS...
✓ tailwind.config.ts updated with CSS variables
✓ globals.css updated with design tokens
✓ Dark mode support enabled

Design tokens defined:
- Primary: hsl(222.2 47.4% 11.2%)
- Secondary: hsl(210 40% 96.1%)
- Accent: hsl(210 40% 96.1%)
- Muted: hsl(210 40% 96.1%)
- Destructive: hsl(0 84.2% 60.2%)

Typography:
- Font: Geist Sans (default)
- Scale: Tailwind default scale

✓ Design system configured
✓ Theme switching functional (light/dark)
```

### 6. Documentation (2-3 minutes)

```
Phase 5: Documentation
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Progress: [████████████████████] 100% (5/5 phases)

Generating documentation...

✓ README.md created
  - Getting started instructions
  - Tech stack overview
  - Project structure
  - Deployment guide

✓ CLAUDE.md created
  - Project overview
  - Development commands
  - Conventions
  - Component usage
  - Anti-patterns

✓ Documentation complete
```

### 7. Final Verification (1 minute)

```
Verification Checklist
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Functional:
✓ Template installed and running
✓ Development server starts without errors
✓ All pages load correctly
✓ Components render properly
✓ Styling works (light and dark mode)

Components:
✓ Shadcn initialized
✓ Core components installed (@ui registry)
✓ Components tested individually
✓ Examples reviewed for each component

Design System:
✓ Tailwind configured
✓ CSS variables defined
✓ Colors work in light/dark mode
✓ Typography set up
✓ No hardcoded colors in code

Documentation:
✓ README.md updated
✓ CLAUDE.md created
✓ Project structure documented
✓ Getting started instructions clear

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Simple blog setup complete!

Total time: 18 minutes
Next step: npm run dev
```

---

## Generated Files Structure

After completion, your project will have this structure:

```
my-blog/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   └── posts/
│       └── [slug]/
│           └── page.tsx
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       └── separator.tsx
├── lib/
│   ├── utils.ts
│   └── posts.ts
├── public/
│   └── posts/
│       └── hello-world.md
├── .env.local
├── CLAUDE.md
├── README.md
├── components.json
├── next.config.js
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## Key Files Generated

### CLAUDE.md

```markdown
# My Blog

## Overview
Personal blog built with Next.js 14, TypeScript, Tailwind CSS, and Shadcn UI.

## Tech Stack
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS + Shadcn UI (@ui)
- Blog Starter Kit template

## Development

### Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint

### Conventions
- Mobile-first responsive design
- Use Shadcn components from @ui registry
- Global Tailwind CSS variables only (no inline custom colors)
- Follow Next.js App Router conventions

### Component Usage
- Shadcn workflow: Search → View → Example → Install (never skip Example)
- Test each component after installation
- Keep components in /components/ui

## Anti-Patterns
❌ Hardcoded colors (use CSS variables)
   **Why**: Breaks theme switching and design system consistency

❌ Skipping Shadcn Example step
   **Why**: Examples reveal usage patterns and prevent integration issues

❌ Custom Tailwind without CSS variables
   **Why**: Bypasses design system, requires recompilation for changes

❌ Mixing Pages Router and App Router patterns
   **Why**: Creates conflicts and confusing behavior
```

### README.md (excerpt)

```markdown
# My Blog

Personal blog built with the Next.js Intelligence Toolkit.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Shadcn UI (@ui components)

## Deployment

Deploy to Vercel:

```bash
vercel
```

Or use the Vercel dashboard for one-click deployment.
```

---

## Testing Your Blog

### 1. Start Development Server

```bash
npm run dev
```

Visit: http://localhost:3000

### 2. Test Components

Visit: http://localhost:3000/test-components

You should see:
- Working buttons with Shadcn styling
- Cards with proper borders and padding
- Separator lines
- Light/dark mode toggle

### 3. Test Blog Posts

Visit: http://localhost:3000/posts/hello-world

You should see:
- Markdown rendered correctly
- Proper typography
- Responsive layout
- Code syntax highlighting (if included)

---

## Next Steps

### Option A: Start Writing Content

1. Add markdown files to `public/posts/`
2. Posts auto-discovered by the app
3. Customize post metadata (title, date, author)

### Option B: Customize Design

1. Edit `app/globals.css` (CSS variables)
2. Update `tailwind.config.ts` (extend theme)
3. Add more Shadcn components as needed

### Option C: Add Features

Consider adding:
- Analytics (Vercel Analytics, Google Analytics)
- SEO optimization (next-seo package)
- RSS feed generation
- Search functionality
- Comments (Giscus, Utterances)
- Newsletter subscription

---

## Deployment

### Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

### Deploy to Netlify

```bash
# Build
npm run build

# Deploy build output (.next/)
netlify deploy --prod
```

### Environment Variables

If you add external services, create `.env.local`:

```bash
# Analytics
NEXT_PUBLIC_ANALYTICS_ID=your-id

# CMS (if using)
CMS_API_KEY=your-key

# Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
```

---

## Troubleshooting

### Issue: Components don't render

**Solution**: Verify import paths in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

### Issue: Dark mode not working

**Solution**: Install `next-themes`:

```bash
npm install next-themes
```

Then wrap app in `ThemeProvider` (see Shadcn docs).

### Issue: CSS variables not applying

**Solution**: Ensure `globals.css` is imported in `app/layout.tsx`:

```typescript
import "./globals.css"
```

---

## Success Criteria Met

✅ Template selected and installed
✅ Development environment working
✅ Core components configured (Shadcn @ui)
✅ Design system established (CSS variables)
✅ Basic documentation created
✅ Ready to start building features

**Total time**: 18 minutes (within 15-30 min target)
**Next**: Build your blog or continue with additional features

---

## Reference

- **Template Used**: Blog Starter Kit (Vercel)
- **Components**: Shadcn UI (@ui registry)
- **Styling**: Tailwind CSS with CSS variables
- **Deployment**: Vercel (one-click)

For more examples, see:
- Complex SaaS example: `examples/complex-saas/`
- Next.js Intelligence Toolkit documentation: `README.md`
