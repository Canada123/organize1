# Database Setup Decision Criteria & Implementation Patterns

**Purpose**: Provide explicit database setup patterns for Next.js projects with Supabase MCP

**Target Audience**: AI agents making autonomous database setup decisions

**Scope**: Single-tenant, multi-tenant, and e-commerce database patterns with schema examples, RLS policies, and implementation workflows

---

## Overview

**Decision Flow** (CoD^Σ):
```
Database_Required? → Identify_Pattern → Schema_Design → RLS_Implementation → Auth_Setup → Verification
```

**Pattern Selection Criteria**:
- **Single-Tenant**: One organization, multiple users, basic access control
- **Multi-Tenant**: Multiple isolated organizations/workspaces, strict data separation
- **E-commerce**: Product catalog, inventory, orders, customer management

**Reference**: @docs/guides/optional-components-logic.md for WHEN to use Supabase (trigger conditions)

---

## Pattern 1: Single-Tenant Database

**Use When**:
- Single organization or owner
- Multiple users share same data space
- Basic user-level access control (own data only)
- No workspace isolation needed

**Examples**: Personal blog with author roles, task management app, CRM for single company

### 1.1 Schema Pattern (CoD^Σ)

```sql
-- Core Pattern: user_id foreign key + basic RLS

-- Users table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-owned content table pattern
CREATE TABLE public.posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shared reference data (no user_id needed)
CREATE TABLE public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Many-to-many relationship
CREATE TABLE public.post_categories (
  post_id UUID REFERENCES public.posts(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, category_id)
);
```

**Schema Principles**:
- `user_id UUID REFERENCES public.profiles(id)` on all user-owned tables
- `ON DELETE CASCADE` for dependent data cleanup
- `created_at`, `updated_at` timestamps on all tables
- `role` enum for basic permission levels
- Shared/reference data tables have no `user_id`

### 1.2 RLS Policy Pattern

```sql
-- Enable RLS on all user-owned tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view all, edit only their own
CREATE POLICY "Profiles are viewable by all authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Posts: Users can CRUD their own posts
CREATE POLICY "Users can view their own posts"
  ON public.posts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own posts"
  ON public.posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own posts"
  ON public.posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own posts"
  ON public.posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Published posts are viewable by all (public read)
CREATE POLICY "Published posts are viewable by everyone"
  ON public.posts
  FOR SELECT
  TO anon
  USING (published = true);

-- Categories: Read-only for all, admin-only write
CREATE POLICY "Categories are viewable by all"
  ON public.categories
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Only admins can modify categories"
  ON public.categories
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );
```

**RLS Principles**:
- ALWAYS use `auth.uid()` for current user checks
- `FOR SELECT` policies for read access
- `FOR INSERT/UPDATE/DELETE` policies for write access
- `USING` clause: read permission filter
- `WITH CHECK` clause: write permission validation
- Admin checks via role subquery
- Public read via `TO anon` + condition

### 1.3 Authentication Setup

```typescript
// lib/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// lib/supabase/auth.ts
export async function signUp(email: string, password: string, full_name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name, // Stored in auth.users.raw_user_meta_data
      },
    },
  })

  if (error) throw error

  // Create profile (trigger can auto-create on signup)
  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: data.user.id,
        email: data.user.email!,
        full_name,
      })

    if (profileError) throw profileError
  }

  return data
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}
```

**Database Trigger for Auto Profile Creation**:
```sql
-- Automatically create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 1.4 Server Actions Pattern

```typescript
// app/actions/posts.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const { data, error } = await supabase
    .from('posts')
    .insert({
      user_id: user.id, // RLS will verify this matches auth.uid()
      title,
      content,
      published: false,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath('/posts')
  return data
}

export async function updatePost(id: string, formData: FormData) {
  const supabase = await createClient()

  const title = formData.get('title') as string
  const content = formData.get('content') as string
  const published = formData.get('published') === 'true'

  // RLS will ensure user_id matches auth.uid()
  const { data, error } = await supabase
    .from('posts')
    .update({ title, content, published })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error

  revalidatePath('/posts')
  return data
}

export async function deletePost(id: string) {
  const supabase = await createClient()

  // RLS will ensure user_id matches auth.uid()
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id)

  if (error) throw error

  revalidatePath('/posts')
}
```

**Server Actions Principles**:
- ALWAYS use server-side Supabase client
- Let RLS handle access control (don't duplicate checks)
- Revalidate paths after mutations
- Return data for optimistic updates

### 1.5 Implementation Workflow (CoD^Σ)

```
Single_Tenant_Setup :=
  Schema_Creation
    ∘ RLS_Policies
    ∘ Auth_Trigger
    ∘ Client_Setup
    ∘ Server_Actions
    ∘ Verification

