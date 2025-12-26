"use client";

import { Badge } from "@/shared/ui/badge";
import { ToolCard } from "@/widgets/tool-card";

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

interface ToolsGridProps {
    categories: Category[];
}

export function ToolsGrid({ categories }: ToolsGridProps) {
    return (
        <section id="tools" className="max-w-7xl mx-auto px-6 pb-24">
            <div className="space-y-16">
                {categories.map((category) => (
                    <div key={category.id}>
                        <div className="flex items-center gap-4 mb-8">
                            <div
                                className={`w-12 h-12 rounded-2xl bg-linear-to-br ${category.gradient} flex items-center justify-center text-2xl shadow-lg`}
                            >
                                {category.icon}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-foreground">
                                    {category.nameKo}
                                </h2>
                                <p className="text-muted-foreground text-sm">{category.name}</p>
                            </div>
                            <Badge
                                variant="secondary"
                                className="ml-auto bg-secondary text-secondary-foreground border-0"
                            >
                                {category.tools.length} 도구
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {category.tools.map((tool) => (
                                <ToolCard
                                    key={tool.id}
                                    tool={tool}
                                    gradient={category.gradient}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
