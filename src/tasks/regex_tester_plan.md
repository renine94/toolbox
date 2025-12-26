# Regex Tester Implementation Plan

This plan outlines the steps to implement the Regex Tester feature following the Feature-Sliced Design (FSD) architecture and project guidelines.

## 결정 사항
- **UI 구조**: 기존 features 패턴 준수 (JSON Formatter, Color Picker 참고)
- **상태 관리**: Zustand + lib 분리 패턴 (복잡한 로직)
- **기능**: 실시간 정규식 테스트, 플래그 선택, 매칭 하이라이트, 그룹 캡처
- **추가 기능**:
  - 치트시트 (자주 사용하는 패턴 예제 및 문법 가이드)
  - 히스토리 (localStorage 기반 패턴 저장/불러오기)

## 1. Directory Structure

### Feature: `src/features/regex-tester`
```
src/features/regex-tester/
├── index.ts                 # Public API export
├── model/
│   ├── types.ts            # 타입 정의
│   └── useRegexStore.ts    # Zustand store (persist 미들웨어로 히스토리 저장)
├── lib/
│   ├── regex-utils.ts      # 정규식 처리 유틸리티
│   └── cheatsheet-data.ts  # 치트시트 데이터 (패턴 예제, 문법 가이드)
└── ui/
    ├── RegexTester.tsx     # 메인 컨테이너
    ├── RegexInput.tsx      # 정규식 입력
    ├── FlagSelector.tsx    # 플래그 선택 (g, i, m, s, u, y)
    ├── TestInput.tsx       # 테스트 문자열 입력
    ├── MatchResults.tsx    # 매칭 결과 표시 (하이라이트)
    ├── ControlPanel.tsx    # 액션 버튼 (Clear, Copy, Save)
    ├── CheatSheet.tsx      # 정규식 문법 가이드 및 예제 패턴
    └── History.tsx         # 저장된 패턴 히스토리 목록
```

### Page: `src/app/regex-tester`
```
src/app/regex-tester/
└── page.tsx                # 페이지 컴포넌트
```

## 2. Implementation Steps

### Step 1: Create Type Definitions
- Create `model/types.ts` with RegexMatch, RegexResult, RegexFlag, RegexState interfaces

### Step 2: Create Utility Functions
- Create `lib/regex-utils.ts`:
  - `testRegex(pattern, text, flags)`: 정규식 실행 및 결과 반환
  - `isValidRegex(pattern, flags)`: 정규식 유효성 검사
  - `escapeRegex(text)`: 특수문자 이스케이프

### Step 3: Create Zustand Store
- Create `model/useRegexStore.ts`:
  - pattern, testText, flags 상태 관리
  - 상태 변경 시 자동으로 결과 계산
  - 에러 처리 포함
  - persist 미들웨어로 히스토리 localStorage 저장

### Step 4: Implement UI Components
- **RegexInput.tsx**: 정규식 패턴 입력, 실시간 유효성 표시
- **FlagSelector.tsx**: 플래그 토글 버튼들 (g, i, m, s, u, y)
- **TestInput.tsx**: 테스트할 문자열 입력 (Textarea)
- **MatchResults.tsx**: 매칭 하이라이트, 그룹 캡처 결과 표시
- **ControlPanel.tsx**: Clear, Copy Pattern, Copy Results, Save 버튼
- **CheatSheet.tsx**: 정규식 문법 가이드 및 예제 패턴
- **History.tsx**: 저장된 패턴 히스토리 목록
- **RegexTester.tsx**: 메인 컨테이너, 반응형 레이아웃

### Step 5: Create Page
- Create `src/app/regex-tester/page.tsx` with SEO metadata

### Step 6: Update Home Page
- Update `src/app/page.tsx`: Change status to `available`

## 3. Tech Stack Details
- **State**: Zustand (with persist middleware)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Button, Input, Textarea, Label)
- **Icons**: Lucide React (Copy, Check, X, AlertCircle, Clock, BookOpen)
- **Toast**: Sonner

## 4. Supported Regex Flags
| Flag | Name | Description |
|------|------|-------------|
| g | Global | 모든 매칭 찾기 |
| i | Case-insensitive | 대소문자 구분 안함 |
| m | Multiline | ^와 $가 줄 단위로 매칭 |
| s | Dotall | .이 줄바꿈도 매칭 |
| u | Unicode | 유니코드 지원 |
| y | Sticky | lastIndex부터 매칭 |

## 5. UI Features
- **실시간 테스트**: 입력 변경 시 즉시 결과 업데이트
- **하이라이트**: 매칭된 부분을 색상으로 강조
- **그룹 표시**: 캡처 그룹 결과 별도 표시
- **에러 표시**: 잘못된 정규식 에러 메시지
- **복사 기능**: 패턴 및 결과 클립보드 복사
- **반응형**: 모바일/데스크톱 지원
- **치트시트**: 정규식 문법 가이드 및 예제 패턴 (클릭 시 자동 입력)
- **히스토리**: localStorage 기반 패턴 저장/불러오기 (최대 20개)

## 6. Files Created

### New Files
```
src/features/regex-tester/
├── index.ts
├── model/
│   ├── types.ts
│   └── useRegexStore.ts
├── lib/
│   ├── regex-utils.ts
│   └── cheatsheet-data.ts
└── ui/
    ├── RegexTester.tsx
    ├── RegexInput.tsx
    ├── FlagSelector.tsx
    ├── TestInput.tsx
    ├── MatchResults.tsx
    ├── ControlPanel.tsx
    ├── CheatSheet.tsx
    └── History.tsx

src/app/regex-tester/
└── page.tsx
```

### Modified Files
- `src/app/page.tsx`: Changed Regex Tester status to `available`