Workflow:
  1. Create schema (profiles, posts, categories)
  2. Enable RLS on all user-owned tables
  3. Create RLS policies (SELECT, INSERT, UPDATE, DELETE)
  4. Add profile auto-creation trigger
  5. Set up Supabase client (client + server)
  6. Implement server actions with RLS reliance
  7. Test auth flow (signup, signin, signout)
  8. Verify RLS policies work (try unauthorized access)
```

---

## Pattern 2: Multi-Tenant Database

**Use When**:
- Multiple organizations/workspaces/teams
- Strict data isolation required
- Each tenant has own users and data
- Tenant-level billing or settings

**Examples**: SaaS platforms, team collaboration tools, multi-store e-commerce

### 2.1 Schema Pattern (CoD^Σ)

```sql
-- Core Pattern: tenant_id foreign key + user membership + advanced RLS

-- Tenants (organizations/workspaces)
CREATE TABLE public.tenants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL, -- subdomain or workspace identifier
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'enterprise')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant memberships (which users belong to which tenants)
CREATE TABLE public.tenant_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id) -- User can only be member once per tenant
);

-- Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tenant-owned content (every table has tenant_id)
CREATE TABLE public.projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Project-level resources (tenant_id + project_id)
CREATE TABLE public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  assigned_to UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tenant_members_tenant_id ON public.tenant_members(tenant_id);
CREATE INDEX idx_tenant_members_user_id ON public.tenant_members(user_id);
CREATE INDEX idx_projects_tenant_id ON public.projects(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON public.tasks(tenant_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
```

**Schema Principles**:
- `tenant_id` on EVERY tenant-owned table (non-negotiable)
- `tenant_members` junction table for user-tenant relationships
- `role` at membership level (owner, admin, member)
- Indexes on `tenant_id` for query performance
- `ON DELETE CASCADE` for tenant deletion cleanup

### 2.2 RLS Policy Pattern

```sql
-- Enable RLS on all tables
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Helper function: Check if user is member of tenant
CREATE OR REPLACE FUNCTION public.is_tenant_member(tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_members.tenant_id = is_tenant_member.tenant_id
      AND tenant_members.user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function: Check if user has role in tenant
CREATE OR REPLACE FUNCTION public.has_tenant_role(tenant_id UUID, required_role TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.tenant_members
    WHERE tenant_members.tenant_id = has_tenant_role.tenant_id
      AND tenant_members.user_id = auth.uid()
      AND tenant_members.role = required_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Tenants: Users can view tenants they belong to
CREATE POLICY "Users can view their tenants"
  ON public.tenants
  FOR SELECT
  TO authenticated
  USING (is_tenant_member(id));

-- Only owners can update tenant settings
CREATE POLICY "Only owners can update tenants"
  ON public.tenants
  FOR UPDATE
  TO authenticated
  USING (has_tenant_role(id, 'owner'))
  WITH CHECK (has_tenant_role(id, 'owner'));

-- Tenant Members: View own memberships + admin can view all in tenant
CREATE POLICY "Users can view their own memberships"
  ON public.tenant_members
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    has_tenant_role(tenant_id, 'admin') OR
    has_tenant_role(tenant_id, 'owner')
  );

-- Admins/owners can manage members
CREATE POLICY "Admins can insert members"
  ON public.tenant_members
  FOR INSERT
  TO authenticated
  WITH CHECK (
    has_tenant_role(tenant_id, 'admin') OR
    has_tenant_role(tenant_id, 'owner')
  );

CREATE POLICY "Admins can update members"
  ON public.tenant_members
  FOR UPDATE
  TO authenticated
  USING (
    has_tenant_role(tenant_id, 'admin') OR
    has_tenant_role(tenant_id, 'owner')
  );

CREATE POLICY "Admins can delete members"
  ON public.tenant_members
  FOR DELETE
  TO authenticated
  USING (
    has_tenant_role(tenant_id, 'admin') OR
    has_tenant_role(tenant_id, 'owner')
  );

-- Profiles: All authenticated users can view
CREATE POLICY "Profiles are viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Projects: Tenant members can CRUD within their tenant
CREATE POLICY "Tenant members can view projects"
  ON public.projects
  FOR SELECT
  TO authenticated
  USING (is_tenant_member(tenant_id));

CREATE POLICY "Tenant members can insert projects"
  ON public.projects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    is_tenant_member(tenant_id) AND
    created_by = auth.uid()
  );

CREATE POLICY "Tenant members can update projects"
  ON public.projects
  FOR UPDATE
  TO authenticated
  USING (is_tenant_member(tenant_id));

CREATE POLICY "Tenant admins can delete projects"
  ON public.projects
  FOR DELETE
  TO authenticated
  USING (
    has_tenant_role(tenant_id, 'admin') OR
    has_tenant_role(tenant_id, 'owner')
  );

-- Tasks: Tenant members can CRUD within their tenant's projects
CREATE POLICY "Tenant members can view tasks"
  ON public.tasks
  FOR SELECT
  TO authenticated
  USING (is_tenant_member(tenant_id));

CREATE POLICY "Tenant members can insert tasks"
  ON public.tasks
  FOR INSERT
  TO authenticated
  WITH CHECK (is_tenant_member(tenant_id));

CREATE POLICY "Tenant members can update tasks"
  ON public.tasks
  FOR UPDATE
  TO authenticated
  USING (is_tenant_member(tenant_id));

CREATE POLICY "Tenant members can delete tasks"
  ON public.tasks
  FOR DELETE
  TO authenticated
  USING (is_tenant_member(tenant_id));
```

**RLS Principles**:
- Use helper functions for cleaner policies
- ALWAYS check `is_tenant_member(tenant_id)` for tenant-owned data
- Role-based checks for admin operations
- `SECURITY DEFINER` on helper functions (runs with elevated privileges)
- Separate policies for different operations (SELECT, INSERT, UPDATE, DELETE)

### 2.3 Authentication + Tenant Context

```typescript
// lib/supabase/tenant-context.ts
import { createContext, useContext } from 'react'

type TenantContextType = {
  tenantId: string | null
  tenantSlug: string | null
  role: 'owner' | 'admin' | 'member' | null
}

const TenantContext = createContext<TenantContextType>({
  tenantId: null,
  tenantSlug: null,
  role: null,
})

export const useTenant = () => useContext(TenantContext)
export const TenantProvider = TenantContext.Provider

// app/[tenant]/layout.tsx
import { createClient } from '@/lib/supabase/server'
import { TenantProvider } from '@/lib/supabase/tenant-context'
import { notFound } from 'next/navigation'

export default async function TenantLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { tenant: string }
}) {
  const supabase = await createClient()

  // Verify tenant exists
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('id, slug')
    .eq('slug', params.tenant)
    .single()

  if (error || !tenant) {
    notFound()
  }

  // Get user's role in this tenant
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return redirect('/login')
  }

  const { data: membership } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenant.id)
    .eq('user_id', user.id)
    .single()

  if (!membership) {
    return <div>Not a member of this tenant</div>
  }

  return (
    <TenantProvider
      value={{
        tenantId: tenant.id,
        tenantSlug: tenant.slug,
        role: membership.role,
      }}
    >
      {children}
    </TenantProvider>
  )
}
```

### 2.4 Server Actions with Tenant Context

```typescript
// app/[tenant]/actions/projects.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createProject(tenantId: string, formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Verify user is member of tenant (belt-and-suspenders with RLS)
  const { data: membership } = await supabase
    .from('tenant_members')
    .select('role')
    .eq('tenant_id', tenantId)
    .eq('user_id', user.id)
    .single()

  if (!membership) throw new Error('Not a member of this tenant')

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  // RLS will verify tenant membership
  const { data, error } = await supabase
    .from('projects')
    .insert({
      tenant_id: tenantId, // CRITICAL: Always set tenant_id
      created_by: user.id,
      name,
      description,
    })
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/[tenant]/projects`, 'page')
  return data
}

export async function updateProject(
  tenantId: string,
  projectId: string,
  formData: FormData
) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const description = formData.get('description') as string

  // RLS will verify tenant membership and tenant_id match
  const { data, error } = await supabase
    .from('projects')
    .update({ name, description })
    .eq('id', projectId)
    .eq('tenant_id', tenantId) // Belt-and-suspenders
    .select()
    .single()

  if (error) throw error

  revalidatePath(`/[tenant]/projects`, 'page')
  return data
}
```

