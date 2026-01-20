# 쇼핑몰 프로젝트를 위한 FSD 아키텍처 가이드
**Feature-Sliced Design 기반 이커머스 설계 패턴**

---

## 목차

1. [FSD 핵심 개념](#1-fsd-핵심-개념)
2. [레이어 구조](#2-레이어-구조)
3. [쇼핑몰 프로젝트 구조](#3-쇼핑몰-프로젝트-구조)
4. [Entities 레이어 상세](#4-entities-레이어-상세)
5. [Features 레이어 상세](#5-features-레이어-상세)
6. [Widgets 레이어 상세](#6-widgets-레이어-상세)
7. [Pages(App) 레이어 상세](#7-pagesapp-레이어-상세)
8. [실전 구현 예시](#8-실전-구현-예시)
9. [네이밍 컨벤션](#9-네이밍-컨벤션)
10. [안티패턴과 해결책](#10-안티패턴과-해결책)
11. [체크리스트](#11-체크리스트)

---

## 1. FSD 핵심 개념

### 1.1 FSD란?

**Feature-Sliced Design(FSD)**은 프론트엔드 프로젝트를 위한 아키텍처 방법론입니다. 코드를 **비즈니스 도메인** 기준으로 구조화하여 확장성과 유지보수성을 높입니다.

### 1.2 핵심 원칙

| 원칙 | 설명 |
|------|------|
| **단방향 의존성** | 상위 레이어만 하위 레이어를 import 가능 |
| **Public API** | 각 슬라이스는 `index.ts`를 통해서만 외부에 노출 |
| **비즈니스 중심** | 기술이 아닌 비즈니스 도메인 기준으로 분리 |
| **고응집 저결합** | 관련 코드는 가깝게, 무관한 코드는 분리 |

### 1.3 핵심 구분: Entity vs Feature

```
┌─────────────────────────────────────────────────────────────┐
│  Entity = 명사 (데이터)     │  Feature = 동사 (액션)        │
├─────────────────────────────────────────────────────────────┤
│  Product (상품)             │  addToCart (장바구니 담기)    │
│  User (사용자)              │  checkout (결제하기)          │
│  Order (주문)               │  writeReview (리뷰 작성)      │
│  Cart (장바구니)            │  searchProducts (상품 검색)   │
│  Review (리뷰)              │  applyPromotion (프로모션적용)│
└─────────────────────────────────────────────────────────────┘

Entity: "무엇을" 다루는가? (What)
Feature: "무엇을 하는가?" (Do What)
```

---

## 2. 레이어 구조

### 2.1 레이어 계층도

```
┌─────────────────────────────────────────────────────────────┐
│  app (pages)    │ 라우팅, 페이지 조합                       │
├─────────────────────────────────────────────────────────────┤
│  widgets        │ 독립적 UI 블록 (features + entities 조합) │
├─────────────────────────────────────────────────────────────┤
│  features       │ 사용자 액션, 유스케이스                   │
├─────────────────────────────────────────────────────────────┤
│  entities       │ 비즈니스 도메인 객체                      │
├─────────────────────────────────────────────────────────────┤
│  shared         │ 공통 유틸, UI 키트, 설정                  │
└─────────────────────────────────────────────────────────────┘
         ↓ 의존성 방향 (위에서 아래로만 가능)
```

### 2.2 Import 규칙

| From | Can Import | Cannot Import |
|------|------------|---------------|
| app | widgets, features, entities, shared | - |
| widgets | features, entities, shared | app |
| features | entities, shared | app, widgets |
| entities | shared | app, widgets, features |
| shared | 외부 라이브러리만 | 모든 상위 레이어 |

```typescript
// ✅ 올바른 import
import { Button } from '@/shared/ui/button'
import { Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'
import { ProductGrid } from '@/widgets/product-grid'

// ❌ 금지된 import (레이어 규칙 위반)
// entities에서 features import
import { useAddToCart } from '@/features/add-to-cart'  // entities/product 내부에서

// features에서 widgets import
import { ProductGrid } from '@/widgets/product-grid'   // features/search 내부에서
```

### 2.3 세그먼트 구조

각 슬라이스(entities, features, widgets)는 다음 세그먼트로 구성됩니다:

```
{slice-name}/
├── ui/           # UI 컴포넌트
├── model/        # 상태, 타입, 훅, 비즈니스 로직
├── api/          # API 호출, TanStack Query 훅
├── lib/          # 유틸리티 함수 (선택)
└── index.ts      # Public API (외부 노출 export)
```

---

## 3. 쇼핑몰 프로젝트 구조

### 3.1 전체 디렉토리 구조

```
src/
├── app/                              # Next.js App Router (Pages)
│   ├── layout.tsx
│   ├── globals.css
│   ├── providers/
│   └── [locale]/
│       └── (shop)/
│           ├── layout.tsx            # 쇼핑몰 레이아웃
│           ├── page.tsx              # 홈
│           ├── products/
│           │   ├── page.tsx          # 상품 목록
│           │   └── [id]/
│           │       └── page.tsx      # 상품 상세
│           ├── cart/
│           │   └── page.tsx          # 장바구니
│           ├── checkout/
│           │   └── page.tsx          # 결제
│           ├── orders/
│           │   ├── page.tsx          # 주문 목록
│           │   └── [id]/
│           │       └── page.tsx      # 주문 상세
│           ├── events/
│           │   └── [slug]/
│           │       └── page.tsx      # 이벤트 상세
│           └── mypage/
│               └── page.tsx          # 마이페이지
│
├── widgets/                          # 독립적 UI 블록
│   ├── header/
│   ├── footer/
│   ├── product-grid/
│   ├── product-detail-section/
│   ├── cart-summary/
│   ├── checkout-form/
│   ├── review-section/
│   ├── category-nav/
│   ├── search-modal/
│   ├── promotional-banner/
│   └── recommended-products/
│
├── features/                         # 사용자 액션
│   ├── add-to-cart/
│   ├── remove-from-cart/
│   ├── update-cart-quantity/
│   ├── checkout/
│   ├── apply-coupon/
│   ├── search-products/
│   ├── filter-products/
│   ├── sort-products/
│   ├── write-review/
│   ├── toggle-wishlist/
│   ├── share-product/
│   ├── track-order/
│   └── auth/
│       ├── login/
│       ├── logout/
│       └── register/
│
├── entities/                         # 비즈니스 도메인 객체
│   ├── product/
│   ├── user/
│   ├── cart/
│   ├── order/
│   ├── review/
│   ├── category/
│   ├── coupon/
│   └── address/
│
└── shared/                           # 공통 코드
    ├── ui/                           # shadcn/ui 컴포넌트
    ├── hooks/
    ├── lib/
    ├── api/
    └── config/
```

---

## 4. Entities 레이어 상세

### 4.1 Entity의 역할

- **비즈니스 도메인 객체** 표현
- **여러 페이지/기능에서 재사용**되는 데이터와 UI
- 다른 Entity를 참조할 수 있지만, Feature나 Widget은 참조 불가

### 4.2 쇼핑몰 Entities 목록

| Entity | 설명 | 주요 UI 컴포넌트 |
|--------|------|------------------|
| `product` | 상품 정보 | ProductCard, ProductImage, PriceTag |
| `user` | 사용자 정보 | UserAvatar, UserBadge |
| `cart` | 장바구니 | CartItem, CartBadge |
| `order` | 주문 | OrderItem, OrderStatus |
| `review` | 리뷰 | ReviewCard, StarRating |
| `category` | 카테고리 | CategoryBadge, CategoryIcon |
| `coupon` | 쿠폰 | CouponCard, CouponBadge |
| `address` | 배송 주소 | AddressCard |

### 4.3 Product Entity 구현 예시

```
entities/product/
├── ui/
│   ├── ProductCard.tsx           # 상품 카드
│   ├── ProductImage.tsx          # 상품 이미지 (갤러리, 줌)
│   ├── ProductInfo.tsx           # 상품 기본 정보
│   ├── PriceTag.tsx              # 가격 표시 (할인가 포함)
│   ├── StockBadge.tsx            # 재고 상태 뱃지
│   ├── ProductSkeleton.tsx       # 로딩 스켈레톤
│   └── ProductVariantSelector.tsx # 옵션 선택 (색상, 사이즈)
├── model/
│   ├── types.ts                  # Product, ProductVariant 타입
│   ├── schemas.ts                # Zod 스키마
│   └── helpers.ts                # 가격 계산, 할인율 등 헬퍼
├── api/
│   ├── useProduct.ts             # 단일 상품 조회
│   ├── useProducts.ts            # 상품 목록 조회
│   └── productApi.ts             # API 함수
└── index.ts
```

#### types.ts

```typescript
import { z } from 'zod'

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  options: z.array(z.object({
    name: z.string(),
    value: z.string(),
    priceModifier: z.number().default(0),
  })),
})

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  discountPercent: z.number().optional(),
  images: z.array(z.string().url()),
  category: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }),
  variants: z.array(productVariantSchema).optional(),
  stock: z.number(),
  rating: z.number().min(0).max(5),
  reviewCount: z.number(),
  tags: z.array(z.string()),
  createdAt: z.string().datetime(),
})

export type Product = z.infer<typeof productSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>

// 목록 조회용 간소화 타입
export type ProductListItem = Pick<Product,
  'id' | 'name' | 'slug' | 'price' | 'originalPrice' |
  'discountPercent' | 'images' | 'rating' | 'reviewCount' | 'stock'
>
```

#### ProductCard.tsx

```tsx
import { Link } from '@/i18n/navigation'
import { Card } from '@/shared/ui/card'
import { Badge } from '@/shared/ui/badge'
import { cn } from '@/shared/lib/utils'
import { ProductListItem } from '../model/types'
import { PriceTag } from './PriceTag'
import { StockBadge } from './StockBadge'

interface ProductCardProps {
  product: ProductListItem
  className?: string
  // 슬롯: features에서 주입
  actionSlot?: React.ReactNode  // AddToCartButton, WishlistButton 등
}

export function ProductCard({ product, className, actionSlot }: ProductCardProps) {
  const isOutOfStock = product.stock === 0
  const hasDiscount = product.discountPercent && product.discountPercent > 0

  return (
    <Card className={cn('group overflow-hidden', className)}>
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-square overflow-hidden">
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              'object-cover w-full h-full transition-transform group-hover:scale-105',
              isOutOfStock && 'opacity-50'
            )}
          />
          {hasDiscount && (
            <Badge className="absolute top-2 left-2 bg-red-500">
              {product.discountPercent}% OFF
            </Badge>
          )}
          <StockBadge stock={product.stock} className="absolute top-2 right-2" />
        </div>
      </Link>

      <div className="p-4">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-medium line-clamp-2 hover:underline">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
          <span>⭐ {product.rating.toFixed(1)}</span>
          <span>({product.reviewCount})</span>
        </div>

        <PriceTag
          price={product.price}
          originalPrice={product.originalPrice}
          className="mt-2"
        />

        {/* Feature에서 주입되는 액션 버튼 */}
        {actionSlot && (
          <div className="mt-3">
            {actionSlot}
          </div>
        )}
      </div>
    </Card>
  )
}
```

#### index.ts (Public API)

```typescript
// UI Components
export { ProductCard } from './ui/ProductCard'
export { ProductImage } from './ui/ProductImage'
export { ProductInfo } from './ui/ProductInfo'
export { PriceTag } from './ui/PriceTag'
export { StockBadge } from './ui/StockBadge'
export { ProductSkeleton } from './ui/ProductSkeleton'
export { ProductVariantSelector } from './ui/ProductVariantSelector'

// Types
export type { Product, ProductListItem, ProductVariant } from './model/types'
export { productSchema, productVariantSchema } from './model/types'

// API Hooks
export { useProduct } from './api/useProduct'
export { useProducts } from './api/useProducts'

// Helpers
export { calculateDiscountPrice, formatPrice } from './model/helpers'
```

### 4.4 다른 Entities 예시 구조

#### Cart Entity

```
entities/cart/
├── ui/
│   ├── CartItem.tsx              # 장바구니 상품 항목
│   ├── CartBadge.tsx             # 헤더용 장바구니 뱃지 (수량 표시)
│   ├── CartEmpty.tsx             # 빈 장바구니 UI
│   └── CartSummaryCard.tsx       # 요약 카드 (금액 계산)
├── model/
│   ├── types.ts                  # CartItem, Cart 타입
│   ├── useCartStore.ts           # Zustand 스토어
│   └── helpers.ts                # 총액 계산 등
├── api/
│   ├── useCart.ts                # 장바구니 조회
│   └── cartApi.ts
└── index.ts
```

#### Order Entity

```
entities/order/
├── ui/
│   ├── OrderCard.tsx             # 주문 카드
│   ├── OrderItem.tsx             # 주문 상품 항목
│   ├── OrderStatus.tsx           # 주문 상태 뱃지/타임라인
│   ├── OrderSummary.tsx          # 주문 요약
│   └── OrderTimeline.tsx         # 배송 추적 타임라인
├── model/
│   ├── types.ts                  # Order, OrderStatus 타입
│   └── helpers.ts
├── api/
│   ├── useOrder.ts
│   ├── useOrders.ts
│   └── orderApi.ts
└── index.ts
```

---

## 5. Features 레이어 상세

### 5.1 Feature의 역할

- **사용자 액션/유스케이스** 구현
- 하나의 명확한 **동작**을 담당
- Entity의 데이터를 **조작**하는 로직 포함
- 재사용 가능한 **액션 컴포넌트** 제공

### 5.2 쇼핑몰 Features 목록

| Feature | 설명 | 주요 컴포넌트 |
|---------|------|---------------|
| `add-to-cart` | 장바구니 담기 | AddToCartButton |
| `remove-from-cart` | 장바구니 삭제 | RemoveFromCartButton |
| `update-cart-quantity` | 수량 변경 | QuantitySelector |
| `checkout` | 결제 프로세스 | CheckoutButton, PaymentForm |
| `apply-coupon` | 쿠폰 적용 | CouponInput, AppliedCoupon |
| `search-products` | 상품 검색 | SearchInput, SearchSuggestions |
| `filter-products` | 필터링 | FilterPanel, ActiveFilters |
| `sort-products` | 정렬 | SortSelect |
| `write-review` | 리뷰 작성 | ReviewForm |
| `toggle-wishlist` | 찜하기 | WishlistButton |
| `share-product` | 공유하기 | ShareButton |
| `track-order` | 배송 조회 | TrackingForm |

### 5.3 add-to-cart Feature 구현 예시

```
features/add-to-cart/
├── ui/
│   ├── AddToCartButton.tsx       # 메인 버튼
│   └── AddToCartDialog.tsx       # 옵션 선택 다이얼로그 (선택)
├── model/
│   ├── useAddToCart.ts           # 비즈니스 로직 훅
│   └── types.ts
├── api/
│   └── addToCartApi.ts           # API 호출
└── index.ts
```

#### useAddToCart.ts

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useCartStore } from '@/entities/cart'
import { addToCartApi } from '../api/addToCartApi'

interface AddToCartParams {
  productId: string
  quantity: number
  variantId?: string
}

export function useAddToCart() {
  const queryClient = useQueryClient()
  const { addItem } = useCartStore()

  return useMutation({
    mutationFn: (params: AddToCartParams) => addToCartApi(params),

    // Optimistic Update
    onMutate: async (params) => {
      await queryClient.cancelQueries({ queryKey: ['cart'] })

      const previousCart = queryClient.getQueryData(['cart'])

      // 낙관적으로 UI 업데이트
      addItem({
        productId: params.productId,
        quantity: params.quantity,
        variantId: params.variantId,
      })

      return { previousCart }
    },

    onSuccess: () => {
      toast.success('장바구니에 담았습니다')
    },

    onError: (error, variables, context) => {
      // 롤백
      if (context?.previousCart) {
        queryClient.setQueryData(['cart'], context.previousCart)
      }
      toast.error('장바구니 담기에 실패했습니다')
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
  })
}
```

#### AddToCartButton.tsx

```tsx
'use client'

import { Button } from '@/shared/ui/button'
import { ShoppingCart, Loader2 } from 'lucide-react'
import { useAddToCart } from '../model/useAddToCart'
import { cn } from '@/shared/lib/utils'

interface AddToCartButtonProps {
  productId: string
  quantity?: number
  variantId?: string
  disabled?: boolean
  className?: string
  size?: 'sm' | 'default' | 'lg'
  variant?: 'default' | 'outline' | 'secondary'
}

export function AddToCartButton({
  productId,
  quantity = 1,
  variantId,
  disabled,
  className,
  size = 'default',
  variant = 'default',
}: AddToCartButtonProps) {
  const { mutate: addToCart, isPending } = useAddToCart()

  const handleClick = () => {
    addToCart({ productId, quantity, variantId })
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn('w-full', className)}
      size={size}
      variant={variant}
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <ShoppingCart className="w-4 h-4 mr-2" />
      )}
      장바구니 담기
    </Button>
  )
}
```

#### index.ts

```typescript
export { AddToCartButton } from './ui/AddToCartButton'
export { AddToCartDialog } from './ui/AddToCartDialog'
export { useAddToCart } from './model/useAddToCart'
```

### 5.4 다른 Features 예시

#### search-products Feature

```
features/search-products/
├── ui/
│   ├── SearchInput.tsx           # 검색 입력
│   ├── SearchSuggestions.tsx     # 자동완성 추천
│   ├── SearchHistory.tsx         # 최근 검색어
│   └── SearchResults.tsx         # 검색 결과 (간략)
├── model/
│   ├── useSearch.ts              # 검색 로직
│   ├── useSearchHistory.ts       # 검색 기록 관리
│   └── types.ts
├── api/
│   ├── searchApi.ts
│   └── useSearchSuggestions.ts
└── index.ts
```

#### checkout Feature

```
features/checkout/
├── ui/
│   ├── CheckoutButton.tsx        # 결제 버튼
│   ├── PaymentMethodSelect.tsx   # 결제 수단 선택
│   ├── ShippingAddressForm.tsx   # 배송지 입력
│   └── OrderConfirmation.tsx     # 주문 확인
├── model/
│   ├── useCheckout.ts            # 결제 프로세스
│   ├── useCheckoutStore.ts       # 결제 상태 관리
│   └── types.ts
├── api/
│   └── checkoutApi.ts
└── index.ts
```

---

## 6. Widgets 레이어 상세

### 6.1 Widget의 역할

- **독립적인 UI 블록** (페이지의 한 섹션)
- **Features + Entities 조합**
- 자체적인 데이터 fetching 가능
- 다른 페이지에서 **재사용 가능**

### 6.2 쇼핑몰 Widgets 목록

| Widget | 구성 요소 | 사용 페이지 |
|--------|----------|-------------|
| `product-grid` | ProductCard + FilterPanel + SortSelect | 홈, 검색, 카테고리 |
| `product-detail-section` | ProductImage + ProductInfo + VariantSelector + AddToCartButton | 상품 상세 |
| `cart-summary` | CartItem + QuantitySelector + RemoveButton + PriceTotal | 장바구니, 결제 |
| `checkout-form` | AddressForm + PaymentForm + CouponInput | 결제 |
| `review-section` | ReviewList + WriteReviewForm + StarRating | 상품 상세 |
| `category-nav` | CategoryList + CategoryIcon | 헤더, 사이드바 |
| `search-modal` | SearchInput + SearchSuggestions + SearchHistory | 헤더 |
| `recommended-products` | ProductCard + useRecommendations | 상품 상세, 장바구니 |
| `promotional-banner` | EventBanner + Countdown | 홈, 이벤트 |

### 6.3 product-grid Widget 구현 예시

```
widgets/product-grid/
├── ui/
│   ├── ProductGrid.tsx           # 메인 컴포넌트
│   ├── ProductGridSkeleton.tsx   # 로딩 상태
│   ├── GridControls.tsx          # 필터/정렬 컨트롤
│   └── Pagination.tsx            # 페이지네이션
├── model/
│   ├── useProductGrid.ts         # 데이터 + 상태 통합
│   └── types.ts
└── index.ts
```

#### ProductGrid.tsx

```tsx
'use client'

import { ProductCard, ProductSkeleton, useProducts } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'
import { WishlistButton } from '@/features/toggle-wishlist'
import { FilterPanel } from '@/features/filter-products'
import { SortSelect } from '@/features/sort-products'
import { useProductGrid } from '../model/useProductGrid'
import { Pagination } from './Pagination'
import { GridControls } from './GridControls'

interface ProductGridProps {
  categorySlug?: string
  searchQuery?: string
  initialFilters?: Record<string, string[]>
}

export function ProductGrid({
  categorySlug,
  searchQuery,
  initialFilters
}: ProductGridProps) {
  const {
    products,
    isLoading,
    filters,
    setFilters,
    sort,
    setSort,
    page,
    setPage,
    totalPages,
  } = useProductGrid({ categorySlug, searchQuery, initialFilters })

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div>
      <GridControls>
        <FilterPanel filters={filters} onChange={setFilters} />
        <SortSelect value={sort} onChange={setSort} />
      </GridControls>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            actionSlot={
              <div className="flex gap-2">
                <AddToCartButton
                  productId={product.id}
                  size="sm"
                  className="flex-1"
                />
                <WishlistButton productId={product.id} size="sm" />
              </div>
            }
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        className="mt-8"
      />
    </div>
  )
}
```

### 6.4 product-detail-section Widget

```
widgets/product-detail-section/
├── ui/
│   ├── ProductDetailSection.tsx  # 메인
│   ├── ProductGallery.tsx        # 이미지 갤러리
│   ├── ProductPurchaseCard.tsx   # 구매 영역 (가격, 옵션, 버튼)
│   └── ProductTabs.tsx           # 상세정보/리뷰/문의 탭
└── index.ts
```

#### ProductDetailSection.tsx

```tsx
'use client'

import { useProduct, ProductImage, ProductInfo, PriceTag } from '@/entities/product'
import { ProductVariantSelector } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'
import { WishlistButton } from '@/features/toggle-wishlist'
import { ShareButton } from '@/features/share-product'
import { useState } from 'react'

interface ProductDetailSectionProps {
  productId: string
}

export function ProductDetailSection({ productId }: ProductDetailSectionProps) {
  const { data: product, isLoading } = useProduct(productId)
  const [selectedVariant, setSelectedVariant] = useState<string | undefined>()
  const [quantity, setQuantity] = useState(1)

  if (isLoading || !product) {
    return <ProductDetailSkeleton />
  }

  return (
    <section className="grid md:grid-cols-2 gap-8">
      {/* 이미지 갤러리 */}
      <ProductGallery images={product.images} />

      {/* 상품 정보 */}
      <div className="space-y-6">
        <ProductInfo product={product} />

        <PriceTag
          price={product.price}
          originalPrice={product.originalPrice}
          size="lg"
        />

        {/* 옵션 선택 */}
        {product.variants && (
          <ProductVariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onSelect={setSelectedVariant}
          />
        )}

        {/* 수량 선택 */}
        <QuantityInput value={quantity} onChange={setQuantity} max={product.stock} />

        {/* 액션 버튼 */}
        <div className="flex gap-3">
          <AddToCartButton
            productId={product.id}
            quantity={quantity}
            variantId={selectedVariant}
            disabled={product.stock === 0}
            className="flex-1"
            size="lg"
          />
          <WishlistButton productId={product.id} size="lg" />
          <ShareButton product={product} size="lg" />
        </div>
      </div>
    </section>
  )
}
```

---

## 7. Pages(App) 레이어 상세

### 7.1 Page의 역할

- **라우팅과 레이아웃**만 담당
- **비즈니스 로직 없음** (Widgets, Features, Entities에 위임)
- **조합(Composition)**의 역할
- 서버 컴포넌트로 메타데이터, 초기 데이터 처리

### 7.2 Page 구현 원칙

```tsx
// ✅ 좋은 Page 컴포넌트
export default function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">전체 상품</h1>
      <ProductGrid />  {/* Widget이 모든 로직 담당 */}
    </div>
  )
}

// ❌ 나쁜 Page 컴포넌트 (비즈니스 로직이 Page에 있음)
export default function ProductsPage() {
  const [filters, setFilters] = useState({})  // ❌ 상태 관리
  const { data } = useProducts(filters)       // ❌ 데이터 fetching

  const handleFilter = () => { ... }          // ❌ 이벤트 핸들러

  return (
    <div>
      {data?.map(product => (                  // ❌ 직접 렌더링
        <ProductCard key={product.id} ... />
      ))}
    </div>
  )
}
```

### 7.3 상품 상세 페이지 예시

```tsx
// app/[locale]/(shop)/products/[id]/page.tsx
import { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { ProductDetailSection } from '@/widgets/product-detail-section'
import { ReviewSection } from '@/widgets/review-section'
import { RecommendedProducts } from '@/widgets/recommended-products'
import { getProduct } from '@/entities/product'

type Props = {
  params: Promise<{ locale: string; id: string }>
}

// 메타데이터 생성
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)

  return {
    title: `${product.name} | 쇼핑몰`,
    description: product.description,
    openGraph: {
      images: [product.images[0]],
    },
  }
}

// 페이지 컴포넌트
export default async function ProductDetailPage({ params }: Props) {
  const { locale, id } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'product' })

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">
      {/* 상품 상세 섹션 */}
      <ProductDetailSection productId={id} />

      {/* 리뷰 섹션 */}
      <ReviewSection productId={id} />

      {/* 추천 상품 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">{t('recommended')}</h2>
        <RecommendedProducts productId={id} />
      </section>
    </div>
  )
}
```

### 7.4 장바구니 페이지 예시

```tsx
// app/[locale]/(shop)/cart/page.tsx
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { CartSummary } from '@/widgets/cart-summary'
import { RecommendedProducts } from '@/widgets/recommended-products'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'cart' })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('title')}</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* 장바구니 상품 목록 */}
        <div className="lg:col-span-2">
          <CartSummary />
        </div>

        {/* 결제 요약 */}
        <div>
          <CheckoutSummaryCard />
        </div>
      </div>

      {/* 추천 상품 */}
      <section className="mt-16">
        <h2 className="text-2xl font-bold mb-6">{t('youMayAlsoLike')}</h2>
        <RecommendedProducts />
      </section>
    </div>
  )
}
```

---

## 8. 실전 구현 예시

### 8.1 새 기능 추가: "상품 비교하기"

#### 1단계: Entity 확장 필요 여부 검토

- 기존 `product` entity로 충분 → 새 entity 불필요

#### 2단계: Feature 생성

```
features/compare-products/
├── ui/
│   ├── CompareButton.tsx         # 비교 추가 버튼
│   ├── CompareBar.tsx            # 하단 비교 바
│   └── CompareRemoveButton.tsx   # 비교에서 제거
├── model/
│   ├── useCompareStore.ts        # Zustand 스토어
│   └── types.ts
└── index.ts
```

```typescript
// model/useCompareStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface CompareState {
  productIds: string[]
  addProduct: (id: string) => void
  removeProduct: (id: string) => void
  clearAll: () => void
  isComparing: (id: string) => boolean
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      productIds: [],
      addProduct: (id) => {
        const current = get().productIds
        if (current.length < 4 && !current.includes(id)) {
          set({ productIds: [...current, id] })
        }
      },
      removeProduct: (id) => {
        set({ productIds: get().productIds.filter(pid => pid !== id) })
      },
      clearAll: () => set({ productIds: [] }),
      isComparing: (id) => get().productIds.includes(id),
    }),
    { name: 'compare-storage' }
  )
)
```

#### 3단계: Widget 생성

```
widgets/compare-drawer/
├── ui/
│   ├── CompareDrawer.tsx         # 비교 드로어
│   └── CompareTable.tsx          # 비교 테이블
└── index.ts
```

#### 4단계: Page 생성

```tsx
// app/[locale]/(shop)/compare/page.tsx
import { CompareTable } from '@/widgets/compare-drawer'

