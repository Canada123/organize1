https://deepwiki.com/EcsRx/EcsR3

https://github.com/EcsRx/EcsR3

I understand now! You're asking what EcsRx/EcsR3 actually does because you're building a Unity game where "everything is containers" (which I interpret as you wanting to use a container-based architecture for your game objects).

What EcsR3 Does for Unity Games
EcsR3 is an Entity Component System (ECS) framework that helps you organize game logic using a container-based architecture. README.md:3-12

Instead of traditional Unity GameObjects with MonoBehaviours, EcsR3 gives you:

1. Entities as Containers
Entities are lightweight containers (just an ID) that hold components. README.md:29-32

var entity = EntityCollection.Create(); // Creates an empty container
2. Components as Data
Components are pure data containers - no logic, just state. IComponent.cs:3-11

For example, instead of a Unity MonoBehaviour with health logic:

public class HealthComponent : IComponent  
{  
    public int CurrentHealth { get; set; }  
    public int MaxHealth { get; set; }  
}
README.md:73-78

3. Systems Process the Containers
Systems contain all your game logic and operate on entities that have specific components. README.md:101-103

The most performant approach uses BatchedSystem which processes all matching entities efficiently:

public class BatchedExampleSystem : BatchedSystem<SomeComponentA, SomeComponentB>  
{  
    protected override Observable<Unit> ReactWhen()  
    { return Observable.EveryUpdate(); }  
      
    protected override void Process(Entity entity, SomeComponentA componentA, SomeComponentB componentB)  
    {  
        // Your game logic here  
    }      
}
README.md:128-140

Why Use This for Unity?
The framework is designed to work with Unity and provides several benefits for container-based architecture:

Performance - BatchedSystems are highly optimized for processing many entities readme.md:5-6
Separation of Concerns - Data (components) is separate from logic (systems) README.md:16-18
Reactive Architecture - Systems react to changes rather than polling every frame README.md:17
Getting Started in Unity
The framework provides a base application class that sets up dependency injection and manages the ECS infrastructure: EcsR3Application.cs:14-21

You create entities, add components to them (filling the containers with data), and let systems process them based on what components they have. README.md:43-54

Notes
The framework explicitly states it's designed for Unity and .NET applications faqs-etc.md:5 , and provides Unity-specific packages. If you're building a game where you want entities to be data containers processed by systems rather than traditional GameObject hierarchies, this framework provides that architecture.

Wiki pages you might want to explore:

Overview (EcsRx/EcsR3)
EcsRx/EcsR3
README.md

# EcsR3
EcsR3 is a reactive take on the common ECS pattern with a well separated design using R3 and adhering to IoC and other sensible design patterns.

[![Build Status][build-status-image]][build-status-url]
[![Code Quality Status][codacy-image]][codacy-url]
[![License][license-image]][license-url]
[![Nuget Version][nuget-image]][nuget-url]
[![Join Discord Chat][discord-image]][discord-url]
[![Documentation][gitbook-image]][gitbook-url]

> This is basically EcsRx but natively using R3 rather than Rx

## Features
- Simple ECS interfaces and implementations to use/extend
- Fully reactive architecture
- Favours composition over inheritance
- Adheres to inversion of control
- Lightweight codebase
- Built in support for events (raise your own and react to them)


It is advised to look at the [setup docs](./docs/ecs-r3/introduction/setup.md), this covers the 2 avenues to setup the application using it without the helper libraries, or with the helper libraries which offer you dependency injection and other benefits.
If you haven't used an ECS system before there are 3 main parts:
- `Entity` - Has components applied to them and acts as a handle to access them
- `Components` - Stores actual state/data and is used in driving logic in `Systems`
- `Systems` - Runs logic against entities and their components

> Its also worth noting we have the notion of `Groups` which are a contractual object which describes what `Components` a `System` needs to operate, see more below or in docs.

This is a super barebones example of creating an application and adding an `Entity` to the `EntityCollection`, check the docs for more information.

```csharp
public class HelloWorldExampleApplication : EcsR3Application // Sets up a basic entry point for your application
{
    public override IDependencyRegistry DependencyRegistry { get; } = new MicrosoftDependencyRegistry(); // Uses the default Microsoft dependency injection provider
    
    protected override void ApplicationStarted()
    {
        var entityId = EntityCollection.Create(); // The Entity Collection allows you to create/access entities

        var canTalkComponent = new CanTalkComponent { Message = "Hello world" }; // We make a new component
        EntityComponentAccessor.AddComponent(entityId, canTalkComponent); // We apply the component to the entity
    }
}
```

> As mentioned above and in the docs you can ignore the `Infrastructure` part of the framework if you do not want DI/Plugins etc, but in 99% of cases you probably do.

> For example in an RPG you may have a `Character` model which represents `Health`, `Damage`, `Experience`, `Inventory` etc but in ECS world you would probably want each of those to be their own components so then anything with a `HealthComponent` can have its health reduced without knowing about any other facets of a `Character`, deconstructing larger models into their behavioural parts is a big part of ECS design.

```csharp
public class HealthComponent : IComponent
{
    public int CurrentHealth { get; set; }
    public int MaxHealth { get; set; }
}
```

You can optionally implement `IDisposable` if you want to dispose stuff like so:


> You can also make your components as `struct` rather than `class` which can provide some performance benefits, but you need to then explicitly request the 
> `ref` of a component if you want to alter its state, whereas the class components are inherently reference types which makes things a bit simpler.
### Systems

Systems are basically logic executors, but they only execute logic against `Entities` within a given `Group`, so if you want to check for an `Entity` with health dying, then you would only want `Entities` with the `HealthComponent` like this:

```csharp
public class CheckForDeathSystem : IReactToEntitySystem


There are MANY different types of systems provided out the box, each have their own scenarios they are catering for, in almost all scenarios you will probably want a `BatchedSystem` as they are the fastest and provide you the components you need directly, like so:

```csharp
// The system automatically sets up the group based on the component generics provided
public class BatchedExampleSystem : BatchedSystem<SomeComponentA, SomeComponentB>
{
    // Execute every update (see R3 docs around setting up Time/Frame providers)
    protected override Observable<Unit> ReactWhen()
    { return Observable.EveryUpdate(); }
    
