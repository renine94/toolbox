# 프론트엔드 프로젝트 개발 가이드
**Feature-Sliced Design 아키텍처 기반 + Next.js App Router**

---

## 1. 기술 스택

| 카테고리 | 라이브러리 | 용도 |
|---------|-----------|------|
| 프레임워크 | Next.js 16+ (App Router) | SSR, 라우팅, 빌드 |
| 서버 상태 | TanStack Query | API 캐싱, 동기화 |
| 클라이언트 상태 | Zustand | 전역 상태 관리 |
| CSS | Tailwind CSS 4 | 유틸리티 기반 스타일링 |
| UI 컴포넌트 | shadcn/ui + Radix UI | 재사용 컴포넌트 |
| 폼 관리 | React Hook Form | 폼 상태, 유효성 |
| 스키마 검증 | Zod | 타입 안전한 검증 |
| 아이콘 | Lucide React | 아이콘 라이브러리 |
| 토스트 | Sonner | 알림 메시지 |
| 테마 | next-themes | 다크모드 지원 |
| 마크다운 | marked + highlight.js | 마크다운 파싱 & 코드 하이라이팅 |
| 색상 | colord + react-colorful | 색상 변환 & 선택기 |
| 코드 에디터 | Monaco Editor | 코드 편집기 |
| Python 실행 | Pyodide | 브라우저 Python 런타임 |
| QR 코드 | qrcode.react | QR 코드 생성 |
| 스크린샷 | html2canvas-pro | 요소 캡처 |

---

## 2. 프로젝트 구조

```
src/
├── app/                          # Next.js App Router (FSD app + pages 레이어 통합)
│   ├── layout.tsx                # 루트 레이아웃
│   ├── globals.css               # 전역 스타일 (Tailwind)
│   ├── providers/                # 앱 프로바이더
│   │   └── query-provider.tsx
│   ├── (main)/                   # 메인 도구 라우트 그룹
│   │   ├── layout.tsx            # 메인 레이아웃 (Header, Footer)
│   │   ├── page.tsx              # 홈 페이지 (/)
│   │   ├── json-formatter/       # /json-formatter
│   │   ├── base64-encoder/       # /base64-encoder
│   │   ├── code-runner/          # /code-runner
│   │   ├── color-picker/         # /color-picker
│   │   ├── color-palette/        # /color-palette
│   │   ├── gradient-generator/   # /gradient-generator
│   │   ├── image-editor/         # /image-editor
│   │   ├── markdown-editor/      # /markdown-editor
│   │   ├── password-generator/   # /password-generator
│   │   ├── qr-generator/         # /qr-generator
│   │   └── regex-tester/         # /regex-tester
│   └── admin/                    # 관리자 라우트
│       ├── login/                # /admin/login
│       └── dashboard/            # /admin/dashboard (SidebarProvider)
│
├── widgets/                      # 독립적 대형 UI 블록
│   ├── header/                   # 메인 헤더
│   ├── footer/                   # 메인 푸터
│   ├── sidebar/                  # 관리자 사이드바
│   │   ├── ui/
│   │   ├── model/
│   │   ├── lib/
│   │   └── index.ts
│   ├── hero-section/             # 홈 히어로 섹션
│   ├── tools-grid/               # 도구 그리드
│   ├── tool-card/                # 도구 카드
│   ├── cta-section/              # CTA 섹션
│   ├── developer-section/        # 개발자 섹션
│   └── stats-section/            # 통계 섹션
│
├── features/                     # 비즈니스 기능
│   └── tools/                    # 도구별 비즈니스 로직
│       ├── json-formatter/
│       │   ├── ui/               # JsonFormatter 컴포넌트
│       │   ├── model/            # types, store, hooks
│       │   ├── lib/              # 유틸리티 함수
│       │   └── index.ts          # Public API
│       ├── base64-encoder/
│       ├── code-runner/
│       ├── color-picker/
│       ├── color-palette/
│       ├── gradient-generator/
│       ├── image-editor/
│       ├── markdown-editor/
│       ├── password-generator/
│       ├── qr-generator/
│       └── regex-tester/
│
├── entities/                     # 비즈니스 엔티티 (현재 미사용)
│
└── shared/                       # 공통 코드
    ├── ui/                       # shadcn 컴포넌트
    │   ├── button.tsx
    │   ├── input.tsx
    │   ├── card.tsx
    │   ├── dialog.tsx
    │   ├── dropdown-menu.tsx
    │   ├── form.tsx
    │   ├── select.tsx
    │   ├── separator.tsx
    │   ├── sheet.tsx
    │   ├── sidebar.tsx
    │   ├── slider.tsx
    │   ├── switch.tsx
    │   └── tooltip.tsx
    ├── hooks/                    # 커스텀 훅
    │   └── use-mobile.ts         # 모바일 감지 훅
    ├── lib/                      # 유틸리티 함수
    │   └── utils.ts              # cn() 등
    ├── api/                      # API 클라이언트
    └── config/                   # 환경변수, 상수
```

