# A system implementation of Pathfinder Second Edition for Foundry VTT
This document provides a comprehensive overview of the PF2e system for Foundry VTT, covering its architecture, core components, and major subsystems. The PF2e system is a full implementation of Pathfinder Second Edition rules within the Foundry Virtual Tabletop platform.

For detailed information about specific subsystems, see Core Systems, Gameplay Systems, Character Building, Campaign Systems, User Interface, System Configuration, and Migration and Maintenance.

System Architecture
The PF2e system is built on a layered architecture with core data models (ActorPF2e, ItemPF2e) at its foundation, enhanced by a dynamic rule system that enables complex game mechanics automation.

System Architecture Overview


Sources: 
src/module/actor/base.ts
103-144
 
src/module/item/base/document.ts
 
src/module/actor/character/document.ts
94-108
 
src/module/actor/creature/document.ts
58-70

Core Data Flow
The system processes actor and item data through multiple preparation phases, incorporating rule elements and generating synthetic data for game mechanics.

Data Preparation Pipeline















Sources: 
src/module/actor/base.ts
137-144
 
src/module/actor/base.ts
212-225
 
src/module/rules/helpers.ts
40-50

Major Subsystems
Actor System
The actor system manages all game entities including characters, NPCs, hazards, and parties. Each actor type specializes the base ActorPF2e class with specific functionality.

Key Classes:

ActorPF2e - Base actor functionality 
src/module/actor/base.ts
103
CharacterPF2e - Player character implementation 
src/module/actor/character/document.ts
94
CreaturePF2e - Living creature base class 
src/module/actor/creature/document.ts
58
NPCPF2e - Non-player character specialization 
src/module/actor/npc/document.ts
Item System
The item system handles all game objects from weapons and armor to spells and effects. Items can modify their owning actor through embedded rule elements.

Key Classes:

ItemPF2e - Base item functionality
PhysicalItemPF2e - Physical objects with bulk/carry mechanics 
src/module/item/physical/document.ts
37
WeaponPF2e - Weapons and combat equipment 
src/module/item/weapon/document.ts
37
SpellPF2e - Spells and magical effects
Rule Element System
Rule elements provide dynamic modification of actor and item behavior, enabling complex automated mechanics without hardcoded special cases.

Key Classes:

RuleElementPF2e - Base rule element 
src/module/rules/rule-element/base.ts
RuleElementSynthetics - Container for computed data 
src/module/rules/synthetics.ts
StatisticModifier - Bonus/penalty calculations 
src/module/actor/modifiers.ts
Combat and Spellcasting
These systems handle turn-based combat, initiative, spellcasting mechanics, and action resolution.

Key Classes:

EncounterPF2e - Combat encounter management 
src/module/encounter/document.ts
ActorSpellcasting - Spellcasting collection management 
src/module/actor/spellcasting.ts
SpellcastingEntry - Individual spellcasting traditions 
src/module/item/spellcasting-entry/document.ts
User Interface
The UI system provides sheets, dialogs, and specialized interfaces for interacting with actors and items.

Key Classes:

ActorSheetPF2e - Base actor sheet functionality 
src/module/actor/sheet/base.ts
77
CharacterSheetPF2e - Character sheet implementation 
src/module/actor/character/sheet.ts
78
Compendium Browser - Content discovery and filtering
System Integration Points
Foundry VTT Integration
The system extends Foundry's core document classes:

Actor → ActorPF2e for enhanced actor functionality
Item → ItemPF2e for PF2e-specific item behavior
TokenDocument → TokenDocumentPF2e for token enhancements
Combat → EncounterPF2e for PF2e combat rules
Data Migration
The system includes a comprehensive migration framework to handle version updates and data structure changes:

MigrationRunnerBase - Core migration infrastructure 
src/module/migration/runner/base.ts
14-26
Version tracking through _migration.version fields
Automatic migration during system updates
Localization
Multi-language support through JSON localization files:

Core translations in 
static/lang/en.json
Rule element text in 
static/lang/re-en.json
Automated text enrichment and formatting
Sources: 
static/system.json
1-10
 
package.json
2-4
 
src/module/actor/base.ts
100-160
 
src/module/migration/runner/base.ts
17-26

Development Architecture
The system follows TypeScript-first development with comprehensive type safety:

Build Process:

Vite-based build system with TypeScript compilation
SCSS preprocessing for styling
Automated compendium pack building
ESLint and Prettier for code quality
Key Configuration:

package.json - Build scripts and dependencies 
package.json
7-23
static/system.json - Foundry system manifest 
static/system.json
1-20
static/template.json - Data structure definitions 
static/template.json
1-15
Sources: 
package.json
1-30
 
static/system.json
 
src/module/actor/base.ts
1-10
 
build/run-migration.ts
1-10
