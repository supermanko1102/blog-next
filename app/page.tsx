import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FeaturedPostCard } from "@/components/FeaturedPostCard";
import { CategoryCard } from "@/components/CategoryCard";
import { getAllPosts, getAllCategories } from "@/lib/posts";

export default async function Home() {
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      {/* 頭部區域 */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
          前端技術學習筆記
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          記錄前端技術學習過程中的心得與技巧，包含 JavaScript、React、Webpack
          等主題
        </p>
      </section>

      {/* 特色文章 */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">最近更新</h2>
          <Link
            href="/posts"
            className={buttonVariants({ variant: "ghost", size: "sm" })}
          >
            所有文章 <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.length > 0 ? (
            posts
              .slice(0, 3)
              .map((post) => (
                <FeaturedPostCard
                  key={post.slug}
                  title={post.title}
                  excerpt={post.excerpt}
                  date={post.date}
                  category={post.category}
                  slug={post.slug}
                />
              ))
          ) : (
            <p className="text-muted-foreground col-span-3 py-10 text-center">
              尚無文章
            </p>
          )}
        </div>
      </section>

      {/* 文章分類 */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">文章分類</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.length > 0 ? (
            categories.map((category) => (
              <CategoryCard
                key={category.slug}
                title={category.title}
                count={category.count}
                slug={category.slug}
              />
            ))
          ) : (
            <p className="text-muted-foreground col-span-4 py-10 text-center">
              尚無分類
            </p>
          )}
        </div>
      </section>

      {/* 關於我 */}
      <section className="mb-16 bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">關於這個部落格</h2>
        <p className="text-muted-foreground mb-4">
          這是一個記錄我在前端開發學習過程中的心得與筆記的部落格。我會分享各種前端技術、框架和工具的使用經驗，
          希望能幫助到其他正在學習前端開發的朋友。
        </p>
        <Link href="/about" className={buttonVariants({ variant: "outline" })}>
          了解更多
        </Link>
      </section>
    </div>
  );
}