export default function ComparePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">상품 비교</h1>
      <CompareTable />
    </div>
  )
}
```

#### 5단계: 기존 컴포넌트에 통합

```tsx
// ProductCard의 actionSlot에 CompareButton 추가
<ProductCard
  product={product}
  actionSlot={
    <div className="flex gap-2">
      <AddToCartButton productId={product.id} />
      <WishlistButton productId={product.id} />
      <CompareButton productId={product.id} />  {/* 추가 */}
    </div>
  }
/>
```

---

## 9. 네이밍 컨벤션

### 9.1 폴더/파일명

| 항목 | 규칙 | 예시 |
|-----|------|------|
| 폴더명 | kebab-case | `add-to-cart`, `product-grid` |
| 컴포넌트 파일 | PascalCase | `ProductCard.tsx`, `AddToCartButton.tsx` |
| 훅 파일 | camelCase + use | `useAddToCart.ts`, `useProductGrid.ts` |
| 스토어 파일 | camelCase + Store | `useCartStore.ts` |
| 타입 파일 | camelCase | `types.ts`, `schemas.ts` |
| API 파일 | camelCase + Api | `productApi.ts` |

### 9.2 Export 네이밍

| 항목 | 규칙 | 예시 |
|-----|------|------|
| 컴포넌트 | PascalCase | `ProductCard`, `AddToCartButton` |
| 훅 | camelCase + use | `useAddToCart`, `useProducts` |
| 타입 | PascalCase | `Product`, `CartItem` |
| 스키마 | camelCase + Schema | `productSchema` |
| 상수 | UPPER_SNAKE_CASE | `MAX_CART_ITEMS` |
| 유틸 함수 | camelCase | `formatPrice`, `calculateDiscount` |

### 9.3 Feature 네이밍

Feature 이름은 **동사 + 명사** 형태로:

```
✅ 좋은 네이밍
add-to-cart        (장바구니에 추가)
remove-from-cart   (장바구니에서 제거)
toggle-wishlist    (찜하기 토글)
write-review       (리뷰 작성)
search-products    (상품 검색)
apply-coupon       (쿠폰 적용)