    protected override void Process(Entity entity, SomeComponentA componentA, SomeComponentB componentB)
    {
        // Do something with the components or entity
    }    
}
```

This is the most *typical* ECS style system where it allows you to batch process all entities of the same type, it's also the most performant out the box system, but in some situations you may have some other scenarios, so here are some other system examples:


EcsRx/EcsR3
src/EcsR3/Components/IComponent.cs

﻿namespace EcsR3.Components
{
    /// <summary>
    /// A container for isolated contextual data on an entity, should never contain logic.
    /// </summary>
    /// <remarks>
    /// Components should contain pure data which is passed around to different systems.
    /// If you also need to dispose on data inside your component i.e ReactiveProperty vars
    /// then just implement IDisposable as well and they will be auto disposed when the entity
    /// disposes
    /// </remarks>
    public interface IComponent
    {


EcsRx/EcsR3
docs/ecs-r3/performance/readme.md



If you want to maximize performance then here is quick set of advisories which can greatly increase performance and reduce allocations:
## 1. Use BatchedSystems Wherever Possible - *Low Effort* / *High Performance Gains*
The `BatchedSystem` (and related `BatchedRefSystem`, `BatchedMixedSystem`) is the most performant system for scheduled execution on entities, this is because it caches all the lookup data ahead of time and pre-accesses all the components at once, so the cpu doesnt need to do any memory hopping every time you want a component.

## 2. Try To Reuse Same Groups - *Low Effort* / *Reduces Background Processing*
In some instances you may have multiple systems which all use the same core data but with one or two differences, i.e:


EcsRx/EcsR3
src/EcsR3.Infrastructure/EcsR3Application.cs



namespace EcsR3.Infrastructure
{
    public abstract class EcsR3Application : SystemsR3Application, IEcsR3Application
    {
        public IEntityCollection EntityCollection { get; private set; }
        public IComponentDatabase ComponentDatabase { get; private set; }
        public IComputedEntityGroupRegistry ComputedEntityGroupRegistry { get; private set; }
        public IComputedComponentGroupRegistry ComputedComponentGroupRegistry { get; private set; }
        public IEntityComponentAccessor EntityComponentAccessor { get; private set; }
        
        /// <summary>
        /// Load any modules that your application needs
        /// </summary>


EcsRx/EcsR3
docs/shared/faqs-etc.md



This project is an evolution of [EcsRx](https://github.com/EcsRx/ecsrx) which was in turn inspired by [uFrame ECS](https://github.com/micahosborne/uFrame) and [Entitas](https://github.com/sschmid/Entitas-CSharp), it was an attempt to have some of the simplicity and separation of Entitas while having some of the nicer reactive elements of uFrame ECS, so a huge thanks to the creators of those 2 libraries.
It started off as a unity specific framework but has been separated to be used in both .net with rx, and in unity with unirx, however with the advent of R3 it was decided that we should move to that but as that introduced breaking changes at low levels with EcsRx it was made into its own repo.

Now some common things you will probably want to ask/know:

EcsRx/EcsR3
but what else it can do like i want to keep what type of stat or currency seperate keep balancing til i feel its correct in our data lake there is all the game mechanics and systems and then i have to...
Show full text
Fast
I understand now! You're asking about how EcsR3 can help you manage game data separation (stats, currency, timers) while you iterate on balancing, and how to connect your game mechanics with lore and services. README.md:59-77

Separating Stats and Currency with Components
EcsR3 lets you keep different types of game data completely separate using individual components. IComponent.cs:1-15

For your stats and currency system, you'd create separate components:

public class StatsComponent : IComponent  
{  
    public int Strength { get; set; }  
    public int Intelligence { get; set; }  
    public int Dexterity { get; set; }  
}  
  
public class CurrencyComponent : IComponent  
{  
    public int Gold { get; set; }  
    public int Gems { get; set; }  
}
This separation means you can balance each system independently - entities can have stats without currency, or currency without stats. README.md:68-77

Balancing in Your Data Lake
For iterative balancing, you can use Blueprints to define preset configurations that you can tweak without touching code. IBlueprint.cs:6-23

Blueprints let you set up entities with default values from your data lake:

public class WarriorBlueprint : IBlueprint  
{  
    public void Apply(IEntityComponentAccessor accessor, Entity entity)  
    {  
        accessor.AddComponent(entity, new StatsComponent   
        {   
            Strength = 15,  // Tweak these values for balancing  
            Intelligence = 5,  
            Dexterity = 10   
        });  
          
        accessor.AddComponent(entity, new CurrencyComponent   
        {   
            Gold = 100   
        });  
    }  
}
You can store these configurations in JSON files in your data lake and load them at runtime, making balancing a data-driven process rather than code changes.

Timers and Game Functions
For timers and time-based mechanics, you'd create systems that process entities on schedules. systems.md:18-31

The framework provides reactive scheduling so timers don't poll every frame:

public class TimerSystem : BatchedSystem<TimerComponent>  
{  
    protected override Observable<Unit> ReactWhen()  
    {   
        return Observable.Interval(TimeSpan.FromSeconds(1)); // Tick every second  
    }  
      
    protected override void Process(Entity entity, TimerComponent timer)  
    {  
        timer.RemainingTime -= 1;  
        if (timer.RemainingTime <= 0)  
        {  
            // Timer expired - trigger game logic  
        }  
    }  
}
systems.md:211-218

Matching Mechanics with Lore
To connect your game mechanics with lore, you can use multiple components on the same entity:

// Mechanics  
entity.AddComponent(new StatsComponent { ... });  
entity.AddComponent(new CombatComponent { ... });  
  
// Lore/Narrative  
entity.AddComponent(new LoreComponent   
{   
    CharacterName = "Warrior of Light",  
    Backstory = "...",  
    Faction = "Kingdom"  
});
Systems can then process entities based on which components they need. A combat system only cares about StatsComponent and CombatComponent, while a dialogue system only needs LoreComponent. README.md:103-122

Calling Services
For calling external services (like save systems, analytics, or backend APIs), you can use event-based systems that react to game state changes. TakeDamageSystem.cs:7-14

public class SaveGameSystem : IReactToEventSystem<GameStateChangedEvent>  
{  
    public void Process(GameStateChangedEvent eventData)  
    {  
        // Call your save service  
        SaveService.SavePlayerData(eventData.PlayerEntity);  
    }  
}
The framework also has a persistence plugin for data pipelines that can serialize/deserialize your game state. EcsRxPipelineBuilder.cs:15-37

Notes
The framework's Utility AI plugin is particularly useful for balancing game mechanics with decision-making systems. utility-ai-plugin.md:1-14 It lets you score actions based on normalized values (0-1), which is perfect for balancing how stats influence AI behavior. For example, you can tune how much "low health" should influence an NPC's decision to flee versus fight, all through data-driven configuration rather than hardcoded logic.

Wiki pages you might want to explore:

Overview (EcsRx/EcsR3)
Example Applications (EcsRx/EcsR3)



EcsRx/EcsR3
README.md



> As mentioned above and in the docs you can ignore the `Infrastructure` part of the framework if you do not want DI/Plugins etc, but in 99% of cases you probably do.
### Components

```csharp
public class CanTalkComponent : IComponent // Give it the interface so its treated like a component
{
    public string Message { get; set; } // Expose any data we want to access
}
```

Your components should contain state which the `Systems` access via the `Entities`, you can apply as many `Components` to an `Entity` as you like so sometimes its better to break things down into several components vs one large component.

> For example in an RPG you may have a `Character` model which represents `Health`, `Damage`, `Experience`, `Inventory` etc but in ECS world you would probably want each of those to be their own components so then anything with a `HealthComponent` can have its health reduced without knowing about any other facets of a `Character`, deconstructing larger models into their behavioural parts is a big part of ECS design.

```csharp
public class HealthComponent : IComponent
{
    public int CurrentHealth { get; set; }
    public int MaxHealth { get; set; }
}
```

You can optionally implement `IDisposable` if you want to dispose stuff like so:



### Systems
Systems are basically logic executors, but they only execute logic against `Entities` within a given `Group`, so if you want to check for an `Entity` with health dying, then you would only want `Entities` with the `HealthComponent` like this:

```csharp
public class CheckForDeathSystem : IReactToEntitySystem
{
    public IGroup TargetGroup => new Group(typeof(HealthComponent)); // Get any entities with health component

    public Observable<Entity> ReactToEntity(IEntityComponentAccessor entityComponentAccessor, Entity entity) // Explain when you want to execute
    {
        var healthComponent = entityComponentAccessor.GetComponent<HealthComponent>(entity);
        return healthComponent.CurrentHealth.Where(x => x <= 0).Select(x => entity);
    }
    
    public void Process(IEntityComponentAccessor entityComponentAccessor, IEntity entity) // Execute against entities whenever the above reaction occurs
    {
        // We know the health is <= 0 because of the predicate in the ReactToEntity contract
        entityComponentAccessor.RemoveComponent<HealthComponent>(entity);
        entityComponentAccessor.AddComponent<IsDeadComponent>(entity);
    }
}
``` 

There are MANY different types of systems provided out the box, each have their own scenarios they are catering for, in almost all scenarios you will probably want a `BatchedSystem` as they are the fastest and provide you the components you need directly, like so:


EcsRx/EcsR3
src/EcsR3/Components/IComponent.cs

﻿namespace EcsR3.Components
{
    /// <summary>
    /// A container for isolated contextual data on an entity, should never contain logic.
    /// </summary>
    /// <remarks>
    /// Components should contain pure data which is passed around to different systems.
    /// If you also need to dispose on data inside your component i.e ReactiveProperty vars
    /// then just implement IDisposable as well and they will be auto disposed when the entity
    /// disposes
    /// </remarks>
    public interface IComponent
    {

    }
}

EcsRx/EcsR3
src/EcsR3/Blueprints/IBlueprint.cs



namespace EcsR3.Blueprints
{
    /// <summary>
    /// Blueprints are a pre-defined setup routine for an entity, this is meant to setup required
    /// components and default values. Such as if you wanted to setup an NPC who needed both Moveable, Talkable
    /// components and default values around movement speed etc.
    /// </summary>
    /// <remarks>
    /// You *can* apply multiple blueprints after an entity has been created, but this is meant for you to be able to
    /// have a mixin style approach to setting up entity config data, it is not meant to replace an
    /// ISetupSystem which will do more than just setup entity config but also run logic on the component
    /// </remarks>
    public interface IBlueprint
    {
        /// <summary>
        /// Applies the given blueprint to the entity
        /// </summary>
        /// <param name="entity">The entity to be configured</param>
        void Apply(IEntityComponentAccessor entityComponentAccessor, Entity entity);
    }
}

EcsRx/EcsR3
docs/ecs-r3/framework/systems.md



This means you do not need to do any `entityComponentAccessor.GetComponent<SomeComponent>()` for each thing you want in the `Group`, you just get given all the required components via the method call.
```csharp
public class BatchedExampleSystem : BatchedSystem
{
    // We dont need to provide an explicit Group as it can infer them from the generics provided, but you can override it for ExcludedComponent scenarios
    
    protected override Observable ReactWhen()
    { return Observable.EveryUpdate(); }
    
    protected override void Process(Entity entity, SomeComponentA componentA, SomeComponentB componentB)
    {
        // Do something with the components and/or entity
    }    
}
```

> You can use both `class` and `struct` components with this system, but the structs will be passed by value so are read only (there is a performance benefit to not having to deal with `refs`)


    
    public void Process(IEntityComponentAccessor entityComponentAccessor, IEntity entity) // Execute against entities whenever the above reaction occurs
    {
        // We know the health is <= 0 because of the predicate in the ReactToEntity contract
        entityComponentAccessor.RemoveComponent<HealthComponent>(entity);
        entityComponentAccessor.AddComponent<IsDeadComponent>(entity);
    }
}
```

Once you have setup your reactions the `Process` method is triggered every time the subscription from the reaction phase is triggered, so this way your system reacts to data rather than polling for changes each frame, this makes system logic for succinct and direct, it also can make quite complex scenarios quite simple as you can use the power of **R3** to daisy chain together your observables to trigger whatever you want.

