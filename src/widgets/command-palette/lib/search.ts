import { SearchableToolItem } from "../model/types";

/**
 * 검색어로 도구를 필터링합니다.
 * 도구 이름, 설명, ID를 검색합니다.
 */
export function searchTools(
  query: string,
  tools: SearchableToolItem[]
): SearchableToolItem[] {
  if (!query.trim()) return [];

  const lowerQuery = query.toLowerCase();

  return tools.filter((tool) => {
    return (
      tool.name.toLowerCase().includes(lowerQuery) ||
      tool.description.toLowerCase().includes(lowerQuery) ||
      tool.id.toLowerCase().includes(lowerQuery)
    );
  });
}

/**
 * 도구들을 카테고리별로 그룹화합니다.
 */
export function groupByCategory(
  tools: SearchableToolItem[]
): Record<string, SearchableToolItem[]> {
  return tools.reduce(
    (acc, tool) => {
      if (!acc[tool.categoryId]) {
        acc[tool.categoryId] = [];
      }
      acc[tool.categoryId].push(tool);
      return acc;
    },
    {} as Record<string, SearchableToolItem[]>
  );
}
