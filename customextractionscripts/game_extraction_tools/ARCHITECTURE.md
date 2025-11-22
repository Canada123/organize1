# Game System Architecture

## Core Concept
Players take ACTIONS. Actions create CHAINS. Chains are enforced by LOCKS.

## Three-Layer Architecture

```
┌─────────────────────────────────────────┐
│         PLAYER ACTIONS LAYER            │  ← 199 actions (witness, betray, etc.)
└─────────────────────────────────────────┘
              ↓ triggers
┌─────────────────────────────────────────┐
│         CHAIN PROCESSING LAYER          │  ← Actions create chains
└─────────────────────────────────────────┘
              ↓ enforced by
┌─────────────────────────────────────────┐
│      DISTRIBUTED LOCKS LAYER            │  ← Commitments must complete
└─────────────────────────────────────────┘
```

## How It Works

### 1. Player Takes Action

```python
# NOT HARDCODED - actions are data-driven
player.take_action(
    action_type="witness",  # Any of 199 actions
    target=some_event
)
```

### 2. System Creates Lock

```python
# Lock enforces commitment
lock = distributed_system.create_lock(
    player_id=player.id,
    action=action_type,
    ttl=calculate_time_needed(action_type)
)
```

### 3. Chain Starts

```python
# Other players react
chain = Chain()
chain.add(PlayerAction(player_a, "witness", event))

# Other players can now:
# - doubt (challenge the witness)
# - investigate (verify the claim)  
# - help (support the investigation)
# - hinder (block the investigation)
# etc.

# Chain continues as long as players take actions
```

### 4. Lock Enforces Completion

```python
# If player doesn't complete action before TTL:
if not action.completed and lock.expired():
    penalty_system.apply(player.id, action.penalty)
    lock.release()
```

## Actual System Components

### Component 1: Action Registry (NOT HARDCODED)

```python
class ActionRegistry:
    def __init__(self):
        self.actions = {}
    
    def register(self, action_name, handler, requires_lock=True, ttl=None):
        self.actions[action_name] = {
            'handler': handler,
            'requires_lock': requires_lock,
            'ttl': ttl or self.default_ttl(action_name)
        }
    
    def execute(self, player, action_name, **params):
        action = self.actions[action_name]
        
        if action['requires_lock']:
            lock = self.lock_manager.acquire(
                player.id, 
                action_name,
                ttl=action['ttl']
            )
            if not lock:
                return ActionResult.LOCKED
        
        result = action['handler'](player, **params)
        return result

# Use it
registry = ActionRegistry()
registry.register('witness', handle_witness, ttl=300)
registry.register('betray', handle_betray, ttl=60)
registry.register('investigate', handle_investigate, ttl=600)
```

### Component 2: Chain System (NOT HARDCODED)

```python
class Chain:
    def __init__(self, chain_id):
        self.chain_id = chain_id
        self.actions = []
        self.participants = set()
    
    def add_action(self, player_id, action_type, data):
        action = ChainAction(
            player_id=player_id,
            action_type=action_type,
            data=data,
            timestamp=now()
        )
        
        self.actions.append(action)
        self.participants.add(player_id)
        
        # Notify other players - they can react
        self.notify_participants(action)
    
    def notify_participants(self, new_action):
        for player_id in self.participants:
            if player_id != new_action.player_id:
                # Player can now respond with any valid action
                self.send_notification(player_id, {
                    'chain_id': self.chain_id,
                    'new_action': new_action,
                    'possible_responses': self.get_valid_responses(new_action)
                })
    
    def get_valid_responses(self, action):
        # Based on action type, what can others do?
        # NOT HARDCODED - defined in action config
        return action_registry.get_valid_responses(action.action_type)
```

### Component 3: Lock Manager (Uses Distributed Patterns)

```python
class LockManager:
    def __init__(self, backend='redis'):
        # Use any of the 8 distributed patterns
        if backend == 'redis':
            from redisson import Redisson
            self.client = Redisson()
        elif backend == 'zookeeper':
            from kazoo.client import KazooClient
            self.client = KazooClient()
        # etc.
    
    def acquire(self, player_id, action_type, ttl):
        lock_key = f"player:{player_id}:action:{action_type}"
        
        # Try to acquire lock
        lock = self.client.get_lock(lock_key)
        acquired = lock.try_lock(timeout=100, lease_time=ttl)
        
        if acquired:
            # Start monitoring for completion
            self.monitor_completion(player_id, action_type, lock, ttl)
            return lock
        
        return None
    
    def monitor_completion(self, player_id, action_type, lock, ttl):
        # Background task monitors if action completes
        async def monitor():
            await sleep(ttl)
            if not self.action_completed(player_id, action_type):
                # Action not completed - apply penalty
                penalty_system.apply(player_id, action_type)
                lock.unlock()
        
        spawn_task(monitor)
```

