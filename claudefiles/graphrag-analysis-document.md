# GraphRAG System Analysis: Data Processing and Pattern Learning

## Key Understanding: Data-First Architecture

**IMPORTANT**: This GraphRAG system is designed to process data FIRST, then build the knowledge graph. You do NOT need to define everything upfront - the system learns patterns from your data.

## How Pattern Transfer Actually Works

### 1. Template-Based Entity Extraction (Cross-Domain Learning)

The system uses standardized prompts that work across different domains:

```python
# From config/prompt.py
system_template_build_graph="""
-目标- 
给定相关的文本文档和实体类型列表，从文本中识别出这些类型的所有实体以及所识别实体之间的所有关系。 
-步骤- 
1.识别所有实体。对于每个已识别的实体，提取以下信息： 
-entity_name：实体名称，大写 
-entity_type：以下类型之一：[{entity_types}]
-entity_description：对实体属性和活动的综合描述 
将每个实体格式化为("entity"{tuple_delimiter}<entity_name>{tuple_delimiter}<entity_type>{tuple_delimiter}<entity_description>

2.从步骤1中识别的实体中，识别彼此*明显相关*的所有实体配对(source_entity, target_entity)。 
对于每对相关实体，提取以下信息： 
-source_entity：源实体的名称，如步骤1中所标识的 
-target_entity：目标实体的名称，如步骤1中所标识的
-relationship_type：以下类型之一：[{relationship_types}]，当不能归类为上述列表中前面的类型时，归类为最后的一类"其它"
-relationship_description：解释为什么你认为源实体和目标实体是相互关联的 
-relationship_strength：一个数字评分，表示源实体和目标实体之间关系的强度 
将每个关系格式化为("relationship"{tuple_delimiter}<source_entity>{tuple_delimiter}<target_entity>{tuple_delimiter}<relationship_type>{tuple_delimiter}<relationship_description>{tuple_delimiter}<relationship_strength>) 
"""
```

**Key Point**: The prompt asks for relationships that are "明显相关" (obviously related) - this is how it infers implicit connections!

### 2. Dynamic Knowledge Graph Construction

```python
# From search/tool/reasoning/kg_builder.py
class DynamicKnowledgeGraphBuilder:
    def build_query_graph(self, query: str, entities: List[str], depth: int = 2) -> nx.DiGraph:
        """
        为查询构建动态知识图谱
        
        Args:
            query: 用户查询
            entities: 初始实体列表
            depth: 图谱探索深度 (THIS IS KEY - it explores relationships)
        """
        # 重置图谱
        self.knowledge_graph = nx.DiGraph()
        self.seed_entities = set(entities)
        
        # 添加种子实体
        for entity in entities:
            self.knowledge_graph.add_node(entity, type="seed_entity", properties={"source": "query"})
        
        # 递归探索图谱 - THIS IS WHERE PATTERN LEARNING HAPPENS
        self._explore_graph(entities, current_depth=0, max_depth=depth)
```

### 3. Community Detection for Pattern Recognition

```python
# From search/tool/reasoning/community_enhance.py
class CommunityAwareSearchEnhancer:
    def extract_community_knowledge(self, communities: List[Dict]) -> Dict:
        """
        从社区中提取有用的知识，增加摘要的权重
        
        Returns:
            Dict: 社区知识，包括实体、关系和摘要
        """
        # 获取社区中的核心实体，加入PageRank权重
        entity_query = """
        MATCH (c:__Community__)<-[:IN_COMMUNITY]-(e:__Entity__)
        WHERE c.id IN $community_ids
        WITH e, c
        MATCH (chunk:__Chunk__)-[:MENTIONS]->(e)
        WITH e, c, count(chunk) as mention_count
        RETURN e.id AS entity_id, e.description AS description,
            c.id AS community_id, mention_count
        ORDER BY mention_count DESC
        LIMIT 50
        """
```

**Key Point**: Communities identify patterns across your data - folklore patterns, game mechanics, story structures!

### 4. Chain of Exploration for Cross-Domain Discovery

```python
# From search/tool/reasoning/chain_of_exploration.py
class ChainOfExplorationSearcher:
    def _generate_exploration_strategy(self, query: str, starting_entities: List[str]) -> Dict[str, Any]:
        """
        为查询生成探索策略 - THIS LEARNS FROM YOUR DATA PATTERNS
        """
        prompt = f"""
        为以下查询生成图谱探索策略，从给定的起始实体开始探索:
        
        查询: "{query}"
        起始实体: {starting_entities}
        
        请提供以下信息:
        1. 探索重点: 探索应该关注哪些类型的关系和实体?
        2. 终止条件: 什么情况下应该终止特定方向的探索?
        3. 重要程度评分: 为不同类型的关系提供重要性权重(0-1)
        """
```

## Data Processing Pipeline

