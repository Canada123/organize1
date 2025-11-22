#!/usr/bin/env python3
"""
Enhanced Event Stream Logger
"""
import json
import sys
import os
import re
from datetime import datetime
from pathlib import Path

# Event type mapping
TOOL_EVENT_MAPPING = {
    'Write': 'Action', 'Edit': 'Action', 'MultiEdit': 'Action',
    'TodoWrite': 'PlanUpdate', 'Task': 'Action',
    'Read': 'Observation', 'WebSearch': 'Research',
    'mcp__memory__create_entities': 'GraphUpdate',
    'mcp__memory__store': 'MemoryStore',
}

def detect_current_task(project_dir):
    """Extract current task ID from todo.md."""
    todo_path = Path(project_dir) / 'context' / 'todo.md'
    if not todo_path.exists():
        return None
    
    try:
        with open(todo_path, 'r') as f:
            content = f.read()
        
        # Find section headers with task IDs [SEC-001]
        section_tasks = re.findall(r'##.*?\[([A-Z]+-\d+(?:\.\d+)?)\]', content)
        if section_tasks:
            return section_tasks[0]
            
    except Exception:
        pass
    
    return None

def infer_reason(tool_name, tool_input):
    """Infer the reason/context for the action."""
    reasons = []
    
    if tool_name == 'Write':
        file_path = tool_input.get('file_path', '')
        if '.md' in file_path:
            reasons.append("updating documentation")
        elif 'context' in file_path:
            reasons.append("updating working files")
    elif tool_name == 'TodoWrite':
        todos = tool_input.get('todos', [])
        completed = sum(1 for t in todos if t.get('status') == 'completed')
        if completed > 0:
            reasons.append(f"completing {completed} task(s)")
    
    return f" ({', '.join(reasons)})" if reasons else ""

def format_enhanced_event_description(tool_name, tool_input, project_dir):
    """Generate an enhanced description."""
    # Base description
    if tool_name == 'Write':
        file_name = os.path.basename(tool_input.get('file_path', 'unknown'))
        description = f"Created/updated {file_name}"
    elif tool_name == 'TodoWrite':
        todos = tool_input.get('todos', [])
        completed = sum(1 for t in todos if t.get('status') == 'completed')
        in_progress = sum(1 for t in todos if t.get('status') == 'in_progress')
        pending = sum(1 for t in todos if t.get('status') == 'pending')
        description = f"Updated todos: {completed} completed, {in_progress} in progress, {pending} pending"
    else:
        description = f"{tool_name} operation completed"
    
    # Add task context
    task_id = detect_current_task(project_dir)
    if task_id:
        description = f"[{task_id}] {description}"
    
    # Add reason
    reason = infer_reason(tool_name, tool_input)
    if reason:
        description += reason
    
    return description

def append_event(event_line, event_stream_path):
    """Append event to stream."""
    try:
        with open(event_stream_path, 'r') as f:
            lines = f.readlines()
        
        # Find last event line
        last_event_index = -1
        for i in range(len(lines) - 1, -1, -1):
            if lines[i].strip().startswith('['):
                last_event_index = i
                break
        
        # Insert after last event
        if last_event_index == -1:
            lines.append(event_line + '\n')
        else:
            lines.insert(last_event_index + 1, event_line + '\n')
        
        with open(event_stream_path, 'w') as f:
            f.writelines(lines)
        
        return True
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        return False

def main():
    """Main function."""
    try:
        input_data = json.load(sys.stdin)
        
        if input_data.get('hook_event_name') != 'PostToolUse':
            sys.exit(0)
        
        tool_name = input_data.get('tool_name', '')
        if tool_name in ['LS', 'BashOutput']:
            sys.exit(0)
        
        tool_input = input_data.get('tool_input', {})
        project_dir = os.environ.get('CLAUDE_PROJECT_DIR', os.getcwd())
        event_stream_path = Path(project_dir) / 'context' / 'event-stream.md'
        
        # Generate enhanced event
        timestamp = datetime.now().strftime('[%Y-%m-%d %H:%M]')
        event_type = TOOL_EVENT_MAPPING.get(tool_name, 'Action')
        description = format_enhanced_event_description(tool_name, tool_input, project_dir)
        
        event_line = f"{timestamp} {event_type} - {description}"
        
        if append_event(event_line, event_stream_path):
            print(f"📝 Enhanced event: {event_line}")
    
    except Exception as e:
        print(f"Hook error: {e}", file=sys.stderr)
    
    sys.exit(0)

if __name__ == '__main__':
    main()
