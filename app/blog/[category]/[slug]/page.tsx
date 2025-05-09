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
      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer px-3 py-1 text-sm">
            <Link href="/" className="w-full h-full block">
              全部
            </Link>
          </Badge>

          {categories.map((cat) => (
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

      <article className="prose prose-lg dark:prose-invert max-w-none">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-muted-foreground">
            <time dateTime={post.date}>
              {new Date(post.date).toLocaleDateString("zh-TW", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <Badge variant="secondary">{categoryTitle}</Badge>
          </div>
        </header>

        <Separator className="my-8" />

        <div
          className="prose prose-lg dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>
    </div>
  );
}
