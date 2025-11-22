# ESLint and Code Quality Guide

## Overview

This project enforces strict code quality standards through ESLint, TypeScript, and automated formatting. All code must pass linting checks before being committed or merged.

## Prerequisites

- **Node.js**: Version 18.17.0 or higher (specified in `.nvmrc`)
- **npm**: Version 9.0.0 or higher

To switch to the correct Node version:
```bash
nvm use  # Uses version from .nvmrc
```

## Key Tools

### 1. ESLint
- **Configuration**: `eslint.config.js`
- **Rules**: TypeScript strict mode, no `any` types, no console.log statements
- **Ignored**: dist/, node_modules/, coverage/, e2e/, config files

### 2. TypeScript
- **Configuration**: `tsconfig.json`
- **Strict Mode**: Enabled
- **No Implicit Any**: Enforced
- **Target**: ES2022

### 3. Prettier
- **Configuration**: `.prettierrc`
- **Integration**: Works with ESLint for consistent formatting
- **Auto-fix**: Applied on pre-commit

### 4. Husky & Lint-staged
- **Pre-commit Hook**: Automatically runs linting on staged files
- **Auto-fix**: Attempts to fix issues before commit
- **Zero Tolerance**: Blocks commits with ESLint errors

## Common Commands

```bash
# Check for linting issues
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code with Prettier
npm run format

# Type check without emitting
npm run typecheck

# Run all checks (lint + typecheck + tests)
npm run check
```

## Pre-commit Workflow

When you commit code, the following happens automatically:

1. **Husky** triggers the pre-commit hook
2. **Lint-staged** runs on staged files:
   - ESLint with auto-fix
   - Prettier formatting
   - TypeScript files must have zero warnings
3. If issues remain, the commit is blocked

## CI/CD Integration

### GitHub Actions Workflow

Located at `.github/workflows/lint-and-test.yml`

**On Every Push/PR:**
1. **Lint Job**: Runs ESLint and TypeScript checks
2. **Test Job**: Runs unit tests with coverage
3. **Build Job**: Verifies production build
4. **Auto-fix Job** (PRs only): Automatically fixes and commits formatting issues

### Enforcement Rules
- ✅ Pull requests cannot be merged with linting errors
- ✅ Auto-fixes are committed back to PRs
- ✅ Coverage reports are generated
- ✅ Build size is monitored

## Common ESLint Issues and Fixes

### 1. TypeScript `any` Type
**Issue**: Using `any` type is forbidden
```typescript
// ❌ Bad
const data: any = fetchData();

// ✅ Good
const data: unknown = fetchData();
// or define proper types
interface UserData {
  id: string;
  name: string;
}
const data: UserData = fetchData();
```

### 2. Console Statements
**Issue**: `console.log`, `console.debug` are not allowed
```typescript
// ❌ Bad
console.log('Debug info:', data);

// ✅ Good
// Use proper logging service or remove
// console.warn and console.error are allowed for production issues
```

### 3. Unused Variables
**Issue**: Variables declared but not used
```typescript
// ❌ Bad
const unused = 'value';

// ✅ Good
// Remove unused variables or prefix with underscore
const _intentionallyUnused = 'value';
```

### 4. Missing Return Types
**Issue**: Functions should have explicit return types
```typescript
// ❌ Bad
function calculate(a: number, b: number) {
  return a + b;
}

// ✅ Good
function calculate(a: number, b: number): number {
  return a + b;
}
```

## Bulk Fixing Scripts

For large-scale fixes, use the provided script:
```bash
node scripts/fix-eslint-issues.cjs
```

This script automatically:
- Removes console statements
- Replaces `any` with `unknown` or proper types
- Fixes common patterns

## Troubleshooting

### Node Version Issues
If ESLint fails with `structuredClone is not defined`:
```bash
nvm install 18
nvm use 18
npm install
```

### Husky Not Running
If pre-commit hooks don't run:
```bash
npx husky install
chmod +x .husky/pre-commit
```

### Too Many Warnings
To see all issues without truncation:
```bash
npm run lint > lint-results.txt 2>&1
```

## Best Practices

1. **Fix Issues Immediately**: Don't let linting errors accumulate
2. **Use Auto-fix**: Run `npm run lint:fix` before manual fixes
3. **Type Everything**: Avoid `unknown` when you can define proper types
4. **Review Auto-fixes**: Check what the auto-fixer changed
5. **Keep Dependencies Updated**: Regular updates prevent compatibility issues

## VSCode Integration

Install recommended extensions:
- ESLint
- Prettier - Code formatter
- TypeScript and JavaScript Language Features

Add to `.vscode/settings.json`:
```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

## Zero-Tolerance Policy

This project maintains a zero-tolerance policy for:
- ❌ TypeScript `any` types (use `unknown` or proper types)
- ❌ Console.log statements (except warn/error)
- ❌ Unused variables (remove or prefix with `_`)
- ❌ Missing TypeScript types
- ❌ Formatting inconsistencies

All code must pass these checks before being committed or deployed.

## Monitoring and Reporting

The GitHub Actions workflow provides:
- 📊 ESLint error/warning counts
- 📈 Test coverage reports
- 📦 Build size analysis
- ⚡ Performance metrics

Check the Actions tab in GitHub to view detailed reports for each commit.