### `IReactToGroupSystem`


EcsRx/EcsR3
src/EcsR3.Examples/ExampleApps/HealthExample/Systems/TakeDamageSystem.cs



namespace EcsR3.Examples.ExampleApps.HealthExample.Systems
{
    public class TakeDamageSystem : IReactToEventSystem<EntityDamagedEvent>
    {
        public Observable<EntityDamagedEvent> ObserveOn(Observable<EntityDamagedEvent> observable)
        { return observable; }

        public void Process(EntityDamagedEvent eventData)
        { eventData.HealthComponent.Health.Value -= eventData.DamageApplied; }
    }
}

EcsRx/EcsR3
src/EcsR3.Plugins.Persistence/Builders/EcsRxPipelineBuilder.cs



namespace EcsR3.Plugins.Persistence.Builders
{
    public class EcsRxPipelineBuilder
    {
        private readonly IDependencyResolver _resolver;

        public EcsRxPipelineBuilder(IDependencyResolver resolver)
        {
            _resolver = resolver;
        }
        
        public EcsRxPipelineNeedsObjectBuilder StartFromInput()
        { return new EcsRxPipelineNeedsObjectBuilder(_resolver, new List<IPipelineStep>()); }
        
        public EcsRxPipelineNeedsObjectBuilder StartFrom(Func<Task<object>> method)
        { return new EcsRxPipelineNeedsObjectBuilder(_resolver, new List<IPipelineStep>{ new ReceiveMethodStep(method)}); }
        
        public EcsRxPipelineNeedsObjectBuilder StartFrom(Func<object, Task<object>> method)
        { return new EcsRxPipelineNeedsObjectBuilder(_resolver, new List<IPipelineStep>{ new ReceiveMethodStep(method)}); }
        
        public EcsRxPipelineNeedsDataBuilder StartFrom(IReceiveDataEndpoint endpoint)
        { return new EcsRxPipelineNeedsDataBuilder(_resolver, new List<IPipelineStep>{ new ReceiveEndpointStep(endpoint)}); }
        
        public EcsRxPipelineNeedsDataBuilder StartFrom<T>() where T : IReceiveDataEndpoint
        { return new EcsRxPipelineNeedsDataBuilder(_resolver, new List<IPipelineStep>{ new ReceiveEndpointStep(_resolver.Resolve<T>())}); }

        public EcsRxPipelineNeedsObjectBuilder ForkObjectFrom(IFlowPipeline flowPipeline, int forkAtStep = -1)
        {


EcsRx/EcsR3
docs/ecs-r3/plugins/utility-ai-plugin.md

﻿## EcsR3.Plugins.UtilityAI

While there isn't as much information available as I would like about Utility/Infinite Axis style AI, there is enough if you google it so I wont go over that too much here, but here is a quick crash course:

### Quick Utility/Infinite Axis AI Overview

The high level idea is that you distill contextual information into normalized values of 0-1 which are then used together to score how good high level actions are.

For example if you have a player with data like `{ health: number, maxHealth: number, ammo: number, position: vector3 }` you can normalize a lot of these values so if you get the health percentage as a normalized value 0-1 then you can use that as a `Consideration` when factoring in if you should carry out `Actions` such as if you should take cover or shoot an enemy (assuming you also have enough ammo).

With this in mind we have 2 high level concepts:

- `Considerations` - These are normalized numeric abstractions (0-1) over contextual information, such as the health, ammo levels, distance to threats etc
- `Actions` - These are higher level actions your agent may want to do based on the `Considerations` it is given, it decides how good an action is by scoring all related `Considerations` to provide a feel as to how useful the action is (aka its utility).

With this being said there is a bit more complexity at play under the hood, as the name `Utility` comes from how useful something is, and having a `Consideration` between 0-1 is good, but we need to provide some context as to "how good" that consideration is, which is where `Curve Functions` come in as they allow us to plot our value to a final consideration.

EcsRx/EcsR3
but i am not sure if i even want all the stats in unity like all the definitions now i just want all the options and then the actual will come from us or aritcy. but the directors. are npcs and they ...
Show full text
Fast
I understand now! You're asking about a data-driven architecture where:

Stat/currency definitions stay in your backend database (not hardcoded in Unity)
Unity only receives the "options" - the actual values come from your backend or Articy
Directors (NPCs) dynamically receive content based on tags from your backend database
Multiple layers of data (mechanics, lore, content) need to match up before being added to Unity
How EcsR3 Supports This Architecture
1. Blueprints for Dynamic Entity Creation
EcsR3's Blueprint system is perfect for creating entities from backend data. IBlueprint.cs:6-22

Instead of hardcoding stats, you'd create blueprints dynamically from your backend:

public class DynamicDirectorBlueprint : IBlueprint  
{  
    private DirectorData _backendData; // Data from your backend/Articy  
      
    public void Apply(IEntityComponentAccessor accessor, Entity entity)  
    {  
        // Add components based on backend tags  
        if (_backendData.Tags.Contains("has_stats"))  
        {  
            accessor.AddComponent(entity, new StatsComponent   
            {   
                Strength = _backendData.Stats.Strength,  
                Intelligence = _backendData.Stats.Intelligence  
            });  
        }  
          
        if (_backendData.Tags.Contains("has_lore"))  
        {  
            accessor.AddComponent(entity, new LoreComponent   
            {   
                Backstory = _backendData.Lore.Backstory,  
                Faction = _backendData.Lore.Faction  
            });  
        }  
    }  
}
2. Setup Systems for Backend Integration
Use ISetupSystem to fetch and apply backend data when Directors are created. ISetupSystem.cs:6-26

public class DirectorSetupSystem : ISetupSystem  
{  
    public IGroup Group { get; } = new Group(typeof(DirectorComponent));  
      
    public void Setup(IEntityComponentAccessor accessor, Entity entity)  
    {  
        var director = accessor.GetComponent<DirectorComponent>(entity);  
          
        // Fetch content from backend based on tags  
        var backendContent = BackendService.GetContentByTags(director.Tags);  
          
        // Apply mechanics that match lore  
        if (backendContent.MechanicsMatchLore)  
        {  
            // Add components dynamically  
            foreach (var mechanic in backendContent.Mechanics)  
            {  
                ApplyMechanic(accessor, entity, mechanic);  
            }  
        }  
    }  
}
3. Component Addition for Multi-Layer Data
The EntityComponentAccessor lets you add components dynamically as data arrives from your backend. EntityComponentAccessor.cs:27-34

This means you can:

Create a Director entity with minimal components initially
Add mechanics components when backend confirms they match lore
Add stat components only when balancing is finalized
Add content components as new tagged content arrives
4. Reactive Systems for Backend Updates
Since Directors "constantly get new content by their tags," you need systems that react to backend updates. systems.md:194-218

public class DirectorContentUpdateSystem : IReactToEventSystem<BackendContentUpdatedEvent>  
{  
    public void Process(BackendContentUpdatedEvent eventData)  
    {  
        // When backend pushes new tagged content  
        var director = FindDirectorByTags(eventData.Tags);  
          
        // Add new components if mechanics + lore match  
        if (eventData.Content.IsReadyToAdd)  
        {  
            EntityComponentAccessor.AddComponent(director,   
                new NewContentComponent { Data = eventData.Content });  
        }  
    }  
}
Your Multi-Layer Architecture
Based on your description, your flow is:

Backend Database (Articy/Your DB)  
    ↓ (sends tagged content)  
Layer 1: Mechanics definitions  
Layer 2: Lore/narrative content    
Layer 3: Match mechanics + lore  
    ↓ (when matched)  
Layer 4: Unity receives "options" (component types)  
    ↓ (EcsR3 creates entities)  
Layer 5: Directors (NPCs) with dynamic components  
EcsR3 handles Layer 4-5 - it doesn't care where the data comes from, it just creates entities with whatever components you tell it to add. IEntityComponentAccessorExtensions.cs:37-41

Notes
The key insight is that EcsR3 is data-agnostic - it doesn't need stat definitions in Unity. IComponent.cs:3-11 Components are just data containers, so you can populate them from any source (backend API, Articy export, JSON files). The framework's reactive architecture means Directors can receive new components at runtime as your backend pushes tagged content, without needing to restart or reload the game.

Wiki pages you might want to explore:

Overview (EcsRx/EcsR3)



EcsRx/EcsR3
src/EcsR3/Blueprints/IBlueprint.cs



namespace EcsR3.Blueprints
{
    /// <summary>
    /// Blueprints are a pre-defined setup routine for an entity, this is meant to setup required
    /// components and default values. Such as if you wanted to setup an NPC who needed both Moveable, Talkable
    /// components and default values around movement speed etc.
    /// </summary>
    /// <remarks>
    /// You *can* apply multiple blueprints after an entity has been created, but this is meant for you to be able to
    /// have a mixin style approach to setting up entity config data, it is not meant to replace an
    /// ISetupSystem which will do more than just setup entity config but also run logic on the component
    /// </remarks>
    public interface IBlueprint
    {
        /// <summary>
        /// Applies the given blueprint to the entity
        /// </summary>
        /// <param name="entity">The entity to be configured</param>
        void Apply(IEntityComponentAccessor entityComponentAccessor, Entity entity);
    }
}

EcsRx/EcsR3
src/EcsR3/Systems/Reactive/ISetupSystem.cs



namespace EcsR3.Systems.Reactive
{
    /// <summary>
    /// Setup systems are run ONCE when an entity joins a given group,
    /// there is also some additional logic around handling predicates so if
    /// an entity matches a group BUT it has a predicate that is not met, the entity
    /// will be monitored and when the entity matches the group and the predicate
    /// passes it will then run the setup.
    /// </summary>
    /// <remarks>
    /// If the entity leaves the group and re-joins it will re-trigger the setup
    /// method on there so keep this in mind, and just because components match
    /// if there is a predicate that doesn't match then it wont be run until it
    /// does match.
    /// </remarks>
    public interface ISetupSystem : IGroupSystem
    {
        /// <summary>
        /// The logic run when the entity needs setting up
        /// </summary>
        /// <param name="entity">The entity to setup</param>
        void Setup(IEntityComponentAccessor entityComponentAccessor, Entity entity);
    }
}

EcsRx/EcsR3
src/EcsR3/Entities/Accessors/EntityComponentAccessor.cs


            EntityChangeRouter = entityChangeRouter;
        }
        
