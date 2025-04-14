# Comparison of Elasticsearch and OpenSearch REST APIs

## Overview
OpenSearch was forked from Elasticsearch 7.10.2, maintaining compatibility with most core APIs while developing its own features and endpoints. This document outlines the key differences and similarities between their REST APIs.

## REST API Specification Directory Structure

### Directory Naming Convention
```
src/rest-spec/
├── elasticsearch/
│   ├── v6_0_0/
│   ├── v7_0_0/
│   └── v8_0_0/
└── opensearch/
    ├── v1_0_0/
    └── v2_0_0/
```

### Version Management Rules
1. **Major Version Based**
   - Directory names should reflect major versions
   - Format: `v{major}_{minor}_{patch}`
   - Example: `v6_0_0`, `v7_0_0`, `v8_0_0`

2. **Product Separation**
   - Clear separation between Elasticsearch and OpenSearch
   - Each product has its own root directory
   - Maintains clean separation of product-specific features

3. **Compatibility Mapping**
   - OpenSearch v1.0.0 ≈ Elasticsearch v7.10.2
   - OpenSearch v2.0.0 introduces new features
   - Document compatibility in each version directory

4. **File Organization**
```
src/rest-spec/elasticsearch/v8_0_0/
├── core/
│   ├── search.json
│   ├── index.json
│   └── cluster.json
├── security/
│   └── xpack.json
└── ml/
    └── machine_learning.json

src/rest-spec/opensearch/v2_0_0/
├── core/
│   ├── search.json
│   ├── index.json
│   └── cluster.json
├── security/
│   └── plugins_security.json
└── ml/
    └── plugins_ml.json
```

## Core API Compatibility
Most basic operations remain identical between both products:
- Document CRUD operations
- Basic search operations
- Index management
- Cluster management
- Bulk operations
- Mapping/Settings management

## Key Differences in API Endpoints

### Security APIs
```
Elasticsearch:
- /_xpack/security/...
- /_security/...

OpenSearch:
- /_plugins/_security/...
- /_opendistro/_security/...
```

### Machine Learning/Anomaly Detection
```
Elasticsearch:
- /_ml/...
- /_xpack/ml/...

OpenSearch:
- /_plugins/_ml/...
- /_plugins/_anomaly_detection/...
```

### SQL
```
Elasticsearch:
- /_xpack/sql
- /_sql

OpenSearch:
- /_plugins/_sql
- /_opensearch/_sql
```

### Monitoring
```
Elasticsearch:
- /_monitoring/...
- /_xpack/monitoring/...

OpenSearch:
- /_plugins/_monitoring/...
```

## Version-Specific Features

### OpenSearch 2.x
- New search pipeline APIs
- Enhanced security features
- Observability APIs
- Custom plugin endpoints under `/_plugins` namespace

### Elasticsearch 8.x
- Vector search APIs
- Enhanced ML capabilities
- Cloud integration APIs
- New security features

## Implementation Considerations

### Product Detection
To support both products, implement product detection:

```typescript
interface ElasticProduct {
  type: 'elasticsearch' | 'opensearch';
  version: string;
  majorVersion: number;
}

async function detectProduct(host: string): Promise<ElasticProduct> {
  const response = await fetch(host);
  const data = await response.json();
  
  return {
    type: data.version?.distribution === 'opensearch' ? 'opensearch' : 'elasticsearch',
    version: data.version.number,
    majorVersion: parseInt(data.version.number)
  };
}
```

### Host Configuration
Store both product type and version information:

```typescript
interface ElasticHostConfig {
  url: string;
  product: 'elasticsearch' | 'opensearch';
  version?: string;
}
```

### API Endpoint Management
Create a unified endpoint management system:

```typescript
class ElasticEndpoints {
  constructor(private product: ElasticProduct) {}

  getSecurityEndpoint(): string {
    return this.product.type === 'opensearch'
      ? '/_plugins/_security'
      : '/_security';
  }

  getSqlEndpoint(): string {
    return this.product.type === 'opensearch'
      ? '/_plugins/_sql'
      : '/_sql';
  }
}
```

## Migration Considerations

### Security
- Elasticsearch uses X-Pack security
- OpenSearch uses Security plugin
- Different authentication/authorization endpoints
- Role and user management variations

### Plugin Management
- Both support `_cat/plugins`
- OpenSearch uses `_plugins` namespace for custom features
- Plugin compatibility may vary

### Advanced Features
- Product-specific features may have different API structures
- Custom plugins need compatibility verification
- Monitor version-specific changes in both products

## Best Practices

1. **Version Detection**
   - Always detect product type and version on connection
   - Store product information with host configuration
   - Handle version-specific features appropriately

