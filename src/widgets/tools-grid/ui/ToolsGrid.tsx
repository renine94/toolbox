"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

import { Badge } from "@/shared/ui/badge";
import { ToolCard } from "@/widgets/tool-card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/shared/ui/carousel";
import { cn } from "@/shared/lib/utils";
import { chunkArray } from "../lib/utils";

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

const ITEMS_PER_PAGE = 16;

function ToolCardWrapper({ tool, gradient }: { tool: Tool; gradient: string }) {
    if (tool.status === "available") {
        return (
            <Link href={`/${tool.id}`} className="block h-full">
                <ToolCard tool={tool} gradient={gradient} />
            </Link>
        );
    }
    return <ToolCard tool={tool} gradient={gradient} />;
}

function PageIndicator({ total, current }: { total: number; current: number }) {
    return (
        <div className="flex gap-2">
            {Array.from({ length: total }).map((_, i) => (
                <span
                    key={i}
                    className={cn(
                        "w-2 h-2 rounded-full transition-colors",
                        i === current ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                />
            ))}
        </div>
    );
}

function AreaCarousel({ chunks, gradient }: { chunks: Tool[][]; gradient: string }) {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const onSelect = useCallback(() => {
        if (!api) return;
        setCurrent(api.selectedScrollSnap());
    }, [api]);

    useEffect(() => {
        if (!api) return;
        onSelect();
        api.on("select", onSelect);
        return () => {
            api.off("select", onSelect);
        };
    }, [api, onSelect]);

    return (
        <Carousel
            setApi={setApi}
            opts={{
                align: "start",
                loop: false,
            }}
            className="w-full"
        >
            <CarouselContent>
                {chunks.map((chunk, pageIndex) => (
                    <CarouselItem key={pageIndex} className="basis-full">
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                            {chunk.map((tool) => (
                                <ToolCardWrapper
                                    key={tool.id}
                                    tool={tool}
                                    gradient={gradient}
                                />
                            ))}
                        </div>
                    </CarouselItem>
                ))}
            </CarouselContent>
            <div className="flex justify-center items-center gap-4 mt-6">
                <CarouselPrevious className="static translate-y-0" />
                <PageIndicator total={chunks.length} current={current} />
                <CarouselNext className="static translate-y-0" />
            </div>
        </Carousel>
    );
}

export function ToolsGrid({ categories }: ToolsGridProps) {
    const t = useTranslations("common.tools");

    return (
        <section id="tools" className="max-w-7xl mx-auto px-6 pb-24">
            <div className="space-y-16">
                {categories.map((category) => {
                    const chunks = chunkArray(category.tools, ITEMS_PER_PAGE);
                    const needsCarousel = chunks.length > 1;

                    return (
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
                                    {t("count", { count: category.tools.length })}
                                </Badge>
                            </div>

                            <div className="relative">
                                {needsCarousel ? (
                                    <AreaCarousel
                                        chunks={chunks}
                                        gradient={category.gradient}
                                    />
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
                                        {category.tools.map((tool) => (
                                            <ToolCardWrapper
                                                key={tool.id}
                                                tool={tool}
                                                gradient={category.gradient}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
