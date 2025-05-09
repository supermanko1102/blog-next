import { getPostData, getSortedPostsData, getAllCategories } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { getCategoryTitle } from "@/lib/utils";

export async function generateStaticParams() {
  const categories = getAllCategories();
  const paths = [];

  for (const category of categories) {
    const posts = await getSortedPostsData();
    paths.push(
      ...posts
        .filter(
          (post) => post.category?.toLowerCase() === category.toLowerCase()
        )
        .map((post) => ({
          category,
          slug: post.slug,
        }))
    );
  }

  return paths;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const { category, slug } = resolvedParams;
  const post = await getPostData(category, slug);
  const categories = getAllCategories();
  const categoryTitle = getCategoryTitle(category);

  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      {/* 返回列表按鈕 */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-primary text-primary bg-primary/10 hover:bg-primary/20 transition focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          ← 返回列表
        </Link>
      </div>

      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/"
            tabIndex={0}
            aria-current={!category ? "page" : undefined}
          >
            <span
              className={`
                inline-block px-4 py-1.5 rounded-lg border font-medium text-sm transition
                cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                active:scale-95
                ${
                  !category
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                }
              `}
            >
              全部
            </span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat}
              href={`/categories/${cat}`}
              tabIndex={0}
              aria-current={cat === category ? "page" : undefined}
            >
              <span
                className={`
                  inline-block px-4 py-1.5 rounded-lg border font-medium text-sm transition
                  cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                  active:scale-95
                  ${
                    cat === category
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  }
                `}
              >
                {getCategoryTitle(cat)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 文章內容卡片 */}
      <article className="prose prose-lg dark:prose-invert max-w-none bg-white/90 dark:bg-zinc-900/80 rounded-xl shadow-md p-8 mb-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground text-base mb-2">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <Badge
              variant="secondary"
              className="bg-primary/10 text-primary border border-primary/30"
            >
              {categoryTitle}
            </Badge>
          </div>
          <Separator className="my-6" />
        </header>
        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
