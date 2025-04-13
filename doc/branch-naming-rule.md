# 브랜치 네이밍 규칙

## 기본 구조
```
<type>/<scope>[-<sub-scope>][-<issue-number>]
```

## 타입(Type) 분류

### 주요 타입
- `fix/` : 버그 수정, 현재 문제 해결
- `feature/` : 새로운 기능 개발
- `enhance/` : 기존 기능 개선
- `refactor/` : 코드 리팩토링
- `diagnose/` : 문제 분석 및 진단
- `docs/` : 문서 관련 작업
- `test/` : 테스트 관련 작업
- `chore/` : 빌드, 설정 변경 등
- `hotfix/` : 긴급 수정 사항

## 네이밍 예시

### 기본 형식
```
fix/host-connection
feature/api-spec-7.17
enhance/ui/icon-design
```

### 이슈 번호 포함
```
fix/host-connection-#123
feature/api-spec-#456
```

### 하위 범주(sub-scope) 포함
```
fix/connection/host-timeout
enhance/ui/icon/design
feature/api/spec-7.17
```

## 사용 예시

### 문제 해결
- `fix/host-connection` : 호스트 연결 문제 해결
- `fix/api/timeout` : API 타임아웃 문제 해결
- `hotfix/security-issue` : 긴급 보안 문제 해결

### 기능 개발
- `feature/api-spec-7.17` : 7.17 버전 API 스펙 추가
- `feature/ui/dark-theme` : 다크 테마 기능 추가
- `feature/auth/oauth` : OAuth 인증 기능 추가

### 기능 개선
- `enhance/ui/icon-design` : UI 아이콘 디자인 개선
- `enhance/performance/query` : 쿼리 성능 개선
- `enhance/ux/response-time` : 응답 시간 개선

### 리팩토링
- `refactor/namespace-rename` : 네임스페이스 변경
- `refactor/code-structure` : 코드 구조 개선
- `refactor/api/client` : API 클라이언트 리팩토링

### 문제 분석
- `diagnose/connection-issue` : 연결 문제 분석
- `diagnose/performance` : 성능 문제 분석
- `diagnose/memory-leak` : 메모리 누수 분석

### 문서 작업
- `docs/api-guide` : API 가이드 문서 작성
- `docs/setup-guide` : 설치 가이드 문서 작성
- `docs/branch-naming` : 브랜치 네이밍 규칙 문서 작성

### 빌드 및 설정
- `chore/marketplace-setup` : 마켓플레이스 설정
- `chore/dependency-update` : 의존성 업데이트
- `chore/build-optimization` : 빌드 최적화

## 규칙
1. 모든 브랜치명은 영문 소문자를 사용합니다.
2. 단어 구분은 하이픈(-)을 사용합니다.
3. 범주 구분은 슬래시(/)를 사용합니다.
4. 이슈 번호는 끝에 '#번호' 형식으로 추가합니다.
5. 브랜치명은 작업 내용을 명확하게 표현해야 합니다.
6. 긴급 수정사항은 `hotfix/`를 사용합니다.

## Pull Request (PR) 규칙

### PR 생성 시기
- 기능 개발이 완료되었을 때
- 버그 수정이 완료되었을 때
- 코드 리뷰가 필요한 변경사항이 있을 때
- 문서 작업이 완료되었을 때

### PR 제목 형식
```
[<type>] <title> (#issue-number)
```

예시:
- `[fix] Resolve host connection timeout issue (#123)`
- `[feature] Add Elasticsearch 7.17 API support (#456)`
- `[docs] Update API documentation (#789)`

### PR 설명 포함 사항
1. 변경 사항 요약
2. 상세 변경 내용
3. 테스트 결과
4. 관련 이슈 번호
5. 리뷰어 체크리스트

### PR 리뷰 프로세스
1. 코드 리뷰 요청
2. 리뷰어의 피드백 반영
3. 승인 후 병합
4. 브랜치 삭제

## 참고사항
- 브랜치명은 가능한 한 간단명료하게 작성합니다.
- 작업 내용을 명확하게 표현할 수 있는 단어를 선택합니다.
- 팀원들이 이해하기 쉬운 용어를 사용합니다.
- 프로젝트의 특성에 따라 추가적인 타입을 정의할 수 있습니다. 