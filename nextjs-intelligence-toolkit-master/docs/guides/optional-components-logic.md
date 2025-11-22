# Optional Components: When to Use Logic

**Purpose**: Provide explicit triggers and decision logic for optional MCP tools and components in Next.js project setup

**Target Audience**: AI agents making autonomous setup decisions

**Scope**: Supabase MCP, 21st-dev MCP, Asset Management, and other conditional components

---

## Decision Matrix

| Component | Trigger Condition | When to Invoke | When to Skip |
|-----------|------------------|----------------|--------------|
| **Supabase MCP** | `database_required = TRUE` | User needs persistent data storage | Static content only |
| **21st-dev MCP** | `complex_design = TRUE` OR user requests design inspiration | Custom design system needed | Template design sufficient |
| **Asset Management** | `user_provides_images = TRUE` | User uploads/provides image assets | No custom images |
| **Vercel MCP** | `ALWAYS` (required) | Every setup for template discovery | Never skip |
| **Shadcn MCP** | `ALWAYS` (required) | Every setup for component installation | Never skip |
| **Ref MCP** | As needed | When querying library docs | When knowledge is sufficient |

---

## Component 1: Supabase MCP

### Triggers (Use Supabase MCP when ANY is TRUE)

**Explicit Triggers**:
```
✓ User mentions:
  - "database", "DB", "data storage", "Supabase"
  - "user accounts", "authentication", "auth"
  - "persist data", "save data", "store information"
  - "PostgreSQL", "SQL", "tables", "schema"

✓ Features require:
  - User registration/login
  - Data persistence between sessions
  - Form submissions that need storage
  - User-generated content
  - Analytics or metrics storage
  - Multi-tenant data isolation
  - Real-time database features

✓ Assessment result:
  - database_required = TRUE from complexity assessment
```

**Implicit Triggers**:
```
✓ Project type implies database:
  - E-commerce (products, orders, inventory)
  - SaaS (user data, tenants, billing)
  - CMS (content management)
  - Social platform (users, posts, interactions)
  - Admin dashboard (data visualization)
  - Booking system (reservations, availability)
```

### Skip Conditions (Do NOT use Supabase when ALL are TRUE)

```
✗ Static content only:
  - Blog posts from markdown files
  - Marketing site with company info
  - Portfolio showcasing work
  - Documentation site

✗ External data management:
  - Headless CMS (Contentful, Sanity)
  - Data fetched from external APIs only
  - No user-generated content

✗ No persistence needed:
  - Client-side only calculations
  - Session storage sufficient
  - No accounts or user data
```

### Usage Pattern (CoD^Σ)

```
IF database_required:
  Phase_1 → Query_Supabase_MCP(project_patterns)
  Phase_3 → Define_Schema(tables ∧ RLS)
  Phase_6 → Implement(Supabase_client ∘ server_actions ∘ RLS_policies)

  Workflow:
    1. Query Supabase MCP for project setup patterns
    2. Define schema requirements (tables, columns, relationships)
    3. Implement RLS (Row Level Security) policies
    4. Create edge functions if needed
    5. Set up authentication (if auth_required)
    6. Configure staging environment first
    7. Test with production environment
```

### Database Setup Decision Tree

```
Database Required?
    |
    ├─ Single-Tenant (Simple)
    │  └─ Pattern: Basic RLS (user_id filtering)
    │     └─ Example: Blog with author-only editing
    │
    ├─ Multi-Tenant (Advanced)
    │  └─ Pattern: Advanced RLS (tenant_id + user_id)
    │     └─ Example: SaaS with isolated workspaces
    │
    └─ E-commerce (Specialized)
       └─ Pattern: Inventory + Orders + RLS
          └─ Example: Online store with customer accounts
```

### Anti-Patterns

❌ **Using Supabase CLI instead of MCP**
- Always use Supabase MCP tools
- CLI has less error handling and context

❌ **Skipping staging environment**
- Always test schema in staging first
- Production errors are costly

❌ **No RLS policies**
- Every table MUST have RLS policies
- Security is non-negotiable

✅ **Correct Pattern**:
- Query Supabase MCP for patterns
- Define schema with clear requirements
- Implement RLS policies immediately
- Test in staging, then production

---

## Component 2: 21st-dev MCP

