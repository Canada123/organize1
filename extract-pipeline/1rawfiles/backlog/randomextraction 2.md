YES. You're absolutely right. I'm rushing to solutions when you need visibility first. My mistake.
You have 200+ repos. You don't know what's in them. You don't know which are packages vs projects vs random files. You need to see the map before you dig.
Here's the tool that only discovers and catalogs. It does nothing else.
```
REPO DISCOVERY TOOL (Copy this ONE file)
```
csharp
Copy
// Assets/Editor/RepoDiscoveryTool.cs
```
using UnityEngine;
using UnityEditor;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
```

```
public class RepoDiscoveryTool : EditorWindow
```
{
    // ❗SET THIS TO YOUR ACTUAL FOLDER❗
```
    private string rootReposPath = "C:/UnityRepos/";
```
    
```
    private Vector2 scrollPos;
    private List<DetectedItem> detectedItems = new List<DetectedItem>();
    private bool hasScanned = false;
```
    
```
    public class DetectedItem
```
    {
```
        public string name;
        public string path;
        public ItemType type;
        public List<string> features = new List<string>();
        public string status;
        public bool hasSamples;
        public string packageVersion;
```
    }
    
```
    public enum ItemType { UnityPackage, UnityProject, ResourceRepo, Unknown }
```
    
```
    [MenuItem("RIDDIM/Step 1: Discover Repositories")]
    public static void ShowWindow()
```
    {
```
        var window = GetWindow<RepoDiscoveryTool>("Repository Discovery");
        window.minSize = new Vector2(700, 500);
        window.Show();
```
    }
    
```
    void OnGUI()
```
    {
```
        GUILayout.Label("Repository Discovery Tool", EditorStyles.boldLabel);
        GUILayout.Label("This tool ONLY scans and shows what exists. No files will be modified.", EditorStyles.helpBox);
```
        
```
        rootReposPath = EditorGUILayout.TextField("Root Folder:", rootReposPath);
```
        
```
        if (GUILayout.Button("🔍 SCAN REPOSITORIES", GUILayout.Height(30)))
```
        {
```
            ScanRepositories();
```
        }
        
```
        if (!hasScanned)
```
        {
```
            GUILayout.Label("Click SCAN to begin", EditorStyles.centeredGreyMiniLabel);
            return;
```
        }
        
```
        scrollPos = EditorGUILayout.BeginScrollView(scrollPos);
```
        
        // Show packages
```
        var packages = detectedItems.Where(i => i.type == ItemType.UnityPackage).ToList();
        if (packages.Any())
```
        {
```
            GUILayout.Label($"📦 Unity Packages ({packages.Count})", EditorStyles.boldLabel);
            foreach (var item in packages) DrawItem(item);
```
        }
        
        // Show projects
```
        var projects = detectedItems.Where(i => i.type == ItemType.UnityProject).ToList();
        if (projects.Any())
```
        {
```
            GUILayout.Space(10);
            GUILayout.Label($"📁 Unity Projects ({projects.Count})", EditorStyles.boldLabel);
            foreach (var item in projects) DrawItem(item);
```
        }
        
        // Show resources
```
        var resources = detectedItems.Where(i => i.type == ItemType.ResourceRepo).ToList();
        if (resources.Any())
```
        {
```
            GUILayout.Space(10);
            GUILayout.Label($"📂 Resource Repositories ({resources.Count})", EditorStyles.boldLabel);
            foreach (var item in resources) DrawItem(item);
```
        }
        
```
        EditorGUILayout.EndScrollView();
```
    }
    
```
    void DrawItem(DetectedItem item)
```
    {
```
        using (new EditorGUILayout.HorizontalScope(EditorStyles.helpBox))
```
        {
            string icon = item.type switch
            {
                ItemType.UnityPackage => "📦",
                ItemType.UnityProject => "📁",
                _ => "📂"
```
            };
            EditorGUILayout.LabelField(icon, GUILayout.Width(30));
```
            
```
            using (new EditorGUILayout.VerticalScope())
```
            {
```
                EditorGUILayout.LabelField(item.name, EditorStyles.boldLabel);
                EditorGUILayout.LabelField(item.path, EditorStyles.miniLabel);
                EditorGUILayout.LabelField(item.status, EditorStyles.miniLabel);
```
                
```
                if (item.features.Any())
```
                {
```
                    EditorGUILayout.LabelField($"Features: {string.Join(", ", item.features)}", EditorStyles.miniLabel);
```
                }
            }
        }
    }
    
```
    void ScanRepositories()
```
    {
```
        detectedItems.Clear();
```
        
```
        if (!Directory.Exists(rootReposPath))
```
        {
```
            EditorUtility.DisplayDialog("Error", $"Path not found:\n{rootReposPath}", "OK");
            return;
```
        }
        
```
        var directories = Directory.GetDirectories(rootReposPath);
```
        
```
        foreach (var dir in directories)
```
        {
```
            var item = AnalyzeDirectory(dir);
            if (item != null)
```
            {
```
                detectedItems.Add(item);
```
            }
        }
        
```
        hasScanned = true;
        Repaint();
```
    }
    
```
    DetectedItem AnalyzeDirectory(string path)
```
    {
        var item = new DetectedItem
        {
```
            name = Path.GetFileName(path),
```
            path = path
```
        };
```
        
        // 1. Check if it's a Unity package
```
        var packageJson = Directory.GetFiles(path, "package.json", SearchOption.AllDirectories)
            .FirstOrDefault(f => !f.Contains("node_modules"));
```
            
```
        if (packageJson != null)
```
        {
```
            item.type = ItemType.UnityPackage;
            item.status = "Ready to install";
```
            
```
            var json = File.ReadAllText(packageJson);
            var displayName = Regex.Match(json, "\"displayName\"\\s*:\\s*\"([^\"]+)\"").Groups[1].Value;
            if (!string.IsNullOrEmpty(displayName)) item.name = displayName;
```
            
```
            item.packageVersion = Regex.Match(json, "\"version\"\\s*:\\s*\"([^\"]+)\"").Groups[1].Value;
```
            
```
            if (Directory.GetFiles(path, "*.asmdef", SearchOption.AllDirectories).Any())
                item.features.Add("Has assemblies");
```
            
```
            var samples = Directory.GetDirectories(path, "Samples~", SearchOption.AllDirectories);
            item.hasSamples = samples.Any();
            if (item.hasSamples) item.status += " (has samples)";
```
            
```
            return item;
```
        }
        
        // 2. Check if it's a Unity project
```
        bool hasAssets = Directory.Exists(Path.Combine(path, "Assets"));
        bool hasProjectSettings = Directory.Exists(Path.Combine(path, "ProjectSettings"));
```
        
```
        if (hasAssets && hasProjectSettings)
```
        {
```
            item.type = ItemType.UnityProject;
            item.status = "Ready to extract";
```
            
```
            DetectFeatures(item, path);
```
            
```
            if (item.name.Contains("Herp") || item.name.Contains("Hereos"))
```
            {
```
                item.status = "UI SOURCE - Can extract screens";
                if (!item.features.Contains("UI")) item.features.Add("UI System");
```
            }
            
```
            return item;
```
        }
        
        // 3. Check for resource repository
```
        var csFiles = Directory.GetFiles(path, "*.cs", SearchOption.AllDirectories).Length;
        if (csFiles > 0)
```
        {
```
            item.type = ItemType.ResourceRepo;
            item.status = $"{csFiles} scripts found";
            DetectFeatures(item, path);
            return item;
```
        }
        
```
        return null;
```
    }
    
```
    void DetectFeatures(DetectedItem item, string path)
```
    {
```
        var files = Directory.GetFiles(path, "*.cs", SearchOption.AllDirectories).Take(20);
        var content = string.Join("\n", files.Select(File.ReadAllText));
```
        
```
        if (content.Contains("QuestManager") || content.Contains("QuestData"))
            item.features.Add("Quest System");
```
            
```
        if (content.Contains("DialogueManager") || content.Contains("Conversation"))
            item.features.Add("Dialogue System");
```
            
```
        if (content.Contains("CombatManager") || content.Contains("Battle"))
            item.features.Add("Combat System");
```
            
```
        if (content.Contains("Inventory") || content.Contains("Item"))
            item.features.Add("Inventory System");
```
            
```
        if (content.Contains("Popup") || content.Contains("UI"))
            item.features.Add("UI Components");
```
    }
}
THIS IS ALL IT DOES:
Scans your folder
Categorizes everything into:
```
📦 Packages (has package.json) - Install these via Package Manager
📁 Projects (has Assets folder) - Extract scenes/prefabs from these
📂 Resources (just scripts) - Copy useful scripts from these
Shows features it found (Quest, Dialogue, UI, etc.)
Shows status (what you can do with each)
```
NO installation. NO extraction. NO code generation. Just a map.
YOUR NEXT STEPS AFTER SCANNING:
Look at the list and see what's there
```
Identify Herp Derp (it will show as "UI SOURCE")
Identify UniState (it will show as a Package)
```
Identify other packages you might want
Make a list of what looks useful
```
Then we can build Step 2 (Installation) tool
```
Does this slow-down-and-show-me approach work? It gives you complete visibility with zero risk.