**Server Actions Principles**:
- ALWAYS pass `tenant_id` explicitly
- Verify membership (belt-and-suspenders with RLS)
- Filter by `tenant_id` in queries (defense in depth)
- Revalidate tenant-scoped paths

### 2.5 Implementation Workflow (CoD^Σ)

```
Multi_Tenant_Setup :=
  Schema_Creation
    ∘ RLS_Helper_Functions
    ∘ RLS_Policies
    ∘ Tenant_Context_Setup
    ∘ Server_Actions
    ∘ Verification

Workflow:
  1. Create schema (tenants, tenant_members, profiles, projects, tasks)
  2. Add indexes on tenant_id columns
  3. Create RLS helper functions (is_tenant_member, has_tenant_role)
  4. Enable RLS on all tables
  5. Create RLS policies (tenant-scoped access)
  6. Set up tenant context provider (React context)
  7. Implement server actions with tenant_id filtering
  8. Test tenant isolation (try cross-tenant access - should fail)
  9. Verify RLS policies work (check query plans)
```

---

## Pattern 3: E-commerce Database

**Use When**:
- Product catalog with inventory
- Shopping cart and checkout
- Order management
- Customer accounts
- Payment processing

**Examples**: Online stores, marketplaces, subscription services

### 3.1 Schema Pattern (CoD^Σ)

