#!/usr/bin/env python3
"""
Event Stream API Utilities - Quick version for programmatic access
"""
import json
import re
from datetime import datetime
from pathlib import Path

def get_recent_events(project_dir, limit=10):
    """Get recent events from the stream."""
    event_stream_path = Path(project_dir) / 'context' / 'event-stream.md'
    
    if not event_stream_path.exists():
        return []
    
    with open(event_stream_path, 'r') as f:
        lines = f.readlines()
    
    events = []
    for line in lines:
        if line.strip().startswith('['):
            # Parse basic event structure
            match = re.match(r'\[([^\]]+)\]\s+(\w+)\s+-\s+(.*)', line.strip())
            if match:
                timestamp_str, event_type, description = match.groups()
                events.append({
                    'timestamp': timestamp_str,
                    'type': event_type,
                    'description': description
                })
    
    return events[-limit:]

def get_events_by_task(project_dir, task_id):
    """Get all events for a specific task."""
    event_stream_path = Path(project_dir) / 'context' / 'event-stream.md'
    
    if not event_stream_path.exists():
        return []
    
    with open(event_stream_path, 'r') as f:
        content = f.read()
    
    # Find events with the task ID
    events = []
    for line in content.splitlines():
        if line.strip().startswith('[') and f'[{task_id}]' in line:
            events.append(line.strip())
    
    return events

# Quick CLI for testing
if __name__ == '__main__':
    import sys
    project_dir = sys.argv[1] if len(sys.argv) > 1 else '.'
    
    print("Recent Events:")
    for event in get_recent_events(project_dir):
        print(f"  {event['timestamp']} {event['type']} - {event['description']}")