        public void AddComponents(Entity entity, IComponent[] components)
        {
            var componentTypeIds = ComponentTypeLookup.GetComponentTypeIds(components);
            var allocationIds = EntityAllocationDatabase.AllocateComponents(componentTypeIds, entity);
            ComponentDatabase.SetMany(componentTypeIds, allocationIds, components);
            
            EntityChangeRouter.PublishEntityAddedComponents(entity, componentTypeIds);
        }
        
        public ref T CreateComponent<T>(Entity entity) where T : struct, IComponent
        {


EcsRx/EcsR3
docs/ecs-r3/framework/systems.md


}
```
### `IReactToEntitySystem`

This interface implies that you want to react to individual changes in an entity. It will pass each entity to the `ReactToEntity` method to setup the observable you want, such as Health changing, input occurring, random intervals etc. This only happens once per matched entity, here is an example of the sort of thing you would do here:

```csharp
public class CheckForDeathSystem : IReactToEntitySystem
{
    public IGroup TargetGroup => new Group(typeof(HealthComponent)); // Get any entities with health component

    public Observable ReactToEntity(IEntityComponentAccessor entityComponentAccessor, Entity entity) // Explain when you want to execute
    {
        var healthComponent = entityComponentAccessor.GetComponent(entity);
        return healthComponent.CurrentHealth.Where(x => x <= 0).Select(x => entity);
    }
    