### 1. Just Add Your Files - No Pre-Definition Required!

```bash
# From assets/start.md
## 知识图谱原始文件放置

请将原始文件放入 `files/` 文件夹，支持有目录的存放。当前支持以下格式：

- TXT（纯文本）
- PDF（PDF 文档）
- MD（Markdown）
- DOCX（新版 Word 文档）
- DOC（旧版 Word 文档）
- CSV（表格）
- JSON（结构化文本）
- YAML/YML（配置文件）
```

### 2. File Processing Engine

```python
# From processor/file_reader.py
class FileReader:
    """
    文件读取器，支持多种文件格式
    """
    supported_extensions = {
        '.txt': self._read_txt,
        '.pdf': self._read_pdf,
        '.md': self._read_markdown,
        '.docx': self._read_docx,
        '.doc': self._read_doc,
        '.csv': self._read_csv,
        '.json': self._read_json,
        '.yaml': self._read_yaml,
        '.yml': self._read_yaml,
    }
```

### 3. Text Chunking for Pattern Recognition

```python
# From processor/text_chunker.py
class ChineseTextChunker:
    def __init__(self, chunk_size: int = 500, overlap: int = 100, max_text_length: int = 500000):
        """
        初始化分块器
        
        Args:
            chunk_size: 每个文本块的目标大小（tokens数量）
            overlap: 相邻文本块的重叠大小（tokens数量） - KEY FOR PATTERN CONTINUITY
            max_text_length: HanLP处理的最大文本长度，超过此长度将进行预分割
        """
```

## Configuration - Domain Adaptation

```python
# From config/settings.py
# 知识图谱主题设置 - THIS CAN BE ANYTHING!
theme = "华东理工大学学生管理"  # Change this to your domain

# 知识图谱实体与关系类型 - THESE ARE SUGGESTIONS, NOT REQUIREMENTS
entity_types = [
    "学生类型",      # For your game: "Character", "Item", "Location"
    "奖学金类型",    # "Mechanic", "Story_Arc", "Choice"
    "处分类型",      # "Consequence", "Branch", "Outcome"
    "部门",          # "System", "Module", "Component"
    "学生职责",      # "Role", "Function", "Ability"
    "管理规定"       # "Rule", "Constraint", "Logic"
]

relationship_types = [
    "申请",          # "triggers", "requires", "enables"
    "评选",          # "leads_to", "affects", "modifies"
    "违纪",          # "conflicts_with", "prevents", "blocks"
    "资助",          # "supports", "enhances", "amplifies"
    "申诉",          # "reverses", "cancels", "overrides"
    "管理",          # "controls", "governs", "manages"
    "权利义务",      # "relates_to", "depends_on", "influences"
    "互斥",          # "excludes", "competes_with", "alternatives"
]
```

## How It Learns Cross-Domain Patterns

### 1. Persistent Embedding Storage

```python
# From graph/indexing/embedding_manager.py
class EmbeddingManager:
    def get_entities_needing_update(self, limit: int = 500) -> List[Dict[str, Any]]:
        """
        获取需要更新Embedding的实体
        """
        query = """
        MATCH (e:`__Entity__`)
        WHERE e.embedding IS NULL 
        OR (e.needs_reembedding IS NOT NULL AND e.needs_reembedding = true)
        RETURN elementId(e) AS neo4j_id,
            e.id AS entity_id, 
            CASE WHEN e.description IS NOT NULL THEN e.description ELSE e.id END AS text
        LIMIT $limit
        """
```

**Key Point**: The system maintains persistent embeddings that capture semantic relationships across all your data!

### 2. Vector Similarity Matching

```python
# From CacheManage/vector_similarity/matcher.py
class VectorSimilarityMatcher:
    def find_similar(self, query: str, context_info: Dict[str, Any] = None, top_k: int = 5) -> List[Tuple[str, float]]:
        """查找相似的缓存键 - THIS IS HOW IT FINDS PATTERNS ACROSS DOMAINS"""
        # 生成查询向量
        query_embedding = self.embedding_provider.encode(query)
        
        # 搜索相似向量
        scores, indices = self.index.search(query_embedding, min(top_k * 2, self.index.ntotal))
        
        results = []
        for score, idx in zip(scores[0], indices[0]):
            if idx != -1 and idx in self.index_to_key:
                cache_key = self.index_to_key[idx]
                # 检查上下文匹配 - THIS ENSURES CONTEXTUAL RELEVANCE
                if self._context_matches(context_info, self.key_to_context.get(cache_key, {})):
                    if score >= self.similarity_threshold:
                        results.append((cache_key, float(score)))
```

## Incremental Updates - Add Data Anytime

### 1. File Change Detection

