import { getSortedPostsData, getAllCategories } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { PostList } from "@/components/PostList";
import { getCategoryTitle } from "@/lib/utils";

export default async function BlogPage() {
  const posts = await getSortedPostsData();
  const categories = getAllCategories();

  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          前端技術學習筆記
        </h1>
        <p className="text-lg text-muted-foreground mb-6">
          記錄我在學習前端技術過程中的心得與技巧
        </p>
        <Separator className="w-32 bg-primary h-0.5 my-6" />
      </section>

      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge variant="default" className="cursor-pointer px-3 py-1 text-sm">
            <Link href="/blog" className="w-full h-full block">
              全部
            </Link>
          </Badge>

          {categories.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="cursor-pointer px-3 py-1 text-sm"
            >
              <Link href={`/blog/${category}`} className="w-full h-full block">
                {getCategoryTitle(category)}
              </Link>
            </Badge>
          ))}
        </div>
      </section>

      <PostList posts={posts} />

      {posts.length === 0 && (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">目前還沒有文章</h2>
          <p className="text-muted-foreground">
            我們正在努力創作更多內容，敬請期待...
          </p>
        </section>
      )}
    </div>
  );
}