```sql
-- Core Pattern: products + inventory + orders + customers

-- Products catalog
CREATE TABLE public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  sku TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category TEXT,
  image_urls TEXT[],
  metadata JSONB DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inventory tracking
CREATE TABLE public.inventory (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  reserved INTEGER NOT NULL DEFAULT 0 CHECK (reserved >= 0),
  warehouse_location TEXT,
  last_restock_date TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(product_id) -- One inventory record per product
);

-- Customer profiles (extends auth.users)
CREATE TABLE public.customers (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  shipping_address JSONB, -- {street, city, state, zip, country}
  billing_address JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shopping carts (active carts for logged-in users)
CREATE TABLE public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For anonymous carts
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id), -- One cart per user
  CHECK (user_id IS NOT NULL OR session_id IS NOT NULL) -- Must have one
);

-- Cart items
CREATE TABLE public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price_at_add DECIMAL(10, 2) NOT NULL, -- Snapshot price when added
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cart_id, product_id) -- One line item per product per cart
);

-- Orders
CREATE TABLE public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL, -- Human-readable order #
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
  )),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) NOT NULL DEFAULT 0,
  shipping DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB NOT NULL,
  payment_intent_id TEXT, -- Stripe payment intent ID
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items
CREATE TABLE public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price DECIMAL(10, 2) NOT NULL, -- Snapshot price at order time
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_active ON public.products(active);
CREATE INDEX idx_inventory_product_id ON public.inventory(product_id);
CREATE INDEX idx_carts_user_id ON public.carts(user_id);
CREATE INDEX idx_carts_session_id ON public.carts(session_id);
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
```

**Schema Principles**:
- Product catalog separate from inventory (different update patterns)
- Price snapshots in cart_items and order_items (historical accuracy)
- `reserved` inventory for pending orders (prevent overselling)
- `session_id` for anonymous carts (convert to user cart on login)
- JSONB for addresses (flexible schema)
- Order number for customer-facing display
- Status enum for order lifecycle

