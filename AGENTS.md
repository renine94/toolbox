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
| UI 컴포넌트 | shadcn/ui | 재사용 컴포넌트 |
| 폼 관리 | React Hook Form | 폼 상태, 유효성 |
| 스키마 검증 | Zod | 타입 안전한 검증 |
| 아이콘 | Heroicons | 아이콘 라이브러리 |
| 토스트 | Sonner | 알림 메시지 |

---

## 2. 프로젝트 구조

```
src/
├── app/                      # Next.js App Router (FSD app + pages 레이어 통합)
│   ├── layout.tsx            # 루트 레이아웃 (QueryProvider, Toaster)
│   ├── globals.css           # 전역 스타일
│   ├── page.tsx              # 홈 페이지 (/)
│   ├── providers/            # 앱 프로바이더
│   │   ├── query-provider.tsx
│   │   └── index.tsx
│   ├── dashboard/            # 대시보드 라우트 (/dashboard)
│   │   └── page.tsx
│   └── [기타 라우트]/
│
├── widgets/                  # 독립적 대형 UI 블록
│   ├── header/
│   │   ├── ui/
│   │   └── index.ts
│   ├── sidebar/
│   └── footer/
│
├── features/                 # 비즈니스 기능
│   ├── auth/
│   │   ├── ui/               # LoginForm, SignupForm 등
│   │   ├── model/            # types, store, hooks
│   │   ├── api/              # useLogin, useLogout 등
│   │   └── index.ts
│   └── [기타 기능]/
│
├── entities/                 # 비즈니스 엔티티
│   ├── user/
│   │   ├── ui/               # UserCard, UserAvatar 등
│   │   ├── model/            # types, schema
│   │   ├── api/              # useUser, useUsers 등
│   │   └── index.ts
│   └── [기타 엔티티]/
│
└── shared/                   # 공통 코드
    ├── ui/                   # shadcn 컴포넌트 (button, input, form 등)
    ├── lib/                  # 유틸리티 (utils.ts)
    ├── api/                  # fetch 인스턴스, API 클라이언트
    └── config/               # 환경변수, 상수
```

---

## 3. FSD 아키텍처 개요

### 3.1 레이어 구조 (상위 → 하위)
| 레이어 | 역할 | 예시 |
|-------|------|-----|
| `app` | Next.js App Router - 라우팅, 레이아웃, 페이지 | layout.tsx, page.tsx |
| `widgets` | 독립적 대형 UI 블록 | Header, Sidebar, Footer |
| `features` | 비즈니스 기능 (액션) | auth, search, cart, payment |
| `entities` | 비즈니스 엔티티 (데이터) | user, product, order |
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

### 5.5 shadcn 컴포넌트 추가하기

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
|-----|------|-----|
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

---

## 9. 코드 리뷰 체크포인트

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

## 10. 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 린트 검사
npm run lint

# shadcn 컴포넌트 추가
npx shadcn@latest add [component-name]
```

---

## 11. 참고 링크

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Zustand Docs](https://zustand-demo.pmnd.rs/)
- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Docs](https://zod.dev/)
- [shadcn/ui Docs](https://ui.shadcn.com/)
- [Feature-Sliced Design](https://feature-sliced.design/)