    public void Process(IEntityComponentAccessor entityComponentAccessor, IEntity entity) // Execute against entities whenever the above reaction occurs
    {
        // We know the health is <= 0 because of the predicate in the ReactToEntity contract
        entityComponentAccessor.RemoveComponent(entity);
        entityComponentAccessor.AddComponent(entity);
    }
}
```

Once you have setup your reactions the `Process` method is triggered every time the subscription from the reaction phase is triggered, so this way your system reacts to data rather than polling for changes each frame, this makes system logic for succinct and direct, it also can make quite complex scenarios quite simple as you can use the power of **R3** to daisy chain together your observables to trigger whatever you want.

### `IReactToGroupSystem`


EcsRx/EcsR3
src/EcsR3/Extensions/IEntityComponentAccessorExtensions.cs


        public static void RemoveComponents(this IEntityComponentAccessor accessor, Entity entity, params IComponent[] components)
        { accessor.RemoveComponents(entity, components.Select(x => x.GetType()).ToArray()); }
        
        public static void AddComponent(this IEntityComponentAccessor accessor, Entity entity, IComponent component)
        { accessor.AddComponents(entity, component); }
        
        public static void AddComponents(this IEntityComponentAccessor accessor, Entity entity, params IComponent[] components)
        { accessor.AddComponents(entity, components); }

        public static void CreateComponent<T>(this IEntityComponentAccessor accessor, Entity entity)
            where T : IComponent, new()


EcsRx/EcsR3
src/EcsR3/Components/IComponent.cs

﻿namespace EcsR3.Components
{
    /// <summary>
    /// A container for isolated contextual data on an entity, should never contain logic.
    /// </summary>
    /// <remarks>
    /// Components should contain pure data which is passed around to different systems.
    /// If you also need to dispose on data inside your component i.e ReactiveProperty vars
    /// then just implement IDisposable as well and they will be auto disposed when the entity
    /// disposes
    /// </remarks>
    public interface IComponent
    {

EcsRx/EcsR3
but the thing is that the states of them and the connections and the rules how does this work
Fast
I understand you're asking about how state management, entity connections, and rule systems work in EcsR3 for your Directors (NPCs) that receive dynamic content from your backend.

State Management in EcsR3
1. Component-Based State
In EcsR3, entity state is stored entirely in components. IComponent.cs:1-15 For your Directors, you'd track state like this:

public class DirectorStateComponent : IComponent  
{  
    public string CurrentState { get; set; } // e.g., "idle", "talking", "quest_giving"  
    public Dictionary<string, object> StateData { get; set; }  
}
The framework doesn't enforce a specific state machine pattern - you implement state transitions through systems that react to component changes.

2. Reactive State Transitions
State changes trigger automatically when components are modified. EntityChangeRouter.cs:11-54 The EntityChangeRouter publishes events when components are added, removed, or modified, allowing systems to react to state changes:

public class DirectorStateTransitionSystem : IReactToEntitySystem  
{  
    public IGroup Group { get; } = new Group(typeof(DirectorStateComponent));  
      
    public Observable<Entity> ReactToEntity(IEntityComponentAccessor accessor, Entity entity)  
    {  
        var stateComponent = accessor.GetComponent<DirectorStateComponent>(entity);  
        // React when state changes  
        return stateComponent.CurrentState.Where(state => state == "ready_for_content");  
    }  
      
    public void Process(IEntityComponentAccessor accessor, Entity entity)  
    {  
        // Fetch new content from backend when Director enters "ready" state  
        FetchBackendContent(entity);  
    }  
}
systems.md:194-217

Entity Connections and Relationships
1. Reference Components for Connections
To connect Directors with other entities (like quests, dialogue, or other NPCs), use reference components:

public class DirectorConnectionsComponent : IComponent  
{  
    public List<Entity> ConnectedQuests { get; set; }  
    public List<Entity> RelatedNPCs { get; set; }  
    public Entity CurrentDialogue { get; set; }  
}
2. Group-Based Queries
The framework's IGroup system lets you query entities by their component composition. For example, to find all Directors with active quests:

public IGroup Group { get; } = new Group(  
    typeof(DirectorComponent),   
    typeof(DirectorConnectionsComponent),  
    typeof(ActiveQuestComponent)  
);
Systems automatically process only entities matching this group, so connections are maintained through component presence.

Rule Systems
1. Setup/Teardown for Rule Enforcement
Use ISetupSystem and ITeardownSystem to enforce rules when entities join or leave groups. systems.md:153-192

public class DirectorRuleEnforcementSystem : ISetupSystem  
{  
    public IGroup Group { get; } = new Group(typeof(DirectorComponent));  
      
    public void Setup(IEntityComponentAccessor accessor, Entity entity)  
    {  
        var director = accessor.GetComponent<DirectorComponent>(entity);  
          
        // Enforce rules: Directors must have valid tags from backend  
        if (!ValidateTags(director.Tags))  
        {  
            accessor.RemoveComponent<DirectorComponent>(entity);  
            return;  
        }  
          
        // Apply rule: Directors with "quest_giver" tag need QuestComponent  
        if (director.Tags.Contains("quest_giver"))  
        {  
            accessor.AddComponent(entity, new QuestGiverComponent());  
        }  
    }  
}
2. Event-Based Rule Validation
For rules that depend on backend data matching (mechanics + lore), use event systems: README.md:169-178

public class ContentValidationRuleSystem : IReactToEventSystem<BackendContentReceivedEvent>  
{  
    public void Process(BackendContentReceivedEvent eventData)  
    {  
        // Rule: Only add content if mechanics and lore match  
        if (eventData.MechanicsMatchLore && eventData.IsBalanced)  
        {  
            var director = FindDirectorByTags(eventData.Tags);  
            EntityComponentAccessor.AddComponent(director,   
                new ValidatedContentComponent { Content = eventData.Content });  
        }  
    }  
}
3. Utility AI for Complex Rules
For balancing rules and decision-making, the framework includes a Utility AI plugin. utility-ai-plugin.md:1-56 This lets you score actions based on normalized values (0-1), perfect for rules like "Director should offer quest if player level is appropriate AND relationship is high enough":

// Considerations (normalized 0-1)  
var playerLevelConsideration = NormalizePlayerLevel(player.Level);  
var relationshipConsideration = director.RelationshipScore;  
  
// Rule: Multiply considerations to get action score  
var questOfferScore = playerLevelConsideration * relationshipConsideration;  
  
if (questOfferScore > 0.7f) // Rule threshold  
{  
    OfferQuest(director, player);  
}
How It All Connects
The EntityChangeRouter is the central hub that connects everything. EntityChangeRouter.cs:11-89 When you add/remove components (changing state or connections), it publishes events that trigger:

Group membership updates - Entities automatically join/leave groups based on components
System reactions - IReactToEntitySystem and IReactToGroupSystem respond to changes
Rule enforcement - ISetupSystem/ITeardownSystem run when entities enter/exit groups
The EntityComponentAccessor is how you modify state and connections at runtime. EntityComponentAccessor.cs:12-43 It handles adding/removing components and notifies the router, which triggers all connected systems.

Notes
The framework doesn't provide a built-in state machine or rule engine - it gives you the primitives (components, groups, reactive systems) to build your own. README.md:14-23 For your Directors receiving dynamic backend content, you'd implement state transitions through component changes, connections through reference components, and rules through Setup/Teardown systems or event-based validation. The reactive architecture means everything updates automatically when backend data arrives and components are added.

Wiki pages you might want to explore:

Systems (EcsRx/EcsR3)



EcsRx/EcsR3
src/EcsR3/Components/IComponent.cs

﻿namespace EcsR3.Components
{
    /// <summary>
    /// A container for isolated contextual data on an entity, should never contain logic.
    /// </summary>
    /// <remarks>
    /// Components should contain pure data which is passed around to different systems.
    /// If you also need to dispose on data inside your component i.e ReactiveProperty vars
    /// then just implement IDisposable as well and they will be auto disposed when the entity
    /// disposes
    /// </remarks>
    public interface IComponent
    {

    }
}

EcsRx/EcsR3
src/EcsR3/Entities/Routing/EntityChangeRouter.cs



namespace EcsR3.Entities.Routing
{
    public class EntityChangeRouter : IEntityChangeRouter
    {
        private readonly Dictionary<ComponentContract, Subject<EntityChanges>> _onComponentAddedForGroup = new Dictionary<ComponentContract, Subject<EntityChanges>>();
        private readonly Dictionary<ComponentContract, Subject<EntityChanges>> _onComponentRemovingForGroup = new Dictionary<ComponentContract, Subject<EntityChanges>>();
        private readonly Dictionary<ComponentContract, Subject<EntityChanges>> _onComponentRemovedForGroup = new Dictionary<ComponentContract, Subject<EntityChanges>>();
        
        public IComponentTypeLookup ComponentTypeLookup { get; }

        public EntityChangeRouter(IComponentTypeLookup componentTypeLookup)
        { ComponentTypeLookup = componentTypeLookup; }

        public void Dispose()
        {
            _onComponentAddedForGroup.ForEachRun(x => x.Value.Dispose());
            _onComponentRemovingForGroup.ForEachRun(x => x.Value.Dispose());
            _onComponentRemovedForGroup.ForEachRun(x => x.Value.Dispose());
        }

        public Observable<EntityChanges> OnEntityAddedComponents(params int[] componentTypes)
        { return OnEntityComponentEvent(_onComponentAddedForGroup, componentTypes); }
        
        public Observable<EntityChanges> OnEntityRemovingComponents(params int[] componentTypes)
        { return OnEntityComponentEvent(_onComponentRemovingForGroup, componentTypes); }
        
        public Observable<EntityChanges> OnEntityRemovedComponents(params int[] componentTypes)
        { return OnEntityComponentEvent(_onComponentRemovedForGroup, componentTypes); }
        
        public void PublishEntityAddedComponents(Entity entity, int[] componentIds)
        { PublishEntityComponentEvent(entity, componentIds, _onComponentAddedForGroup); }
        
        public void PublishEntityRemovingComponents(Entity entity, int[] componentIds)
        { PublishEntityComponentEvent(entity, componentIds, _onComponentRemovingForGroup); }
        
        public void PublishEntityRemovedComponents(Entity[] entities, int[] componentIds)
        { PublishEntityComponentEvent(entities, componentIds, _onComponentRemovedForGroup); }
        
        public void PublishEntityAddedComponents(Entity[] entities, int[] componentIds)
        { PublishEntityComponentEvent(entities, componentIds, _onComponentAddedForGroup); }
        
        public void PublishEntityRemovingComponents(Entity[] entities, int[] componentIds)
        { PublishEntityComponentEvent(entities, componentIds, _onComponentRemovingForGroup); }
        
        public void PublishEntityRemovedComponents(Entity entity, int[] componentIds)
        { PublishEntityComponentEvent(entity, componentIds, _onComponentRemovedForGroup); }
        
        public Observable<EntityChanges> OnEntityComponentEvent(Dictionary<ComponentContract, Subject<EntityChanges>> source, params int[] componentTypes)
        {
            var contract = new ComponentContract(componentTypes);
            if(source.TryGetValue(contract, out var existingObservable))
            { return existingObservable; }

            var newSub = new Subject<EntityChanges>();
            source.Add(contract, newSub);
            return newSub;
        }

        public void PublishEntityComponentEvent(Entity entity, int[] componentIds, Dictionary<ComponentContract, Subject<EntityChanges>> source)
        {
            var buffer = ArrayPool<int>.Shared.Rent(componentIds.Length);
            var allContracts = source.Keys.ToArray();
            for (var i = 0; i < allContracts.Length; i++)
            {
                var currentContract = allContracts[i];
                var lastUsedIndexInBuffer = currentContract.GetMatchingComponentIdsNoAlloc(componentIds, buffer);
                if (lastUsedIndexInBuffer == -1) { continue; }

                /*
                 This is an optimization as we know the EntityRouterComputedEntityGroupTracker subscriber will instantly
                 use the data as its called synchronously so we can use Memory<T> and it can be re-used.

                 There is a worry that anyone could subscribe elsewhere and want to use the data later but they would
                 need to convert it to an array in that scenario, if they didnt they would just have garbage data.
                 */
                ReadOnlyMemory<int> bufferAsMemory = buffer;
                
                source[currentContract].OnNext(new EntityChanges(entity, bufferAsMemory[..(lastUsedIndexInBuffer + 1)]));
            }
            ArrayPool<int>.Shared.Return(buffer);
        }
        
        public void PublishEntityComponentEvent(Entity[] entities, int[] componentIds, Dictionary<ComponentContract, Subject<EntityChanges>> source)
        {


EcsRx/EcsR3
docs/ecs-r3/framework/systems.md


    }
}
```
### `ISetupSystem`

This interface implies that you want to setup entities, so it will match all entities via the group and will run a `Setup` method once for each of the entities. 

> This is primarily there for doing one off setup methods on entities, such as setting up view related data (i.e `ViewResolvers`) or other one time things.

```csharp
public class SetupAsteroidSystem : ISetupSystem
{
    public IGroup Group { get; } = new Group(typeof(AsteroidComponent), typeof(ViewComponent));
    
    // When an entity initially joins the group it will have this Setup method execute once
    public void Setup(IEntityComponentAccessor entityComponentAccessor, Entity entity)
    {
        var viewComponent = entityComponentAccessor.GetComponent(entity);
        viewComponent.View = new SomeAsteroidSpriteThingy();
    }
}
```

### `ITeardownSystem`

This is similar to `ISetupSystem`, but is used when a matched entity's group is *ABOUT* to be removed.

> This distinction is important because it means that all components should still be on the entity when this system gets triggered, if we triggered it after the component was removed you wouldnt be able to access it on the entity.

```csharp
public class TeardownAsteroidSystem : ITeardownSystem
{
    public IGroup Group { get; } = new Group(typeof(AsteroidComponent), typeof(ViewComponent));
    
    // When an entity is about to leave the group this will get triggered once
    public void Teardown(IEntityComponentAccessor entityComponentAccessor, Entity entity);
    {
        var viewComponent = entityComponentAccessor.GetComponent(entity);
        viewComponent.View.Dispose();
        viewComponent.View = null;
    }
}
```
 
### `IReactToEntitySystem`

This interface implies that you want to react to individual changes in an entity. It will pass each entity to the `ReactToEntity` method to setup the observable you want, such as Health changing, input occurring, random intervals etc. This only happens once per matched entity, here is an example of the sort of thing you would do here:

```csharp
public class CheckForDeathSystem : IReactToEntitySystem
{
    public IGroup TargetGroup => new Group(typeof(HealthComponent)); // Get any entities with health component

    public Observable ReactToEntity(IEntityComponentAccessor entityComponentAccessor, Entity entity) // Explain when you want to execute
    {
        var healthComponent = entityComponentAccessor.GetComponent(entity);
        return healthComponent.CurrentHealth.Where(x => x <= 0).Select(x => entity);
    }
    
    public void Process(IEntityComponentAccessor entityComponentAccessor, IEntity entity) // Execute against entities whenever the above reaction occurs
    {
        // We know the health is <= 0 because of the predicate in the ReactToEntity contract
        entityComponentAccessor.RemoveComponent(entity);
        entityComponentAccessor.AddComponent(entity);
    }
}
```
Once you have setup your reactions the `Process` method is triggered every time the subscription from the reaction phase is triggered, so this way your system reacts to data rather than polling for changes each frame, this makes system logic for succinct and direct, it also can make quite complex scenarios quite simple as you can use the power of **R3** to daisy chain together your observables to trigger whatever you want.

### `IReactToGroupSystem`


EcsRx/EcsR3
README.md



> This is basically EcsRx but natively using R3 rather than Rx
## Features

- Simple ECS interfaces and implementations to use/extend
- Fully reactive architecture
- Favours composition over inheritance
- Adheres to inversion of control
- Lightweight codebase
- Built in support for events (raise your own and react to them)
- Built in Dependency Injection abstraction layer
- Built in support for plugins (wrap up your own components/systems/events and share them with others)

## Quick Start


```

```csharp
// You may want to react to events agnostic of the ECS paradigm
public class ReactToPlayerDeadEventSystem : IReactToEventSystem<PlayerDeadEvent>
{
    // Triggered when the IEventSystem gets a PlayerDeadEvent
    public void Process(PlayerDeadEvent eventData)
    {
        Console.WriteLine("Oh no the player has died");
    }
}
```

```csharp
// Maybe you want to just do things when a system is started or stopped, or even make your own System types based off this (Like BatchedSystems)


EcsRx/EcsR3
docs/ecs-r3/plugins/utility-ai-plugin.md

﻿## EcsR3.Plugins.UtilityAI

While there isn't as much information available as I would like about Utility/Infinite Axis style AI, there is enough if you google it so I wont go over that too much here, but here is a quick crash course:

### Quick Utility/Infinite Axis AI Overview

The high level idea is that you distill contextual information into normalized values of 0-1 which are then used together to score how good high level actions are.

For example if you have a player with data like `{ health: number, maxHealth: number, ammo: number, position: vector3 }` you can normalize a lot of these values so if you get the health percentage as a normalized value 0-1 then you can use that as a `Consideration` when factoring in if you should carry out `Actions` such as if you should take cover or shoot an enemy (assuming you also have enough ammo).

With this in mind we have 2 high level concepts:

- `Considerations` - These are normalized numeric abstractions (0-1) over contextual information, such as the health, ammo levels, distance to threats etc
- `Actions` - These are higher level actions your agent may want to do based on the `Considerations` it is given, it decides how good an action is by scoring all related `Considerations` to provide a feel as to how useful the action is (aka its utility).

With this being said there is a bit more complexity at play under the hood, as the name `Utility` comes from how useful something is, and having a `Consideration` between 0-1 is good, but we need to provide some context as to "how good" that consideration is, which is where `Curve Functions` come in as they allow us to plot our value to a final consideration.

> The OpenRpg lib that this plugin uses for curve functions and variables, has a page that explains curve functions in more depth and has its own AI related examples/demos, but while at the high level that library is doing same thing as this its API is quite different. https://openrpg.github.io/OpenRpg/

To give a more detailed example, if we think about 2 high level actions `Attack` and `TakeCover`, the `Attack` action would likely only be a good idea if we have a good amount of health (ignoring ammo levels for now), and the `TakeCover` action would likely be important if health was low, so if we have 75% health (expressed as 0.75f) is that good or not, for Attacking yeah 0.75f seems like a high score, but for Taking cover 0.75f also seems like a high score, so should both actions be as likely at 75% health? (no they shouldnt).

So jumping back to curve functions, lets create 2 `Considerations` based off the same underlying input (Health Percentage):

`Healthy` Consideration

<img width="350" height="234" alt="image" src="https://github.com/user-attachments/assets/7502e559-a022-47dd-bfa0-e0fad8d2c367" />

If we pass in 0.75f to the linear function we will get out 0.75f which is fine, as it makes sense as we are quite healthy.

`LowHealth` Consideration

<img width="346" height="214" alt="image" src="https://github.com/user-attachments/assets/2326da26-f437-467a-b801-ea4c8292e526" />

Notice how we have an inverse linear function, which is the opposite, so passing in 0.75f would output 0.25f, meaning that its not actually that high at the moment.

Taking the 2 considerations together, we can drive the `Attack` action from `Health` consideration, and the `Take Cover` action from the `LowHealth` consideration.

You could even get fancier and express `LowHealth` with a more drastic curve where anything above 50% health is seen as fine, its only when you get to less than 50% health it DRASTICALLY ramps up
<img width="337" height="218" alt="image" src="https://github.com/user-attachments/assets/1788e684-b698-479e-9af4-2e8770ea5428" />

Either way the input value alone needs to be run through a curve function to plot how high the value actually is, so the same inputs can be considered multiple ways.

With this taken care of now if we have 75% health our Attack would score 0.75f and TakeCover would score far lower at 0 (on latter graph).

Just before we finish off there is one more thing to mention, which is how `Actions` can factor in multiple `Considerations` so in the above example its fine having a high `Health` consideration, but we would also need to ensure we had `Ammo` and were close enough for our weapon to hit an enemy, or if there is even an enemy there.

For example if we had 75% health, and an enemy pretty close, if we have no ammo we cant shoot, so taking imaginary consideration scores like:
- `Health` 0.75f
- `EnemyNearby` 0.75f
- `Ammo` 0f

It doesnt matter that 2 of the `Considerations` are high, as the ammo one is 0, which acts as a sort of veto and will mean when they are calculated together as when multiplied by 0 its going to be 0, which makes the action a no go. Also as the `Considerations` are all normalized between 0-1 you can use as many of them as you want, which is where the `Infinite Axis` name comes from, you can add as many axis/considerations as you want to score your actions, which makes it a very additive system as you come up with newer `Considerations` you may want to factor them into your `Actions`.

> The `Action` score is not quite as simple as multiplying all the normalized `Considerations` together, as the numbers would continue to shrink the more you have. So there is a compensator built into the calculation to stop this, so the numbers will remain accurate, so you cant just Average, or Sum and Divide etc.

Finally worth mentioning we use the term `Advice` rather than `Action` as we split the scoring and doing of the `Action` into different things, so the scoring part of an action is the `Advice` and we leave you to do the actual `Action` execution elsewhere.

### Why Utility AI and not GOAP/FSM/BT/MGS etc


EcsRx/EcsR3
src/EcsR3/Entities/Accessors/EntityComponentAccessor.cs



namespace EcsR3.Entities.Accessors
{
    public class EntityComponentAccessor : IEntityComponentAccessor
    {
        public IComponentTypeLookup ComponentTypeLookup { get; }
        public IEntityAllocationDatabase EntityAllocationDatabase { get; }
        public IComponentDatabase ComponentDatabase { get; }
        public IEntityChangeRouter EntityChangeRouter { get; }
        