### 3.2 RLS Policy Pattern

```sql
-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone"
  ON public.products
  FOR SELECT
  TO anon, authenticated
  USING (active = true);

CREATE POLICY "Admins can manage products"
  ON public.products
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE id = auth.uid() AND email LIKE '%@admin.com' -- Simplified admin check
    )
  );

-- Inventory: Public read (for stock status), admin write
CREATE POLICY "Inventory is viewable by everyone"
  ON public.inventory
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage inventory"
  ON public.inventory
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE id = auth.uid() AND email LIKE '%@admin.com'
    )
  );

-- Customers: Users can CRUD their own profile
CREATE POLICY "Users can view own customer profile"
  ON public.customers
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own customer profile"
  ON public.customers
  FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Carts: Users can CRUD their own cart
CREATE POLICY "Users can view own cart"
  ON public.carts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cart"
  ON public.carts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cart"
  ON public.carts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Cart Items: Users can CRUD items in their cart
CREATE POLICY "Users can view own cart items"
  ON public.cart_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own cart items"
  ON public.cart_items
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.carts
      WHERE carts.id = cart_items.cart_id
        AND carts.user_id = auth.uid()
    )
  );

-- Orders: Users can view own orders, admins can view all
CREATE POLICY "Users can view own orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE id = auth.uid() AND email LIKE '%@admin.com'
    )
  );

CREATE POLICY "Users can insert own orders"
  ON public.orders
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can update orders (for status changes)
CREATE POLICY "Admins can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.customers
      WHERE id = auth.uid() AND email LIKE '%@admin.com'
    )
  );

-- Order Items: Users can view items in their orders
CREATE POLICY "Users can view own order items"
  ON public.order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert order items"
  ON public.order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
        AND orders.user_id = auth.uid()
    )
  );
```

**RLS Principles**:
- Public read for products and inventory (storefront)
- Admin checks via email pattern (simplified - use proper role table in production)
- Cart and order isolation via user_id checks
- Nested EXISTS for cart_items and order_items (join to parent table)

### 3.3 Inventory Management Functions

```sql
-- Reserve inventory when order is created
CREATE OR REPLACE FUNCTION public.reserve_inventory(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
DECLARE
  v_available INTEGER;
BEGIN
  -- Get available quantity (total - reserved)
  SELECT (quantity - reserved) INTO v_available
  FROM public.inventory
  WHERE product_id = p_product_id
  FOR UPDATE; -- Lock row

  IF v_available IS NULL THEN
    RAISE EXCEPTION 'Product not found in inventory';
  END IF;

  IF v_available < p_quantity THEN
    RAISE EXCEPTION 'Insufficient inventory: % available, % requested',
      v_available, p_quantity;
  END IF;

  -- Reserve the quantity
  UPDATE public.inventory
  SET reserved = reserved + p_quantity,
      updated_at = NOW()
  WHERE product_id = p_product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Release reserved inventory (e.g., on order cancellation)
CREATE OR REPLACE FUNCTION public.release_inventory(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.inventory
  SET reserved = GREATEST(reserved - p_quantity, 0),
      updated_at = NOW()
  WHERE product_id = p_product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Fulfill order (move from reserved to sold)
CREATE OR REPLACE FUNCTION public.fulfill_inventory(
  p_product_id UUID,
  p_quantity INTEGER
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE public.inventory
  SET quantity = quantity - p_quantity,
      reserved = GREATEST(reserved - p_quantity, 0),
      updated_at = NOW()
  WHERE product_id = p_product_id;

  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;
```

### 3.4 Order Creation Workflow

