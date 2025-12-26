"use client";

interface Category {
    id: string;
    nameKo: string;
    icon: string;
}

interface HeroSectionProps {
    categories: Category[];
    selectedCategory: string | null;
    onCategoryChange: (categoryId: string | null) => void;
}

export function HeroSection({
    categories,
    selectedCategory,
    onCategoryChange,
}: HeroSectionProps) {
    return (
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border text-sm text-muted-foreground mb-8">
                <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                새로운 도구가 계속 추가됩니다
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
                당신의 업무를 위한
                <br />
                <span className="bg-linear-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    올인원 도구 모음
                </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed">
                개발자, 디자이너, 마케터 등 모든 직업군을 위한
                <br className="hidden md:block" />
                유용한 온라인 도구들을 한 곳에서 만나보세요.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-16">
                <button
                    onClick={() => onCategoryChange(null)}
                    className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${selectedCategory === null
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
                        }`}
                >
                    전체 보기
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() =>
                            onCategoryChange(
                                selectedCategory === category.id ? null : category.id
                            )
                        }
                        className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 ${selectedCategory === category.id
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-transparent"
                            }`}
                    >
                        <span>{category.icon}</span>
                        <span>{category.nameKo}</span>
                    </button>
                ))}
            </div>
        </section>
    );
}
