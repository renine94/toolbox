import type { VariationCategory } from "../model/types";

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function getCategoryColor(category: VariationCategory): string {
  const colors: Record<VariationCategory, string> = {
    numbers: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    questions: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    howto: "bg-green-500/10 text-green-500 border-green-500/20",
    lists: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    urgency: "bg-red-500/10 text-red-500 border-red-500/20",
    fomo: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    comparison: "bg-cyan-500/10 text-cyan-500 border-cyan-500/20",
    secrets: "bg-pink-500/10 text-pink-500 border-pink-500/20",
    beginner: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    expert: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    trending: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    results: "bg-teal-500/10 text-teal-500 border-teal-500/20",
    negative: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    challenge: "bg-violet-500/10 text-violet-500 border-violet-500/20",
    warning: "bg-red-600/10 text-red-600 border-red-600/20",
  };
  return colors[category] || "bg-gray-500/10 text-gray-500 border-gray-500/20";
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
