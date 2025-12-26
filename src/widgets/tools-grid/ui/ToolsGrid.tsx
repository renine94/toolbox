"use client";

import Link from "next/link";

import { Badge } from "@/shared/ui/badge";
import { ToolCard } from "@/widgets/tool-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/shared/ui/carousel";

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

                        <div className="relative">
                            {category.tools.length > 4 ? (
                                <Carousel
                                    opts={{
                                        align: "start",
                                        dragFree: true,
                                    }}
                                    className="w-full"
                                >
                                    <CarouselContent className="-ml-4">
                                        {category.tools.map((tool) => (
                                            <CarouselItem key={tool.id} className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                                                <div className="h-full">
                                                    {tool.status === "available" ? (
                                                        <Link href={`/${tool.id}`} className="block h-full">
                                                            <ToolCard
                                                                tool={tool}
                                                                gradient={category.gradient}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        <ToolCard
                                                            tool={tool}
                                                            gradient={category.gradient}
                                                        />
                                                    )}
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <div className="hidden xl:block">
                                        <CarouselPrevious className="-left-12" />
                                        <CarouselNext className="-right-12" />
                                    </div>
                                    <div className="flex xl:hidden justify-end gap-2 mt-4">
                                        <CarouselPrevious className="static translate-y-0" />
                                        <CarouselNext className="static translate-y-0" />
                                    </div>
                                </Carousel>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                    {category.tools.map((tool) => (
                                        tool.status === "available" ? (
                                            <Link key={tool.id} href={`/${tool.id}`} className="block h-full">
                                                <ToolCard
                                                    tool={tool}
                                                    gradient={category.gradient}
                                                />
                                            </Link>
                                        ) : (
                                            <ToolCard
                                                key={tool.id}
                                                tool={tool}
                                                gradient={category.gradient}
                                            />
                                        )
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
