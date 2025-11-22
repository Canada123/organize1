1. DoorContainer.cs
csharp
Copy
using UnityEngine;

[System.Serializable]
public class DoorContainer
{
    public string doorID;
    public string sceneName;
    public Vector3 position;
    public string directorID;  // The director currently at this door
    public string[] tagIDs;    // Tags from Articy
}
2. DirectorContainer.cs
csharp
Copy
[System.Serializable]
public class DirectorContainer
{
    public string directorID;
    public string displayName;
    public string archetype;  // From Articy tag - NO ENUM
    public float affinity;
    public string[] traitTags;
    public string[] currentStates;  // Dynamic states from Articy
}
3. PlayerContainer.cs
csharp
Copy
[System.Serializable]
public class PlayerContainer
{
    public string playerID;
    public string currentState;
    public InventoryItem[] inventory;
    public string[] unlockedSkills;
}

[System.Serializable]
public class InventoryItem
{
    public string itemID;
    public int quantity;
}

1. ItemContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/ItemContainer.cs
[System.Serializable]
public class ItemContainer
{
    public string id;
    public string displayName;
    public string description;
    public string itemType;  // "Weapon", "Potion", "Key" - from Articy string
    public string rarity;    // "Common", "Legendary" - from Articy string
    public Dictionary<string, float> stats; // Dynamic: {"Damage": 10, "Weight": 2.5}
    public string iconId;    // Reference to Articy asset ID
    public float goldValue;
    public bool isQuestItem;
    public List<string> tags; // From Articy: ["Consumable", "Magic"]
}
2. StatContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/StatContainer.cs
[System.Serializable]
public class StatContainer
{
    public string id;
    public string statName;        // "Strength", "Charisma" - from Articy
    public string displayName;
    public float baseValue;
    public float currentValue;
    public string statCategory;    // "Physical", "Mental" - from Articy
    public bool isClamp01;         // Does it clamp 0-1? (like reputation)
    public Dictionary<string, float> modifiers; // {"Equipment": +5, "Buff": +2}
}
3. CurrencyContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/CurrencyContainer.cs
[System.Serializable]
public class CurrencyContainer
{
    public string id;
    public string currencyType;    // "Gold", "Gems", "SkillPoints" - Articy string
    public string displayName;
    public string displaySymbol;   // "G", "💎", "SP"
    public float currentAmount;
    public float maxAmount;        // -1 for infinite
    public bool isPremium;         // Real money currency?
}
4. SkillContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/SkillContainer.cs
[System.Serializable]
public class SkillContainer
{
    public string id;
    public string skillName;
    public string description;
    public string skillCategory;   // "Combat", "Crafting" - from Articy
    public Dictionary<string, float> costs;      // {"Gold": 100, "SkillPoints": 1}
    public Dictionary<string, float> effects;    // {"DamageBonus": 0.15}
    public List<string> prerequisites;          // IDs of required skills
    public int currentLevel;
    public int maxLevel;
    public string iconId;
}
5. QuestContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/QuestContainer.cs
[System.Serializable]
public class QuestContainer
{
    public string id;
    public string questName;
    public string description;
    public string questGiverId;    // Director ID from Articy
    public List<TaskContainer> tasks;
    public Dictionary<string, float> rewards; // {"Gold": 500, "XP": 250}
    public List<string> requiredItems;        // Item IDs needed
    public string questStatus;     // "Available", "Active", "Completed", "Failed"
    public bool isMainQuest;
    public string nextQuestId;     // Chain to next quest
}
6. TaskContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/TaskContainer.cs
[System.Serializable]
public class TaskContainer
{
    public string id;
    public string taskDescription;
    public string taskType;        // "Kill", "Collect", "Talk" - from Articy
    public string targetId;        // ID of thing to kill/collect/talk to
    public int currentProgress;
    public int requiredAmount;
    public bool isCompleted;
    public Dictionary<string, float> taskRewards; // Per-task completion rewards
}
7. EventContainer.cs
csharp
Copy
// Assets/Scripts/Data/Containers/EventContainer.cs
[System.Serializable]
public class EventContainer
{
    public string id;
    public string eventName;
    public string eventType;       // "Dialogue", "Combat", "Cutscene"
    public List<string> directorIds; // Who's involved
    public string triggerCondition;   // Articy expression as string
    public Dictionary<string, object> payload; // ANY data: {"Scene": "BossFight", "Music": "Epic"}
    public bool isOneTime;
    public bool hasFired;
}
THE LOADER THAT FILLS THEM (No hard-coded logic)
csharp
Copy
// Assets/Scripts/Core/DynamicContainerLoader.cs
using Articy.Unity;
using System.Collections.Generic;

public static class DynamicContainerLoader
{
    public static Dictionary<string, T> LoadAll<T>(string articyTag) where T : new()
    {
        var containers = new Dictionary<string, T>();
        
        foreach (var obj in ArticyDatabase.GetAll(articyTag))
        {
            var container = new T();
            
            // Use reflection to map Articy features to container fields
            foreach (var field in typeof(T).GetFields())
            {
                if (obj.HasFeature(field.Name))
                {
                    field.SetValue(container, obj.GetFeature(field.Name));
                }
            }
            
            containers[obj.GetFeature<string>("Id")] = container;
        }
        
        return containers;
    }
}

