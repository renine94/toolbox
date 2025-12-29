"use client";

import { useState } from "react";
import { HeroSection } from "@/widgets/hero-section";
import { ToolsGrid } from "@/widgets/tools-grid";
import { StatsSection } from "@/widgets/stats-section";
import { DeveloperSection } from "@/widgets/developer-section";

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
        status: "available",
      },
      {
        id: "base64-encoder",
        name: "Base64 Encoder",
        description: "텍스트나 데이터를 Base64로 인코딩/디코딩합니다.",
        icon: "🔤",
        status: "available",
      },
      {
        id: "color-picker",
        name: "Color Picker",
        description: "다양한 형식(HEX, RGB, HSL)으로 색상을 선택하고 변환합니다.",
        icon: "🎨",
        status: "available",
      },
      {
        id: "code-runner",
        name: "Code Runner",
        description: "JavaScript, Python 등 다양한 언어의 코드를 실행합니다.",
        icon: "▶️",
        status: "available",
      },
      {
        id: "regex-tester",
        name: "Regex Tester",
        description: "정규표현식을 테스트하고 매칭 결과를 확인합니다.",
        icon: ".*",
        status: "available",
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
        status: "available",
      },
      {
        id: "image-editor",
        name: "Image Editor",
        description: "이미지 크기 조절, 자르기, 필터 적용 등을 수행합니다.",
        icon: "🖼️",
        status: "available",
      },
      {
        id: "gradient-generator",
        name: "Gradient Generator",
        description: "CSS 그라디언트를 시각적으로 생성합니다.",
        icon: "🌅",
        status: "available",
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
        status: "available",
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
        status: "available",
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
        status: "available",
      },
    ],
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredCategories = selectedCategory
    ? categories.filter((cat) => cat.id === selectedCategory)
    : categories;

  const totalTools = categories.reduce((acc, cat) => acc + cat.tools.length, 0);

  const stats = [
    {
      value: `${totalTools}+`,
      label: "도구",
      gradient: "from-violet-400 to-purple-400",
    },
    {
      value: categories.length.toString(),
      label: "카테고리",
      gradient: "from-pink-400 to-rose-400",
    },
    {
      value: "무료",
      label: "이용료",
      gradient: "from-emerald-400 to-teal-400",
    },
    {
      value: "∞",
      label: "사용 횟수",
      gradient: "from-amber-400 to-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-pink-500/15 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <HeroSection
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        <ToolsGrid categories={filteredCategories} />

        <StatsSection stats={stats} />

        <DeveloperSection />
      </div>
    </div>
  );
}