        public EntityComponentAccessor(IComponentTypeLookup componentTypeLookup, IEntityAllocationDatabase entityAllocationDatabase, IComponentDatabase componentDatabase, IEntityChangeRouter entityChangeRouter)
        {
            ComponentTypeLookup = componentTypeLookup;
            EntityAllocationDatabase = entityAllocationDatabase;
            ComponentDatabase = componentDatabase;
            EntityChangeRouter = entityChangeRouter;
        }
        
        public void AddComponents(Entity entity, IComponent[] components)
        {
            var componentTypeIds = ComponentTypeLookup.GetComponentTypeIds(components);
            var allocationIds = EntityAllocationDatabase.AllocateComponents(componentTypeIds, entity);
            ComponentDatabase.SetMany(componentTypeIds, allocationIds, components);
            
            EntityChangeRouter.PublishEntityAddedComponents(entity, componentTypeIds);
        }
        
        public ref T CreateComponent<T>(Entity entity) where T : struct, IComponent
        {
            var defaultComponent = new T();
            var componentTypeId = ComponentTypeLookup.GetComponentTypeId(typeof(T));
            var allocationId = EntityAllocationDatabase.AllocateComponent(componentTypeId, entity);
            ComponentDatabase.Set(componentTypeId, allocationId, defaultComponent);
            return ref ComponentDatabase.GetRef<T>(componentTypeId, allocationId);
        }