❌ 나쁜 네이밍
cart               (Entity와 혼동)
wishlist           (Entity와 혼동)
review             (Entity와 혼동)
products-search    (어순이 어색)
```

---

## 10. 안티패턴과 해결책

### 10.1 페이지 기반 구조 (안티패턴)

```
❌ 안티패턴: 페이지 단위로 features 구성

features/
├── product-list-page/     # 페이지가 feature?
├── product-detail-page/
├── cart-page/
└── checkout-page/

문제점:
- ProductCard가 여러 feature에 중복
- 로직 재사용 불가
- 페이지 간 공통 기능 공유 어려움
```

```
✅ 해결: 비즈니스 액션 단위로 분리

entities/
├── product/               # 상품 데이터 + UI
└── cart/                  # 장바구니 데이터 + UI

features/
├── add-to-cart/           # 장바구니 담기 액션
├── search-products/       # 검색 액션
└── checkout/              # 결제 액션

widgets/
├── product-grid/          # 상품 목록 조합
└── cart-summary/          # 장바구니 조합
```

### 10.2 거대한 Feature (안티패턴)

```
❌ 안티패턴: 하나의 feature에 너무 많은 책임

features/cart/
├── ui/
│   ├── CartPage.tsx           # 페이지 전체
│   ├── CartItem.tsx           # 아이템
│   ├── AddToCartButton.tsx    # 담기 버튼
│   ├── RemoveButton.tsx       # 삭제 버튼
│   ├── QuantitySelector.tsx   # 수량 선택
│   ├── CouponInput.tsx        # 쿠폰 입력
│   └── CheckoutButton.tsx     # 결제 버튼
└── ...
```

```
✅ 해결: 액션 단위로 분리

