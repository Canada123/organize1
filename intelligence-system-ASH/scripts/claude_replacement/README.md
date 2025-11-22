# Claude Replacement System

## Problem:
yangsi7 systems expect Claude to:
1. Read markdown prompts
2. Process via API
3. Return results

## Solution:
Replace each Claude-dependent component with:

### 1. Prompt Interpreter
- Reads yangsi7 markdown prompts
- Extracts the INTENT (what work should be done)
- Executes equivalent Python code

### 2. Local Execution Engine  
- Uses your existing ML toolbox
- Processes your 2000 indexes directly
- Returns structured results

### 3. Workflow Coordinator
- Manages task flows between systems
- Maintains project memory
- Tracks progress

## Files to replace:
- intelligence-system/agents/*.md → claude_replacement/local_agents/
- nextjs-intelligence-toolkit/components/*.md → claude_replacement/local_components/
