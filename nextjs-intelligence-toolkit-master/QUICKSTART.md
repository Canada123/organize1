# Quick Start Guide - Next.js Intelligence Toolkit

**Duration**: 5 minutes
**Goal**: Get up and running with the Next.js Intelligence Toolkit

This guide will help you verify your installation and create your first Next.js project in 5 minutes.

---

## Step 1: Verify Installation (1 minute)

After running the installation script, verify everything is working:

```bash
# Run the validation script
./validate-installation.sh
```

**Expected Output**:
```
Installation Validation Report

Summary:
- Test Categories: 8
- Total Assertions: 20
- Passed: 19 ✅
- Failed: 0 ❌
- Warnings: 1 ⚠️
- Pass Rate: 95%

Status: ✅ GOOD - All tests passed with 1 warnings
```

**If you see issues**:
- **Missing global skills?** Install from `~/.claude/skills/` (shadcn-ui, nextjs, tailwindcss)
- **Missing MCP tools?** Configure .mcp.json (Vercel, Shadcn required; Supabase, 21st-dev optional)
- **Missing /reports/ directory?** It will be created automatically on first use

---

## Step 2: Explore Simple Blog Example (2 minutes)

The toolkit includes a complete walkthrough for creating a simple blog:

```bash
cd examples/simple-blog/
cat README.md
```

**What you'll see**:
- 15-30 minute workflow for simple Next.js blog
- Complete terminal output for each step
- Template selection → Setup → Components → Design → Documentation

**Key Takeaway**: Simple projects (blogs, portfolios) follow a streamlined path with minimal configuration.

**Try it yourself** (optional - 15-30 min):
```bash
mkdir ~/test-blog
cd ~/test-blog
claude-code
# Then paste: "I want to set up a simple Next.js blog. No database, no auth, simple design."
```

---

## Step 3: Learn About Token Efficiency (2 minutes)

The toolkit uses an **intelligence-first approach** for complex projects:

**Before** (Old approach):
```
4 Research Agents × 2,000 tokens each = 8,000 tokens
```

**After** (Intelligence-first):
```
Global skills review:     500 tokens
MCP queries:             300 tokens
Synthesis:               700 tokens
─────────────────────────────────────
Total:                 1,500 tokens

Savings: 6,500 tokens (81% reduction)
```

**How it works**:
1. **Review global skills** (shadcn-ui, nextjs, tailwindcss) → 3,316 lines of curated knowledge
2. **Query MCP tools** (Vercel, Shadcn, Supabase) → real-time authoritative info
3. **Synthesize context** → concise foundation research report
4. **Output**: `/reports/foundation-research.md` (700-1,000 tokens)

**See complex example**:
```bash
cd examples/complex-saas/
cat README.md  # Phase 1: Foundation Research walkthrough
```

---

## Step 4: Next Steps

### Option A: Create Your Own Project

**Simple Project** (blog, portfolio, marketing site):
```bash
mkdir my-project
cd my-project
claude-code
# Paste: "I want to set up a simple Next.js [blog|portfolio|marketing site]."
```

**Complex Project** (SaaS, e-commerce, multi-tenant):
```bash
mkdir my-saas-app
cd my-saas-app
claude-code
# Paste: "I want to set up a complex Next.js SaaS with [database|auth|multi-tenant|features]."
```

### Option B: Read Full Documentation

- **ARCHITECTURE.md** - System overview, CoD^Σ diagrams, token budgets
- **TROUBLESHOOTING.md** - 10+ common issues with solutions
- **.claude/skills/nextjs-project-setup/SKILL.md** - Complete skill documentation (999 lines)

### Option C: Share Feedback

Found an issue or have a suggestion?
- **GitHub Issues**: https://github.com/yangsi7/nextjs-intelligence-toolkit/issues

---

## Troubleshooting Quick Tips

### Issue: Skill not triggering automatically

**Symptom**: Claude Code doesn't recognize project setup requests

**Fix**: Use explicit trigger:
```
Use the nextjs-project-setup skill to create a [simple|complex] Next.js project.
```

---

### Issue: Global skills not found

**Symptom**: Validation reports missing shadcn-ui, nextjs, or tailwindcss skills

**Fix**: Install global skills in `~/.claude/skills/`:
```bash
# These are separate skills you need to install
# See your skill repository or Claude Code marketplace
```

**Why needed**: Global skills provide 3,316 lines of curated knowledge for:
- shadcn-ui (1,053 lines) - Component library, dark mode, forms, theming
- nextjs (1,129 lines) - App Router, routing, data fetching, optimization
- tailwindcss (1,134 lines) - Design tokens, responsive design, utilities

---

### Issue: MCP tools not configured

**Symptom**: Validation reports missing Vercel or Shadcn MCP

**Fix**: Configure `.mcp.json` in your project or `~/.claude/.mcp.json`:
```json
{
  "mcpServers": {
    "vercel": { "command": "npx", "args": ["-y", "@vercel/mcp"] },
    "shadcn": { "command": "npx", "args": ["-y", "@shadcn/mcp"] }
  }
}
```

See Claude Code MCP documentation for complete setup.

---

### Issue: Reports directory error

**Symptom**: Phase 1 fails with "cannot create /reports/foundation-research.md"

**Fix**: Directory will be created automatically. If persists:
```bash
mkdir reports
touch reports/README.md
```

---

## Success! 🎉

You're ready to build production-ready Next.js apps with AI assistance.

**What you learned**:
- ✅ Verified installation (95% pass rate)
- ✅ Explored simple blog example (15-30 min workflow)
- ✅ Learned token efficiency (81% savings)
- ✅ Know next steps (create project, read docs, share feedback)

**Key Principle**: The **nextjs-project-setup skill** (999 lines) is the main product. Everything else (setup.sh, validation, examples, docs) supports your ability to use this skill effectively.

---

## Quick Reference

| What | Command |
|------|---------|
| **Validate installation** | `./validate-installation.sh` |
| **Simple project** | `claude-code` → "simple Next.js blog" |
| **Complex project** | `claude-code` → "complex SaaS with [features]" |
| **Documentation** | Read ARCHITECTURE.md, TROUBLESHOOTING.md |
| **Examples** | See examples/simple-blog/, examples/complex-saas/ |
| **Issues** | https://github.com/yangsi7/nextjs-intelligence-toolkit/issues |

**Installation reminder**:
```bash
curl -fsSL https://raw.githubusercontent.com/yangsi7/nextjs-intelligence-toolkit/master/setup.sh | bash
```

---

**Next**: Create your first project or read [ARCHITECTURE.md](ARCHITECTURE.md) for deeper understanding.
