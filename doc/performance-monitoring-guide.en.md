# Performance Monitoring Guide

## 1. VSCode Extension Performance Metrics

### Activation Performance
- **Activation Time**: Time taken to load and activate the extension
  ```typescript
  const startTime = process.hrtime();
  // Activation code
  const endTime = process.hrtime(startTime);
  console.log(`Activation time: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  ```

- **Memory Usage**: Memory consumed by the extension
  ```typescript
  const used = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
  ```

### Operation Performance
1. **Query Execution Time**
   - Elasticsearch query response time
   - Query result processing time
   - Result display time

2. **UI Responsiveness**
   - Command execution latency
   - Tree view update time
   - Editor interaction response time

## 2. Performance Monitoring Implementation

### Telemetry Collection
```typescript
interface PerformanceMetric {
  type: 'activation' | 'query' | 'ui';
  operation: string;
  duration: number;
  timestamp: Date;
  memory?: number;
  error?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  trackOperation(type: string, operation: string, callback: () => Promise<void>) {
    const startTime = process.hrtime();
    
    return callback()
      .then(() => {
        const endTime = process.hrtime(startTime);
        this.metrics.push({
          type,
          operation,
          duration: endTime[0] * 1000 + endTime[1] / 1000000,
          timestamp: new Date(),
          memory: process.memoryUsage().heapUsed
        });
      })
      .catch(error => {
        // Error logging
        throw error;
      });
  }
}
```

### Performance Benchmarks
1. **Activation Performance**
   - Activation time: < 1 second
   - Initial memory: < 50MB

2. **Query Performance**
   - Simple queries: < 1 second
   - Complex queries: < 3 seconds
   - Large data sets: < 5 seconds

3. **UI Responsiveness**
   - Command execution: < 100ms
   - Tree updates: < 500ms
   - User input response: < 50ms

## 3. Monitoring Dashboard

### Real-time Monitoring
```typescript
class PerformanceDashboard {
  private static instance: PerformanceDashboard;
  private statusBarItem: vscode.StatusBarItem;

  private constructor() {
    this.statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right
    );
  }

  updateMetrics(metrics: PerformanceMetric[]) {
    const avgQueryTime = this.calculateAverageQueryTime(metrics);
    this.statusBarItem.text = `Avg Query: ${avgQueryTime.toFixed(2)}ms`;
    this.statusBarItem.show();
  }
}
```

### Performance Report Generation
```typescript
interface PerformanceReport {
  period: string;
  metrics: {
    avgActivationTime: number;
    avgQueryTime: number;
    maxMemoryUsage: number;
    errorRate: number;
  };
  alerts: string[];
}
```

## 4. Performance Optimization Strategies

### Memory Management
1. **Prevent Memory Leaks**
   - Clean up event listeners
   - Limit cache size
   - Periodic memory cleanup

2. **Resource Disposal**
   ```typescript
   class ResourceManager {
     private disposables: vscode.Disposable[] = [];

     dispose() {
       this.disposables.forEach(d => d.dispose());
       this.disposables = [];
     }
   }
   ```

### Query Optimization
1. **Caching Strategy**
   ```typescript
   class QueryCache {
     private cache = new Map<string, {
       result: any;
       timestamp: number;
     }>();

     get(key: string): any {
       const cached = this.cache.get(key);
       if (cached && Date.now() - cached.timestamp < 5000) {
         return cached.result;
       }
       return null;
     }
   }
   ```

2. **Batch Processing**
   ```typescript
   class BatchProcessor {
     private queue: any[] = [];
     private processing = false;

     async add(item: any) {
       this.queue.push(item);
       if (!this.processing) {
         await this.process();
       }
     }
   }
   ```

## 5. Alerts and Warnings

### Performance Alerts
```typescript
class PerformanceAlert {
  checkMetrics(metrics: PerformanceMetric[]) {
    if (metrics.some(m => m.duration > 5000)) {
      vscode.window.showWarningMessage(
        'Performance degradation detected. Please check logs.'
      );
    }
  }
}
```

### Logging System
```typescript
class PerformanceLogger {
  private logFile: string;

  constructor() {
    this.logFile = path.join(os.tmpdir(), 'vscode-extension-performance.log');
  }

