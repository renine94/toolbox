"use client";

import { useTranslations } from "next-intl";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import { ChevronRight } from "lucide-react";

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
            className="h-full flex flex-col bg-card/50 border-border hover:bg-accent/50 hover:border-accent transition-all duration-300 cursor-pointer group overflow-hidden"
        >
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div
                        className={`w-12 h-12 rounded-xl bg-linear-to-br ${gradient} opacity-80 group-hover:opacity-100 flex items-center justify-center text-xl transition-opacity`}
                    >
                        {tool.icon}
                    </div>
                    {tool.status === "coming-soon" && (
                        <Badge
                            variant="outline"
                            className="bg-amber-500/10 text-amber-500 border-amber-500/20 text-xs"
                        >
                            {t("status.comingSoon")}
                        </Badge>
                    )}
                </div>
                <CardTitle className="text-foreground text-lg mt-4 group-hover:text-primary">
                    {tool.name}
                </CardTitle>
                <CardDescription className="text-muted-foreground text-sm leading-relaxed">
                    {tool.description}
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                    <span>{t("tools.viewMore")}</span>
                    <ChevronRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                </div>
            </CardContent>
        </Card>
    );
}