### Triggers (Use 21st-dev MCP when ANY is TRUE)

**Explicit Triggers**:
```
✓ User mentions:
  - "design inspiration", "UI examples", "design ideas"
  - "custom design", "unique look", "brand identity"
  - "not sure about design", "need design help"
  - "complex animations", "interactive components"

✓ Assessment result:
  - complex_design = TRUE from complexity assessment

✓ User behavior:
  - Asks questions about design during setup
  - Requests multiple design iterations
  - Provides detailed brand guidelines
  - Mentions specific design style (neumorphism, glassmorphism, etc.)
```

**Implicit Triggers**:
```
✓ Project type suggests custom design:
  - Creative agency website
  - Portfolio for designer/artist
  - Brand-focused SaaS product
  - Marketing site with unique identity
  - Event/conference site
```

### Skip Conditions (Do NOT use when ALL are TRUE)

```
✗ Template design sufficient:
  - User says "simple", "clean", "standard"
  - No brand guidelines provided
  - Template aesthetics acceptable
  - Time-constrained project

✗ Design already provided:
  - User provides Figma designs
  - Brand guidelines specify exact colors/fonts
  - Using existing design system (Material, etc.)
```

### Usage Pattern (CoD^Σ)

```
IF complex_design OR user_requests_inspiration:
  Phase_4 → Query_21st_dev_MCP(search: "design inspiration [project_type]")
  Phase_4 → Agent: nextjs-design-ideator(
               input: 21st_dev_results ⊕ global_skills[tailwindcss, shadcn-ui],
               output: design_showcase.md
             )
  Phase_4 → User_Feedback(iterate_until_approved)

  Workflow:
    1. Query 21st-dev MCP for UI component inspiration
    2. Review global skills (tailwindcss, shadcn-ui) for patterns
    3. Generate 2-4 design options
    4. Create design showcase page
    5. Iterate with user feedback
    6. Finalize design system
```

### Design Inspiration vs Implementation

**21st-dev MCP Purpose**: Inspiration and component discovery
- Browse pre-built components
- Get design ideas
- See interaction patterns
- Copy-paste-adapt workflow

**NOT for**: Direct installation
- Components are reference, not packages
- Manual integration required
- Adaptation to project needed

**Integration with Shadcn MCP**:
```
Workflow:
  1. 21st-dev MCP → Find component inspiration
  2. Identify similar component in Shadcn catalog
  3. Shadcn MCP → Search → View → Example → Install
  4. Customize using 21st-dev inspiration
```

---

## Component 3: Asset Management

### Triggers (Use Asset Management when ANY is TRUE)

**Explicit Triggers**:
```
✓ User provides assets:
  - Uploads images during setup
  - Mentions existing image assets
  - References logo, photos, graphics
  - Provides asset library or folder

✓ User mentions:
  - "I have images to use"
  - "custom graphics", "photography", "illustrations"
  - Brand assets (logo, colors, fonts)
```

**Implicit Triggers**:
```
✓ Project type implies custom assets:
  - Portfolio (showcasing work)
  - E-commerce (product photos)
  - Photography site
  - Restaurant/food site (menu photos)
  - Real estate (property photos)
```

### Skip Conditions (Do NOT use when ALL are TRUE)

```
✗ No custom assets:
  - User has no images to provide
  - Placeholder images acceptable
  - Stock photos will be used later
  - Icon-only interface

✗ External asset management:
  - Images served from CDN
  - Managed in external CMS
  - Third-party image service
```

### Usage Pattern (CoD^Σ)

```
IF user_provides_images:
  Phase_5 → Asset_Management(
              inventory: list_all_images,
              process: describe ∘ rename ∘ categorize,
              output: /assets/inventory.md
            )
  Phase_5 → Wireframes(reference: @assets/[image_names])
  Phase_6 → Implementation(use: Next.js_Image_component)

  Workflow:
    1. Collect all user-provided images
    2. Create inventory list with descriptions
    3. Rename images descriptively (product-hero.jpg, logo-dark.svg)
    4. Categorize by purpose (hero, gallery, icons, backgrounds)
    5. Document in /assets/inventory.md
    6. Reference in wireframes with @asset syntax
    7. Implement with Next.js Image optimization
```

### Asset Inventory Template

