import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  getSortedPostsData,
  getAllCategories,
  type PostMeta,
} from "@/lib/posts";

// 格式化日期的函數
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 獲取分類名稱的格式化字符串
function getCategoryTitle(category: string): string {
  // 轉換分類名稱為更友好的顯示格式
  const categoryMappings: Record<string, string> = {
    javascript: "JavaScript",
    typescript: "TypeScript",
    react: "React",
    webpack: "Webpack",
    uncategorized: "未分類",
  };

  return categoryMappings[category.toLowerCase()] || category;
}

// 生成靜態路徑
export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category: category.toLowerCase(),
  }));
}

// 正確的 Next.js 頁面參數類型
type Props = {
  params: {
    category: string;
  };
};

// 頁面元件
export default function CategoryPage({ params }: Props) {
  const { category } = params;
  const categoryTitle = getCategoryTitle(category);

  const posts: PostMeta[] = getSortedPostsData(category);

  // 按日期對文章進行分組
  const postsByYear = posts.reduce((acc: Record<string, PostMeta[]>, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  // 獲取年份並排序
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          {categoryTitle} 學習筆記
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          關於 {categoryTitle} 的文章和學習心得
        </p>
        <Separator className="w-32 bg-primary h-0.5 my-6" />
      </section>

      <section>
        {years.map((year) => (
          <div key={year} className="mb-10">
            <h2 className="text-2xl font-bold mb-4">{year} 年</h2>
            <ul className="space-y-5">
              {postsByYear[year].map((post) => (
                <li key={post.slug} className="border-b pb-5">
                  <article>
                    <div className="flex justify-between items-baseline mb-2">
                      <h3 className="text-xl font-semibold">
                        <Link
                          href={`/posts/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {formatDate(post.date)}
                      </Badge>
                    </div>
                    <div className="text-muted-foreground text-sm mt-2">
                      <Link
                        href={`/posts/${post.slug}`}
                        className="text-primary hover:underline inline-flex items-center"
                      >
                        閱讀全文
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="ml-1 h-3 w-3"
                        >
                          <path d="M5 12h14"></path>
                          <path d="m12 5 7 7-7 7"></path>
                        </svg>
                      </Link>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      {posts.length === 0 && (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">此分類下還沒有文章</h2>
          <p className="text-muted-foreground">
            我們正在努力創作更多內容，敬請期待...
          </p>
        </section>
      )}
    </div>
  );
}
