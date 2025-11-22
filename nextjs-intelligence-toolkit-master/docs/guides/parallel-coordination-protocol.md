# Parallel Execution Coordination Protocol

**Purpose**: Enable multiple AI agents to work on independent features concurrently without conflicts, while maintaining consistency and preventing race conditions.

**Version**: 1.0.0
**Status**: ACTIVE
**Target Audience**: AI agents executing parallel implementation tasks

---

## Overview

This protocol defines how AI agents coordinate when implementing multiple features in parallel during nextjs-project-setup skill execution.

**Problem**: Multiple agents working on independent features can create conflicts (file overwrites, schema inconsistencies, dependency collisions).

**Solution**: Dependency-aware coordination with file locking, shared state tracking, and merge conflict prevention.

---

## Coordination Model (CoD^Σ)

```
Parallel_Execution :=
  Dependency_Analysis
    ∘ Task_Partitioning
    ∘ Lock_Acquisition
    ∥ Concurrent_Implementation
    ∘ Conflict_Detection
    ∘ Merge_Coordination
    → Integrated_Result

Conflict_Prevention := file_locking ⊕ dependency_graph ⊕ shared_state_tracking
```

---

## Phase 1: Dependency Analysis

### 1.1 Feature Dependency Graph

**Before parallel execution begins**, analyze all features to build dependency graph:

```
Feature_Dependencies := {
  feature_id: {
    blocks: [feature_ids_that_depend_on_this],
    blocked_by: [feature_ids_this_depends_on],
    file_writes: [paths_this_will_modify],
    file_reads: [paths_this_will_read],
    schema_changes: [tables_this_will_create_or_modify],
    shared_resources: [dependencies_like_auth_or_database]
  }
}
```

**Example**:
```json
{
  "P1_user_auth": {
    "blocks": ["P2_user_profile", "P3_posts"],
    "blocked_by": [],
    "file_writes": [
      "app/actions/auth.ts",
      "middleware.ts",
      "supabase/migrations/001_auth_setup.sql"
    ],
    "file_reads": [],
    "schema_changes": ["profiles"],
    "shared_resources": ["supabase_auth"]
  },
  "P2_user_profile": {
    "blocks": [],
    "blocked_by": ["P1_user_auth"],
    "file_writes": [
      "app/actions/profile.ts",
      "app/profile/page.tsx",
      "components/ProfileForm.tsx"
    ],
    "file_reads": ["app/actions/auth.ts"],
    "schema_changes": ["profiles"],
    "shared_resources": ["supabase_auth"]
  },
  "P3_posts": {
    "blocks": [],
    "blocked_by": ["P1_user_auth"],
    "file_writes": [
      "app/actions/posts.ts",
      "app/posts/page.tsx",
      "components/PostList.tsx",
      "supabase/migrations/002_posts.sql"
    ],
    "file_reads": ["app/actions/auth.ts"],
    "schema_changes": ["posts"],
    "shared_resources": ["supabase_auth"]
  }
}
```

### 1.2 Independence Check

**Criteria for parallelizable features**:
- ✅ **No file write conflicts**: Features write to different files
- ✅ **No schema conflicts**: Features modify different database tables
- ✅ **No blocking dependencies**: Features don't depend on each other's completion
- ✅ **Independent testing**: Each feature can be tested in isolation

**Example**:
```
Can_Execute_Parallel(P2, P3)?
  ✓ File writes: No overlap (P2 → profile.ts, P3 → posts.ts)
  ✓ Schema: No overlap (P2 → profiles table, P3 → posts table)
  ✗ Dependencies: Both blocked by P1_user_auth
  → Result: WAIT for P1, then execute P2 ∥ P3
```

---

## Phase 2: Task Partitioning

### 2.1 Execution Waves

Organize features into **waves** based on dependencies:

```
Wave := {
  wave_number: integer,
  features: [feature_ids],
  prerequisites: [wave_numbers_that_must_complete_first],
  can_parallelize: boolean
}
```

**Example**:
```json
{
  "waves": [
    {
      "wave_number": 0,
      "features": ["setup_infrastructure"],
      "prerequisites": [],
      "can_parallelize": false
    },
    {
      "wave_number": 1,
      "features": ["foundational_features"],
      "prerequisites": [0],
      "can_parallelize": false
    },
    {
      "wave_number": 2,
      "features": ["P1_user_auth"],
      "prerequisites": [1],
      "can_parallelize": false
    },
    {
      "wave_number": 3,
      "features": ["P2_user_profile", "P3_posts"],
      "prerequisites": [2],
      "can_parallelize": true
    }
  ]
}
```