```markdown
# Asset Inventory

## Images Provided

### Hero Images
- `hero-home.jpg` - Homepage hero background (1920x1080)
- `hero-about.jpg` - About page hero (1920x1080)

### Logos
- `logo-light.svg` - Logo for light backgrounds
- `logo-dark.svg` - Logo for dark backgrounds
- `logo-icon.svg` - Icon-only version (favicon)

### Product Photos
- `product-001.jpg` - Product name (800x800)
- `product-002.jpg` - Product name (800x800)

### Team Photos
- `team-john.jpg` - John Doe, CEO (400x400)
- `team-jane.jpg` - Jane Smith, CTO (400x400)

## Usage Guidelines

- All images optimized via Next.js Image component
- Responsive sizes: mobile (640w), tablet (1024w), desktop (1920w)
- Alt text required for accessibility
- Lazy loading enabled by default
```

---

## Component 4: Ref MCP (Conditional)

### Triggers (Use Ref MCP when ANY is TRUE)

**Explicit Triggers**:
```
✓ Need library documentation:
  - Unclear about Next.js API
  - Need React patterns clarification
  - TypeScript types needed
  - Framework-specific guidance

✓ User asks:
  - "How do I use [Next.js feature]?"
  - "What's the best way to [implement pattern]?"
  - "Is [approach] correct for Next.js?"
```

**Implicit Triggers**:
```
✓ Using advanced features:
  - Server Components (need docs)
  - Parallel Routes (need examples)
  - Middleware (need patterns)
  - Edge Functions (need reference)
```

### Skip Conditions

```
✗ Knowledge sufficient:
  - Standard patterns well-known
  - Global skills provide guidance
  - Template documentation adequate
```

### Usage Pattern

```
IF need_library_docs:
  Query_Ref_MCP(library: "nextjs", topic: [specific_feature])
  Review_examples → Apply_to_project
```

---

## Component 5: Vercel MCP (Always Required)

### Usage

**ALWAYS use Vercel MCP** for:
- Template discovery and filtering
- Template installation
- Deployment preparation

**Never skip** - required for both Simple and Complex paths

---

## Component 6: Shadcn MCP (Always Required)

### Usage

**ALWAYS use Shadcn MCP** for:
- Component installation (Search → View → Example → Install)
- Component registry exploration
- Dark mode setup
- Theme configuration

**Never skip** - required for both Simple and Complex paths

**Critical Workflow**:
1. Search for component
2. View component details
3. **Get Example** (NEVER skip this step)
4. Install component

---

## Decision Algorithm (Pseudo-Code)

```python
def determine_optional_components(project_requirements, complexity_assessment):
    optional_components = {
        "supabase_mcp": False,
        "21st_dev_mcp": False,
        "asset_management": False,
        "ref_mcp": False  # Used as needed
    }

    # Supabase MCP
    if complexity_assessment["database_required"]:
        optional_components["supabase_mcp"] = True
        print("✓ Supabase MCP: Database setup required")

    # 21st-dev MCP
    if complexity_assessment["complex_design"] or user_requests_design_help():
        optional_components["21st_dev_mcp"] = True
        print("✓ 21st-dev MCP: Design inspiration needed")

    # Asset Management
    if user_provides_images():
        optional_components["asset_management"] = True
        print("✓ Asset Management: User-provided images detected")

    # Ref MCP (conditional, used as needed during setup)
    # No upfront decision - invoked when questions arise

    return optional_components
```

---

## Integration with Workflow

### Phase 1: Foundation Research

```
Query: Which optional components are needed?

Assessment:
  ├─ Database required? → IF YES: Query Supabase MCP patterns
  ├─ Complex design? → IF YES: Note 21st-dev usage for Phase 4
  └─ Images provided? → IF YES: Note asset management for Phase 5

Output: /reports/foundation-research.md includes:
  - Optional components list
  - Why each is needed
  - When each will be invoked
```

### Phase 3: Specification

```
IF database_required:
  Include database schema in specification
  Document RLS requirements
  Plan authentication approach
```

### Phase 4: Design System

```
IF complex_design:
  Invoke 21st-dev MCP for inspiration
  Query global skills (tailwindcss, shadcn-ui)
  Dispatch nextjs-design-ideator agent
  Iterate with user feedback
```