---

## 3. FSD 아키텍처 개요

### 3.1 레이어 구조 (상위 → 하위)
| 레이어 | 역할 | 예시 |
|-------|------|------|
| `app` | Next.js App Router - 라우팅, 레이아웃, 페이지 | layout.tsx, page.tsx |
| `widgets` | 독립적 대형 UI 블록 | Header, Sidebar, Footer |
| `features` | 비즈니스 기능 (액션) | tools/json-formatter |
| `entities` | 비즈니스 엔티티 (데이터) | user, product |
| `shared` | 공통 유틸, UI 키트 | Button, Input, api client |

### 3.2 세그먼트 구조
각 슬라이스(widgets, features, entities)는 다음 세그먼트로 구성:
| 세그먼트 | 역할 |
|---------|------|
| `ui/` | UI 컴포넌트 |
| `model/` | 상태, 타입, 훅, 비즈니스 로직 |
| `api/` | API 호출, TanStack Query 훅 |
| `lib/` | 유틸리티 함수 (선택) |
| `index.ts` | Public API (외부 노출 export) |

### 3.3 핵심 규칙
1. **단방향 의존성**: 상위 레이어만 하위 레이어를 import 가능
2. **Public API**: 각 슬라이스는 index.ts를 통해서만 외부에 노출
3. **shared 예외**: 슬라이스 없이 세그먼트로 직접 구성

---

## 4. Import 규칙

| From | Can Import | Cannot Import |
|------|------------|---------------|
| app | widgets, features, entities, shared | - |
| widgets | features, entities, shared | app |
| features | entities, shared | app, widgets |
| entities | shared | app, widgets, features |
| shared | - | 모든 상위 레이어 |

```ts
// ✅ 올바른 import
import { Button } from '@/shared/ui/button'
import { User } from '@/entities/user'
import { useAuth } from '@/features/auth'
import { Header } from '@/widgets/header'

// ❌ 금지된 import
import { Header } from '@/widgets/header'      // feature → widget (금지)
import { LoginForm } from '@/features/auth'    // entity → feature (금지)
```

---

## 5. 개발 가이드

### 5.1 새 페이지 추가하기
App Router를 사용하므로 `src/app/` 디렉토리에 폴더를 생성합니다.

```
src/app/
└── products/                 # /products 라우트
    ├── page.tsx              # 상품 목록 페이지
    ├── [id]/                 # /products/:id 동적 라우트
    │   └── page.tsx          # 상품 상세 페이지
    └── layout.tsx            # (선택) 상품 페이지 전용 레이아웃
```

**예시: 상품 목록 페이지**
```tsx
// src/app/products/page.tsx
import { ProductList } from '@/features/product'

export default function ProductsPage() {
  return (
    <main>
      <h1>상품 목록</h1>
      <ProductList />
    </main>
  )
}
```

