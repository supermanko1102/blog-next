import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "posts");

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  category?: string;
};

export function getSortedPostsData(category?: string): PostMeta[] {
  const fileNames = fs.readdirSync(postsDirectory);
  console.log("找到的檔案:", fileNames);

  const allPostsData = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    console.log("解析 " + fileName + ":", matterResult.data);

    // 確保日期是字串格式
    const date = matterResult.data.date;
    const dateString =
      date instanceof Date
        ? date.toISOString().split("T")[0] // 如果是Date物件，轉換為YYYY-MM-DD格式
        : date.toString(); // 否則確保是字串

    return {
      slug: matterResult.data.slug,
      title: matterResult.data.title,
      date: dateString,
      category: matterResult.data.category || "uncategorized", // 添加分類，默認為未分類
    };
  });

  // 如果提供了分類，則過濾文章
  const filteredPosts = category
    ? allPostsData.filter(
        (post) => post.category?.toLowerCase() === category.toLowerCase()
      )
    : allPostsData;

  console.log({ filteredPosts });

  return filteredPosts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostData(slug: string) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const matterResult = matter(fileContents);

  // 同樣確保日期是字串格式
  const date = matterResult.data.date;
  const dateString =
    date instanceof Date ? date.toISOString().split("T")[0] : date.toString();

  return {
    slug,
    content: matterResult.content,
    ...matterResult.data,
    date: dateString,
  };
}

export function getAllCategories(): string[] {
  const fileNames = fs.readdirSync(postsDirectory);

  // 獲取所有文章的分類
  const categories = fileNames.map((fileName) => {
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const matterResult = matter(fileContents);
    return matterResult.data.category || "uncategorized";
  });

  // 去重並排序
  return Array.from(new Set(categories)).sort();
}