```typescript
// app/actions/checkout.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  // Get user's cart
  const { data: cart } = await supabase
    .from('carts')
    .select('id, cart_items(id, product_id, quantity, price_at_add)')
    .eq('user_id', user.id)
    .single()

  if (!cart || !cart.cart_items?.length) {
    throw new Error('Cart is empty')
  }

  // Calculate totals
  const subtotal = cart.cart_items.reduce(
    (sum, item) => sum + item.price_at_add * item.quantity,
    0
  )
  const tax = subtotal * 0.08 // 8% tax rate
  const shipping = 10.00 // Flat shipping
  const total = subtotal + tax + shipping

  // Create Stripe payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // Convert to cents
    currency: 'usd',
    metadata: {
      user_id: user.id,
    },
  })

  // Start transaction: Create order + reserve inventory
  const { data: order, error: orderError } = await supabase.rpc(
    'create_order_with_inventory_reserve',
    {
      p_user_id: user.id,
      p_cart_id: cart.id,
      p_subtotal: subtotal,
      p_tax: tax,
      p_shipping: shipping,
      p_total: total,
      p_shipping_address: JSON.parse(formData.get('shipping_address') as string),
      p_billing_address: JSON.parse(formData.get('billing_address') as string),
      p_payment_intent_id: paymentIntent.id,
    }
  )

  if (orderError) throw orderError

  return {
    order,
    clientSecret: paymentIntent.client_secret,
  }
}

// Database function for atomic order creation
-- create_order_with_inventory_reserve in SQL
CREATE OR REPLACE FUNCTION public.create_order_with_inventory_reserve(
  p_user_id UUID,
  p_cart_id UUID,
  p_subtotal DECIMAL,
  p_tax DECIMAL,
  p_shipping DECIMAL,
  p_total DECIMAL,
  p_shipping_address JSONB,
  p_billing_address JSONB,
  p_payment_intent_id TEXT
)
RETURNS UUID AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_cart_item RECORD;
BEGIN
  -- Generate order number
  v_order_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');

  -- Create order
  INSERT INTO public.orders (
    order_number, user_id, status, subtotal, tax, shipping, total,
    shipping_address, billing_address, payment_intent_id
  ) VALUES (
    v_order_number, p_user_id, 'pending', p_subtotal, p_tax, p_shipping, p_total,
    p_shipping_address, p_billing_address, p_payment_intent_id
  )
  RETURNING id INTO v_order_id;

  -- Create order items and reserve inventory
  FOR v_cart_item IN
    SELECT product_id, quantity, price_at_add
    FROM public.cart_items
    WHERE cart_id = p_cart_id
  LOOP
    -- Insert order item
    INSERT INTO public.order_items (order_id, product_id, quantity, price)
    VALUES (v_order_id, v_cart_item.product_id, v_cart_item.quantity, v_cart_item.price_at_add);

    -- Reserve inventory
    PERFORM public.reserve_inventory(v_cart_item.product_id, v_cart_item.quantity);
  END LOOP;

  -- Clear cart
  DELETE FROM public.cart_items WHERE cart_id = p_cart_id;

  RETURN v_order_id;
END;
$$ LANGUAGE plpgsql;
```

### 3.5 Implementation Workflow (CoD^Σ)

```
E_Commerce_Setup :=
  Schema_Creation
    ∘ RLS_Policies
    ∘ Inventory_Functions
    ∘ Order_Transaction_Function
    ∘ Stripe_Integration
    ∘ Verification

Workflow:
  1. Create schema (products, inventory, customers, carts, orders)
  2. Add indexes for performance
  3. Enable RLS on all tables
  4. Create RLS policies (public read products, user-scoped carts/orders)
  5. Create inventory management functions (reserve, release, fulfill)
  6. Create atomic order creation function (with inventory reserve)
  7. Set up Stripe integration
  8. Implement checkout server action
  9. Test inventory reservation (overselling protection)
  10. Verify RLS policies (users can't see others' orders)
```

---

## Cross-Pattern Comparison

| Aspect | Single-Tenant | Multi-Tenant | E-commerce |
|--------|---------------|--------------|------------|
| **Isolation Level** | User-level | Tenant-level | User-level |
| **Key FK** | `user_id` | `tenant_id` + `user_id` | `user_id` |
| **RLS Complexity** | Simple (`auth.uid()`) | Advanced (helper functions) | Moderate (nested EXISTS) |
| **Membership** | Direct (profiles) | Junction (tenant_members) | Direct (customers) |
| **Role Management** | Profile-level | Membership-level | Email pattern (simplified) |
| **Public Access** | Conditional (published flag) | No (tenant-scoped) | Yes (products, inventory) |
| **Indexes** | Basic | Extensive (tenant_id) | Moderate (category, status) |
| **Transactions** | Simple CRUD | Medium complexity | Complex (inventory reserve) |