### 5.2 새 Feature 추가하기

**1) 디렉토리 생성**
```
src/features/{feature-name}/
├── ui/
├── model/
├── api/
└── index.ts
```

**2) 타입 정의** — `model/types.ts`
```ts
import { z } from 'zod'

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number()
})

export type Product = z.infer<typeof productSchema>
```

**3) API 훅** — `api/useProduct.ts`
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

// Query
export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: () => fetch('/api/products').then(res => res.json())
  })
}

// Mutation
export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateProductDto) => fetch('/api/products', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      toast.success('상품이 생성되었습니다')
    },
    onError: () => toast.error('상품 생성에 실패했습니다')
  })
}
```

**4) UI 컴포넌트** — `ui/ProductForm.tsx`
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { productSchema, Product } from '../model/types'
import { useCreateProduct } from '../api/useProduct'

export function ProductForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<Product>({
    resolver: zodResolver(productSchema)
  })
  const { mutate, isPending } = useCreateProduct()

  return (
    <form onSubmit={handleSubmit((data) => mutate(data))}>
      <Input {...register('name')} placeholder="상품명" />
      {errors.name && <span>{errors.name.message}</span>}
      <Button type="submit" disabled={isPending}>저장</Button>
    </form>
  )
}
```

**5) Public API** — `index.ts`
```ts
// UI
export { ProductForm } from './ui/ProductForm'
export { ProductList } from './ui/ProductList'

// API
export { useProducts, useCreateProduct } from './api/useProduct'

// Types
export type { Product } from './model/types'
```

### 5.3 새 Entity 추가하기

**1) 디렉토리 생성**
```
src/entities/{entity-name}/
├── ui/
├── model/
├── api/
└── index.ts
```

**2) 타입** — `model/types.ts`
```ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatarUrl: z.string().url().optional()
})

export type User = z.infer<typeof userSchema>
```

**3) API** — `api/useUser.ts`
```ts
import { useQuery } from '@tanstack/react-query'

export const useUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => fetch(`/api/users/${id}`).then(res => res.json()),
    enabled: !!id
  })
}
```

**4) UI** — `ui/UserCard.tsx`
```tsx
import { User } from '../model/types'

export function UserCard({ user }: { user: User }) {
  return (
    <div className="rounded-lg border p-4">
      <img src={user.avatarUrl} alt={user.name} className="w-12 h-12 rounded-full" />
      <h3 className="font-bold">{user.name}</h3>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  )
}
```

### 5.4 새 Widget 추가하기

**1) 디렉토리 생성**
```
src/widgets/{widget-name}/
├── ui/
└── index.ts
```

**2) UI 컴포넌트** — `ui/Header.tsx`
```tsx
import { Button } from '@/shared/ui/button'
import { useAuth } from '@/features/auth'

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-xl font-bold">My App</h1>
      {user ? (
        <Button onClick={logout}>로그아웃</Button>
      ) : (
        <Button>로그인</Button>
      )}
    </header>
  )
}
```

**3) Public API** — `index.ts`
```ts
export { Header } from './ui/Header'
```

### 5.5 새 도구(Tool) 추가하기

이 프로젝트의 주요 기능인 도구를 추가하는 방법입니다.

**1) Feature 생성** — `src/features/tools/{tool-name}/`
```
src/features/tools/{tool-name}/
├── ui/
│   └── ToolName.tsx        # 메인 컴포넌트
├── model/
│   ├── types.ts            # 타입 정의
│   └── useToolStore.ts     # Zustand 스토어 (필요시)
├── lib/
│   └── utils.ts            # 도구 전용 유틸리티
└── index.ts                # Public API
```

**2) 라우트 생성** — `src/app/(main)/{tool-name}/page.tsx`
```tsx
import { ToolName } from '@/features/tools/tool-name'

export default function ToolNamePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tool Name</h1>
      <ToolName />
    </div>
  )
}
```

