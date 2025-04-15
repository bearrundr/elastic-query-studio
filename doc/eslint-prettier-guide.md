# ESLint 및 Prettier 사용 가이드

## 개요
이 가이드는 Elastic Query Studio 프로젝트에서 코드 품질과 포맷팅을 위한 ESLint와 Prettier의 사용 방법을 설명합니다.

## ESLint 설정

### 기본 사용법
```bash
# ESLint 검사 실행
yarn lint:check

# ESLint 검사 및 자동 수정
yarn lint
```

### 주요 규칙
1. TypeScript 관련
   - 함수 반환 타입 명시 필수
   - 'any' 타입 사용 제한 (경고)
   - 미사용 변수 감지
   - console.log 사용 제한 (경고)

2. 코드 품질
   - 미사용 import 금지
   - 불필요한 타입 단언 금지
   - 일관된 타입 정의
   - 적절한 오류 처리 필수

### 사용자 정의 규칙
```javascript
{
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "no-console": ["warn", { "allow": ["error", "warn"] }],
    // ... 기타 규칙
}
```

## Prettier 설정

### 기본 사용법
```bash
# 코드 포맷팅
yarn format
```

### 스타일 규칙
- 탭 너비: 4칸
- 최대 줄 길이: 160자
- 세미콜론: 필수
- 따옴표: 작은따옴표
- 후행 쉼표: ES5
- 화살표 함수 괄호: 항상 사용

### 설정 상세
```javascript
{
    "tabWidth": 4,
    "printWidth": 160,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
    "arrowParens": "always"
}
```

## VS Code 통합

### 필수 확장 프로그램
1. ESLint
2. Prettier - Code formatter

### 권장 설정
```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
}
```

## 커밋 전 검사
프로젝트는 Husky를 사용하여 커밋 전 검사를 수행합니다:
- 커밋 전 ESLint 검사 실행
- 커밋 전 Prettier 포맷팅 실행

## 문제 해결

### 일반적인 문제
1. ESLint와 Prettier 충돌
   - 해결: .eslintrc.js와 .prettierrc의 규칙 충돌 여부 확인
   
2. VS Code에서 저장 시 포맷팅이 안 되는 경우
   - 해결: VS Code 설정과 확장 프로그램 설치 상태 확인

3. Husky 훅이 실행되지 않는 경우
   - 해결: `yarn postinstall` 실행하여 훅 재설치

### 규칙 무시하기
ESLint 규칙을 일시적으로 비활성화:
```typescript
/* eslint-disable rule-name */
// 코드 작성
/* eslint-enable rule-name */
```

Prettier 일시적으로 비활성화:
```typescript
// prettier-ignore
const yourCode = here;
```

## 모범 사례
1. 커밋 전 항상 `yarn lint` 실행
2. `// eslint-disable-next-line` 사용 최소화
3. 규칙 무시 시 주석으로 이유 설명
4. .eslintrc.js와 .prettierrc 설정 동기화 유지
5. ESLint와 Prettier 버전 정기적 업데이트

## 추가 자료
- [ESLint 문서](https://eslint.org/)
- [Prettier 문서](https://prettier.io/)
- [TypeScript ESLint 규칙](https://typescript-eslint.io/rules/) 