import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt?: string;
};

// 遞迴讀取所有文章
function getAllPostFiles(dir: string): string[] {
  const files = fs.readdirSync(dir);
  return files.reduce((acc: string[], file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      return [...acc, ...getAllPostFiles(fullPath)];
    }
    return file.endsWith(".md") ? [...acc, fullPath] : acc;
  }, []);
}

// 從檔案路徑獲取分類和 slug
function getPostInfo(filePath: string): { category: string; slug: string } {
  const relativePath = path.relative(postsDirectory, filePath);
  const parts = relativePath.split(path.sep);
  const category = parts[0];
  const slug = path.basename(parts[parts.length - 1], ".md");
  return { category, slug };
}

export async function getSortedPostsData(
  category?: string
): Promise<PostMeta[]> {
  const filePaths = getAllPostFiles(postsDirectory);

  const allPostsData = await Promise.all(
    filePaths.map(async (filePath) => {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const matterResult = matter(fileContents);
      const { category, slug } = getPostInfo(filePath);

      // 轉換 Markdown 為 HTML 以獲取摘要
      const processedContent = await remark()
        .use(html)
        .process(matterResult.content);
      const contentHtml = processedContent.toString();
      const excerpt = contentHtml.slice(0, 200) + "...";

      return {
        slug,
        title: matterResult.data.title,
        date: matterResult.data.date,
        category,
        excerpt,
      };
    })
  );

  const filteredPosts = category
    ? allPostsData.filter(
        (post) => post.category.toLowerCase() === category.toLowerCase()
      )
    : allPostsData;

  return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPostData(
  category: string,
  slug: string
): Promise<PostMeta & { content: string }> {
  const fullPath = path.join(postsDirectory, category, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // 轉換 Markdown 為 HTML
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    category,
    content: contentHtml,
    title: matterResult.data.title,
    date: matterResult.data.date,
  };
}

export function getAllCategories(): string[] {
  const files = fs.readdirSync(postsDirectory);
  const categories = new Set<string>();

  // 添加目錄作為分類
  files.forEach((file) => {
    const fullPath = path.join(postsDirectory, file);
    if (fs.statSync(fullPath).isDirectory()) {
      categories.add(file);
    } else if (file.endsWith(".md")) {
      // 從檔案名稱獲取分類（不含副檔名）
      const category = path.basename(file, ".md");
      categories.add(category);
    }
  });

  return Array.from(categories).sort();
}