### 2.2 Agent Assignment

**Pattern**: One agent per feature within a parallelizable wave

```
Agent_Assignment := {
  wave: 3,
  agents: [
    {
      agent_id: "implementor-1",
      feature: "P2_user_profile",
      file_lock_requests: ["app/actions/profile.ts", "app/profile/page.tsx"]
    },
    {
      agent_id: "implementor-2",
      feature: "P3_posts",
      file_lock_requests: ["app/actions/posts.ts", "app/posts/page.tsx"]
    }
  ]
}
```

---

## Phase 3: File Locking Protocol

### 3.1 Lock Registry

**Centralized lock tracking** in `/tmp/coordination-locks.json`:

```json
{
  "locks": [
    {
      "file_path": "app/actions/profile.ts",
      "locked_by": "implementor-1",
      "feature_id": "P2_user_profile",
      "timestamp": "2025-10-30T14:30:00Z",
      "operation": "write"
    }
  ],
  "pending_locks": [
    {
      "file_path": "middleware.ts",
      "requested_by": "implementor-2",
      "feature_id": "P3_posts",
      "timestamp": "2025-10-30T14:30:05Z",
      "operation": "read"
    }
  ]
}
```

### 3.2 Lock Acquisition Rules

**Before writing any file**, agent MUST:

1. **Check lock registry**:
   ```bash
   jq '.locks[] | select(.file_path == "target/file.ts")' /tmp/coordination-locks.json
   ```

2. **If unlocked → Acquire lock**:
   ```json
   {
     "file_path": "target/file.ts",
     "locked_by": "agent-id",
     "feature_id": "feature-id",
     "timestamp": "ISO-8601",
     "operation": "write"
   }
   ```

3. **If locked by another agent → WAIT or FAIL**:
   - WAIT: If dependency allows (e.g., reading after write completes)
   - FAIL: If conflict detected (both want to write)

4. **Release lock after write**:
   - Remove entry from locks array
   - Signal completion to waiting agents

### 3.3 Read Locks vs Write Locks

**Read Lock** (shared):
- Multiple agents can hold read locks simultaneously
- Blocks write locks until all reads complete

**Write Lock** (exclusive):
- Only one agent can hold write lock
- Blocks all other read and write locks

**Example**:
```
Agent A: Requests write lock on middleware.ts → GRANTED
Agent B: Requests read lock on middleware.ts → BLOCKED (wait for A to release)
Agent C: Requests read lock on auth.ts → GRANTED (different file)
```

---

## Phase 4: Shared State Tracking

### 4.1 Coordination State File

**Location**: `/tmp/coordination-state.json`

**Structure**:
```json
{
  "current_wave": 3,
  "completed_features": ["P1_user_auth"],
  "active_features": ["P2_user_profile", "P3_posts"],
  "blocked_features": [],
  "schema_changes": [
    {
      "feature_id": "P1_user_auth",
      "table": "profiles",
      "operation": "create",
      "committed": true
    }
  ],
  "shared_resources": {
    "supabase_auth": {
      "initialized": true,
      "features_using": ["P1_user_auth", "P2_user_profile", "P3_posts"]
    }
  }
}
```

### 4.2 State Update Protocol

**Before starting feature implementation**:
1. Read `/tmp/coordination-state.json`
2. Verify prerequisites completed: `completed_features` contains all `blocked_by` features
3. Add feature to `active_features`
4. Update shared resource usage

**After completing feature**:
1. Move feature from `active_features` to `completed_features`
2. Update `schema_changes` if database modified
3. Release all locks
4. Signal dependent features

**Example**:
```bash
# Check if P2 can start
jq '.completed_features | contains(["P1_user_auth"])' /tmp/coordination-state.json
# Output: true → P2 can proceed

# Mark P2 as active
jq '.active_features += ["P2_user_profile"]' /tmp/coordination-state.json > /tmp/temp.json
mv /tmp/temp.json /tmp/coordination-state.json
```

---

## Phase 5: Conflict Detection

### 5.1 Pre-Execution Conflict Check

**Before parallel execution begins**, detect potential conflicts:

