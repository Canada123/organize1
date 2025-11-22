# Quick Start - Working Game System

## What This Is

A working game system with:
- Config-driven actions (modify actions.yaml, no code changes)
- Distributed lock enforcement
- Chain mechanics
- Penalty system

## Files

1. **ARCHITECTURE.md** - How it all fits together
2. **game_system.py** - Working implementation (4 components)
3. **actions.yaml** - Action configuration (NOT HARDCODED)

## Run It

### Prerequisites
```bash
pip install redis pyyaml
```

### Start Redis
```bash
# Option 1: Docker
docker run -d -p 6379:6379 redis

# Option 2: Local install
redis-server
```

### Run the game
```bash
python game_system.py
```

You'll see:
```
=== Player A witnesses event ===
{'success': True, 'message': 'Player player_a witnessed event 123', ...}

=== Player B doubts Player A ===
NOTIFY player_a: doubt in chain chain_xxx
  Valid responses: ['prove', 'defend', 'admit']

=== Player A tries another action (should fail - locked) ===
{'error': 'Action locked - complete current action first'}
```

## Modify Actions

Edit `actions.yaml`:
```yaml
actions:
  your_new_action:
    requires_lock: true
    ttl: 180
    valid_responses:
      - response1
      - response2
    penalty:
      reputation: -100
      ban: 600
```

Register handler in Python:
```python
def handle_your_action(player_id, action_name, params):
    # Your logic here
    return {'success': True, ...}

action_registry.register_handler('your_new_action', handle_your_action)
```

That's it. No code changes to core system.

## Architecture

4 components:

1. **ActionRegistry** - Loads actions from YAML, executes with lock enforcement
2. **LockManager** - Distributed locks using Redis (swap to Zookeeper/etcd easily)
3. **ChainManager** - Tracks action sequences, notifies participants
4. **PenaltySystem** - Enforces commitments, applies penalties

See ARCHITECTURE.md for full details.

## What Happens

```
Player action → Lock acquired → Action executes → Added to chain → 
Participants notified → They can respond → Chain continues → 
If lock expires → Penalty applied
```

## Scale It

Production deployment:
- Add load balancer
- Scale app servers horizontally
- Use Redis Cluster or Zookeeper for distributed locks
- Add PostgreSQL for persistence
- Use Celery/RQ for penalty checks

See ARCHITECTURE.md for deployment diagram.

## No Hardcoding

Everything configurable:
- Actions (actions.yaml)
- Penalties (actions.yaml)
- Valid responses (actions.yaml)
- TTLs (actions.yaml)
- Distributed backend (LockManager constructor)

Change behavior by editing config, not code.
