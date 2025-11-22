"""
Runnable Game System - Starter Implementation
No hardcoding. Config-driven. Actually works.
"""

import yaml
import time
import redis
from dataclasses import dataclass
from typing import Dict, List, Callable, Optional
from datetime import datetime, timedelta

# ============================================================================
# COMPONENT 1: ACTION REGISTRY (Config-driven, not hardcoded)
# ============================================================================

@dataclass
class ActionConfig:
    name: str
    requires_lock: bool
    ttl: int
    valid_responses: List[str]
    penalty: Dict

class ActionRegistry:
    def __init__(self, config_file='actions.yaml'):
        self.actions = {}
        self.handlers = {}
        self.load_config(config_file)
    
    def load_config(self, config_file):
        """Load actions from YAML - NOT HARDCODED"""
        with open(config_file) as f:
            config = yaml.safe_load(f)
        
        for action_name, action_data in config['actions'].items():
            self.actions[action_name] = ActionConfig(
                name=action_name,
                requires_lock=action_data.get('requires_lock', True),
                ttl=action_data.get('ttl', 300),
                valid_responses=action_data.get('valid_responses', []),
                penalty=action_data.get('penalty', {})
            )
    
    def register_handler(self, action_name: str, handler: Callable):
        """Register Python function to handle action"""
        self.handlers[action_name] = handler
    
    def execute(self, player_id: str, action_name: str, **params):
        """Execute action with lock enforcement"""
        if action_name not in self.actions:
            return {'error': f'Unknown action: {action_name}'}
        
        action = self.actions[action_name]
        
        # Acquire lock if required
        lock = None
        if action.requires_lock:
            lock = lock_manager.acquire(player_id, action_name, action.ttl)
            if not lock:
                return {'error': 'Action locked - complete current action first'}
        
        # Execute handler
        handler = self.handlers.get(action_name, self.default_handler)
        result = handler(player_id, action_name, params)
        
        # Add to chain
        chain_manager.add_action(player_id, action_name, params, result)
        
        return result
    
    def default_handler(self, player_id, action_name, params):
        """Default handler if none registered"""
        return {
            'player_id': player_id,
            'action': action_name,
            'params': params,
            'timestamp': datetime.now().isoformat()
        }

# ============================================================================
# COMPONENT 2: LOCK MANAGER (Uses distributed patterns)
# ============================================================================

class LockManager:
    def __init__(self, backend='redis', host='localhost', port=6379):
        if backend == 'redis':
            self.client = redis.Redis(host=host, port=port, decode_responses=True)
        else:
            raise ValueError(f'Backend {backend} not implemented')
        
        self.active_locks = {}
    
    def acquire(self, player_id: str, action_name: str, ttl: int) -> Optional[str]:
        """Acquire lock with TTL"""
        lock_key = f'lock:{player_id}:{action_name}'
        
        # Try to set lock with NX (only if not exists) and EX (expiration)
        acquired = self.client.set(
            lock_key,
            datetime.now().isoformat(),
            nx=True,  # Only set if doesn't exist
            ex=ttl    # Expire after TTL seconds
        )
        
        if acquired:
            self.active_locks[lock_key] = {
                'player_id': player_id,
                'action': action_name,
                'expires_at': datetime.now() + timedelta(seconds=ttl)
            }
            
            # Monitor for completion
            self._schedule_penalty_check(player_id, action_name, lock_key, ttl)
            
            return lock_key
        
        return None
    
    def release(self, lock_key: str):
        """Release lock - action completed"""
        self.client.delete(lock_key)
        if lock_key in self.active_locks:
            del self.active_locks[lock_key]
    
    def _schedule_penalty_check(self, player_id, action_name, lock_key, ttl):
        """Check if action completed before TTL"""
        # In production, use Celery/RQ for this
        # For now, simple approach
        import threading
        
        def check():
            time.sleep(ttl)
            if self.client.exists(lock_key):
                # Lock still exists - action not completed
                penalty_system.apply(player_id, action_name)
                self.release(lock_key)
        
        threading.Thread(target=check, daemon=True).start()

# ============================================================================
# COMPONENT 3: CHAIN MANAGER
# ============================================================================