  log(metric: PerformanceMetric) {
    const entry = `${new Date().toISOString()} - ${metric.type}: ${metric.duration}ms\n`;
    fs.appendFileSync(this.logFile, entry);
  }
}
```

## 6. Utilizing Monitoring Data

### Performance Trend Analysis
- Performance changes over time
- Usage pattern analysis
- Bottleneck identification

### User Feedback Integration
- Performance issue reporting system
- User experience metrics
- Improvement prioritization 

## 7. Telemetry System

### User Consent Management
```typescript
class TelemetryConsent {
  private static readonly CONSENT_KEY = 'elasticQueryStudio.telemetryConsent';
  
  static async checkInitialConsent(): Promise<boolean> {
    const config = vscode.workspace.getConfiguration();
    const existingConsent = config.get<boolean>(this.CONSENT_KEY);

    if (existingConsent !== undefined) {
      return existingConsent;
    }

    const response = await vscode.window.showInformationMessage(
      'Would you like to help improve Elastic Query Studio by sending anonymous usage data? ' +
      'No personal information will be collected.',
      'Yes',
      'No',
      'Learn More'
    );

    const consentGranted = response === 'Yes';
    await config.update(this.CONSENT_KEY, consentGranted, true);
    
    return consentGranted;
  }
}
```

### Data Collection Scope
1. **Data Collected**
   - Extension activation time
   - Memory usage
   - Query response time
   - Feature usage statistics
   - Error occurrence count

2. **Data Not Collected**
   - Query content
   - Personal identifiable information
   - Result data
   - User settings

### Server Infrastructure

#### Database Schema
```sql
-- Telemetry Events
CREATE TABLE telemetry_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    client_id VARCHAR(100),    -- Anonymized ID
    extension_version VARCHAR(20),
    vscode_version VARCHAR(20),
    os_type VARCHAR(20),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Metrics
CREATE TABLE performance_metrics (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(100),
    metric_type VARCHAR(50),
    value FLOAT,
    memory_usage FLOAT,
    duration INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### API Server (Node.js/Express)
```typescript
app.post('/telemetry', async (req, res) => {
  const { metrics } = req.body;
  
  try {
    await pool.query(
      `INSERT INTO telemetry_events 
       (event_type, client_id, extension_version, event_data) 
       VALUES ($1, $2, $3, $4)`,
      [metrics.type, metrics.clientId, metrics.extensionVersion, metrics]
    );
    
    res.status(200).send({ status: 'success' });
  } catch (error) {
    console.error('Failed to store data:', error);
    res.status(500).send({ status: 'error' });
  }
});
```

### Data Transmission

#### Telemetry Service
```typescript
class TelemetryService {
  private queue: PerformanceMetric[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 5 * 60 * 1000; // 5 minutes

  async addMetric(metric: PerformanceMetric) {
    if (!this.isEnabled()) return;
    
    this.queue.push(this.anonymizeMetric(metric));
    
    if (this.queue.length >= this.batchSize) {
      await this.flushQueue();
    }
  }

  private async flushQueue() {
    if (this.queue.length === 0) return;

    try {
      const batch = this.queue.splice(0, this.batchSize);
      await this.sendToServer(batch);
    } catch (error) {
      console.error('Failed to transmit telemetry:', error);
      this.handleFailedTransmission(batch);
    }
  }
}
```

### Analytics Dashboard

#### Key Metrics
```typescript
interface AnalyticsDashboard {
  metrics: {
    dailyActiveUsers: number;
    avgQueryTime: number;
    errorRate: number;
    popularFeatures: Array<{
      feature: string;
      useCount: number;
    }>;
  };
  performance: {
    p95ActivationTime: number;
    p95QueryTime: number;
    avgMemoryUsage: number;
  };
}
```

### Implementation Considerations

1. **Security**
   - HTTPS usage
   - Data encryption
   - Access control implementation

2. **Performance**
   - Batch processing
   - Asynchronous transmission
   - Background processing

3. **Scalability**
   - Load balancing
   - Database sharding
   - Caching strategy

4. **Compliance**
   - GDPR compliance
   - Data retention period
   - User rights protection

## Implementation Phases

### Phase 2.1 (Weeks 1-2)
- Basic performance metrics implementation
- User consent system setup
- Logging system implementation

### Phase 2.2 (Weeks 3-4)
- Server infrastructure setup
- Database design
- API endpoint implementation

### Phase 2.3 (Weeks 5-6)
- Telemetry collection system implementation
- Data transmission system implementation
- Error handling and retry mechanism

### Phase 2.4 (Weeks 7-8)
- Analytics dashboard implementation
- Monitoring alert system
- Documentation and testing 