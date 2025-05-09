import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化日期的函數
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 獲取分類名稱的格式化字符串
export function getCategoryTitle(category: string): string {
  const categoryMappings: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    webpack: "Webpack",
    uncategorized: "未分類",
  };

  return categoryMappings[category.toLowerCase()] || category;
}
