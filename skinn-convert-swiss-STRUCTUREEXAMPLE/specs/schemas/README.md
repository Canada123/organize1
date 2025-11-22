# JSON Schema Validation

This directory contains JSON schemas for validating project documentation.

## Available Schemas

### vision.schema.json
Validates product vision documents with:
- Product definition and market positioning
- Vision statement and goals
- User personas (P-001, P-002, etc.)
- Use cases (UC-001, UC-002, etc.)
- Success criteria and constraints

### roadmap.schema.json
Validates project roadmap documents with:
- Epics (EPIC-001, EPIC-002, etc.)
- Features (FEAT-001, FEAT-002, etc.)
- Tasks (T-001, T-002, etc.)
- Milestones and metrics
- Sprint tracking (ISO 8601 week format)

### feature.schema.json
Validates individual feature specifications with:
- Feature ID (FEAT-YYYY-NNN format)
- Problem statement and solution approach
- Technical design with atomic components (≤50 lines)
- Testing results and metrics
- Implementation details and lessons learned

## Usage

### Command Line Validation
```bash
# Install ajv-cli globally
npm install -g ajv-cli

# Validate a document
ajv validate -s specs/schemas/vision.schema.json -d specs/vision.json
ajv validate -s specs/schemas/roadmap.schema.json -d specs/roadmap.json
ajv validate -s specs/schemas/feature.schema.json -d specs/features/FEAT-*.json
```

### Programmatic Validation
```javascript
const Ajv = require('ajv');
const ajv = new Ajv();

// Load schema
const visionSchema = require('./vision.schema.json');
const validate = ajv.compile(visionSchema);

// Validate document
const visionDoc = require('../vision.json');
const valid = validate(visionDoc);

if (!valid) {
  console.error(validate.errors);
}
```

### VS Code Integration
Add to `.vscode/settings.json`:
```json
{
  "json.schemas": [
    {
      "fileMatch": ["specs/vision.json"],
      "url": "./specs/schemas/vision.schema.json"
    },
    {
      "fileMatch": ["specs/roadmap.json"],
      "url": "./specs/schemas/roadmap.schema.json"
    },
    {
      "fileMatch": ["specs/features/*.json"],
      "url": "./specs/schemas/feature.schema.json"
    }
  ]
}
```

## ID Conventions

- **Personas**: P-001, P-002, P-003...
- **Use Cases**: UC-001, UC-002, UC-003...
- **Epics**: EPIC-001, EPIC-002, EPIC-003...
- **Features**: FEAT-001, FEAT-002... (or FEAT-YYYY-NNN for dated)
- **Tasks**: T-001, T-002... (or B-001 for backlog)

## Validation Rules

### Atomic Design Compliance
All components must follow ≤50 lines rule:
```json
{
  "components_created": [
    {
      "name": "FormField",
      "type": "atom",
      "lines": 47,  // ✅ Valid (≤50)
      "purpose": "Unified form field with label and error"
    }
  ]
}
```

### Progress Tracking
Percentages must be 0-100:
```json
{
  "progress_percentage": 40,  // ✅ Valid
  "test_coverage": 82        // ✅ Valid
}
```

### Date Formats
- ISO 8601 dates: "2025-08-26"
- ISO 8601 weeks: "2025-W35"
- ISO 8601 datetime: "2025-08-26T15:10:00Z"

## Extending Schemas

To add new properties:
1. Update the relevant schema file
2. Add to required array if mandatory
3. Define type and constraints
4. Update this README with changes
5. Validate existing documents still pass

## Best Practices

1. **Always validate before commit**
2. **Use enums for fixed values** (status, priority, etc.)
3. **Set reasonable min/max constraints**
4. **Provide clear descriptions**
5. **Use $ref for repeated structures**