### 5.6 shadcn 컴포넌트 추가하기

```bash
npx shadcn@latest add [component-name]
# 예: npx shadcn@latest add dialog
```

컴포넌트는 자동으로 `src/shared/ui/`에 설치됩니다.

---

## 6. 상태 관리

### 6.1 서버 상태 vs 클라이언트 상태
| 구분 | 도구 | 사용 시점 |
|-----|------|----------|
| 서버 상태 | TanStack Query | API 데이터, 캐싱 필요 |
| 클라이언트 상태 | Zustand | UI 상태, 전역 상태 |

### 6.2 Zustand Store 패턴
`features/{feature}/model/use{Feature}Store.ts`
```ts
import { create } from 'zustand'

interface ModalState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen }))
}))
```

---

## 7. 네이밍 컨벤션

| 항목 | 규칙 | 예시 |
|-----|------|------|
| 폴더명 | kebab-case | `user-profile`, `auth` |
| 컴포넌트 | PascalCase | `LoginForm.tsx` |
| 훅 | camelCase + use | `useLogin.ts` |
| 스토어 | camelCase + Store | `useAuthStore.ts` |
| 타입 | PascalCase | `User`, `LoginDto` |
| API 훅 | use + 동사/명사 | `useProducts`, `useCreateUser` |
| 스키마 | camelCase + Schema | `userSchema` |

---

## 8. 자주 사용하는 패턴

### 8.1 Form with Validation
```tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(8, '8자 이상 입력하세요')
})

type FormData = z.infer<typeof schema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema)
  })

  const onSubmit = (data: FormData) => { /* ... */ }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <input {...register('password')} type="password" />
      {errors.password && <span>{errors.password.message}</span>}
      <button type="submit">로그인</button>
    </form>
  )
}
```

### 8.2 Optimistic Update
```ts
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLike = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => fetch(`/api/like/${id}`, { method: 'POST' }),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['post', id] })
      const previous = queryClient.getQueryData(['post', id])
      queryClient.setQueryData(['post', id], (old: Post) => ({
        ...old,
        liked: true
      }))
      return { previous }
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(['post', id], context?.previous)
    }
  })
}
```

### 8.3 Conditional Fetching
```ts
export const useUserPosts = (userId?: string) => {
  return useQuery({
    queryKey: ['posts', userId],
    queryFn: () => fetch(`/api/users/${userId}/posts`).then(res => res.json()),
    enabled: !!userId  // userId가 있을 때만 fetch
  })
}
```

### 8.4 클라이언트 컴포넌트
```tsx
"use client"  // 반드시 파일 최상단에

import { useState } from 'react'
```

### 8.5 Toast 알림
```tsx
import { toast } from 'sonner'

// 성공
toast.success('작업이 완료되었습니다')

// 에러
toast.error('오류가 발생했습니다')

// 클립보드 복사
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  toast.success('클립보드에 복사되었습니다')
}
```

### 8.6 반응형 디자인
```tsx
// 모바일 감지 훅 사용
import { useIsMobile } from '@/shared/hooks/use-mobile'

function Component() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileView /> : <DesktopView />
}

// Tailwind 브레이크포인트
// sm: 640px, md: 768px, lg: 1024px, xl: 1280px
<div className="hidden md:block">  {/* 모바일에서 숨김 */}
<div className="md:hidden">        {/* 데스크탑에서 숨김 */}
```

### 8.7 다크모드 지원
```tsx
import { useTheme } from 'next-themes'

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      Toggle Theme
    </Button>
  )
}
```

---

## 9. AI 개발 가이드

### 9.1 코드 생성 시 필수 체크리스트

**구조**
- [ ] 올바른 FSD 레이어에 위치하는가?
- [ ] index.ts로 Public API만 노출하는가?
- [ ] import 방향이 하위로만 향하는가?
- [ ] 클라이언트 컴포넌트에 `"use client"` 선언했는가?

