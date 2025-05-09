import { getSortedPostsData, getAllCategories } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PostList } from "@/components/PostList";
import { getCategoryTitle } from "@/lib/utils";

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
  const posts = await getSortedPostsData(resolvedParams.category);
  const categories = getAllCategories();
  const categoryTitle = getCategoryTitle(resolvedParams.category);

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

      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="cursor-pointer px-3 py-1 text-sm">
            <Link href="/blog" className="w-full h-full block">
              全部
            </Link>
          </Badge>

          {categories.map((category) => (
            <Badge
              key={category}
              variant={
                resolvedParams.category === category ? "default" : "outline"
              }
              className="cursor-pointer px-3 py-1 text-sm"
            >
              <Link href={`/blog/${category}`} className="w-full h-full block">
                {getCategoryTitle(category)}
              </Link>
            </Badge>
          ))}
        </div>
      </section>

      <PostList posts={posts} showCategory={false} />
    </div>
  );
}
