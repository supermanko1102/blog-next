import { remark } from "remark";
import html from "remark-html";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypePrism from "rehype-prism-plus";

/**
 * 將 Markdown 字符串轉換為 HTML 字符串，並添加程式碼高亮
 * @param markdown Markdown 文本
 * @returns HTML 字符串
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  try {
    // 使用 unified 處理流程，以支持 rehype-prism-plus
    const processedContent = await unified()
      .use(remarkParse) // 將 markdown 解析為 mdast
      .use(remarkRehype, { allowDangerousHtml: true }) // 將 mdast 轉換為 hast
      .use(rehypePrism, {
        showLineNumbers: true, // 顯示行號
        ignoreMissing: true, // 忽略未識別的語言
      }) // 添加程式碼高亮
      .use(rehypeStringify, { allowDangerousHtml: true }) // 將 hast 序列化為 HTML 字符串
      .process(markdown);

    return processedContent.toString();
  } catch (error) {
    console.error("Error processing markdown:", error);
    // 如果出錯，嘗試使用簡單的 remark-html 處理
    try {
      const simpleProcessed = await remark()
        .use(html, { sanitize: false })
        .process(markdown);
      return simpleProcessed.toString();
    } catch (fallbackError) {
      console.error("Error in fallback markdown processing:", fallbackError);
      return markdown; // 出錯時返回原始 markdown
    }
  }
}
