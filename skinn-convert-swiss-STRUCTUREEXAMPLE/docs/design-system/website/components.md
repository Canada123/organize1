# Minimalist Component Library
## SKIIN Switzerland Design System

### Overview
A collection of elegant, minimalistic components designed for the SKIIN Switzerland medical website. These components embody Swiss precision, medical professionalism, and functional beauty.

---

## 🎯 Design Principles

1. **Minimalism First** - Remove all unnecessary elements
2. **Functional Beauty** - Every element has a purpose
3. **Clear Hierarchy** - Proper use of typography and spacing
4. **Consistent Spacing** - 4px base unit system
5. **Subtle Interactions** - Gentle hover states and transitions
6. **Accessibility** - WCAG 2.1 AA compliant

---

## 📦 Component Inventory

### Button Components (`minimal-button.tsx`)
Clean, purposeful buttons with three variants:
- **Primary**: Navy blue (#004C96) background with white text
- **Secondary**: Outlined with navy border
- **Ghost**: Text-only with subtle hover background

**Features:**
- Three size variants (sm, md, lg)
- Loading state with spinner
- Smooth hover transitions to light blue (#5298F2)
- Active state scaling for tactile feedback

**Usage:**
```tsx
import { MinimalButton } from '@/components/ui/minimal-button';

<MinimalButton variant="primary" size="lg">
  Schedule Appointment
</MinimalButton>
```

### Card Components (`minimal-card.tsx`)
Elegant containers with subtle shadows and clean borders:
- **Default**: White background with subtle shadow
- **Soft**: Beige (#EEE8E1) background for warmth
- **Outlined**: Transparent with border only
- **Clickable**: Interactive with hover elevation

**Features:**
- Optional header and footer sections
- Configurable padding (sm, md, lg)
- 8px border radius for softness
- Hover elevation effects

**Usage:**
```tsx
import { 
  MinimalCard, 
  MinimalCardHeader, 
  MinimalCardTitle,
  MinimalCardContent 
} from '@/components/ui/minimal-card';

<MinimalCard variant="soft">
  <MinimalCardHeader>
    <MinimalCardTitle>Patient Information</MinimalCardTitle>
  </MinimalCardHeader>
  <MinimalCardContent>
    Your content here
  </MinimalCardContent>
</MinimalCard>
```

### Form Components

#### Input Field (`minimal-input.tsx`)
Clean text inputs with floating labels:
- **Features:**
  - Floating label animation
  - Error state with red border
  - 44px height for accessibility
  - Navy blue focus state
  - Required field indicators

#### Select Dropdown (`minimal-select.tsx`)
Elegant dropdown with smooth animations:
- **Features:**
  - Custom dropdown with checkmarks
  - Smooth open/close animations
  - Keyboard navigation support
  - Error states
  - Placeholder text

#### Textarea (`minimal-textarea.tsx`)
Multi-line text input for longer content:
- **Features:**
  - Auto-resizing option
  - Floating labels
  - Character count (optional)
  - Minimum height of 80px

**Form Usage Example:**
```tsx
import { MinimalInput } from '@/components/ui/minimal-input';
import { MinimalSelect } from '@/components/ui/minimal-select';
import { MinimalTextarea } from '@/components/ui/minimal-textarea';

// Input with floating label
<MinimalInput
  label="Email Address"
  type="email"
  required
  error={errors.email}
/>

// Select with options
<MinimalSelect
  label="Department"
  options={[
    { value: 'cardiology', label: 'Cardiology' },
    { value: 'neurology', label: 'Neurology' }
  ]}
  required
/>

// Textarea
<MinimalTextarea
  label="Message"
  rows={5}
  required
/>
```

---

## 🎨 Color System

### Primary Palette
- **Navy Blue** (#004C96) - Primary actions, headers
- **Light Blue** (#5298F2) - Hover states, links
- **Violet** (#5549A6) - Accent, used sparingly
- **Beige** (#EEE8E1) - Soft backgrounds

### Text Colors
- **Primary** (#0D0D0D) - Main content
- **Secondary** (#475259) - Supporting text
- **Muted** (#8B919B) - Subtle elements
- **Inverse** (#FFFFFF) - On dark backgrounds

---

## 📏 Spacing & Layout

### Spacing Scale (4px base)
```css
space-1: 4px
space-2: 8px
space-3: 12px
space-4: 16px
space-5: 20px
space-6: 24px
space-8: 32px
space-10: 40px
space-12: 48px
```

### Border Radius
```css
rounded: 4px    /* Default */
rounded-lg: 8px /* Cards */
rounded-full: 9999px /* Pills */
```

---

## ⚡ Interaction States

### Hover Effects
- Buttons: Color transition to light blue
- Cards: Shadow elevation increase
- Inputs: Border color darkens

### Focus States
- 2px ring with navy blue color
- 20% opacity for ring color
- Clear keyboard navigation

### Active States
- Scale down to 98% for tactile feedback
- Immediate color response

---

## 🔧 Implementation Notes

### Dependencies
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- class-variance-authority
- lucide-react (for icons)

### Installation
All components are standalone and can be copied directly into your project. Ensure you have the required dependencies installed:

```bash
npm install class-variance-authority lucide-react
```

### Accessibility
- All interactive elements have focus states
- Minimum touch target of 44x44px
- Proper ARIA labels and roles
- Color contrast ratios meet WCAG AA

### Performance
- Components use CSS transitions (GPU accelerated)
- No unnecessary re-renders
- Lightweight with minimal dependencies
- Tree-shakeable exports

---

## 📖 Best Practices

1. **Consistency**: Use the same variant across similar actions
2. **Hierarchy**: Primary buttons for main actions only
3. **Spacing**: Follow the 4px grid system
4. **Colors**: Stick to the defined palette
5. **Typography**: Use IBM Plex Sans consistently
6. **Feedback**: Always provide hover/focus states
7. **Errors**: Clear, helpful error messages
8. **Loading**: Show loading states for async actions

---

## 🚀 Future Enhancements

- [ ] Dark mode support
- [ ] Additional card variants
- [ ] Toast notifications
- [ ] Modal dialogs
- [ ] Data tables
- [ ] Date/time pickers
- [ ] Progress indicators
- [ ] Breadcrumbs

---

## 📝 Component Status

| Component | Status | Version | Last Updated |
|-----------|--------|---------|--------------|
| MinimalButton | ✅ Complete | 1.0.0 | 2025-08-19 |
| MinimalCard | ✅ Complete | 1.0.0 | 2025-08-19 |
| MinimalInput | ✅ Complete | 1.0.0 | 2025-08-19 |
| MinimalSelect | ✅ Complete | 1.0.0 | 2025-08-19 |
| MinimalTextarea | ✅ Complete | 1.0.0 | 2025-08-19 |

---

## 🔗 References

- Design Tokens: `/docs/design/tokens.md`
- Conventions: `/context/conventions.md`
- Component Examples: `/src/pages/ComponentShowcase.tsx`