        protected int CreateComponentBatch<T>(Entity[] entities) where T : IComponent, new()
        {

EcsRx/EcsR3
but i will put everything together first before it makes it to unty right 
Fast
View as codemap
Yes, exactly! You're asking about assembling and validating your game data outside of Unity first, before it gets loaded into the EcsR3 framework.

Your Data Assembly Pipeline
Based on your description, your workflow is:

Backend/Articy Database  
    ↓  
1. Extract mechanics definitions  
2. Extract lore/narrative content  
3. Match mechanics + lore (validation layer)  
4. Tag content appropriately  
5. Verify all layers align  
    ↓ (only when validated)  
Unity + EcsR3  
    ↓  
Directors (NPCs) created with validated components  
How This Works with EcsR3
1. Pre-Unity Data Validation
You'd build your validation pipeline outside Unity to ensure mechanics, lore, and tags all match before creating any entities. This could be:

Python scripts that validate JSON exports from Articy
Database queries that check tag consistency
Automated tests that verify mechanics-lore alignment
2. Blueprints Load Pre-Validated Data
Once your data passes validation, EcsR3's Blueprint system loads it. Blueprints are just containers for applying pre-validated data to entities:

public class DirectorBlueprint : IBlueprint  
{  
    private ValidatedDirectorData _data; // Already validated outside Unity  
      
    public void Apply(IEntityComponentAccessor accessor, Entity entity)  
    {  
        // Just apply the pre-validated data  
        accessor.AddComponent(entity, new StatsComponent   
        {   
            Strength = _data.Stats.Strength // Already balanced  
        });  
          
        accessor.AddComponent(entity, new LoreComponent   
        {   
            Backstory = _data.Lore.Backstory // Already matches mechanics  
        });  
    }  
}
3. Unity Only Receives "Ready" Data
EcsR3 doesn't do any validation - it just creates entities from whatever data you give it. The validation happens in your external pipeline, and Unity only receives data that's already been assembled and verified.

4. Persistence Plugin for Data Loading
The framework's persistence plugin can load your pre-validated data from JSON/binary files. persistence-plugin.md:26-28 You'd export validated data from your backend, and Unity loads it through the persistence pipeline.

Your Assembly Process
Your external validation pipeline would:

Extract from Articy/Backend - Get raw mechanics and lore
Tag-based matching - Use your tagging system to match mechanics with lore
Validation rules - Check that everything aligns (your "many layers")
Export to JSON - Create validated data files
Unity loads JSON - EcsR3 creates entities from pre-validated data
EcsR3 is just the runtime container system - all the hard work of matching mechanics, lore, and tags happens before Unity ever sees the data.

Notes
This approach is actually recommended by the framework's FAQ. faqs-etc.md:47-55 Not everything needs to be ECS - your data validation and assembly can happen in separate tools/scripts, and EcsR3 just handles the runtime entity management in Unity. The separation means you can iterate on balancing and content matching without touching Unity at all.

I understand you're asking whether EcsR3 is the right framework for supporting 10 million players in your Unity game with Directors (NPCs) receiving dynamic backend content.

The Reality Check
EcsR3 is NOT designed for 10 million concurrent players. faqs-etc.md:11-19 It's a client-side ECS framework for organizing game logic within a single Unity instance, not a server-side multiplayer architecture.

What EcsR3 Actually Handles
The framework's performance benchmarks show it can efficiently handle:

100,000 entities with component operations MakingLotsOfStructEntitiesApplication.cs:27
Batched processing of thousands of entities per frame readme.md:5-6
Single-player or local multiplayer scenarios
This is per-client performance, not concurrent player capacity.

What You Actually Need for 10 Million Players
For 10 million players, you need:

1. Server-Side Architecture
Backend services (not Unity) handling player state, matchmaking, and data
Database clusters storing Director content, player progress, mechanics/lore matching
Load balancers distributing players across server instances
CDN for asset delivery
2. Client-Side Framework (EcsR3's Role)
EcsR3 would run on each player's device, managing:

That player's local game state
Directors they interact with
Components loaded from your backend
Each of your 10 million players runs their own EcsR3 instance locally.

The Correct Architecture
10 Million Players  
    ↓ (each runs)  
Unity Client with EcsR3  
    ↓ (connects to)  
Backend Services (Articy/Your DB)  
    ↓ (provides)  
Validated Director Data  
    ↓ (loaded into)  
EcsR3 Entities/Components  
Your backend handles:

Data validation (mechanics + lore matching)
Content distribution (which Directors each player sees)
Player state persistence
Scalability (10 million concurrent connections)
EcsR3 handles:

Local game logic (one player's experience)
Entity management (Directors in that player's session)
Component processing (stats, timers, state machines)
Performance Considerations
The framework's benchmarks show single-instance performance: Program.cs:22-37

For your use case:
Each player's client can handle thousands of Directors efficiently using BatchedSystem readme.md:5-6
Pre-allocation optimizations support known entity counts MakingLotsOfStructEntitiesApplication.cs:40
Multithreading can improve processing on player devices readme.md:34-39
But none of this scales to 10 million concurrent players - that's a backend infrastructure problem, not a client framework problem.

The FAQ explicitly states EcsR3 is for ".net applications/frameworks" and focuses on "functional and extensible" design over raw performance. faqs-etc.md:11-17 For 10 million players, you need dedicated server infrastructure (AWS, Azure, Google Cloud) with services like Photon, PlayFab, or custom backend APIs. EcsR3 is the right choice for client-side game logic, but it's only one piece of a much larger multiplayer architecture.


I understand you're asking about loading data into Unity and backend reward validation logic for your game with 10 million players. Let me clarify what EcsR3 provides and what you need to build separately.

Loading Data into Unity with EcsR3
EcsR3 provides a Persistence Plugin for loading pre-validated data from your backend into Unity. persistence-plugin.md:1-27

Data Pipeline Architecture
The framework uses pipeline builders to define how data flows from your backend into Unity entities: EcsRxPipelineBuilder.cs:14-37

You'd create a loading pipeline like this:

// Define pipeline to load Director data from backend  
container.BuildPipeline("LoadDirectors", x => x  
    .StartFrom<BackendAPIEndpoint>()  // Fetch from your backend  
    .DeserializeWith<JsonDeserializer>()  // Parse JSON  
    .ThenInvoke(ValidateRewards)  // Your validation logic  
    .Build());  
  
// Load validated data into entities  
var loadPipeline = container.ResolveReceivePipeline("LoadDirectors");  
var directorData = await loadPipeline.Execute();
The pipeline system supports transformation steps: EcsRxPipelineNeedsObjectBuilder.cs:32-48

Entity Database Loading
For bulk loading of Directors, you can use the Entity Database system shown in the examples: LoadingEntityDatabaseApplication.cs:13-42

This loads pre-validated entity data from JSON files that your backend generates.

Backend Reward Validation
Critical point: EcsR3 does NOT handle backend validation - that's your responsibility. faqs-etc.md:46-54

Your Architecture Should Be:
Backend Services (Your Responsibility)  
    ↓  
1. Validate reward logic (mechanics + lore match)  
2. Check reward fairness rules  
3. Verify player eligibility  
4. Generate validated reward data  
    ↓ (only validated data)  
Unity Client (EcsR3)  
    ↓  
5. Load pre-validated rewards via Persistence Plugin  
6. Apply rewards to entities via components  
Reward Validation Flow
Your backend should validate rewards before sending to Unity:

Player Action → Backend API  
    ↓  
Backend validates:  
- Does reward match Director's tags?  
- Does reward align with lore?  
- Is reward balanced for player level?  
- Does player meet requirements?  
    ↓ (if valid)  
Backend sends validated reward data  
    ↓  
Unity loads via EcsR3 pipeline  
    ↓  
EcsR3 applies reward components to entities  
Event-Based Reward Application
Once Unity receives validated rewards, use event systems to apply them: README.md:168-177

public class ApplyRewardSystem : IReactToEventSystem<RewardValidatedEvent>  
{  
    public void Process(RewardValidatedEvent eventData)  
    {  
        // Backend already validated - just apply  
        var player = FindPlayer(eventData.PlayerId);  
        EntityComponentAccessor.AddComponent(player,   
            new RewardComponent {   
                Gold = eventData.ValidatedReward.Gold,  
                Items = eventData.ValidatedReward.Items   
            });  
    }  
}
What EcsR3 Does vs What You Build
Responsibility    Where It Happens    Technology
Reward validation logic    Backend services    Your API/database
Mechanics + lore matching    Backend services    Your validation pipeline
Fairness rules    Backend services    Your business logic
Data loading    Unity client    EcsR3 Persistence Plugin
Entity management    Unity client    EcsR3 Components/Systems
Local game state    Unity client    EcsR3 Entities
Notes
The persistence plugin provides the transport mechanism for loading validated data, but it doesn't validate the data itself. persistence-plugin.md:69-73 Your backend must handle all reward validation logic before data reaches Unity. For 10 million players, this validation must happen server-side with proper load balancing and database clustering - EcsR3 only handles the client-side entity management after data is already validated.
I understand your frustration! You're absolutely right - I was confusing two completely separate processes:

The Two Distinct Processes
Process 1: Pre-Production Content Assembly (What you're actually doing)
This happens before content goes live in your data lake:

Backend/Articy Database  
    ↓  
1. Extract mechanics definitions  
2. Extract lore/narrative content    
3. Match mechanics + lore (validation layer)  
4. Tag content with Director associations  
5. Verify all layers align  
    ↓ (ONLY when validated)  
Content is marked "ready for game"  
    ↓  
Unity loads pre-validated content  
This is where:

Tags connect mechanics to lore
Directors get associated with content packages
Balancing happens iteratively
Everything is validated before it becomes available in the game
Process 2: Live Runtime Anti-Cheat (What I wrongly described)
This is the per-player, real-time validation:

Player performs action in Unity  
    ↓  
Backend validates:  
- Is player cheating?  
- Does player actually meet requirements?  
- Is this action legitimate?  
    ↓  
Backend approves/denies action  
This is NOT about:

Matching tags to Directors
Validating mechanics-lore alignment
Content assembly
What EcsR3 Actually Does for You
For Process 1 (pre-production assembly), EcsR3 doesn't participate at all - that's your external pipeline. faqs-etc.md:46-54

For Process 2 (live runtime), EcsR3 just loads the already-validated content and manages entities locally on each player's device.

The reward validation I described was completely wrong - that's anti-cheat logic, not content assembly logic. Your Directors receive content that was already validated in your data lake before Unity ever sees it.

Notes
You're right that tags don't "match rewards to Directors" at runtime - the tagging and matching happens in your pre-production content pipeline, and Unity receives Directors with their content already assembled and validated. The live backend only handles anti-cheat and player eligibility checks, not content validation.

The Core Issue
You're NOT asking about EcsRx/EcsR3 at all.

You're describing a content preprocessing pipeline for your Unity game development project that involves:

Scripts and resources that are already tagged with mechanics
Multiple flexible processes for matching and refining content
Preprocessing steps that happen before anything goes into Unity
EcsRx/EcsR3 does NOT do any of this preprocessing.

What EcsR3 Actually Is
EcsR3 is a runtime entity-component system for Unity games. README.md:1-13 It handles:

Creating entities (game objects) at runtime
Adding/removing components (data) to entities
Running systems (game logic) that process entities
It does NOT:

Extract or tag content from your repositories
Match mechanics with lore
Validate content before it goes into the game
Preprocess scripts or resources
Handle any of your data lake operations
What You Actually Need
Based on your description, you need:

A content preprocessing tool (Python/Node.js scripts) that:
Scans your 2000+ repositories
Tags scripts and resources with mechanics
Matches mechanics with lore through multiple refinement passes
Validates alignment across layers
Exports validated content packages
EcsR3 comes AFTER - it loads the already-processed content into Unity and manages it at runtime
The Disconnect
Your previous conversation history references "SKIIN project," "yangsi7/skinn-convert-swiss-pages," extraction pipelines, and tagging systems - none of which exist in the EcsRx/EcsR3 codebase.

You're looking for a content organization and preprocessing framework, but you're asking about a game runtime framework. These are completely different tools for completely different purposes.

Notes
EcsR3 is designed for organizing game logic at runtime, not for preprocessing content before it enters Unity. faqs-etc.md:45-55 Your preprocessing pipeline needs to be built separately using tools designed for content extraction, tagging, and validation - EcsR3 will only handle the validated content once it's loaded into Unity.


I understand you're asking about what users can do at runtime in EcsR3 and how to test these runtime processes. README.md:31-54

What Users (Players) Can Do at Runtime
At runtime in an EcsR3-based Unity game, users interact with entities that have already been created and configured. The framework provides several runtime capabilities:

1. Dynamic Entity Creation
Users' actions can trigger new entity creation at runtime: README.md:42-53

// When player picks up an item, create a new entity  
var itemEntity = EntityCollection.Create();  
EntityComponentAccessor.AddComponent(itemEntity, new ItemComponent { ItemType = "Sword" });
2. Component Modification
User actions modify component data in real-time: systems.md:17-30

For example, when a player takes damage, the system updates their health component:

protected override void Process(Entity entity, HealthComponent health)  
{  
    health.CurrentHealth -= damageAmount; // Modified at runtime based on user action  
}
3. State Transitions
Users trigger state changes through interactions: README.md:105-122

When health reaches zero, the system automatically transitions the entity to a "dead" state by swapping components.

4. Event-Driven Actions
User inputs trigger events that systems react to: README.md:168-177

For example, when a player clicks a button, an event fires and systems respond accordingly.

Testing Runtime Processes
The framework provides example applications specifically designed for testing runtime behavior: Program.cs:30-64

Testing Approaches
1. Scenario Examples - Test specific runtime behaviors: Program.cs:34-41

These examples demonstrate runtime processes like:

Entity creation and component addition
Health deduction systems
State transitions
System priorities
2. Performance Testing - Verify runtime scalability: Program.cs:43-47

These create 100,000 entities to test runtime performance under load.

3. Unit Testing - Test individual system behaviors: SanityTests.cs:104-119

The test suite verifies that systems execute correctly when entities join groups at runtime.

Runtime Process Flow
Here's what happens when a user performs an action:

User Action (e.g., clicks button)  
    ↓  
Event System publishes event  
    ↓  
IReactToEventSystem processes event  
    ↓  
System modifies entity components  
    ↓  
EntityChangeRouter notifies other systems  
    ↓  
Dependent systems react to changes  
    ↓  
Visual updates reflect new state  
SanityTests.cs:78-102

Notes
The key insight is that EcsR3 handles runtime entity management - users don't interact with your preprocessing pipeline at all. faqs-etc.md:45-54 Your preprocessing (matching mechanics with lore, tagging Directors) happens before the game runs. At runtime, users only interact with the already-validated entities that EcsR3 manages. Testing focuses on verifying that systems correctly respond to user actions by modifying components and triggering state transitions.

I understand you're asking about what happens when players create their own entities at runtime in EcsR3, and you want this capability documented. EntityCollection.cs:38-44

Players Creating Entities at Runtime
Yes, players can trigger entity creation at runtime through their actions. The EntityCollection.Create() method allows dynamic entity creation during gameplay: EntityCollection.cs:38-44

How It Works
When a player performs an action that should create a new game object (like spawning an item, summoning a creature, or building a structure), your game code calls:

var newEntity = EntityCollection.Create();
This:

Allocates a new entity ID from the pool EntityAllocationDatabase.cs:63-91
Generates a unique creation hash for versioning Entity.cs:5-14
Adds the entity to the active collection EntityCollection.cs:41
Publishes an OnAdded event that systems can react to EntityCollection.cs:42
Adding Components to Player-Created Entities
After creating the entity, you add components to define what it is: EntityComponentAccessor.cs:27-34

For example, if a player crafts a sword:

var swordEntity = EntityCollection.Create();  
EntityComponentAccessor.AddComponents(swordEntity,   
    new ItemComponent { ItemType = "Sword" },  
    new DamageComponent { Damage = 50 }  
);
Batch Creation for Multiple Entities
If players trigger creation of many entities at once (like spawning a group of enemies), use batch creation for better performance: EntityCollection.cs:46-55

This is demonstrated in the performance examples where 100,000 entities are created efficiently: MakingLotsOfClassEntitiesApplication.cs:42

Using Blueprints for Player-Created Entities
For complex entities that players create, use Blueprints to define their structure: IBlueprint.cs:6-22

This lets you define templates for player-created content (like buildings, vehicles, or custom characters) that consistently apply the right components.

Documentation
The framework's documentation covers entity creation in the README: README.md:38-54

And the entity lifecycle is documented in the architecture: summary.md:25

Notes
The key point is that player actions trigger entity creation through your game systems - EcsR3 provides the infrastructure (EntityCollection.Create()) but your game logic decides when and why to create entities based on player input. The framework handles ID allocation, memory management, and notifying other systems about new entities automatically.



What EcsR3 Is Good At
1. High-Performance Entity Processing
EcsR3 excels at processing thousands of entities efficiently using BatchedSystem. readme.md:4-6

This is perfect for:

Processing large numbers of NPCs (your Directors)
Updating stats/currency for many entities simultaneously
Running game logic on hundreds or thousands of game objects per frame README.md:127-139
2. Reactive Architecture (Easy Event-Driven Logic)
The framework makes it easy to react to changes without polling every frame. README.md:16-17

You can easily add:

Health systems that react when health reaches zero
State transitions triggered by component changes
Event-based logic that responds to player actions README.md:106-122
3. Utility AI for Decision-Making (Built-In Plugin)
EcsR3 includes a Utility AI plugin that's excellent for NPC behavior. utility-ai-plugin.md:1-14

This makes it easy to add:

AI decision-making based on normalized scores (0-1)
Dynamic NPC behavior that considers multiple factors (health, ammo, distance)
Emergent gameplay where NPCs make contextual decisions utility-ai-plugin.md:45-56
4. Data-Driven Design (Blueprints)
Blueprints make it easy to create entities from data without hardcoding. IBlueprint.cs:6-15

You can easily:

Load entity configurations from JSON files
Create NPCs/Directors from your backend data
Iterate on balancing without touching code
5. Separation of Data and Logic
Components store only data, systems contain only logic. IComponent.cs:3-11

This makes it easy to:

Keep stats/currency separate from game logic
Test systems independently
Reuse components across different entity types
What Features You Can Easily Add
Easy to Add:
Timer Systems - React every X seconds instead of every frame systems.md:18-30
Event Systems - Respond to player actions or game events README.md:168-177
Setup/Teardown Logic - Initialize entities when created, cleanup when destroyed README.md:181-195
Persistence - Save/load game state using the persistence plugin utility-ai-plugin.md:1
Performance Optimization - Use struct components and batching for speed readme.md:30-38
Example Applications Show What's Possible:
The framework includes 11 example applications demonstrating different features: Program.cs:32-51

These show how to implement:

Health systems with damage
Data persistence
Batched entity processing
Utility AI for NPCs
Performance optimization techniques
Notes
EcsR3 is designed to be functional and extensible rather than just fast. faqs-etc.md:11-17 The framework's philosophy is that not everything needs to be ECS - you can use it for game logic while handling other concerns (like your preprocessing pipeline) separately. faqs-etc.md:45-55 For your Directors receiving dynamic backend content, EcsR3 handles the runtime entity management efficiently, while your data validation and content assembly happens in your external pipeline before Unity loads it