---

## Decision Algorithm (Pseudo-Code)

```python
def determine_database_pattern(project_requirements):
    # Check for multi-tenant indicators
    if any([
        "multiple organizations" in requirements,
        "workspaces" in requirements,
        "teams" in requirements,
        "saas" in requirements.lower(),
        "tenant" in requirements,
    ]):
        return "MULTI_TENANT", {
            "schema": "tenant_id on all tables",
            "rls": "Advanced (helper functions + role checks)",
            "auth": "Tenant context provider",
            "indexes": "Extensive on tenant_id",
        }

    # Check for e-commerce indicators
    if any([
        "products" in requirements,
        "shopping cart" in requirements,
        "checkout" in requirements,
        "inventory" in requirements,
        "orders" in requirements,
        "e-commerce" in requirements,
        "store" in requirements,
    ]):
        return "E_COMMERCE", {
            "schema": "Products + inventory + orders pattern",
            "rls": "Public read products, user-scoped orders",
            "inventory": "Reserve/release/fulfill functions",
            "transactions": "Atomic order creation with inventory",
        }

    # Default: Single-tenant
    return "SINGLE_TENANT", {
        "schema": "user_id on user-owned tables",
        "rls": "Simple (auth.uid() checks)",
        "auth": "Basic profile management",
        "complexity": "Low",
    }
```

---

## Implementation Checklist

### Single-Tenant Checklist
- [ ] Create profiles table (extends auth.users)
- [ ] Create user-owned content tables with `user_id FK`
- [ ] Create shared reference tables (no user_id)
- [ ] Enable RLS on all user-owned tables
- [ ] Create RLS policies (SELECT, INSERT, UPDATE, DELETE)
- [ ] Add profile auto-creation trigger
- [ ] Set up Supabase client (client + server)
- [ ] Implement server actions with RLS reliance
- [ ] Test auth flow (signup, signin, signout)
- [ ] Verify RLS policies (try unauthorized access)

### Multi-Tenant Checklist
- [ ] Create tenants table
- [ ] Create tenant_members junction table
- [ ] Create profiles table
- [ ] Create tenant-owned tables with `tenant_id FK`
- [ ] Add indexes on `tenant_id` columns
- [ ] Create RLS helper functions (`is_tenant_member`, `has_tenant_role`)
- [ ] Enable RLS on all tables
- [ ] Create RLS policies (tenant-scoped access)
- [ ] Set up tenant context provider
- [ ] Implement server actions with tenant_id filtering
- [ ] Test tenant isolation (try cross-tenant access)
- [ ] Verify RLS query plans (ensure efficient filtering)

### E-commerce Checklist
- [ ] Create products table
- [ ] Create inventory table with reserve tracking
- [ ] Create customers table
- [ ] Create carts and cart_items tables
- [ ] Create orders and order_items tables
- [ ] Add indexes (category, status, dates)
- [ ] Enable RLS on all tables
- [ ] Create RLS policies (public products, user-scoped orders)
- [ ] Create inventory management functions (reserve, release, fulfill)
- [ ] Create atomic order creation function
- [ ] Set up Stripe integration
- [ ] Implement checkout server action
- [ ] Test inventory reservation (overselling protection)
- [ ] Test order workflow (cart → order → payment)
- [ ] Verify RLS policies (users can't see others' carts/orders)

---

## Testing & Verification

### RLS Testing Pattern

```sql
-- Test as specific user (simulates authenticated request)
SET request.jwt.claims.sub = '<user_uuid>';

-- Test unauthorized access (should return empty)
SELECT * FROM public.projects WHERE tenant_id = '<other_tenant_uuid>';

-- Test authorized access (should return data)
SELECT * FROM public.projects WHERE tenant_id = '<my_tenant_uuid>';

-- View RLS query plan (ensure efficient filtering)
EXPLAIN (ANALYZE, VERBOSE) SELECT * FROM public.projects WHERE tenant_id = '<uuid>';

-- Reset session
RESET request.jwt.claims.sub;
```