entities/cart/
├── ui/CartItem.tsx            # 데이터 표현만

features/
├── add-to-cart/               # 담기
├── remove-from-cart/          # 삭제
├── update-cart-quantity/      # 수량 변경
├── apply-coupon/              # 쿠폰 적용
└── checkout/                  # 결제
```

### 10.3 순환 의존성 (안티패턴)

```
❌ 안티패턴: Entity가 Feature를 import

// entities/product/ui/ProductCard.tsx
import { AddToCartButton } from '@/features/add-to-cart'  // ❌ 금지!

export function ProductCard({ product }) {
  return (
    <div>
      <h3>{product.name}</h3>
      <AddToCartButton productId={product.id} />  {/* ❌ */}
    </div>
  )
}
```

```
✅ 해결: Slot 패턴 사용

// entities/product/ui/ProductCard.tsx
interface ProductCardProps {
  product: Product
  actionSlot?: React.ReactNode  // ✅ 외부에서 주입
}

export function ProductCard({ product, actionSlot }: ProductCardProps) {
  return (
    <div>
      <h3>{product.name}</h3>
      {actionSlot}  {/* ✅ 주입된 액션 렌더링 */}
    </div>
  )
}

// 사용하는 곳 (widgets 또는 app)
<ProductCard
  product={product}
  actionSlot={<AddToCartButton productId={product.id} />}