```python
def detect_conflicts(features):
    conflicts = []

    for i, feature_a in enumerate(features):
        for feature_b in features[i+1:]:
            # File write conflicts
            write_overlap = set(feature_a.file_writes) & set(feature_b.file_writes)
            if write_overlap:
                conflicts.append({
                    "type": "file_write_conflict",
                    "features": [feature_a.id, feature_b.id],
                    "files": list(write_overlap),
                    "severity": "CRITICAL"
                })

            # Schema conflicts (same table modifications)
            schema_overlap = set(feature_a.schema_changes) & set(feature_b.schema_changes)
            if schema_overlap:
                conflicts.append({
                    "type": "schema_conflict",
                    "features": [feature_a.id, feature_b.id],
                    "tables": list(schema_overlap),
                    "severity": "CRITICAL"
                })

            # Shared resource contention
            resource_overlap = set(feature_a.shared_resources) & set(feature_b.shared_resources)
            if resource_overlap:
                conflicts.append({
                    "type": "resource_contention",
                    "features": [feature_a.id, feature_b.id],
                    "resources": list(resource_overlap),
                    "severity": "WARNING"
                })

    return conflicts
```

**Critical conflicts** (MUST serialize):
- File write conflicts
- Schema conflicts on same table

**Warnings** (can proceed with coordination):
- Shared resource contention (e.g., both use auth)
- Read-after-write dependencies

### 5.2 Runtime Conflict Resolution

**If conflict detected during execution**:

1. **File conflict detected**:
   ```
   Agent A: Attempts to write middleware.ts
   Lock check: middleware.ts locked by Agent B
   → HALT execution
   → LOG conflict to /tmp/conflicts.log
   → WAIT for lock release OR FAIL with error
   ```

2. **Schema conflict detected**:
   ```
   Agent A: Creates migration for "posts" table
   Agent B: Attempts to create migration for "posts" table
   → HALT Agent B
   → REQUIRE manual merge of schema changes
   ```

3. **Dependency violation detected**:
   ```
   Agent A: Starts P3 (depends on P1)
   State check: P1 not in completed_features
   → HALT Agent A
   → WAIT for P1 completion signal
   ```

---

## Phase 6: Merge Coordination

### 6.1 Integration Checkpoints

**After each wave completes**, perform integration:

```
Integration_Workflow :=
  Collect_All_Changes
    ∘ Verify_No_Conflicts
    ∘ Run_Combined_Tests
    ∘ Validate_Schema_Consistency
    → Commit_Wave_Changes

Verification := {
  file_integrity: all_files_valid ∧ ¬overwrites,
  schema_integrity: migrations_sequential ∧ ¬conflicting_changes,
  test_integrity: all_tests_pass ∧ ¬integration_failures,
  dependency_integrity: all_imports_resolve ∧ ¬circular_deps
}
```

### 6.2 Conflict Merge Strategy

**If conflicts discovered at integration**:

1. **Git merge conflicts**:
   ```bash
   # Each agent commits to feature branch
   git checkout -b feature/P2-user-profile
   git add app/actions/profile.ts
   git commit -m "Implement P2: User profile"

   # Coordinator merges sequentially
   git checkout main
   git merge feature/P2-user-profile  # First feature
   git merge feature/P3-posts          # Second feature
   # Resolve conflicts manually if any
   ```

2. **Schema merge conflicts**:
   ```sql
   -- Agent A creates: 001_P2_profiles.sql
   -- Agent B creates: 001_P3_posts.sql
   -- Conflict: Both use migration number 001

   -- Resolution: Rename migrations sequentially
   -- 001_P2_profiles.sql (first to complete)
   -- 002_P3_posts.sql (second to complete)
   ```

3. **Import conflicts**:
   ```typescript
   // Both agents import from same barrel file
   // Agent A: export { ProfileForm } from './components'
   // Agent B: export { PostList } from './components'

   // Resolution: Merge exports
   // export { ProfileForm, PostList } from './components'
   ```

### 6.3 Rollback Protocol

**If integration fails**:

```
Rollback_Wave :=
  Identify_Failed_Features
    ∘ Revert_File_Changes(git_reset)
    ∘ Rollback_Schema_Migrations
    ∘ Clear_Coordination_State
    → Clean_Slate_for_Retry

Rollback_Commands := {
  files: "git reset --hard HEAD~{wave_commit_count}",
  schema: "supabase migration revert {migration_ids}",
  state: "rm /tmp/coordination-state.json && initialize_state()"
}
```

---

## Implementation Example

### Complete Parallel Execution Flow

**Scenario**: Implement P2 (user profile) and P3 (posts) in parallel after P1 (auth) completes.

**Step 1: Initialize Coordination**
```bash
# Create coordination files
cat > /tmp/coordination-state.json <<EOF
{
  "current_wave": 2,
  "completed_features": ["P1_user_auth"],
  "active_features": [],
  "blocked_features": [],
  "schema_changes": [],
  "shared_resources": {
    "supabase_auth": {
      "initialized": true,
      "features_using": ["P1_user_auth"]
    }
  }
}
EOF

cat > /tmp/coordination-locks.json <<EOF
{
  "locks": [],
  "pending_locks": []
}
EOF
```

