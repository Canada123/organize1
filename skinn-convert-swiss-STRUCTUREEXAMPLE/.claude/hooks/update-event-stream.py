#!/usr/bin/env python3
"""
Complete Enhanced Event Stream Logger
Provides task correlation, contextual reasoning, phase tracking, and automatic archival.
"""
import json
import sys
import os
import re
from datetime import datetime
from pathlib import Path

# Event type mapping based on tool names
TOOL_EVENT_MAPPING = {
    'Write': 'Action',
    'Edit': 'Action', 
    'MultiEdit': 'Action',
    'NotebookEdit': 'Action',
    'Bash': 'Action',
    'Task': 'Action',
    'Read': 'Observation',
    'Grep': 'Observation',
    'Glob': 'Observation',
    'WebSearch': 'Research',
    'WebFetch': 'Research',
    'TodoWrite': 'PlanUpdate',
    'mcp__memory__create_entities': 'GraphUpdate',
    'mcp__memory__create_relations': 'GraphUpdate',
    'mcp__memory__store': 'MemoryStore',
    'mcp__memory__recall': 'MemoryRecall',
    'mcp__serena__find_symbol': 'CodeAnalysis',
    'mcp__serena__search_for_pattern': 'CodeAnalysis',
}

# Phase patterns from CLAUDE_PROCESS.md
PHASE_PATTERNS = {
    'Context Gathering': ['context', 'load', 'gather', 'requirements'],
    'Analysis': ['analysis', 'analyze', 'examine', 'investigate'],
    'Research': ['research', 'search', 'investigate', 'documentation'],
    'Brainstorm': ['brainstorm', 'ideate', 'concept', 'options'],
    'Planning': ['plan', 'strategy', 'roadmap', 'breakdown'],
    'Execution': ['implement', 'create', 'build', 'develop'],
    'Review': ['review', 'audit', 'assess', 'evaluate'],
    'Delivery': ['deliver', 'complete', 'finalize', 'deploy']
}

