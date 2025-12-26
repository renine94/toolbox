"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

// 카테고리 데이터 타입
interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  status: "available" | "coming-soon";
}

interface Category {
  id: string;
  name: string;
  nameKo: string;
  icon: string;
  gradient: string;
  tools: Tool[];
}

// 카테고리 및 도구 데이터
const categories: Category[] = [
  {
    id: "developer",
    name: "Developer",
    nameKo: "개발자",
    icon: "💻",
    gradient: "from-violet-500 to-purple-600",
    tools: [
      {
        id: "json-formatter",
        name: "JSON Formatter",
        description: "JSON 데이터를 보기 좋게 포맷팅하고 유효성을 검사합니다.",
        icon: "{ }",
        status: "coming-soon",
      },
      {
        id: "color-picker",
        name: "Color Picker",
        description: "다양한 형식(HEX, RGB, HSL)으로 색상을 선택하고 변환합니다.",
        icon: "🎨",
        status: "coming-soon",
      },
      {
        id: "code-runner",
        name: "Code Runner",
        description: "JavaScript, Python 등 다양한 언어의 코드를 실행합니다.",
        icon: "▶️",
        status: "coming-soon",
      },
      {
        id: "regex-tester",
        name: "Regex Tester",
        description: "정규표현식을 테스트하고 매칭 결과를 확인합니다.",
        icon: ".*",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "designer",
    name: "Designer",
    nameKo: "디자이너",
    icon: "🎨",
    gradient: "from-pink-500 to-rose-600",
    tools: [
      {
        id: "color-palette",
        name: "Color Palette",
        description: "조화로운 색상 팔레트를 생성하고 관리합니다.",
        icon: "🌈",
        status: "coming-soon",
      },
      {
        id: "image-editor",
        name: "Image Editor",
        description: "이미지 크기 조절, 자르기, 필터 적용 등을 수행합니다.",
        icon: "🖼️",
        status: "coming-soon",
      },
      {
        id: "gradient-generator",
        name: "Gradient Generator",
        description: "CSS 그라디언트를 시각적으로 생성합니다.",
        icon: "🌅",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "marketer",
    name: "Marketer",
    nameKo: "마케터",
    icon: "📊",
    gradient: "from-emerald-500 to-teal-600",
    tools: [
      {
        id: "qr-generator",
        name: "QR Code Generator",
        description: "URL, 텍스트, 연락처 정보 등으로 QR 코드를 생성합니다.",
        icon: "📱",
        status: "coming-soon",
      },
      {
        id: "link-shortener",
        name: "Link Shortener",
        description: "긴 URL을 짧고 기억하기 쉬운 링크로 변환합니다.",
        icon: "🔗",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "writer",
    name: "Writer",
    nameKo: "작가/에디터",
    icon: "✍️",
    gradient: "from-amber-500 to-orange-600",
    tools: [
      {
        id: "markdown-editor",
        name: "Markdown Editor",
        description: "마크다운 문서를 작성하고 실시간으로 미리보기합니다.",
        icon: "📝",
        status: "coming-soon",
      },
      {
        id: "word-counter",
        name: "Word Counter",
        description: "글자 수, 단어 수, 문장 수를 세고 분석합니다.",
        icon: "🔢",
        status: "coming-soon",
      },
      {
        id: "lorem-ipsum",
        name: "Lorem Ipsum Generator",
        description: "더미 텍스트를 다양한 형식으로 생성합니다.",
        icon: "📄",
        status: "coming-soon",
      },
    ],
  },
  {
    id: "productivity",
    name: "Productivity",
    nameKo: "생산성",
    icon: "⚡",
    gradient: "from-blue-500 to-cyan-600",
    tools: [
      {
        id: "unit-converter",
        name: "Unit Converter",
        description: "길이, 무게, 온도 등 다양한 단위를 변환합니다.",
        icon: "📏",
        status: "coming-soon",
      },
      {
        id: "timezone-converter",
        name: "Timezone Converter",
        description: "세계 각 지역의 시간대를 변환합니다.",
        icon: "🌍",
        status: "coming-soon",
      },
      {
        id: "password-generator",
        name: "Password Generator",
        description: "안전한 랜덤 비밀번호를 생성합니다.",
        icon: "🔐",
        status: "coming-soon",
      },
    ],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-white/5 backdrop-blur-xl bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-purple-500/25">
                T
              </div>
              <span className="text-xl font-bold text-white">ToolBox</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#tools" className="text-sm text-slate-400 hover:text-white transition-colors">
                도구
              </a>
              <a href="#categories" className="text-sm text-slate-400 hover:text-white transition-colors">
                카테고리
              </a>
              <a href="#about" className="text-sm text-slate-400 hover:text-white transition-colors">
                소개
              </a>
            </nav>
          </div>
        </header>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-slate-400 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            새로운 도구가 계속 추가됩니다
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            당신의 업무를 위한
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              올인원 도구 모음
            </span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            개발자, 디자이너, 마케터 등 모든 직업군을 위한
            <br className="hidden md:block" />
            유용한 온라인 도구들을 한 곳에서 만나보세요.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === null
                ? "bg-white text-slate-900 shadow-lg shadow-white/25"
                : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                }`}
            >
              전체 보기
            </button>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                  ? "bg-white text-slate-900 shadow-lg shadow-white/25"
                  : "bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10"
                  }`}
              >
                <span>{category.icon}</span>
                <span>{category.nameKo}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Tools Grid */}
        <section id="tools" className="max-w-7xl mx-auto px-6 pb-24">
          <div className="space-y-16">
            {filteredCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center gap-4 mb-8">
                  <div
                    className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-lg`}
                  >
                    {category.icon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{category.nameKo}</h2>
                    <p className="text-slate-400 text-sm">{category.name}</p>
                  </div>
                  <Badge variant="secondary" className="ml-auto bg-white/5 text-slate-400 border-0">
                    {category.tools.length} 도구
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {category.tools.map((tool) => (
                    <Card
                      key={tool.id}
                      className="bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group overflow-hidden"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-br ${category.gradient} opacity-80 group-hover:opacity-100 flex items-center justify-center text-xl transition-opacity`}
                          >
                            {tool.icon}
                          </div>
                          {tool.status === "coming-soon" && (
                            <Badge
                              variant="outline"
                              className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-xs"
                            >
                              Coming Soon
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-white text-lg mt-4 group-hover:text-white/90">
                          {tool.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400 text-sm leading-relaxed">
                          {tool.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center text-sm text-slate-500 group-hover:text-slate-400 transition-colors">
                          <span>자세히 보기</span>
                          <svg
                            className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Stats Section */}
        <section className="border-t border-white/5 bg-white/[0.02]">
          <div className="max-w-7xl mx-auto px-6 py-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                  {categories.reduce((acc, cat) => acc + cat.tools.length, 0)}+
                </div>
                <div className="text-slate-400 mt-2">도구</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                  {categories.length}
                </div>
                <div className="text-slate-400 mt-2">카테고리</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                  무료
                </div>
                <div className="text-slate-400 mt-2">이용료</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                  ∞
                </div>
                <div className="text-slate-400 mt-2">사용 횟수</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="relative rounded-3xl bg-gradient-to-r from-violet-600/20 via-purple-600/20 to-pink-600/20 border border-white/10 p-12 md:p-16 text-center overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-600/10 to-pink-600/10 backdrop-blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                지금 바로 시작하세요
              </h2>
              <p className="text-slate-300 max-w-xl mx-auto mb-8">
                로그인 없이 모든 도구를 무료로 사용할 수 있습니다.
                <br />
                필요한 도구를 선택하고 바로 시작해 보세요.
              </p>
              <button className="px-8 py-4 rounded-full bg-white text-slate-900 font-semibold text-lg hover:bg-white/90 transition-colors shadow-lg shadow-white/25">
                도구 탐색하기 →
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/5 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                  T
                </div>
                <span className="text-lg font-semibold text-white">ToolBox</span>
              </div>
              <p className="text-slate-500 text-sm">
                © 2024 ToolBox. 모든 권리 보유.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
