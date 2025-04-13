# Elasticsearch vs OpenSearch REST API Comparison

## Overview
OpenSearch was forked from Elasticsearch 7.10.2, maintaining compatibility with most core APIs while developing its own features and endpoints. This document outlines the key differences and similarities between their REST APIs.

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