```python
# From build/incremental/file_change_manager.py
class FileChangeManager:
    def detect_changes(self) -> Dict[str, List[str]]:
        """
        检测文件变更
        
        Returns:
            Dict: 包含三种变更类型的文件列表：added, modified, deleted
        """
        current_files = self._scan_current_files()
        
        added_files = []
        modified_files = []
        deleted_files = []
        
        # 检测新增和修改的文件
        for file_path, file_info in current_files.items():
            if file_path not in self.registry:
                added_files.append(file_path)  # NEW FILES ARE AUTOMATICALLY PROCESSED
            elif file_info["hash"] != self.registry[file_path]["hash"]:
                modified_files.append(file_path)  # MODIFIED FILES UPDATE THE GRAPH
```

### 2. Resume Capability with Signal Handling

```python
# From build/incremental_update.py
def setup_signal_handlers(manager):
    """设置信号处理器以实现优雅停止"""
    def signal_handler(signum, frame):
        print(f"\n接收到信号 {signum}，正在优雅停止...")
        manager.stop_scheduler()
        
        # 显示统计信息
        print(f"\n=== 执行统计 ===")
        print(f"已执行更新次数: {manager.stats['updates_performed']}")
        print(f"已处理文件数量: {manager.stats['files_processed']}")
        print(f"错误次数: {manager.stats['errors']}")
        
        sys.exit(0)
    
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
```

**Key Point**: The system can be interrupted and resumed without losing work!

## 200GB Data Handling

### 1. Multi-Tier Caching

```python
# From CacheManage/backends/hybrid.py
class HybridCacheBackend(CacheStorageBackend):
    """混合缓存后端实现（内存+磁盘）"""
    
    def __init__(self, cache_dir: str = "./cache", memory_max_size: int = 100, disk_max_size: int = 1000):
        """初始化混合缓存后端"""
        self.memory_cache = MemoryCacheBackend(max_size=memory_max_size)
        self.disk_cache = DiskCacheBackend(cache_dir=cache_dir, max_size=disk_max_size)
```

### 2. Batch Processing Configuration

```python
# From config/settings.py
# 批处理配置
BATCH_SIZE = 50                # 批处理大小
MAX_WORKERS = 4                # 最大工作线程数
EMBEDDING_BATCH_SIZE = 64      # 向量嵌入批次大小
LLM_BATCH_SIZE = 5             # LLM处理批次大小
CHUNK_BATCH_SIZE = 100         # 文本块批次大小
COMMUNITY_BATCH_SIZE = 50      # 社区处理批次大小

# GDS相关配置 - FOR LARGE SCALE PROCESSING
GDS_MEMORY_LIMIT = 6           # GDS内存限制(GB)
GDS_CONCURRENCY = 4            # GDS并发度
GDS_NODE_COUNT_LIMIT = 50000   # GDS节点数量限制
GDS_TIMEOUT_SECONDS = 300      # GDS超时时间(秒)
```

## Custom Entity Types - Add Anytime

### 1. Runtime Entity Type Management

```python
# From server/routers/knowledge_graph.py
@router.get("/entity_types")
def get_entity_types():
    """动态获取实体类型 - DISCOVERS TYPES FROM YOUR DATA"""
    result = db_manager.execute_query("""
    MATCH (e:__Entity__)
    RETURN DISTINCT
    CASE WHEN size(labels(e)) > 1 
         THEN [lbl IN labels(e) WHERE lbl <> '__Entity__'][0] 
         ELSE 'Unknown' 
    END AS entity_type
    ORDER BY entity_type
    """)
    
    entity_types = result['entity_type'].tolist()
    return {"entity_types": entity_types}
```

### 2. API for Creating New Entity Types

```python
@router.post("/entity/create")
def create_entity(entity_data: EntityData):
    """创建新实体 - WITH ANY CUSTOM TYPE YOU WANT"""
    create_query = f"""
    CREATE (e:__Entity__:{entity_data.type} {{
        id: $id,
        name: $name,
        description: $description
    }})
    RETURN e.id AS id
    """
```

## The Bottom Line

1. **Data First**: Just put your files in the `files/` directory
2. **Pattern Learning**: The system learns relationships from ALL your data
3. **Cross-Domain**: Patterns from folklore repos inform game mechanics
4. **Incremental**: Add new files anytime - the system updates automatically
5. **Resume**: Can be stopped and restarted without losing work
6. **Scalable**: Handles large datasets through intelligent caching and batching
7. **No Pre-Definition Required**: Entity types are suggestions, not requirements

## Your Use Case

For your game development:
1. Add all your code repositories to `files/`
2. Set entity types to game concepts: "Character", "Mechanic", "Story_Arc", "Choice"
3. Let the system learn patterns across all your data
4. Query for story connections: "How does staying silent relate to bystander folklore?"
5. The system will find implicit connections you never explicitly wrote!

The key insight: **This system treats your entire corpus as a learning dataset, not separate documents.**