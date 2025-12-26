"use client";

interface StatItem {
    value: string | number;
    label: string;
    gradient: string;
}

interface StatsSectionProps {
    stats?: StatItem[];
}

const defaultStats: StatItem[] = [
    {
        value: "15+",
        label: "도구",
        gradient: "from-violet-400 to-purple-400",
    },
    {
        value: "5",
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

export function StatsSection({ stats = defaultStats }: StatsSectionProps) {
    return (
        <section className="border-t border-white/5 bg-white/2 dark:bg-black/20">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-center">
                            <div
                                className={`text-4xl md:text-5xl font-bold bg-linear-to-r ${stat.gradient} bg-clip-text text-transparent`}
                            >
                                {stat.value}
                            </div>
                            <div className="text-muted-foreground mt-2">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
