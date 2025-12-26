"use client";

interface CTASectionProps {
    title?: string;
    description?: string;
    buttonText?: string;
    onButtonClick?: () => void;
}

export function CTASection({
    title = "지금 바로 시작하세요",
    description = "로그인 없이 모든 도구를 무료로 사용할 수 있습니다.\n필요한 도구를 선택하고 바로 시작해 보세요.",
    buttonText = "도구 탐색하기 →",
    onButtonClick,
}: CTASectionProps) {
    const descriptionLines = description.split("\n");

    return (
        <section className="max-w-7xl mx-auto px-6 py-24">
            <div className="relative rounded-3xl bg-linear-to-r from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-border p-12 md:p-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-secondary/30 backdrop-blur-3xl" />
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {title}
                    </h2>
                    <p className="text-muted-foreground max-w-xl mx-auto mb-8">
                        {descriptionLines.map((line, index) => (
                            <span key={index}>
                                {line}
                                {index < descriptionLines.length - 1 && <br />}
                            </span>
                        ))}
                    </p>
                    <button
                        onClick={onButtonClick}
                        className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
                    >
                        {buttonText}
                    </button>
                </div>
            </div>
        </section>
    );
}
