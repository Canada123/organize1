# Troubleshooting Guide - Next.js Intelligence Toolkit

**Purpose**: Resolve common issues when installing and using the Next.js Intelligence Toolkit
**Target**: 10+ common issues with detailed solutions
**Last Updated**: 2025-10-30

---

## Table of Contents

1. [Installation Issues](#installation-issues)
2. [Validation Issues](#validation-issues)
3. [Runtime Issues](#runtime-issues)
4. [Component Issues](#component-issues)
5. [Workflow Issues](#workflow-issues)
6. [Getting Help](#getting-help)

---

## Installation Issues

### Issue 1: Node.js Version Mismatch

**Symptom**: setup.sh fails with error: "Node.js 18+ required. Found: vX.X.X"

**Cause**: Using Node.js version < 18

**Solution**:
```bash
# Check current Node.js version
node --version

# Install Node.js 18+ using nvm (recommended)
nvm install 18
nvm use 18
nvm alias default 18

# OR install via package manager
# macOS: brew install node@18
# Ubuntu: sudo apt install nodejs
# Windows: Download from nodejs.org

# Verify installation
node --version  # Should show v18.x.x or higher

# Retry setup
./setup.sh
```

**Prevention**: Always check Node.js version before running setup.sh

---

### Issue 2: Claude Code Not Installed

**Symptom**: setup.sh fails with error: "Claude Code CLI not found"

**Cause**: Claude Code CLI not installed or not in PATH

**Solution**:
```bash
# Check if Claude Code is installed
which claude-code
# OR
which claude

# If not found, install Claude Code
# Visit: https://claude.ai/download
# Follow installation instructions for your platform

# Verify installation
claude-code --version

# Add to PATH if needed (macOS/Linux)
export PATH="$PATH:/path/to/claude-code"

# Retry setup
./setup.sh
```

**Alternative**: Use Claude Code without CLI by opening in desktop app

---

### Issue 3: Git Not Available

**Symptom**: setup.sh fails with error: "Git not found"

**Cause**: Git not installed or not in PATH

**Solution**:
```bash
# Check if Git is installed
which git

# Install Git
# macOS: brew install git
# Ubuntu: sudo apt install git
# Windows: Download from git-scm.com

# Verify installation
git --version

# Configure Git (if first time)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Retry setup
./setup.sh
```

**Prevention**: Install Git before running setup.sh

---

### Issue 4: Permission Errors During Installation

**Symptom**: setup.sh fails with "Permission denied" errors

**Cause**: Insufficient permissions to create directories or write files

**Solution**:
```bash
# Option 1: Fix directory permissions (preferred)
sudo chown -R $USER:$USER ~/.claude/
sudo chown -R $USER:$USER ./.claude/

# Option 2: Run setup with sudo (NOT RECOMMENDED for security)
# Only use if Option 1 fails
sudo ./setup.sh

# Option 3: Change installation scope
# Edit setup.sh to use different installation directory
# Change INSTALL_SCOPE from "both" to "project" if ~/.claude/ issues
```

**Prevention**: Ensure write permissions in target directories before installation

---

### Issue 5: Network/Download Failures

**Symptom**: setup.sh fails downloading files from GitHub with curl/wget errors

**Cause**: Network issues, firewall blocking, or GitHub API rate limits

**Solution**:
```bash
# Check network connectivity
ping github.com

# Verify curl/wget available
which curl
which wget

# Test GitHub raw file access
curl -I https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master/setup.sh

# If rate limited, wait or use authenticated requests
# GitHub API rate limit: 60 requests/hour (unauthenticated)

# Retry setup after network stabilizes
./setup.sh

# If persistent, download files manually
git clone https://github.com/yangsi7/nextjs-intelligence-toolkit.git
cd nextjs-intelligence-toolkit
# Follow manual installation steps in README.md
```

**Prevention**: Ensure stable network connection before running setup

---

### Issue 6: Incomplete Installation (Files Missing)

**Symptom**: setup.sh completes but files are missing in .claude/ directory

**Cause**: Partial download failure or interrupted installation

**Solution**:
```bash
# Check what's installed
ls -la .claude/
ls -la .claude/skills/nextjs-project-setup/
ls -la .claude/agents/
ls -la .claude/templates/

# Re-run setup.sh (it should detect existing files)
./setup.sh

# If files still missing, clean and reinstall
rm -rf .claude/
./setup.sh

# Verify installation
./validate-installation.sh
```

**Prevention**: Don't interrupt setup.sh during installation

---

## Validation Issues

### Issue 7: Global Skills Not Found

**Symptom**: validate-installation.sh reports:
```
Test 6 (Global Skills Detection): ⚠️ WARNING
- shadcn-ui skill: NOT FOUND in ~/.claude/skills/
- nextjs skill: NOT FOUND in ~/.claude/skills/
- tailwindcss skill: NOT FOUND in ~/.claude/skills/
```

**Cause**: Global skills not installed in ~/.claude/skills/

**Solution**:
```bash
# Global skills are SEPARATE installations
# These are NOT included in the toolkit installer

# You need to install these skills separately:
# 1. shadcn-ui skill (1,053 lines)
# 2. nextjs skill (1,129 lines)
# 3. tailwindcss skill (1,134 lines)

# Install from your skill repository OR
# Claude Code marketplace (if available)

# Verify installation
ls -la ~/.claude/skills/shadcn-ui/SKILL.md
ls -la ~/.claude/skills/nextjs/SKILL.md
ls -la ~/.claude/skills/tailwindcss/SKILL.md

# Retry validation
./validate-installation.sh
```

**Why Needed**: Global skills provide 3,316 lines of curated knowledge for the toolkit to reference (reduces token usage by 81%)

**Impact**: ⚠️ Warning level - toolkit still works but with reduced token efficiency

---

### Issue 8: MCP Tools Not Configured

**Symptom**: validate-installation.sh reports:
```
Test 5 (MCP Tools Detection): ⚠️ WARNING
- .mcp.json found: NO
- Required MCP servers (Vercel, Shadcn): 0/2
```

**Cause**: MCP servers not configured in .mcp.json

**Solution**:
```bash
# Create .mcp.json in project root OR ~/.claude/.mcp.json
cat > .mcp.json << 'EOF'
{
  "mcpServers": {
    "vercel": {
      "command": "npx",
      "args": ["-y", "@vercel/mcp"]
    },
    "shadcn": {
      "command": "npx",
      "args": ["-y", "@shadcn/mcp"]
    }
  }
}
EOF

# Optional MCP servers (recommended for full features):
# Add to the mcpServers object:
#   "supabase": { "command": "npx", "args": ["-y", "@supabase/mcp"] }
#   "21st-dev": { "command": "npx", "args": ["-y", "@21st-dev/mcp"] }
#   "ref": { "command": "npx", "args": ["-y", "@ref/mcp"] }

# Verify configuration
cat .mcp.json

# Retry validation
./validate-installation.sh
```

**Documentation**: See Claude Code MCP documentation for complete setup

**Impact**: ⚠️ Warning level - toolkit works but without external integrations (templates, components, databases)

---

### Issue 9: Reports Directory Error

**Symptom**: validate-installation.sh reports:
```
Test 8 (Phase 1 Installation): ❌ FAILED
- /reports/ directory: NOT FOUND
```

**OR during Phase 1 execution:
```
Error: cannot create /reports/foundation-research.md: No such file or directory
```

**Cause**: Reports directory not created during installation

**Solution**:
```bash
# Create reports directory manually
mkdir -p reports
touch reports/README.md

# Add .gitignore to reports/
cat > reports/.gitignore << 'EOF'
# Ignore all generated reports
*.md
!README.md
EOF

# Add README.md to reports/
cat > reports/README.md << 'EOF'
# Reports Directory

This directory stores generated reports during complex project setup:

- `foundation-research.md` - Phase 1 research output (700-1000 tokens)
- Other phase reports as generated

**Note**: Report files are gitignored (except this README)
EOF

# Verify directory structure
ls -la reports/

# Retry validation
./validate-installation.sh
```

**Prevention**: Future versions of setup.sh will create this automatically

---

### Issue 10: Template/Agent Files Missing

**Symptom**: validate-installation.sh reports missing templates or agents

**Cause**: Incomplete installation or file download failure

**Solution**:
```bash
# Check what's missing
./validate-installation.sh | grep "NOT FOUND"

# Re-download specific components
# Option 1: Re-run setup.sh (detects and fills gaps)
./setup.sh

# Option 2: Manually download missing files from GitHub
# Example for missing template:
curl -o .claude/templates/design-showcase.md \
  https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master/.claude/templates/design-showcase.md

# Example for missing agent:
curl -o .claude/agents/nextjs-design-ideator.md \
  https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master/.claude/agents/nextjs-design-ideator.md

# Verify fix
./validate-installation.sh
```

**Prevention**: Ensure stable network during installation

---

## Runtime Issues

### Issue 11: Skill Not Triggering Automatically

**Symptom**: Claude Code doesn't recognize project setup requests

**User says**: "Set up a Next.js blog"
**Claude responds**: Doesn't use nextjs-project-setup skill

**Cause**: Skill description doesn't match user prompt keywords

**Solution**:
```bash
# Option 1: Use explicit trigger (RECOMMENDED)
# In Claude Code, say:
"Use the nextjs-project-setup skill to create a simple Next.js blog."

# Option 2: Use description keywords
# Say phrases that match skill description:
"I want to create a new Next.js project from scratch"
"Set up a comprehensive Next.js application"
"Initialize a Next.js project with template selection"

# Option 3: Verify skill is loaded
# Ask Claude Code:
"What skills do you have available?"
# Should list: nextjs-project-setup

# Option 4: Check SKILL.md description
cat .claude/skills/nextjs-project-setup/SKILL.md | head -10
# Verify YAML frontmatter has description field
```

**Why This Happens**: Claude Code matches user prompts against skill descriptions to determine relevance

**Prevention**: Use keywords from skill description: "Next.js project setup", "template selection", "design system", "comprehensive"

---

### Issue 12: Agent Reports Exceed 2,500 Tokens

**Symptom**: Agent returns very long report causing context pollution

**Cause**: Agent not following truncation protocol

**Solution**:
```bash
# Check agent YAML frontmatter for token budget
cat .claude/agents/nextjs-design-ideator.md | head -20

# Agent should have truncation instructions in system prompt
# If missing, update agent file to include:

# Add to agent system prompt:
## Token Budget Enforcement

**Target**: ≤2,500 tokens

**Truncation**:
- IF report > 2,500t:
  - Truncate at 2,500t
  - Add marker: "[TRUNCATED - Request [CONTINUE] for more]"

**Continuation**:
- Main agent: "[CONTINUE]"
- Agent: Next 1,000t segment

# Verify SKILL.md has agent token limits documented
grep -A 10 "Token Budget" .claude/skills/nextjs-project-setup/SKILL.md

# If agent still exceeds limit, manually request truncation:
# In Claude Code, say:
"Please truncate your report to 2,500 tokens maximum and provide only:
- Executive summary (100-150 tokens)
- Key findings (300-400 tokens)
- Recommendations (200-300 tokens)
- Critical details only (1,500-1,700 tokens)"
```

**Prevention**: Ensure all agents have token budget enforcement in system prompts

---

### Issue 13: Complexity Assessment Incorrect

**Symptom**: Simple project routed to complex path (or vice versa)

**Example**:
- User: "Simple blog" → Complex path chosen (8 phases, 2-4 hours)
- User: "Multi-tenant SaaS" → Simple path chosen (15-30 minutes)

**Cause**: Complexity assessment logic unclear or user confirmation skipped

**Solution**:
```bash
# Complexity is based on 6 indicators:
# 1. Database required?
# 2. Custom authentication?
# 3. Multi-tenant architecture?
# 4. E-commerce features?
# 5. Complex design system?
# 6. Multiple integrations?

# Simple path: ≤1 indicator true
# Complex path: ≥2 indicators true

# Option 1: Explicit override
# In Claude Code, say:
"I want to set up a simple Next.js blog. Use the SIMPLE PATH (15-30 minutes)."
# OR:
"I want to set up a complex Next.js SaaS. Use the COMPLEX PATH (8 phases)."

# Option 2: Clarify requirements
# When Claude asks: "Should I use simple or complex path?"
# Respond clearly: "Use simple path" OR "Use complex path"

# Option 3: Check decision tree
cat .claude/skills/nextjs-project-setup/docs/decision-trees/complexity-assessment.md
# Verify your project matches the criteria
```

**Prevention**: Always confirm complexity assessment when prompted

---

### Issue 14: MCP Tool Connection Failures

**Symptom**: Errors like:
```
Error: Failed to connect to Vercel MCP server
Error: Shadcn MCP not responding
Error: Supabase MCP timeout
```

**Cause**: MCP server not installed, not running, or network issues

**Solution**:
```bash
# Test MCP server installation
npx @vercel/mcp --version
npx @shadcn/mcp --version
npx @supabase/mcp --version

# Check .mcp.json configuration
cat .mcp.json
# Verify "command": "npx" and correct package names

# Test MCP server manually
npx -y @vercel/mcp
# Should start server without errors

# Check Claude Code MCP integration
# In Claude Code settings, verify MCP tools are enabled

# Restart Claude Code if configuration changed

# If persistent issues, check network
ping registry.npmjs.org

# Verify npm can download packages
npm view @vercel/mcp
```

**Workaround**: If MCP unavailable, use manual mode:
```
# In Claude Code, say:
"Since MCP tools are unavailable, please manually guide me through:
1. Template selection (I'll choose from options you provide)
2. Component installation (I'll run commands you suggest)"
```

**Prevention**: Configure and test MCP tools before starting project setup

---

### Issue 15: Phase Progression Stuck

**Symptom**: Complex path workflow stuck at specific phase, doesn't progress

**Example**:
- Phase 4 (Design System) completes but Phase 5 (Wireframes) never starts
- Phase 1 (Foundation Research) repeats multiple times

**Cause**: Phase completion criteria not met or waiting for user input

**Solution**:
```bash
# Check current phase status
# In Claude Code, ask:
"What phase are we currently on? What's blocking progression to the next phase?"

# Common blockers:
# Phase 1: Waiting for /reports/foundation-research.md confirmation
# Phase 4: Waiting for design system approval (user feedback loop)
# Phase 5: Waiting for wireframe approval (user feedback loop)

# Option 1: Explicit approval
# In Claude Code, say:
"I approve the current phase output. Please proceed to the next phase."

# Option 2: Check acceptance criteria
grep -A 5 "Acceptance Criteria" .claude/skills/nextjs-project-setup/SKILL.md | grep "Phase X"
# Verify all criteria met

# Option 3: Check for user feedback loops
# Design System (Phase 4) has max 3 iterations
# Wireframes (Phase 5) has max 3 iterations
# If iteration limit reached, approve best option:
"I approve Option 2. Please proceed with that design."

# Option 4: Skip optional phases
"Skip Phase 5 (Wireframes) and proceed directly to Phase 6 (Implementation)."
```

**Prevention**: Respond promptly to user feedback requests during iterations

---

## Component Issues

### Issue 16: Shadcn Components Not Installing

**Symptom**: `npx shadcn@latest add button` fails with errors

**Cause**: Shadcn not initialized or components.json missing

**Solution**:
```bash
# Check if Shadcn initialized
ls -la components.json

# If missing, initialize Shadcn
npx shadcn@latest init

# Configuration prompts:
# - TypeScript: Yes
# - Style: New York (or Default)
# - Color: Slate (or preferred)
# - CSS variables: Yes (REQUIRED)
# - Tailwind config: Yes
# - Components directory: @/components
# - Utils directory: @/lib/utils

# Verify components.json created
cat components.json

# Retry component installation
npx shadcn@latest add button

# Check component installed
ls -la components/ui/button.tsx
```

**Common Errors**:
- "TypeScript not configured" → Add tsconfig.json
- "Tailwind not configured" → Add tailwind.config.ts
- "Path alias not set" → Update tsconfig.json with `"@/*": ["./*"]`

**Prevention**: Always run `npx shadcn@latest init` before adding components

---

### Issue 17: Dark Mode Not Working

**Symptom**: Dark mode toggle doesn't switch themes or CSS variables don't update

**Cause**: next-themes not installed or ThemeProvider not configured

**Solution**:
```bash
# Install next-themes
npm install next-themes

# Add ThemeProvider to root layout
# Edit app/layout.tsx:

import { ThemeProvider } from "next-themes"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

# Verify dark mode CSS variables in globals.css
grep -A 20 ".dark {" app/globals.css

# Test dark mode toggle
# Add to a component:
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

**Prevention**: Follow Shadcn dark mode setup guide: https://ui.shadcn.com/docs/dark-mode

---

### Issue 18: CSS Variables Not Applying

**Symptom**: Tailwind classes like `bg-primary` don't work or show wrong colors

**Cause**: CSS variables not defined or Tailwind config not updated

**Solution**:
```bash
# Check globals.css has CSS variables
cat app/globals.css | grep -A 30 ":root {"

# Verify tailwind.config.ts references CSS variables
cat tailwind.config.ts | grep -A 10 "colors:"

# Should see:
colors: {
  border: "hsl(var(--border))",
  input: "hsl(var(--input))",
  ring: "hsl(var(--ring))",
  background: "hsl(var(--background))",
  foreground: "hsl(var(--foreground))",
  primary: {
    DEFAULT: "hsl(var(--primary))",
    foreground: "hsl(var(--primary-foreground))",
  },
  // ... more colors
}

# If missing, copy from Shadcn docs or examples

# Verify globals.css imported in layout
grep "import.*globals.css" app/layout.tsx

# Should see:
import "./globals.css"

# Restart dev server
npm run dev
```

**Prevention**: Always use Shadcn init to set up CSS variables correctly

---

### Issue 19: Tailwind Not Compiling

**Symptom**: Tailwind classes don't apply styles or show in browser

**Cause**: Tailwind not configured correctly or content paths missing

**Solution**:
```bash
# Check tailwind.config.ts content paths
cat tailwind.config.ts | grep -A 10 "content:"

# Should include all relevant paths:
content: [
  "./pages/**/*.{ts,tsx}",
  "./components/**/*.{ts,tsx}",
  "./app/**/*.{ts,tsx}",
  "./src/**/*.{ts,tsx}",
]

# Verify Tailwind installed
npm list tailwindcss

# Check globals.css has Tailwind directives
cat app/globals.css | head -5

# Should see:
@tailwind base;
@tailwind components;
@tailwind utilities;

# Restart dev server (required after config changes)
npm run dev

# Clear Next.js cache if persistent
rm -rf .next
npm run dev
```

**Prevention**: Use `npx shadcn@latest init` to auto-configure Tailwind

---

## Workflow Issues

### Issue 20: Simple Path Chosen for Complex Project

**Symptom**: Started complex SaaS but got simple 15-30 minute workflow

**Cause**: Complexity assessment incorrect (≤1 indicator when should be ≥2)

**Solution**:
```bash
# Stop current workflow
# In Claude Code, say:
"Stop. I need to restart with the COMPLEX PATH instead."

# Restart with explicit path
"Use the nextjs-project-setup skill to set up a complex Next.js SaaS application.

Requirements (COMPLEX - multiple indicators):
- Database required: Supabase
- Custom authentication: Email + OAuth
- Multi-tenant architecture: Yes
- Features: User management, subscriptions, payments

Please use the COMPLEX PATH (8 phases, 2-4 hours)."

# Alternative: Provide all 6 indicators explicitly
"Complexity assessment:
[x] Database required
[x] Custom authentication
[x] Multi-tenant
[x] E-commerce
[ ] Complex design
[x] Multiple integrations

Count: 5/6 indicators = COMPLEX PATH"
```

**Prevention**: Be explicit about complexity requirements upfront

---

### Issue 21: Generated Files Incomplete

**Symptom**: Some expected files missing after workflow completion

**Examples**:
- No CLAUDE.md generated
- Missing /docs/ directory
- No components/ui/ directory
- No test files

**Cause**: Phase skipped or incomplete execution

**Solution**:
```bash
# Check what was generated
find . -name "CLAUDE.md"
find . -name "*.md" -path "*/docs/*"
ls -la components/ui/
find . -name "*.test.*" -o -name "*.spec.*"

# Identify missing phase
# Phase 2-3: /docs/ directory
# Phase 4: components/ui/ + tailwind.config.ts
# Phase 6: Implementation files
# Phase 8: CLAUDE.md + /docs/ audit

# Re-run specific phase
# In Claude Code, say:
"It looks like Phase 8 (Documentation) didn't complete. Please run Phase 8 now:
1. Create CLAUDE.md
2. Audit /docs/ directory
3. Clean repository
4. Generate documentation audit report"

# OR restart entire workflow if multiple phases missing
"Let's restart the complex path from the beginning with all 8 phases."

# Verify completion criteria
grep -A 20 "Success Criteria" .claude/skills/nextjs-project-setup/SKILL.md
# Check all criteria met
```

**Prevention**: Monitor phase completion messages and verify deliverables after each phase

---

## Getting Help

### Documentation Resources

1. **QUICKSTART.md** - 5-minute onboarding guide
   - Location: `/QUICKSTART.md`
   - When: First time using the toolkit
   - Content: Installation verification, simple example, token efficiency explanation

2. **ARCHITECTURE.md** - Complete system documentation
   - Location: `/ARCHITECTURE.md`
   - When: Understanding system design, token budgets, workflows
   - Content: CoD^Σ diagrams, component architecture, dependency graphs, extension points

3. **This Guide (TROUBLESHOOTING.md)** - Issue resolution
   - Location: `/TROUBLESHOOTING.md`
   - When: Encountering errors or unexpected behavior
   - Content: 21+ common issues with detailed solutions

4. **README.md** - Project overview
   - Location: `/README.md`
   - When: First introduction to the toolkit
   - Content: Features, prerequisites, installation, quick start

5. **Skill Documentation** - Main product documentation
   - Location: `/.claude/skills/nextjs-project-setup/SKILL.md`
   - When: Understanding skill workflows, phases, quality standards
   - Content: Complete 999-line skill definition (THE MAIN PRODUCT)

6. **Validation Report** - Installation health check
   - Location: `/INSTALLATION-VALIDATION-REPORT.md`
   - When: After running validate-installation.sh
   - Content: 8 test results, pass/warn/fail status, remediation guidance

---

### Example Projects

**Simple Blog Example**:
- Location: `/examples/simple-blog/README.md`
- Duration: 15-30 minutes
- Content: Complete walkthrough with expected terminal output
- When: Learning simple path workflow

**Complex SaaS Example**:
- Location: `/examples/complex-saas/README.md`
- Duration: Phase 1-3 documented (30 min + 15 min + 30 min)
- Content: Intelligence-first approach, token efficiency demonstration
- When: Learning complex path workflow, understanding Phase 1 research

---

### GitHub Issues

**Repository**: https://github.com/yangsi7/nextjs-intelligence-toolkit/issues

**When to Create Issue**:
- Bug found not covered in this troubleshooting guide
- Feature request or improvement suggestion
- Documentation unclear or incorrect
- Installation fails on specific platform/environment

**Issue Template**:
```markdown
**Environment**:
- OS: [macOS 14.5 / Ubuntu 22.04 / Windows 11]
- Node.js: [v18.17.0]
- Claude Code: [v1.2.3]
- Installation Scope: [project / user / both]

**Issue Description**:
[Clear description of the problem]

**Steps to Reproduce**:
1. [First step]
2. [Second step]
3. [Error occurs]

**Expected Behavior**:
[What should happen]

**Actual Behavior**:
[What actually happens]

**Validation Report** (if applicable):
```
[Paste output from ./validate-installation.sh]
```

**Error Messages** (if any):
```
[Paste exact error messages]
```

**Additional Context**:
[Any other relevant information]
```

---

### Validation Report Interpretation

**Run Validation**:
```bash
./validate-installation.sh
```

**Reading Results**:

1. **Overall Status**:
   - ✅ **EXCELLENT** - All 20 assertions passed (100% pass rate)
   - ✅ **GOOD** - 16-19 assertions passed (80-95% pass rate) with warnings only
   - ⚠️ **ACCEPTABLE** - 12-15 assertions passed (60-75% pass rate) with warnings
   - ❌ **NEEDS ATTENTION** - <12 assertions passed (<60% pass rate) with failures

2. **Test Categories**:
   - **Test 1-4**: Core skill functionality (nextjs-project-setup)
   - **Test 5-6**: External dependencies (MCP tools, global skills)
   - **Test 7-8**: Workflow validation (simple + complex paths)

3. **Action Required**:
   - ✅ Pass: No action needed
   - ⚠️ Warning: Optional improvement (doesn't block usage)
   - ❌ Fail: Required fix (blocks specific features)

**Example Interpretation**:
```
Test 5 (MCP Tools Detection): ⚠️ WARNING
Test 6 (Global Skills Detection): ⚠️ WARNING

Interpretation:
- Toolkit will work but with reduced efficiency
- MCP tools enable template/component discovery
- Global skills reduce token usage by 81%
- Recommended: Install for full features
- Acceptable: Skip if testing or learning toolkit
```

---

### Self-Service Debugging

**Step 1: Reproduce the Issue**
```bash
# Document exact steps that cause the problem
# Run with verbose output if possible
```

**Step 2: Check Validation**
```bash
./validate-installation.sh > validation-report.txt
cat validation-report.txt
# Look for related test failures
```

**Step 3: Search This Guide**
```bash
# Search for keywords related to your issue
grep -i "keyword" TROUBLESHOOTING.md

# Examples:
grep -i "permission" TROUBLESHOOTING.md
grep -i "network" TROUBLESHOOTING.md
grep -i "shadcn" TROUBLESHOOTING.md
```

**Step 4: Check Logs**
```bash
# Check Claude Code logs (if available)
# Check npm logs for installation errors
cat npm-debug.log

# Check system logs for permission issues
# macOS: tail -f /var/log/system.log
# Linux: tail -f /var/log/syslog
```

**Step 5: Verify File Structure**
```bash
# Check directory structure
tree .claude/ -L 2

# Check specific files exist
ls -la .claude/skills/nextjs-project-setup/SKILL.md
ls -la .claude/agents/nextjs-*.md
ls -la .claude/templates/*.md
```

**Step 6: Test Minimal Setup**
```bash
# Try simple path workflow
echo "Set up a simple Next.js blog" | claude-code

# If simple works but complex fails, issue is in complex path
# If both fail, issue is in base installation
```

---

### Community Support

**Discussions**: https://github.com/yangsi7/nextjs-intelligence-toolkit/discussions
- Q&A for usage questions
- Share tips and workflows
- Request features

**Examples Gallery**: `/examples/`
- Simple blog walkthrough
- Complex SaaS walkthrough
- More examples coming soon

---

## Quick Reference: Issue → Solution Mapping

| Symptom | Likely Cause | Solution Reference |
|---------|--------------|-------------------|
| "Node.js 18+ required" | Old Node version | Issue 1 |
| "Claude Code not found" | CLI not installed | Issue 2 |
| "Git not found" | Git not installed | Issue 3 |
| "Permission denied" | Insufficient permissions | Issue 4 |
| "Download failed" | Network issues | Issue 5 |
| "Global skills not found" | External skills missing | Issue 7 |
| ".mcp.json not found" | MCP not configured | Issue 8 |
| "/reports/ not found" | Directory missing | Issue 9 |
| "Skill not triggering" | Description mismatch | Issue 11 |
| "Agent report too long" | No truncation | Issue 12 |
| "Wrong complexity path" | Assessment incorrect | Issue 13 |
| "MCP connection failed" | Server not running | Issue 14 |
| "Phase stuck" | Missing user input | Issue 15 |
| "Shadcn install fails" | Not initialized | Issue 16 |
| "Dark mode broken" | next-themes missing | Issue 17 |
| "CSS variables don't work" | Not defined | Issue 18 |
| "Tailwind not compiling" | Config incorrect | Issue 19 |
| "Got simple instead of complex" | Explicit path needed | Issue 20 |
| "Files missing" | Phase incomplete | Issue 21 |

---

## Remember

**The Main Product**: nextjs-project-setup skill (999 lines) - THE CORE FOCUS

Everything else (setup.sh, validation, examples, documentation) exists to support your successful use of this skill.

**Most Common Issues**:
1. Global skills not installed (⚠️ Warning, reduces efficiency)
2. MCP tools not configured (⚠️ Warning, limits features)
3. Skill not triggering (use explicit trigger phrase)

**When in Doubt**:
1. Run `./validate-installation.sh` to diagnose
2. Search this guide for keywords
3. Check example projects for reference workflows
4. Create GitHub issue if truly stuck

**Success Metric**: If validation shows ≥80% pass rate (16+ assertions), toolkit is ready to use.

---

**Last Updated**: 2025-10-30
**Total Issues Documented**: 21 (exceeds 10+ requirement)
**Status**: Phase 4, Milestone M4.3 COMPLETE ✅
