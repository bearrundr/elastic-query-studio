# 테스트 작성 가이드

## 개요
이 가이드는 Elastic Query Studio 프로젝트에서 Jest를 사용한 테스트 작성 및 실행 방법을 설명합니다.

## 테스트 구조

### 디렉토리 구성
```
test/
├── unit/                 # 단위 테스트
├── mocks/               # 목 구현체
├── common/              # 공유 테스트 유틸리티
└── setup.ts            # Jest 설정
```

### 테스트 파일 명명 규칙
- 테스트 파일은 `.test.ts` 확장자 사용
- 테스트 대상 모듈을 반영하는 이름 사용
- 예: `axiosInstance.ts`를 테스트하는 `axios_instance.test.ts`

## 테스트 작성

### 기본 테스트 구조
```typescript
import { jest } from '@jest/globals';
import { featureToTest } from '../../src/feature';

describe('기능 이름', () => {
    // 테스트 전 설정
    beforeAll(() => {
        // 전역 설정
    });

    // 테스트 후 정리
    afterAll(() => {
        // 전역 정리
    });

    // 개별 테스트
    it('특정 동작을 수행해야 함', () => {
        // 테스트 구현
        expect(result).toBe(expectedValue);
    });
});
```

### 테스트 환경 모드
프로젝트는 두 가지 테스트 모드를 지원합니다:
```bash
# 목 서버로 테스트 실행
yarn test:mock

# 실제 서버로 테스트 실행
yarn test:real
```

### 목(Mock) 사용

#### 목 설정
```typescript
import { TEST_CONFIG } from '../test.config';

if (TEST_CONFIG.USE_MOCK) {
    mockAxios = jest.spyOn(axiosInstance, 'get')
        .mockImplementation((url: string) => {
            return Promise.resolve(TEST_CONFIG.MOCK_RESPONSES.cluster_info);
        });
}
```

#### 목 응답 템플릿
```typescript
// test/test.config.ts
export const TEST_CONFIG = {
    MOCK_RESPONSES: {
        cluster_info: {
            status: 200,
            data: {
                version: { number: '8.0.0' },
                cluster_name: 'test-cluster'
            }
        }
    }
};
```

### 비동기 코드 테스트
```typescript
it('비동기 작업을 처리해야 함', async () => {
    try {
        const response = await axiosInstance.get(url);
        expect(response.status).toBe(200);
    } catch (error) {
        fail('오류가 발생하지 않아야 함');
    }
});
```

### 오류 처리 테스트
```typescript
it('오류를 적절히 처리해야 함', async () => {
    expect.assertions(1);
    try {
        await functionThatThrows();
    } catch (error) {
        expect(error).toBeInstanceOf(Error);
    }
});
```

## 모범 사례

### 테스트 구성
1. `describe` 블록으로 관련 테스트 그룹화
2. 명확하고 설명적인 테스트 이름 사용
3. 준비-실행-검증 패턴 따르기
4. 테스트 독립성과 격리성 유지

### 목 사용 지침
1. 외부 의존성 목 처리
2. 목 설정/정리에 `beforeAll`/`afterAll` 사용
3. 수동 목보다 Jest 목 선호
4. 목 동작을 주석으로 문서화

### 어설션
1. 구체적인 매처 사용
2. 긍정/부정 케이스 모두 테스트
3. 오류 조건 검증
4. 엣지 케이스 확인

### 코드 커버리지
```bash
# 커버리지 리포트 생성
yarn test:coverage
```

커버리지 목표:
- 구문: > 80%
- 분기: > 80%
- 함수: > 90%
- 라인: > 80%

## 일반적인 패턴

### VSCode 확장 테스트
```typescript
import * as vscode from 'vscode';
import { mockVscode } from '../mocks/vscode';

jest.mock('vscode', () => mockVscode);

describe('VSCode 확장', () => {
    it('VSCode API 호출을 처리해야 함', () => {
        // 테스트 구현
    });
});
```

### API 호출 테스트
```typescript
describe('API 테스트', () => {
    it('성공적인 API 호출을 처리해야 함', async () => {
        const response = await axiosInstance.get(url);
        expect(response.status).toBe(200);
        expect(response.data).toHaveProperty('version');
    });
});
```

## 문제 해결

### 일반적인 문제
1. 테스트 시간 초과
   - 해결: jest.config.ts에서 타임아웃 조정
   
2. 목이 작동하지 않음
   - 해결: 목 설정과 정리 확인

3. 커버리지가 보고되지 않음
   - 해결: Jest 커버리지 설정 확인

## 추가 자료
- [Jest 문서](https://jestjs.io/)
- [Jest API 참조](https://jestjs.io/docs/api)
- [VSCode 확장 테스트](https://code.visualstudio.com/api/working-with-extensions/testing-extension) 