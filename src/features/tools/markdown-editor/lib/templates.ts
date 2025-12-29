import { Template } from "../model/types";

export const TEMPLATES: Template[] = [
  {
    id: "blank",
    name: "Blank",
    nameKo: "빈 문서",
    description: "빈 문서로 시작합니다.",
    content: "",
  },
  {
    id: "blog-post",
    name: "Blog Post",
    nameKo: "블로그 포스트",
    description: "블로그 글 작성을 위한 템플릿",
    content: `# 블로그 제목

> 한 줄 요약을 여기에 작성하세요.

## 소개

본문 내용을 여기에 작성하세요...

## 주요 내용

### 첫 번째 포인트

설명...

### 두 번째 포인트

설명...

## 결론

마무리 내용...

---

*작성일: ${new Date().toLocaleDateString("ko-KR")}*
`,
  },
  {
    id: "readme",
    name: "README",
    nameKo: "README",
    description: "프로젝트 README 템플릿",
    content: `# 프로젝트 이름

프로젝트에 대한 간단한 설명을 작성하세요.

## 기능

- 기능 1
- 기능 2
- 기능 3

## 설치 방법

\`\`\`bash
npm install your-package
\`\`\`

## 사용법

\`\`\`javascript
import { something } from 'your-package';

// 예제 코드
\`\`\`

## 기여 방법

1. 이 저장소를 포크합니다
2. 새 브랜치를 생성합니다 (\`git checkout -b feature/amazing-feature\`)
3. 변경사항을 커밋합니다 (\`git commit -m 'Add some amazing feature'\`)
4. 브랜치에 푸시합니다 (\`git push origin feature/amazing-feature\`)
5. Pull Request를 생성합니다

## 라이선스

MIT License
`,
  },
  {
    id: "resume",
    name: "Resume",
    nameKo: "이력서",
    description: "개발자 이력서 템플릿",
    content: `# 홍길동

**이메일**: email@example.com | **전화**: 010-1234-5678
**GitHub**: github.com/username | **LinkedIn**: linkedin.com/in/username

---

## 소개

간단한 자기소개를 작성하세요.

---

## 기술 스택

- **프론트엔드**: React, TypeScript, Next.js, Tailwind CSS
- **백엔드**: Node.js, Express, PostgreSQL
- **도구**: Git, Docker, AWS

---

## 경력

### 회사명 | 직책
*2022년 1월 - 현재*

- 주요 업무 1
- 주요 업무 2
- 달성한 성과

### 이전 회사명 | 직책
*2020년 1월 - 2021년 12월*

- 주요 업무 1
- 주요 업무 2

---

## 프로젝트

### 프로젝트 이름
*기술 스택: React, Node.js*

프로젝트 설명...

---

## 학력

### 대학교 | 전공
*2016년 - 2020년*
`,
  },
  {
    id: "meeting-notes",
    name: "Meeting Notes",
    nameKo: "회의록",
    description: "회의록 작성 템플릿",
    content: `# 회의록

**날짜**: ${new Date().toLocaleDateString("ko-KR")}
**시간**: 00:00 - 00:00
**장소**:

---

## 참석자

- [ ] 참석자 1
- [ ] 참석자 2
- [ ] 참석자 3

---

## 안건

### 1. 첫 번째 안건

**논의 내용**:


**결정 사항**:


### 2. 두 번째 안건

**논의 내용**:


**결정 사항**:


---

## 액션 아이템

| 담당자 | 내용 | 마감일 |
|--------|------|--------|
|        |      |        |
|        |      |        |

---

## 다음 회의

**날짜**:
**안건**:
`,
  },
  {
    id: "api-docs",
    name: "API Documentation",
    nameKo: "API 문서",
    description: "API 엔드포인트 문서 템플릿",
    content: `# API 문서

API에 대한 간단한 설명

## Base URL

\`\`\`
https://api.example.com/v1
\`\`\`

---

## 인증

API 요청에는 Bearer 토큰이 필요합니다.

\`\`\`
Authorization: Bearer <your-token>
\`\`\`

---

## 엔드포인트

### GET /users

사용자 목록을 조회합니다.

**Parameters**

| 이름 | 타입 | 필수 | 설명 |
|------|------|------|------|
| page | number | X | 페이지 번호 (기본값: 1) |
| limit | number | X | 페이지당 항목 수 (기본값: 10) |

**Response**

\`\`\`json
{
  "data": [
    {
      "id": 1,
      "name": "홍길동",
      "email": "hong@example.com"
    }
  ],
  "total": 100,
  "page": 1
}
\`\`\`

---

### POST /users

새 사용자를 생성합니다.

**Request Body**

\`\`\`json
{
  "name": "홍길동",
  "email": "hong@example.com",
  "password": "securepassword"
}
\`\`\`

**Response**

\`\`\`json
{
  "id": 1,
  "name": "홍길동",
  "email": "hong@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}
\`\`\`

---

## 에러 코드

| 코드 | 설명 |
|------|------|
| 400 | 잘못된 요청 |
| 401 | 인증 실패 |
| 404 | 리소스를 찾을 수 없음 |
| 500 | 서버 오류 |
`,
  },
];