**Step 2: Analyze Dependencies**
```json
{
  "P2_user_profile": {
    "blocked_by": ["P1_user_auth"],
    "blocks": [],
    "file_writes": ["app/actions/profile.ts", "app/profile/page.tsx"],
    "schema_changes": ["profiles"]
  },
  "P3_posts": {
    "blocked_by": ["P1_user_auth"],
    "blocks": [],
    "file_writes": ["app/actions/posts.ts", "app/posts/page.tsx"],
    "schema_changes": ["posts"]
  }
}
```

**Step 3: Detect Conflicts**
```python
conflicts = detect_conflicts([P2, P3])
# Output: [] (no conflicts, safe to parallelize)
```

**Step 4: Assign Agents**
```
Agent implementor-1: Execute P2_user_profile
Agent implementor-2: Execute P3_posts
```

**Step 5: Parallel Execution**

**Agent implementor-1** (P2):
```bash
# 1. Verify prerequisites
jq '.completed_features | contains(["P1_user_auth"])' /tmp/coordination-state.json
# true → proceed

# 2. Mark active
jq '.active_features += ["P2_user_profile"]' /tmp/coordination-state.json

# 3. Acquire locks
jq '.locks += [{
  "file_path": "app/actions/profile.ts",
  "locked_by": "implementor-1",
  "feature_id": "P2_user_profile",
  "timestamp": "'$(date -u +%Y-%m-%dT%H:%M:%SZ)'",
  "operation": "write"
}]' /tmp/coordination-locks.json

# 4. Implement P2 (write files, create migration, run tests)

# 5. Release locks and mark complete
jq '.locks = [.locks[] | select(.locked_by != "implementor-1")]' /tmp/coordination-locks.json
jq '.completed_features += ["P2_user_profile"] | .active_features -= ["P2_user_profile"]' /tmp/coordination-state.json
```

**Agent implementor-2** (P3):
```bash
# Same workflow as implementor-1, but for P3_posts
# No conflicts because different files and schema
```

**Step 6: Integration**
```bash
# After both complete
git checkout main
git merge feature/P2-user-profile
git merge feature/P3-posts

# Run combined tests
npm run test

# Verify schema consistency
supabase db diff

# If all pass → Wave complete
```

---

## Anti-Patterns

### ❌ DON'T: Start parallel execution without dependency analysis
**Why**: Features may have hidden dependencies, causing runtime conflicts

### ❌ DON'T: Skip file locking protocol
**Why**: Multiple agents can overwrite each other's changes

### ❌ DON'T: Assume features are independent without verification
**Why**: Shared resources (auth, database schema) create implicit dependencies

### ❌ DON'T: Merge without integration testing
**Why**: Features may work independently but fail when integrated

### ❌ DON'T: Ignore lock contention warnings
**Why**: Indicates potential race conditions or conflicts

---

## Success Criteria

**Parallel execution is successful when**:
- ✅ All features complete without file overwrites
- ✅ No schema migration conflicts
- ✅ All tests pass in isolation AND after integration
- ✅ No deadlocks or infinite lock waits
- ✅ Rollback works if integration fails
- ✅ Coordination state accurately reflects completion

---

## Monitoring & Debugging

### Check Coordination State
```bash
# View current state
jq '.' /tmp/coordination-state.json

# Check active features
jq '.active_features' /tmp/coordination-state.json

# Verify wave completion
jq '.completed_features | length' /tmp/coordination-state.json
```

### Check Locks
```bash
# View all locks
jq '.locks' /tmp/coordination-locks.json

# Find locks for specific file
jq '.locks[] | select(.file_path == "target/file.ts")' /tmp/coordination-locks.json

# Check for deadlocks (locks held > 5 minutes)
jq '.locks[] | select(.timestamp < "'$(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%SZ)'")' /tmp/coordination-locks.json
```

### Conflict Log
```bash
# View conflicts
cat /tmp/conflicts.log

# Example entry:
# [2025-10-30T14:35:00Z] CONFLICT: file_write_conflict
# Features: P2_user_profile, P4_admin_panel
# File: middleware.ts
# Resolution: Serialize P4 after P2
```

---

## References

- **Related Protocol**: @.claude/shared-imports/constitution.md (Article VII: User-Story-Centric Organization)
- **Dependency**: nextjs-project-setup skill Phase 6 (Implementation)
- **Testing**: nextjs-qa-validator agent (continuous validation during parallel execution)

---

**Protocol Status**: ACTIVE
**Last Updated**: 2025-10-30
**Version**: 1.0.0
