import { getSortedPostsData, getAllCategories } from "@/lib/posts";
import { getCategoryTitle } from "@/lib/utils";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export async function generateStaticParams() {
  const categories = getAllCategories();
  return categories.map((category) => ({
    category,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const resolvedParams = await params;
  const { category } = resolvedParams;
  const allPosts = await getSortedPostsData();
  const allCategories = getAllCategories();
  const categoryTitle = getCategoryTitle(category);

  // 過濾文章
  const filteredPosts = allPosts.filter(
    (post) => post.category?.toLowerCase() === category.toLowerCase()
  );

  // 按年份分組文章
  const postsByYear = filteredPosts.reduce(
    (acc: Record<string, typeof filteredPosts>, post) => {
      const year = new Date(post.date).getFullYear().toString();
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {}
  );

  // 獲取年份並排序
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer px-3 py-1 text-sm">
            <Link href="/" className="w-full h-full block">
              全部
            </Link>
          </Badge>

          {allCategories.map((cat) => (
            <Badge
              key={cat}
              variant={cat === category ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm"
            >
              <Link href={`/categories/${cat}`} className="w-full h-full block">
                {getCategoryTitle(cat)}
              </Link>
            </Badge>
          ))}
        </div>
      </section>

      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-8">
          {categoryTitle} 學習筆記
        </h1>

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
                          href={`/blog/${post.category}/${post.slug}`}
                          className="hover:text-primary transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        {new Date(post.date).toLocaleDateString("zh-TW", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </Badge>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">沒有找到相關文章</p>
          </div>
        )}
      </section>
    </div>
  );
}
