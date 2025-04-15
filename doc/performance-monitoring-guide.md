# 성능 모니터링 가이드

## 1. VSCode 확장 성능 메트릭

### 활성화 성능
- **활성화 시간**: 확장이 로드되고 활성화되는 시간
  ```typescript
  const startTime = process.hrtime();
  // 활성화 코드
  const endTime = process.hrtime(startTime);
  console.log(`활성화 시간: ${endTime[0]}s ${endTime[1] / 1000000}ms`);
  ```

- **메모리 사용량**: 확장이 사용하는 메모리
  ```typescript
  const used = process.memoryUsage();
  console.log(`Memory usage: ${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`);
  ```

### 작업 성능
1. **쿼리 실행 시간**
   - Elasticsearch 쿼리 응답 시간
   - 쿼리 결과 처리 시간
   - 결과 표시 시간

2. **UI 응답성**
   - 명령어 실행 지연 시간
   - 트리 뷰 업데이트 시간
   - 에디터 상호작용 응답 시간

## 2. 성능 모니터링 구현

### 텔레메트리 수집
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
        // 에러 로깅
        throw error;
      });
  }
}
```

### 성능 기준점
1. **활성화 성능**
   - 활성화 시간: < 1초
   - 초기 메모리: < 50MB

2. **쿼리 성능**
   - 단순 쿼리: < 1초
   - 복잡 쿼리: < 3초
   - 대량 데이터: < 5초

3. **UI 응답성**
   - 명령어 실행: < 100ms
   - 트리 업데이트: < 500ms
   - 사용자 입력 응답: < 50ms

## 3. 모니터링 대시보드

### 실시간 모니터링
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
    this.statusBarItem.text = `쿼리 평균: ${avgQueryTime.toFixed(2)}ms`;
    this.statusBarItem.show();
  }
}
```

### 성능 리포트 생성
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

## 4. 성능 최적화 전략

### 메모리 관리
1. **메모리 누수 방지**
   - 이벤트 리스너 정리
   - 캐시 크기 제한
   - 주기적 메모리 정리

2. **리소스 해제**
   ```typescript
   class ResourceManager {
     private disposables: vscode.Disposable[] = [];

     dispose() {
       this.disposables.forEach(d => d.dispose());
       this.disposables = [];
     }
   }
   ```

### 쿼리 최적화
1. **캐싱 전략**
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

2. **배치 처리**
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

## 5. 알림 및 경고

### 성능 경고
```typescript
class PerformanceAlert {
  checkMetrics(metrics: PerformanceMetric[]) {
    if (metrics.some(m => m.duration > 5000)) {
      vscode.window.showWarningMessage(
        '성능 저하가 감지되었습니다. 로그를 확인해주세요.'
      );
    }
  }
}
```

### 로깅 시스템
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

## 6. 모니터링 데이터 활용

### 성능 트렌드 분석
- 시간대별 성능 변화
- 사용 패턴 분석
- 병목 지점 식별

### 사용자 피드백 연계
- 성능 이슈 보고 시스템
- 사용자 경험 메트릭
- 개선사항 우선순위화 

## 7. 텔레메트리 시스템

### 사용자 동의 관리
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
      '익명의 사용 데이터를 수집하여 Elastic Query Studio를 개선하는 데 도움을 주시겠습니까? ' +
      '수집되는 데이터에는 개인정보가 포함되지 않습니다.',
      '동의',
      '거부',
      '자세히 보기'
    );

    const consentGranted = response === '동의';
    await config.update(this.CONSENT_KEY, consentGranted, true);
    
    return consentGranted;
  }
}
```

### 데이터 수집 범위
1. **수집되는 데이터**
   - 확장 활성화 시간
   - 메모리 사용량
   - 쿼리 응답 시간
   - 기능 사용 통계
   - 오류 발생 횟수

2. **수집되지 않는 데이터**
   - 쿼리 내용
   - 개인 식별 정보
   - 결과 데이터
   - 사용자 설정 값

### 서버 인프라

#### 데이터베이스 스키마
```sql
-- 텔레메트리 이벤트
CREATE TABLE telemetry_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50),
    client_id VARCHAR(100),    -- 익명화된 ID
    extension_version VARCHAR(20),
    vscode_version VARCHAR(20),
    os_type VARCHAR(20),
    event_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 성능 메트릭
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

#### API 서버 (Node.js/Express)
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
    console.error('데이터 저장 실패:', error);
    res.status(500).send({ status: 'error' });
  }
});
```

### 데이터 전송

#### 텔레메트리 서비스
```typescript
class TelemetryService {
  private queue: PerformanceMetric[] = [];
  private batchSize: number = 10;
  private flushInterval: number = 5 * 60 * 1000; // 5분

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
      console.error('텔레메트리 전송 실패:', error);
      this.handleFailedTransmission(batch);
    }
  }
}
```

### 분석 대시보드

#### 주요 지표
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

### 구현 고려사항

1. **보안**
   - HTTPS 사용
   - 데이터 암호화
   - 접근 제어 구현

2. **성능**
   - 배치 처리
   - 비동기 전송
   - 백그라운드 처리

3. **확장성**
   - 로드 밸런싱
   - 데이터베이스 샤딩
   - 캐싱 전략

4. **규정 준수**
   - GDPR 준수
   - 데이터 보관 기간
   - 사용자 권리 보장

## 구현 단계

### Phase 2.1 (1-2주차)
- 기본 성능 메트릭 구현
- 사용자 동의 시스템 구축
- 로깅 시스템 구현

### Phase 2.2 (3-4주차)
- 서버 인프라 구축
- 데이터베이스 설계
- API 엔드포인트 구현

### Phase 2.3 (5-6주차)
- 텔레메트리 수집 시스템 구현
- 데이터 전송 시스템 구현
- 오류 처리 및 재시도 메커니즘

### Phase 2.4 (7-8주차)
- 분석 대시보드 구현
- 모니터링 알림 시스템
- 문서화 및 테스트 