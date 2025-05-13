import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { AllPostsSidebar } from "@/components/AllPostsSidebar";
import { PostCard } from "@/components/PostCard";

export const metadata = {
  title: "所有文章 | 前端技術學習筆記",
  description: "瀏覽所有關於前端技術的學習筆記和文章",
};

export default async function PostsPage() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto py-8 md:px-0">
      <div className="flex flex-col md:flex-row">
        {/* 側邊欄 - 在移動端隱藏 */}
        <div className="hidden md:block">
          <AllPostsSidebar
            categories={categories}
            recentPosts={posts.slice(0, 5)}
          />
        </div>

        {/* 文章列表 */}
        <div className="flex-1 px-4 md:px-6">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold">所有文章</h1>
            <Link
              href="/"
              className={buttonVariants({ variant: "ghost", size: "sm" })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> 返回首頁
            </Link>
          </div>

          <div className="grid gap-6">
            {posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.slug}
                  title={post.title}
                  date={post.date}
                  category={post.category}
                  excerpt={post.excerpt}
                  slug={post.slug}
                />
              ))
            ) : (
              <p className="text-muted-foreground text-center py-12">
                尚無文章
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
