import { remark } from "remark";
import html from "remark-html";

/**
 * 將 Markdown 字符串轉換為 HTML 字符串
 * @param markdown Markdown 文本
 * @returns HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    const processedContent = await remark()
      .use(html, { sanitize: false }) // 設置 sanitize 為 false 以允許所有 HTML 標籤
      .process(markdown);

    return processedContent.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    return markdown; // 出錯時返回原始 markdown
  }
}