**품질**
- [ ] TypeScript 타입이 명확한가?
- [ ] Zod 스키마로 타입 검증하는가? (폼/API 응답)
- [ ] 에러 처리와 toast 알림이 있는가?
- [ ] 로딩 상태 처리가 되어있는가?

**스타일**
- [ ] Tailwind CSS를 사용하는가?
- [ ] shadcn/ui 컴포넌트를 활용하는가?
- [ ] 반응형(모바일) 대응이 되어있는가?
- [ ] 다크모드를 지원하는가?

### 9.2 새 도구 추가 시 작업 순서

1. **Feature 생성**: `src/features/tools/{tool-name}/`
   - `ui/ToolName.tsx` - 메인 컴포넌트
   - `model/types.ts` - 타입 정의
   - `lib/utils.ts` - 유틸리티 (필요시)
   - `index.ts` - Public API

2. **페이지 생성**: `src/app/(main)/{tool-name}/page.tsx`
   - Feature 컴포넌트 import
   - 페이지 레이아웃 구성

3. **네비게이션 추가** (필요시):
   - `src/widgets/tools-grid/` 또는 관련 위젯 수정

### 9.3 금지 사항

```tsx
// ❌ 하지 말 것
import { something } from '../../../shared/ui'  // 상대 경로 (다른 레이어)
import { Header } from '@/widgets/header'       // feature에서 widget import

// ✅ 해야 할 것
import { Button } from '@/shared/ui/button'     // 절대 경로
import { cn } from '@/shared/lib/utils'         // 유틸리티
```

### 9.4 도구 컴포넌트 작성 템플릿

```tsx
"use client"

import { useState } from 'react'
import { Button } from '@/shared/ui/button'
import { Card } from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { toast } from 'sonner'

interface ToolNameProps {
  initialValue?: string
}

export function ToolName({ initialValue = '' }: ToolNameProps) {
  const [input, setInput] = useState(initialValue)
  const [output, setOutput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleProcess = async () => {
    if (!input.trim()) {
      toast.error('입력값을 입력해주세요')
      return
    }

    setIsLoading(true)
    try {
      // 처리 로직
      const result = processInput(input)
      setOutput(result)
      toast.success('처리 완료!')
    } catch (error) {
      toast.error('처리 중 오류가 발생했습니다')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(output)
    toast.success('클립보드에 복사되었습니다')
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">입력</h2>
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="입력값을 입력하세요"
        />
        <Button
          onClick={handleProcess}
          disabled={isLoading}
          className="mt-4 w-full"
        >
          {isLoading ? '처리 중...' : '변환'}
        </Button>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">출력</h2>
          <Button variant="outline" size="sm" onClick={handleCopy}>
            복사
          </Button>
        </div>
        <pre className="bg-muted p-4 rounded-lg overflow-auto">
          {output || '결과가 여기에 표시됩니다'}
        </pre>
      </Card>
    </div>
  )
}
```

---

## 10. 코드 리뷰 체크포인트

### 구조
- [ ] 올바른 레이어에 위치하는가?
- [ ] index.ts로 Public API만 노출하는가?
- [ ] import 방향이 하위로만 향하는가?
- [ ] src/tasks 폴더에 구현 계획 파일을 만들었는가?

### 품질
- [ ] Zod 스키마로 타입 검증하는가?
- [ ] TanStack Query로 서버 상태 관리하는가?
- [ ] 에러/성공 시 toast 알림 있는가?
- [ ] 로딩 상태 처리가 되어있는가?

### 컨벤션
- [ ] 네이밍 컨벤션을 따르는가?
- [ ] 불필요한 주석이 없는가?
- [ ] 컴포넌트가 단일 책임을 가지는가?

---

## 11. 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start

# 린트 검사
npm run lint

# shadcn 컴포넌트 추가
npx shadcn@latest add [component-name]
```

---

## 12. 참고 링크

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [Lucide Icons](https://lucide.dev/icons/)