### Inventory Testing Pattern

```sql
-- Test overselling protection
BEGIN;
  -- Attempt to reserve more than available
  SELECT public.reserve_inventory('<product_uuid>', 1000);
  -- Should raise exception: Insufficient inventory
ROLLBACK;

-- Test atomic order creation
BEGIN;
  SELECT public.create_order_with_inventory_reserve(
    '<user_uuid>', '<cart_uuid>', 100.00, 8.00, 10.00, 118.00,
    '{"street": "123 Main St", "city": "City", "state": "ST", "zip": "12345"}'::jsonb,
    '{"street": "123 Main St", "city": "City", "state": "ST", "zip": "12345"}'::jsonb,
    'pi_test_123'
  );
  -- Verify inventory reserved
  SELECT quantity, reserved FROM public.inventory WHERE product_id = '<product_uuid>';
COMMIT;
```

---

## Anti-Patterns (Do NOT Do)

### Multi-Tenant Anti-Patterns
❌ **Forgetting tenant_id on table**: Every tenant-owned table MUST have `tenant_id`
❌ **No indexes on tenant_id**: Causes full table scans, catastrophic performance
❌ **Skipping helper functions**: RLS policies become unmaintainable spaghetti
❌ **Client-side tenant filtering**: ALWAYS filter server-side + RLS (defense in depth)
❌ **Mixing tenant data in queries**: Use `eq('tenant_id', tenantId)` on ALL queries

### E-commerce Anti-Patterns
❌ **No inventory reservation**: Causes overselling when orders are concurrent
❌ **Price in products table only**: Prices change, orders must snapshot price at purchase
❌ **No atomic order creation**: Partial failures leave inconsistent state
❌ **Anonymous cart without session_id**: Can't recover abandoned carts
❌ **Admin via hardcoded IDs**: Use proper role table in production

### General RLS Anti-Patterns
❌ **Forgetting to enable RLS**: `ALTER TABLE ... ENABLE ROW LEVEL SECURITY`
❌ **Missing WITH CHECK clause**: Allows inserts that violate read policies
❌ **Using SELECT * in RLS policies**: Specify columns to avoid circular dependencies
❌ **Not testing RLS as different users**: Use `SET request.jwt.claims.sub` for testing
❌ **Duplicating RLS logic in application**: Let RLS handle access, don't double-check

---

## Success Criteria

### Single-Tenant Success
✅ Users can only view/edit their own data
✅ Published content visible to public (if applicable)
✅ Admins can manage all data via role check
✅ Profile auto-created on signup
✅ RLS query plans show efficient filtering

### Multi-Tenant Success
✅ Users cannot access data from other tenants
✅ Tenant members can CRUD within their tenant
✅ Role-based permissions work (owner, admin, member)
✅ Tenant context provider supplies tenant_id to all queries
✅ Indexes prevent N+1 queries on tenant_id

### E-commerce Success
✅ Inventory reservation prevents overselling
✅ Order creation is atomic (all-or-nothing)
✅ Prices snapshot at cart add and order time
✅ Anonymous carts convert to user carts on login
✅ Users can only view their own carts and orders
✅ Public can view products and inventory status

---

## References

**Related Guides**:
- @docs/guides/optional-components-logic.md - When to use Supabase MCP (trigger conditions)
- .claude/skills/nextjs-project-setup/SKILL.md - Next.js project setup workflow (Phase 3: Specification, Phase 6: Implementation)

**External Documentation**:
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- Supabase Multi-Tenancy: https://supabase.com/docs/guides/auth/row-level-security#multi-tenancy
- Stripe Integration: https://stripe.com/docs/payments/accept-a-payment

**MCP Tools**:
- Supabase MCP: Schema management, RLS policy creation, edge functions (ALWAYS use MCP, NEVER CLI)

---

**Document Status**: Active
**Last Updated**: 2025-10-30
**Version**: 1.0
**Maintained by**: Claude Code Intelligence Toolkit Team
