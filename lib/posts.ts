import fs from "fs";
import path from "path";
import matter from "gray-matter";

export interface Post {
  title: string;
  date: string;
  excerpt: string;
  category: string;
  slug: string;
  content?: string;
}

export interface Category {
  title: string;
  count: number;
  slug: string;
}

// 獲取所有文章，並根據日期排序
export async function getAllPosts(): Promise<Post[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "posts");
    const categories = fs.readdirSync(postsDirectory);

    const allPosts: Post[] = [];

    categories.forEach((category) => {
      if (fs.statSync(path.join(postsDirectory, category)).isDirectory()) {
        // 讀取分類目錄下所有文章
        const postsInCategory = fs.readdirSync(
          path.join(postsDirectory, category)
        );

        postsInCategory.forEach((fileName) => {
          if (fileName.endsWith(".md")) {
            const fullPath = path.join(postsDirectory, category, fileName);
            const fileContents = fs.readFileSync(fullPath, "utf8");

            // 使用gray-matter解析frontmatter
            const { data, content } = matter(fileContents);
            const slug = `${category}/${fileName.replace(/\.md$/, "")}`;

            allPosts.push({
              title: data.title || "無標題",
              date: data.date
                ? new Date(data.date).toLocaleDateString("zh-TW")
                : new Date().toLocaleDateString("zh-TW"),
              excerpt: data.excerpt || content.substring(0, 150) + "...",
              category,
              slug,
            });
          }
        });
      }
    });

    // 按日期降序排序
    return allPosts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error getting all posts:", error);
    return [];
  }
}

// 獲取所有分類及其文章數量
export async function getAllCategories(): Promise<Category[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "posts");
    const categories = fs.readdirSync(postsDirectory);

    const categoryCounts = categories
      .map((category) => {
        if (fs.statSync(path.join(postsDirectory, category)).isDirectory()) {
          // 計算分類中的文章數量
          const postsInCategory = fs
            .readdirSync(path.join(postsDirectory, category))
            .filter((file) => file.endsWith(".md"));

          return {
            title: category,
            count: postsInCategory.length,
            slug: category,
          };
        }
        return null;
      })
      .filter((category): category is Category => category !== null);

    return categoryCounts;
  } catch (error) {
    console.error("Error getting categories:", error);
    return [];
  }
}

// 獲取指定路徑的文章內容
export async function getPostBySlug(slugArray: string[]): Promise<Post | null> {
  try {
    if (!slugArray || slugArray.length < 2) return null;

    const category = slugArray[0];
    const slug = slugArray[1];

    const fullPath = path.join(process.cwd(), "posts", category, `${slug}.md`);

    if (!fs.existsSync(fullPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      title: data.title || "無標題",
      date: data.date
        ? new Date(data.date).toLocaleDateString("zh-TW")
        : "未知日期",
      excerpt: data.excerpt || "",
      category,
      content,
      slug: `${category}/${slug}`,
    };
  } catch (error) {
    console.error("Error getting post:", error);
    return null;
  }
}

// 獲取特定分類下的所有文章
export async function getPostsByCategory(
  category: string
): Promise<Post[] | null> {
  try {
    const categoryPath = path.join(process.cwd(), "posts", category);

    if (
      !fs.existsSync(categoryPath) ||
      !fs.statSync(categoryPath).isDirectory()
    ) {
      return null;
    }

    const postFiles = fs
      .readdirSync(categoryPath)
      .filter((file) => file.endsWith(".md"));

    const posts = postFiles.map((fileName) => {
      const fullPath = path.join(categoryPath, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      const { data, content } = matter(fileContents);
      const slug = fileName.replace(/\.md$/, "");

      return {
        title: data.title || "無標題",
        date: data.date
          ? new Date(data.date).toLocaleDateString("zh-TW")
          : new Date().toLocaleDateString("zh-TW"),
        excerpt: data.excerpt || content.substring(0, 150) + "...",
        category,
        slug: `${category}/${slug}`,
      };
    });

    // 按日期降序排序
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error("Error getting category posts:", error);
    return null;
  }
}

// 獲取所有文章的slug，用於generateStaticParams
export async function getAllPostSlugs(): Promise<{ slug: string[] }[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "posts");
    const categories = fs.readdirSync(postsDirectory);

    const slugs: { slug: string[] }[] = [];

    categories.forEach((category) => {
      if (fs.statSync(path.join(postsDirectory, category)).isDirectory()) {
        const postsInCategory = fs
          .readdirSync(path.join(postsDirectory, category))
          .filter((file) => file.endsWith(".md"));

        postsInCategory.forEach((fileName) => {
          const slug = fileName.replace(/\.md$/, "");
          // 返回格式需要符合[...slug]的參數格式
          slugs.push({
            slug: [category, slug],
          });
        });
      }
    });

    return slugs;
  } catch (error) {
    console.error("Error getting all post slugs:", error);
    return [];
  }
}

// 獲取所有分類的slug，用於分類頁面的generateStaticParams
export async function getAllCategorySlugs(): Promise<{ slug: string }[]> {
  try {
    const postsDirectory = path.join(process.cwd(), "posts");
    const categories = fs.readdirSync(postsDirectory);

    const slugs: { slug: string }[] = [];

    categories.forEach((category) => {
      if (fs.statSync(path.join(postsDirectory, category)).isDirectory()) {
        // 檢查分類下是否有md文件
        const postsInCategory = fs
          .readdirSync(path.join(postsDirectory, category))
          .filter((file) => file.endsWith(".md"));

        if (postsInCategory.length > 0) {
          slugs.push({
            slug: category,
          });
        }
      }
    });

    return slugs;
  } catch (error) {
    console.error("Error getting category slugs:", error);
    return [];
  }
}