2. **API Abstraction**
   - Create abstraction layer for different endpoints
   - Handle product-specific error responses
   - Maintain compatibility with core features

3. **Error Handling**
   - Implement product-specific error handling
   - Provide clear error messages for unsupported features
   - Handle version compatibility issues gracefully

4. **Documentation**
   - Clearly document supported features for each product
   - Maintain version compatibility matrix
   - Update documentation with product-specific changes

## Future Considerations
- Monitor divergence between products
- Track new feature additions in both products
- Plan for version-specific feature support
- Consider backward compatibility requirements 

## REST API Specification and Completion Matching

### Specification Structure
```json
{
  "search": {
    "endpoints": {
      "_search": {
        "methods": ["GET", "POST"],
        "path_patterns": [
          "/{index}/_search",
          "/_search"
        ],
        "params": {
          "q": {
            "type": "string",
            "description": "Query string"
          },
          "size": {
            "type": "number",
            "description": "Number of hits to return"
          }
        },
        "body": {
          "query": {
            "type": "object",
            "description": "Query DSL"
          }
        }
      }
    },
    "snippets": {
      "match_query": {
        "description": "Match query for full-text search",
        "body": {
          "query": {
            "match": {
              "${1:field}": "${2:value}"
            }
          }
        }
      },
      "term_query": {
        "description": "Term query for exact value matches",
        "body": {
          "query": {
            "term": {
              "${1:field}": {
                "value": "${2:value}"
              }
            }
          }
        }
      }
    }
  }
}
```

### Completion Provider Implementation
```typescript
class ElasticCompletionProvider {
  private specs: Map<string, ApiSpec>;
  private product: ElasticProduct;

  constructor(product: ElasticProduct) {
    this.product = product;
    this.specs = this.loadSpecs();
  }

  private loadSpecs(): Map<string, ApiSpec> {
    const specPath = this.getSpecPath();
    // Load and parse spec files from the appropriate directory
    // based on product type and version
    return new Map();
  }

  private getSpecPath(): string {
    const baseDir = 'src/rest-spec';
    const productDir = this.product.type;
    const versionDir = this.getCompatibleVersion();
    return path.join(baseDir, productDir, versionDir);
  }

  private getCompatibleVersion(): string {
    // Map product version to compatible spec version
    if (this.product.type === 'opensearch') {
      if (this.product.majorVersion >= 2) return 'v2_0_0';
      return 'v1_0_0';
    } else {
      return `v${this.product.majorVersion}_0_0`;
    }
  }

  provideCompletions(document: TextDocument, position: Position): CompletionItem[] {
    const linePrefix = document.lineAt(position).text.substr(0, position.character);
    const completions: CompletionItem[] = [];

    // 1. Context Detection
    const context = this.detectContext(linePrefix);
    
    // 2. Spec Matching
    const matchingSpecs = this.findMatchingSpecs(context);

    // 3. Generate Completions
    for (const spec of matchingSpecs) {
      completions.push(...this.createCompletionItems(spec, context));
    }

    return completions;
  }

  private detectContext(linePrefix: string): CompletionContext {
    // Analyze the current line to determine the completion context
    // (e.g., endpoint, query parameter, body, etc.)
    return {
      type: 'endpoint' | 'param' | 'body',
      path: string,
      partial: string
    };
  }

  private findMatchingSpecs(context: CompletionContext): ApiSpec[] {
    // Find relevant specs based on the current context
    return [];
  }

  private createCompletionItems(spec: ApiSpec, context: CompletionContext): CompletionItem[] {
    // Create VS Code completion items from the matching specs
    return [];
  }
}
```

### Spec Matching Process
1. **Version Detection**
   - Determine product type (Elasticsearch/OpenSearch)
   - Map product version to compatible spec version
   - Load appropriate spec files from the correct directory

2. **Context Analysis**
   - Endpoint context (e.g., /_search, /_bulk)
   - Query parameter context (e.g., ?size=, ?q=)
   - Request body context (inside JSON/DSL)
   - Snippet context (common query patterns)

3. **Completion Generation**
   - Generate context-aware completions
   - Include documentation from specs
   - Add snippets for common patterns
   - Support both endpoint and query DSL completions

4. **Version-Specific Features**
   - Handle product-specific endpoints
   - Manage version-specific features
   - Provide appropriate documentation
   - Filter incompatible suggestions

### Usage Example
```typescript
// Initialize completion provider with product info
const provider = new ElasticCompletionProvider({
  type: 'opensearch',
  version: '2.0.0',
  majorVersion: 2
});

// Register completion provider
context.subscriptions.push(
  vscode.languages.registerCompletionItemProvider(
    'elasticsearch',
    provider,
    '/', // Trigger characters
    '.',
    '_'
  )
);
``` 