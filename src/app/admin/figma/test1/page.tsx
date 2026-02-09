'use client'

import { useState, useMemo } from 'react'

// ─── 메뉴 데이터 ─────────────────────────────────────────
interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  category: '메인' | '사이드' | '음료'
  image: string
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 1,
    name: '꿀불고기',
    description: '달콤한 양념의 프리미엄 불고기',
    price: 18000,
    category: '메인',
    image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
  },
  {
    id: 2,
    name: '갈비찜',
    description: '부드러운 소갈비 찜 요리',
    price: 25000,
    category: '메인',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
  },
  {
    id: 3,
    name: '냉면',
    description: '시원한 육수의 평양 냉면',
    price: 12000,
    category: '메인',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  },
  {
    id: 4,
    name: '잡채',
    description: '신선한 채소와 당면 잡채',
    price: 15000,
    category: '사이드',
    image: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',
  },
  {
    id: 5,
    name: '된장찌개',
    description: '구수한 전통 된장찌개',
    price: 10000,
    category: '메인',
    image: 'https://images.unsplash.com/photo-1607532941433-304659e8198a?w=400&h=300&fit=crop',
  },
  {
    id: 6,
    name: '비빔밥',
    description: '신선한 나물 비빔밥',
    price: 13000,
    category: '메인',
    image: 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
  },
]

const CATEGORIES = ['전체', '메인', '사이드', '음료'] as const

function formatPrice(price: number): string {
  return `₩${price.toLocaleString('ko-KR')}`
}

// ─── 메인 페이지 컴포넌트 ─────────────────────────────────
export default function MenuListPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('전체')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      const matchCategory =
        selectedCategory === '전체' || item.category === selectedCategory
      const matchSearch =
        !searchQuery ||
        item.name.includes(searchQuery) ||
        item.description.includes(searchQuery)
      return matchCategory && matchSearch
    })
  }, [selectedCategory, searchQuery])

  return (
    <div className="min-h-screen bg-[#F5F5FA]">
      {/* ── 헤더 ── */}
      <header className="flex h-[68px] items-center justify-between bg-white px-12">
        <span className="text-2xl font-bold text-[#3B59F5]">한일관</span>
        <div className="flex items-center gap-6">
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA] text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
            S
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA] text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
            C
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F5F5FA] text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200">
            P
          </button>
        </div>
      </header>

      {/* ── 구분선 ── */}
      <div className="h-px bg-[#E0E0E6]" />

      {/* ── 컨텐츠 ── */}
      <main className="mx-auto max-w-[1440px] px-12 py-6">
        {/* 검색바 */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="메뉴를 검색하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-[#E0E0E6] bg-[#F7F7FA] px-5 py-3.5 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-[#3B59F5] focus:ring-1 focus:ring-[#3B59F5]"
          />
        </div>

        {/* 카테고리 탭 */}
        <div className="mb-6 flex gap-2">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#3B59F5] text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 메뉴 그리드 */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* 이미지 */}
              <div className="relative h-48 w-full overflow-hidden bg-gray-100">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-full w-full object-cover"
                />
              </div>
              {/* 정보 */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900">
                  {item.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                <p className="mt-3 text-lg font-bold text-[#3B59F5]">
                  {formatPrice(item.price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* 빈 결과 */}
        {filteredItems.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <svg
              className="mb-4 h-12 w-12"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <p className="text-lg font-medium">검색 결과가 없습니다</p>
            <p className="mt-1 text-sm">다른 키워드로 검색해보세요</p>
          </div>
        )}
      </main>
    </div>
  )
}
