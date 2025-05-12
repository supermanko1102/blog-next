import { FeaturedPostCard } from "@/components/FeaturedPostCard";
import { getAllPosts } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "所有文章 | 前端技術學習筆記",
  description: "瀏覽所有關於前端技術的學習筆記和文章",
};

export default async function PostsPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8 flex items-center">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          返回首頁
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">所有文章</h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <FeaturedPostCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
                slug={post.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-10 text-center">
            目前還沒有發布任何文章
          </p>
        )}
      </div>
    </div>
  );
}