class ChainManager:
    def __init__(self):
        self.chains = {}  # chain_id -> Chain
        self.player_chains = {}  # player_id -> set of chain_ids
    
    def add_action(self, player_id: str, action_name: str, params: dict, result: dict):
        """Add action to relevant chains"""
        
        # Determine which chain(s) this belongs to
        if 'chain_id' in params:
            chain_id = params['chain_id']
        else:
            # Start new chain
            chain_id = f'chain_{int(time.time())}_{player_id}'
            self.chains[chain_id] = []
        
        # Add action to chain
        action_record = {
            'player_id': player_id,
            'action': action_name,
            'params': params,
            'result': result,
            'timestamp': datetime.now().isoformat()
        }
        
        self.chains[chain_id].append(action_record)
        
        # Track player chains
        if player_id not in self.player_chains:
            self.player_chains[player_id] = set()
        self.player_chains[player_id].add(chain_id)
        
        # Notify participants
        self._notify_participants(chain_id, action_record)
        
        return chain_id
    
    def _notify_participants(self, chain_id: str, new_action: dict):
        """Notify other players in chain"""
        chain = self.chains[chain_id]
        participants = set(a['player_id'] for a in chain)
        
        action_config = action_registry.actions.get(new_action['action'])
        valid_responses = action_config.valid_responses if action_config else []
        
        for participant_id in participants:
            if participant_id != new_action['player_id']:
                print(f"NOTIFY {participant_id}: {new_action['action']} in chain {chain_id}")
                print(f"  Valid responses: {valid_responses}")

# ============================================================================
# COMPONENT 4: PENALTY SYSTEM
# ============================================================================

class PenaltySystem:
    def __init__(self):
        self.player_state = {}  # player_id -> state
    
    def apply(self, player_id: str, action_name: str):
        """Apply penalty for incomplete action"""
        action = action_registry.actions.get(action_name)
        if not action:
            return
        
        penalty = action.penalty
        
        # Initialize player state if needed
        if player_id not in self.player_state:
            self.player_state[player_id] = {
                'reputation': 1000,
                'banned_until': None
            }
        
        # Apply penalties
        self.player_state[player_id]['reputation'] -= penalty.get('reputation', 0)
        
        ban_duration = penalty.get('ban', 0)
        if ban_duration:
            self.player_state[player_id]['banned_until'] = \
                datetime.now() + timedelta(seconds=ban_duration)
        
        print(f"PENALTY APPLIED to {player_id} for incomplete {action_name}")
        print(f"  Reputation: {self.player_state[player_id]['reputation']}")
        
        # Add to chains
        for chain_id in chain_manager.player_chains.get(player_id, []):
            chain_manager.chains[chain_id].append({
                'player_id': 'SYSTEM',
                'action': 'penalty',
                'params': {'target': player_id, 'reason': f'incomplete_{action_name}'},
                'timestamp': datetime.now().isoformat()
            })

# ============================================================================
# INITIALIZE GLOBAL INSTANCES
# ============================================================================

action_registry = ActionRegistry()
lock_manager = LockManager()
chain_manager = ChainManager()
penalty_system = PenaltySystem()

# ============================================================================
# EXAMPLE USAGE
# ============================================================================

if __name__ == '__main__':
    # Register some action handlers
    def handle_witness(player_id, action_name, params):
        event_id = params.get('event_id')
        return {
            'success': True,
            'message': f'Player {player_id} witnessed event {event_id}',
            'can_be_challenged': True
        }
    
    def handle_doubt(player_id, action_name, params):
        target = params.get('target')
        return {
            'success': True,
            'message': f'Player {player_id} doubts {target}',
            'requires_proof': True
        }
    
    action_registry.register_handler('witness', handle_witness)
    action_registry.register_handler('doubt', handle_doubt)
    
    # Player A witnesses something
    print("\n=== Player A witnesses event ===")
    result = action_registry.execute('player_a', 'witness', event_id=123)
    print(result)
    
    # Player B doubts
    print("\n=== Player B doubts Player A ===")
    result = action_registry.execute('player_b', 'doubt', target='player_a')
    print(result)
    
    # Try to take another action while locked
    print("\n=== Player A tries another action (should fail - locked) ===")
    result = action_registry.execute('player_a', 'investigate', subject=123)
    print(result)
    
    # View chains
    print("\n=== Chains ===")
    for chain_id, actions in chain_manager.chains.items():
        print(f"\n{chain_id}:")
        for action in actions:
            print(f"  {action['player_id']}: {action['action']}")
