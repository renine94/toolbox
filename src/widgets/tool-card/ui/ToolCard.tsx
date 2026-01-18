"use client";

import { useTranslations } from "next-intl";
import {
    Card,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";

interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: "available" | "coming-soon";
}

interface ToolCardProps {
    tool: Tool;
    gradient: string;
    onClick?: () => void;
}

export function ToolCard({ tool, gradient, onClick }: ToolCardProps) {
    const t = useTranslations("common");

    return (
        <Card
            onClick={onClick}
            className="h-full flex flex-col bg-card/50 border-border hover:bg-accent/50 hover:border-accent transition-all duration-300 cursor-pointer group overflow-hidden py-3"
        >
            <CardHeader className="pb-0 px-3 space-y-2">
                <div className="flex items-center gap-2.5">
                    <div
                        className={`w-8 h-8 shrink-0 rounded-lg bg-linear-to-br ${gradient} opacity-80 group-hover:opacity-100 flex items-center justify-center text-sm transition-opacity`}
                    >
                        {tool.icon}
                    </div>
                    <div className="flex-1 min-w-0 flex items-center gap-1.5">
                        <CardTitle className="text-foreground text-sm group-hover:text-primary line-clamp-1">
                            {tool.name}
                        </CardTitle>
                        {tool.status === "coming-soon" && (
                            <Badge
                                variant="outline"
                                className="shrink-0 bg-amber-500/10 text-amber-500 border-amber-500/20 text-[10px] px-1.5 py-0"
                            >
                                {t("status.comingSoon")}
                            </Badge>
                        )}
                    </div>
                </div>
                <p className="text-muted-foreground text-xs line-clamp-1">
                    {tool.description}
                </p>
            </CardHeader>
        </Card>
    );
}