def detect_current_task(project_dir):
    """Extract current task ID from todo.md using section headers."""
    todo_path = Path(project_dir) / 'context' / 'todo.md'
    if not todo_path.exists():
        return None
    
    try:
        with open(todo_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find section headers with task IDs like [SEC-001], [EQ-001.1]
        section_tasks = re.findall(r'##.*?\[([A-Z]+-\d+(?:\.\d+)?)\]', content)
        if section_tasks:
            return section_tasks[0]  # Return first/current task
            
    except Exception:
        pass
    
    return None

def detect_current_phase(tool_name, tool_input, description):
    """Detect current CLAUDE_PROCESS.md phase based on activity."""
    description_lower = description.lower()
    tool_lower = tool_name.lower()
    
    # Check tool input for phase indicators
    input_text = ""
    if isinstance(tool_input, dict):
        input_text = str(tool_input).lower()
    
    combined_text = f"{description_lower} {tool_lower} {input_text}"
    
    for phase, keywords in PHASE_PATTERNS.items():
        if any(keyword in combined_text for keyword in keywords):
            return phase
    
    # Default phase based on tool type
    if tool_name in ['Read', 'Grep', 'Glob']:
        return 'Context Gathering'
    elif tool_name in ['WebSearch', 'WebFetch']:
        return 'Research'
    elif tool_name in ['TodoWrite']:
        return 'Planning'
    elif tool_name in ['Write', 'Edit', 'MultiEdit']:
        return 'Execution'
    elif tool_name == 'Task':
        return 'Execution'
    
    return 'Execution'

def infer_reason(tool_name, tool_input):
    """Infer the contextual reason for the action."""
    reasons = []
    
    if tool_name == 'Write':
        file_path = tool_input.get('file_path', '')
        if '.md' in file_path and 'context' in file_path:
            reasons.append("updating working context")
        elif '.md' in file_path and 'docs' in file_path:
            reasons.append("updating documentation")
        elif '.tsx' in file_path or '.ts' in file_path:
            reasons.append("implementing component")
        elif '.py' in file_path:
            reasons.append("updating hook/script")
    
    elif tool_name == 'TodoWrite':
        todos = tool_input.get('todos', [])
        completed = sum(1 for t in todos if t.get('status') == 'completed')
        in_progress = sum(1 for t in todos if t.get('status') == 'in_progress')
        if completed > 0:
            reasons.append(f"completing {completed} task(s)")
        if in_progress > 0:
            reasons.append(f"progressing {in_progress} task(s)")
    
    elif tool_name == 'Task':
        subagent = tool_input.get('subagent_type', '')
        if subagent:
            reasons.append(f"delegating to {subagent}")
    
    return f" ({', '.join(reasons)})" if reasons else ""

def format_enhanced_event_description(tool_name, tool_input, project_dir):
    """Generate an enhanced event description with full context."""
    
    # FIRST: Check if tool provided a description parameter (Claude often does)
    if 'description' in tool_input and tool_input['description']:
        base_description = tool_input['description']
    else:
        # Fallback to generating description from tool parameters
        if tool_name == 'Write':
            file_path = tool_input.get('file_path', 'unknown')
            file_name = os.path.basename(file_path)
            base_description = f"Created/updated {file_name}"
        
        elif tool_name in ['Edit', 'MultiEdit']:
            file_path = tool_input.get('file_path', 'unknown')
            file_name = os.path.basename(file_path)
            if tool_name == 'MultiEdit':
                edits_count = len(tool_input.get('edits', []))
                base_description = f"Made {edits_count} edits to {file_name}"
            else:
                base_description = f"Modified {file_name}"
        
        elif tool_name == 'Bash':
            command = tool_input.get('command', '')[:50]
            base_description = f"Executed: {command}"
        
        elif tool_name == 'TodoWrite':
            todos = tool_input.get('todos', [])
            completed = sum(1 for t in todos if t.get('status') == 'completed')
            in_progress = sum(1 for t in todos if t.get('status') == 'in_progress')
            pending = sum(1 for t in todos if t.get('status') == 'pending')
            base_description = f"Updated todos: {completed} completed, {in_progress} in progress, {pending} pending"
        
        elif tool_name == 'Task':
            subagent = tool_input.get('subagent_type', 'unknown')
            task_desc = tool_input.get('description', 'task')[:50]
            prompt_preview = tool_input.get('prompt', '')[:100] if 'prompt' in tool_input else ''
            if prompt_preview:
                # Extract key intent from prompt
                base_description = f"Invoked {subagent}: {task_desc}"
            else:
                base_description = f"Invoked {subagent} for {task_desc}"
        
        elif tool_name == 'Read':
            file_path = tool_input.get('file_path', 'unknown')
            file_name = os.path.basename(file_path)
            base_description = f"Read {file_name}"
        
        elif tool_name.startswith('mcp__'):
            # MCP tools - extract meaningful description
            parts = tool_name.split('__')
            if len(parts) >= 3:
                server, operation = parts[1], parts[2]
                base_description = f"{server.capitalize()} {operation.replace('_', ' ')}"
            else:
                base_description = f"{tool_name} operation"
        
        else:
            base_description = f"{tool_name} operation completed"
    
    description = base_description
    
    # Add task context
    task_id = detect_current_task(project_dir)
    if task_id:
        description = f"[{task_id}] {description}"
    
    # Add contextual reason
    reason = infer_reason(tool_name, tool_input)
    if reason:
        description += reason
    
    # Add phase context
    phase = detect_current_phase(tool_name, tool_input, description)
    if phase:
        description += f" | Phase: {phase}"
    
    return description

def count_events(event_stream_path):
    """Count total events in the stream."""
    try:
        with open(event_stream_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        return sum(1 for line in lines if line.strip().startswith('['))
    except Exception:
        return 0

def archive_events(event_stream_path, keep_events=250):
    """Archive old events when threshold is exceeded."""
    try:
        with open(event_stream_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Find all event lines
        event_lines = [line for line in lines if line.strip().startswith('[')]
        non_event_lines = [line for line in lines if not line.strip().startswith('[')]
        
        if len(event_lines) <= keep_events:
            return False  # No archival needed
        
        # Create archive directory
        archive_dir = event_stream_path.parent.parent / 'archive' / 'events'
        archive_dir.mkdir(parents=True, exist_ok=True)
        
        timestamp = datetime.now().strftime('%Y-%m-%d')
        archive_path = archive_dir / f'event-stream-archive-{timestamp}.md'
        
        # Archive old events
        events_to_archive = event_lines[:-keep_events]
        with open(archive_path, 'w', encoding='utf-8') as f:
            f.write(f"# Archived Event Stream - {timestamp}\n")
            f.write(f"Archived {len(events_to_archive)} events\n\n")
            f.writelines(events_to_archive)
        
        # Keep recent events and header content
        with open(event_stream_path, 'w', encoding='utf-8') as f:
            f.writelines(non_event_lines)
            f.write(f"\n> **Archived**: {len(events_to_archive)} older events archived to archive/events/event-stream-archive-{timestamp}.md\n\n")
            f.writelines(event_lines[-keep_events:])
        
        print(f"📁 Archived {len(events_to_archive)} events to {archive_path}", file=sys.stderr)
        return True
        
    except Exception as e:
        print(f"Archival error: {e}", file=sys.stderr)
        return False

def create_subagent_context(event_line, project_dir):
    """Create filtered context for subagents."""
    try:
        context_dir = Path(project_dir) / 'context' / 'subagent-contexts'
        context_dir.mkdir(parents=True, exist_ok=True)
        
        # Extract tool name from event line for subagent filtering
        if 'Invoked ' in event_line and ' for ' in event_line:
            match = re.search(r'Invoked (\w+(?:-\w+)*) for', event_line)
            if match:
                subagent_type = match.group(1)
                
                context_file = context_dir / f'{subagent_type}-context.json'
                
                context_data = {
                    'timestamp': datetime.now().isoformat(),
                    'last_event': event_line.strip(),
                    'agent_type': subagent_type,
                    'recent_events': []
                }
                
                # Add recent relevant events if context file exists
                if context_file.exists():
                    try:
                        with open(context_file, 'r', encoding='utf-8') as f:
                            existing_data = json.load(f)
                        context_data['recent_events'] = existing_data.get('recent_events', [])[-10:]
                    except:
                        pass
                
                context_data['recent_events'].append(event_line.strip())
                
                with open(context_file, 'w', encoding='utf-8') as f:
                    json.dump(context_data, f, indent=2)
                
    except Exception as e:
        print(f"Subagent context error: {e}", file=sys.stderr)

def append_event(event_line, event_stream_path, project_dir):
    """Append event to stream with archival management."""
    try:
        # Check if archival is needed (500 event threshold)
        event_count = count_events(event_stream_path)
        if event_count >= 500:
            archive_events(event_stream_path, keep_events=250)
        
        # Read current file
        with open(event_stream_path, 'r', encoding='utf-8') as f:
            lines = f.readlines()
        
        # Find the last event line for insertion
        last_event_index = -1
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip().startswith('['):
                last_event_index = i
                break
        
        # Insert new event after last event
        if last_event_index == -1:
            lines.append(event_line + '\n')
        else:
            lines.insert(last_event_index + 1, event_line + '\n')
        
        # Write back to file
        with open(event_stream_path, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        
        # Subagent context creation disabled - using temporary context files instead
        # create_subagent_context(event_line, project_dir)
        
        return True
        
    except Exception as e:
        print(f"Error updating event stream: {e}", file=sys.stderr)
        return False

def main():
    """Complete enhanced event stream hook main function."""
    try:
        # Read input from stdin
        input_data = json.load(sys.stdin)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON input: {e}", file=sys.stderr)
        sys.exit(1)
    
    # Extract event information
    hook_event = input_data.get('hook_event_name', '')
    tool_name = input_data.get('tool_name', '')
    tool_input = input_data.get('tool_input', {})
    
    # Only process PostToolUse events
    if hook_event != 'PostToolUse':
        sys.exit(0)
    
    # Skip certain tools that don't need logging
    skip_tools = ['LS', 'BashOutput', 'KillBash', 'ListMcpResourcesTool']
    if tool_name in skip_tools:
        sys.exit(0)
    
    # Get project directory
    project_dir = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
    event_stream_path = Path(project_dir) / 'context' / 'event-stream.md'
    
    if not event_stream_path.exists():
        print(f"Warning: {event_stream_path} does not exist", file=sys.stderr)
        sys.exit(1)
    
    # Generate enhanced event entry
    timestamp = datetime.now().strftime('[%Y-%m-%d %H:%M]')
    event_type = TOOL_EVENT_MAPPING.get(tool_name, 'Action')
    description = format_enhanced_event_description(tool_name, tool_input, project_dir)
    
    # Format the enhanced event line
    event_line = f"{timestamp} {event_type} - {description}"
    
    # Append to event stream with full functionality
    if append_event(event_line, event_stream_path, project_dir):
        print(f"📝 Complete enhanced event: {event_line}")
    
    sys.exit(0)

if __name__ == '__main__':
    main()