/>
```

### 10.4 Shared 남용 (안티패턴)

```
❌ 안티패턴: 비즈니스 로직을 shared에 배치

shared/
├── ui/
├── hooks/
│   └── useCart.ts        # ❌ 비즈니스 로직
├── utils/
│   └── priceCalculator.ts # ❌ 도메인 로직
└── components/
    └── ProductCard.tsx    # ❌ 도메인 컴포넌트
```

```
✅ 해결: 도메인 관련은 entities/features로

shared/
├── ui/               # 순수 UI 컴포넌트 (Button, Input)
├── hooks/            # 범용 훅 (useDebounce, useMobile)
└── lib/              # 범용 유틸 (cn, formatDate)

entities/product/
├── ui/ProductCard.tsx         # ✅ 여기로
└── model/helpers.ts           # ✅ 가격 계산 여기로

entities/cart/
└── model/useCartStore.ts      # ✅ 장바구니 로직 여기로
```

---

## 11. 체크리스트

### 11.1 새 기능 추가 시 체크리스트

**설계 단계**
- [ ] 이 기능은 "데이터(Entity)"인가 "액션(Feature)"인가?
- [ ] 기존 Entity를 재사용할 수 있는가?
- [ ] 여러 페이지에서 사용되는가? (Widget 후보)
- [ ] 단일 페이지 전용인가? (Page에서 직접 조합)

**Entity 추가 시**
- [ ] 여러 곳에서 재사용되는 데이터인가?
- [ ] UI 컴포넌트는 데이터 표현만 하는가? (액션 X)
- [ ] Slot 패턴으로 액션 주입이 가능한가?
- [ ] index.ts에 Public API만 노출했는가?

**Feature 추가 시**
- [ ] 하나의 명확한 사용자 액션인가?
- [ ] 이름이 동사 + 명사 형태인가?
- [ ] Entity에 의존하고, Widget에 의존하지 않는가?
- [ ] Optimistic Update가 필요한가?

**Widget 추가 시**
- [ ] 독립적인 UI 블록인가?
- [ ] Features와 Entities를 적절히 조합했는가?
- [ ] 자체 데이터 fetching이 필요한가?

**Page 추가 시**
- [ ] 비즈니스 로직 없이 조합만 하는가?
- [ ] 메타데이터가 올바른가?
- [ ] 서버/클라이언트 컴포넌트 구분이 적절한가?

### 11.2 코드 리뷰 체크리스트

**레이어 규칙**
- [ ] Import 방향이 하위 레이어로만 향하는가?
- [ ] 순환 의존성이 없는가?
- [ ] Public API(index.ts)로만 import하는가?

**네이밍**
- [ ] 폴더명은 kebab-case인가?
- [ ] 컴포넌트는 PascalCase인가?
- [ ] Feature 이름이 동사+명사 형태인가?

**재사용성**
- [ ] Entity는 여러 곳에서 재사용 가능한가?
- [ ] Feature는 단일 책임을 가지는가?
- [ ] Slot 패턴으로 유연성을 확보했는가?

---

## 참고 자료

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [FSD Examples Repository](https://github.com/feature-sliced/examples)
- [Next.js App Router 문서](https://nextjs.org/docs/app)
- [TanStack Query 문서](https://tanstack.com/query/latest)
- [Zustand 문서](https://zustand-demo.pmnd.rs/)

---

*이 가이드는 실제 이커머스 프로젝트 설계를 위한 참고 자료입니다.*
*프로젝트 특성에 따라 유연하게 적용하세요.*
