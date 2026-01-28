"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, Clock, ChevronDown } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { useCommandStore } from "../model/useCommandStore";
import { useQuickAccessStore } from "@/widgets/quick-access";
import {
  TOOLS,
  CATEGORIES,
  toolIdToTranslationKey,
  getToolMetadata,
} from "@/shared/lib/tool-registry";
import { searchTools, groupByCategory } from "../lib/search";
import { SearchableToolItem } from "../model/types";

export function CommandPalette() {
  const t = useTranslations("tools");
  const tCmd = useTranslations("commandPalette");
  const tCat = useTranslations("categories");
  const router = useRouter();

  const { isOpen, close } = useCommandStore();
  const { getRecentTools, recordUsage } = useQuickAccessStore();

  const [search, setSearch] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Cmd+K / Ctrl+K 단축키
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useCommandStore.getState().toggle();
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 검색 가능한 도구 목록 생성 (번역 포함)
  const searchableTools = useMemo<SearchableToolItem[]>(() => {
    return TOOLS.map((tool) => {
      const key = toolIdToTranslationKey(tool.id);
      return {
        id: tool.id,
        icon: tool.icon,
        categoryId: tool.categoryId,
        gradient: tool.gradient,
        name: t(`${key}.name`),
        description: t(`${key}.description`),
      };
    });
  }, [t]);

  // 검색 결과
  const filteredTools = useMemo(() => {
    if (!search.trim()) return [];
    return searchTools(search, searchableTools);
  }, [search, searchableTools]);

  // 카테고리별 그룹핑
  const groupedResults = useMemo(() => {
    return groupByCategory(filteredTools);
  }, [filteredTools]);

  // 최근 사용 도구
  const recentTools = useMemo(() => {
    return getRecentTools(5)
      .map((usage) => {
        const meta = getToolMetadata(usage.toolId);
        if (!meta) return null;
        return searchableTools.find((t) => t.id === usage.toolId);
      })
      .filter(Boolean) as SearchableToolItem[];
  }, [getRecentTools, searchableTools]);

  const handleSelect = useCallback(
    (toolId: string) => {
      recordUsage(toolId);
      router.push(`/${toolId}`);
      close();
      setSearch("");
    },
    [recordUsage, router, close]
  );

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        close();
        setSearch("");
      }
    },
    [close]
  );

  if (!mounted) return null;

  return (
    <CommandDialog open={isOpen} onOpenChange={handleOpenChange}>
      <CommandInput
        placeholder={tCmd("placeholder")}
        value={search}
        onValueChange={setSearch}
      />
      <CommandList className="max-h-[400px]">
        <CommandEmpty>{tCmd("noResults")}</CommandEmpty>

        {/* 최근 사용 도구 (검색어 없을 때만) */}
        {!search && recentTools.length > 0 && (
          <CommandGroup heading={tCmd("recent")}>
            {recentTools.map((tool) => (
              <CommandItem
                key={tool.id}
                value={`recent-${tool.id}`}
                onSelect={() => handleSelect(tool.id)}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                <span className="mr-2">{tool.icon}</span>
                <span>{tool.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* 모든 도구 (검색어 없을 때) */}
        {!search &&
          Object.entries(CATEGORIES).map(([categoryId]) => {
            const categoryTools = searchableTools.filter(
              (t) => t.categoryId === categoryId
            );
            if (categoryTools.length === 0) return null;

            return (
              <CommandGroup key={categoryId} heading={tCat(`${categoryId}.name`)}>
                {categoryTools.map((tool) => (
                  <CommandItem
                    key={tool.id}
                    value={`all-${tool.id}`}
                    onSelect={() => handleSelect(tool.id)}
                    className="cursor-pointer"
                  >
                    <span className="mr-2">{tool.icon}</span>
                    <div className="flex flex-col">
                      <span>{tool.name}</span>
                      <span className="text-xs text-muted-foreground line-clamp-1">
                        {tool.description}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}

        {/* 검색 결과 (카테고리별) */}
        {search &&
          Object.entries(groupedResults).map(([categoryId, tools]) => (
            <CommandGroup key={categoryId} heading={tCat(`${categoryId}.name`)}>
              {tools.map((tool) => (
                <CommandItem
                  key={tool.id}
                  value={`search-${tool.id}`}
                  onSelect={() => handleSelect(tool.id)}
                  className="cursor-pointer"
                >
                  <Search className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="mr-2">{tool.icon}</span>
                  <div className="flex flex-col">
                    <span>{tool.name}</span>
                    <span className="text-xs text-muted-foreground line-clamp-1">
                      {tool.description}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
      </CommandList>
      {/* 하단 힌트 */}
      <div className="flex items-center justify-between border-t px-3 py-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↑↓</kbd>
            {tCmd("hints.navigate")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
            {tCmd("hints.select")}
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-[10px]">esc</kbd>
            {tCmd("hints.close")}
          </span>
        </div>
        <span className="flex items-center gap-1">
          <ChevronDown className="h-3 w-3 animate-bounce" />
          {tCmd("hints.scrollMore")}
        </span>
      </div>
    </CommandDialog>
  );
}