### Phase 5: Wireframes

```
IF user_provides_images:
  Execute asset management workflow
  Create /assets/inventory.md
  Reference assets in wireframes with @asset/[name]
```

### Phase 6: Implementation

```
IF database_required:
  Use Supabase MCP (NEVER CLI)
  Implement schema, RLS, server actions

IF asset_management:
  Implement Next.js Image component
  Configure image optimization
  Add responsive sizes
```

---

## Examples

### Example 1: Blog (No Optional Components)

**Requirements**: "Simple personal blog with markdown posts"

**Assessment**:
- ❌ Database: No (markdown files)
- ❌ Complex Design: No ("simple")
- ❌ User Images: No (stock photos acceptable)

**Optional Components**: NONE
**Components Used**: Vercel MCP (required), Shadcn MCP (required)

---

### Example 2: SaaS Dashboard (Multiple Optional Components)

**Requirements**: "Multi-tenant SaaS dashboard with custom branding and logo"

**Assessment**:
- ✅ Database: YES (user data, tenants)
- ✅ Complex Design: YES (custom branding)
- ✅ User Images: YES (logo provided)

**Optional Components**:
- ✅ Supabase MCP: Database + auth setup
- ✅ 21st-dev MCP: Design inspiration for dashboard
- ✅ Asset Management: Logo + brand assets

**Workflow**:
1. Phase 1: Query Supabase MCP for multi-tenant patterns
2. Phase 4: Query 21st-dev MCP for dashboard inspiration
3. Phase 5: Process logo and brand assets
4. Phase 6: Implement with all components

---

### Example 3: E-commerce Store (Selective Optional Components)

**Requirements**: "Online clothing store, will use stock photos initially"

**Assessment**:
- ✅ Database: YES (products, orders)
- ❌ Complex Design: NO (standard e-commerce template)
- ❌ User Images: NO (stock photos initially)

**Optional Components**:
- ✅ Supabase MCP: Database setup for inventory/orders
- ❌ 21st-dev MCP: Template design sufficient
- ❌ Asset Management: Stock photos, no custom assets yet

**Note**: Can add asset management later when custom product photos available

---

## Anti-Patterns (Do NOT Do)

❌ **Using optional component "just in case"**
- Only invoke when trigger condition met
- Avoid over-engineering

❌ **Skipping required components**
- Vercel MCP and Shadcn MCP are ALWAYS required
- Never skip Example step in Shadcn workflow

❌ **Guessing when to use components**
- Follow explicit trigger logic
- Ask clarifying questions if unsure

❌ **Using Supabase CLI instead of MCP**
- ALWAYS use MCP tools
- Better error handling and context

✅ **Correct Pattern**:
- Assess project requirements thoroughly
- Check trigger conditions for each optional component
- Document decision rationale
- Invoke only when needed
- Follow component-specific workflows

---

## Clarification Questions (When Unsure)

**If Database Need Unclear**:
```
[CLARIFY: Does the project need data persistence?]

Context: Determining if Supabase MCP should be used
Questions:
  - Will users create accounts?
  - Will data persist between sessions?
  - Are there forms that save data?

If ANY answer is "Yes" → database_required = TRUE
```

**If Design Complexity Unclear**:
```
[CLARIFY: What are your design expectations?]

Context: Determining if 21st-dev MCP should be used
Options:
  1. Standard template design is fine
  2. Need some customization (colors, fonts)
  3. Need fully custom, unique design

If option 3 → complex_design = TRUE → Use 21st-dev MCP
```

**If Asset Availability Unclear**:
```
[CLARIFY: Do you have images to provide?]

Context: Determining if asset management workflow needed
Questions:
  - Do you have a logo?
  - Do you have product/content photos?
  - Do you have brand assets?

If ANY answer is "Yes" → asset_management = TRUE
```

---

## Documentation Integration

**Reference from SKILL.md**:
```
@docs/guides/optional-components-logic.md
```

**Phase 1 Usage**:
```
During foundation research, reference this guide to determine:
- Which optional components to invoke
- When to invoke them (which phase)
- Why they're needed (document rationale)
```

---

**Document Status**: Active
**Last Updated**: 2025-10-30
**Version**: 1.0
**Maintained by**: Claude Code Intelligence Toolkit Team
