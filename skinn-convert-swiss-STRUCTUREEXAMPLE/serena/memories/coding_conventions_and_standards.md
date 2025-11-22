# Coding Conventions and Standards

## Code Style and Structure

### Component Architecture
- **Atomic Design**: Components must be ≤50 lines each
- **PascalCase** naming for components
- **Pure Functional Components** only (no class components)
- **Typed Props** with defaults and explicit return types
- **Single Responsibility**: One concern per component

### TypeScript Standards
- **Strict Mode Enabled**: No any types allowed
- **Explicit Types**: Return types required for all exports
- **Meaningful Names**: Descriptive variable and function names
- **Union Types**: For fixed value sets
- **Interface Naming**: PascalCase with descriptive names

### React Patterns
- **Hooks**: camelCase with 'use' prefix
- **Context API**: For global state management
- **TanStack Query**: For all server state
- **Error Boundaries**: try/catch async operations with toast feedback
- **Memoization**: Use React.memo and useMemo for performance

### File Organization
- **Strict File Locations**: Root directory ≤15 config files only
- **Images**: All in /public/assets/images/
- **Components**: Organized by domain in /src/components/
- **No Duplicates**: Each file has exactly one location
- **ISO Date Prefixes**: For documentation (YYYY-MM-DD-name.md)

### CSS and Styling
- **Tailwind CSS Only**: No custom CSS files except index.css
- **shadcn/ui Components**: Use as base, wrap for customization
- **Design Tokens**: Use CSS variables, no hardcoded colors
- **Responsive Design**: Mobile-first approach (375px baseline)
- **Accessibility**: WCAG 2.1 AA compliance mandatory

### Testing Requirements
- **TDD Mandatory**: For backend services and utilities
- **Coverage Requirements**: 80% for services, 70% for utilities  
- **Unit Tests**: Vitest for component and service testing
- **E2E Tests**: Playwright for critical user flows
- **No Test Scripts**: Agents use MCP tools directly
- **Results Archival**: Test results go to /archive/tests/ (git-ignored)

## Code Quality Gates
- **ESLint**: Must pass with zero errors
- **TypeScript**: Must compile without errors  
- **Tests**: Must pass before commits
- **Performance**: LCP <2.5s, CLS <0.1, FID <100ms