### Component 4: Penalty System

```python
class PenaltySystem:
    def __init__(self):
        self.penalties = {}
    
    def register_penalty(self, action_type, penalty):
        self.penalties[action_type] = penalty
    
    def apply(self, player_id, action_type):
        penalty = self.penalties[action_type]
        
        player = get_player(player_id)
        player.reputation -= penalty.reputation_loss
        player.banned_until = now() + penalty.ban_duration
        
        # Notify chain participants
        chains = get_player_chains(player_id)
        for chain in chains:
            chain.add_action(
                player_id=system_id,
                action_type='penalty_applied',
                data={'penalized_player': player_id, 'reason': f'failed_{action_type}'}
            )
```

## Data Flow

```
Player → ActionRegistry.execute("witness", event)
           ↓
       LockManager.acquire(player, "witness", ttl=300)
           ↓ (if acquired)
       Chain.add_action(player, "witness", event)
           ↓
       Chain.notify_participants()
           ↓
       Other players see notification
           ↓
       Other players take actions: doubt, investigate, help, hinder
           ↓
       Each action → LockManager → Chain → Notifications
           ↓
       Chain continues organically
           ↓
       If lock expires before completion → PenaltySystem.apply()
```

## Configuration (NOT HARDCODED)

```yaml
# actions.yaml
actions:
  witness:
    requires_lock: true
    ttl: 300
    valid_responses: [doubt, investigate, help, corroborate]
    penalty:
      reputation: -50
      ban: 900
  
  betray:
    requires_lock: true
    ttl: 60
    valid_responses: [retaliate, forgive, expose, defend]
    penalty:
      reputation: -200
      ban: 3600
  
  investigate:
    requires_lock: true
    ttl: 600
    valid_responses: [help, hinder, spy, witness]
    penalty:
      reputation: -30
      ban: 300

# Load at runtime
action_registry.load_from_yaml('actions.yaml')
```

## Deployment Architecture

```
┌──────────────────┐
│  Load Balancer   │
└────────┬─────────┘
         │
    ┌────┴────┬────────┬────────┐
    │         │        │        │
┌───▼───┐ ┌──▼───┐ ┌──▼───┐ ┌──▼───┐
│ App 1 │ │ App 2│ │ App 3│ │ App N│
└───┬───┘ └──┬───┘ └──┬───┘ └──┬───┘
    │        │        │        │
    └────┬───┴────┬───┴────┬───┘
         │        │        │
    ┌────▼────────▼────────▼────┐
    │  Redis/Zookeeper/etcd     │  ← Distributed locks
    └───────────────────────────┘
         │
    ┌────▼────────┐
    │  PostgreSQL │  ← Game state
    └─────────────┘
```

## What You Actually Build

1. **Action Registry** - Loads actions from config, NOT hardcoded
2. **Chain System** - Tracks action sequences
3. **Lock Manager** - Uses one of 8 distributed patterns
4. **Penalty System** - Enforces commitments

That's it. 4 components.

## Example: Full Flow

```python
# Player A witnesses something
registry.execute(
    player_a,
    'witness',
    event_id=123
)

# System:
# 1. Acquires lock (300s TTL)
# 2. Creates/updates chain
# 3. Notifies other players

# Player B doubts
registry.execute(
    player_b,
    'doubt',
    target=player_a.last_action
)

# System:
# 1. Acquires lock (60s TTL)
# 2. Adds to chain
# 3. Notifies participants

# Player C investigates
registry.execute(
    player_c,
    'investigate',
    subject=event_123
)

# Chain continues...
# If anyone's lock expires before completion → penalty
```

## This Is NOT Hardcoded

- Actions loaded from YAML/JSON
- Penalties configured per action
- Valid responses defined in config
- Distributed backend swappable
- Chain rules customizable

## This IS The Architecture

4 components. Clear data flow. Distributed locks enforce commitments. Chains emerge from player actions.

No forced endpoints. No arbitrary limits. Just actions, chains, locks, penalties.
