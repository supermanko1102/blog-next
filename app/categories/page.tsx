// 分類頁面

import { CategoryCard } from "@/components/CategoryCard";
import { getAllCategories } from "@/lib/posts";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export const metadata = {
  title: "文章分類 | 前端技術學習筆記",
  description: "瀏覽所有前端技術文章分類",
};

export default async function CategoriesPage() {
  const categories = await getAllCategories();

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
        <h1 className="text-3xl font-bold mb-6">文章分類</h1>

        {categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                title={category.title}
                count={category.count}
                slug={category.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-10 text-center">
            目前還沒有任何分類
          </p>
        )}
      </div>

      <section className="mb-16 bg-card rounded-lg p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">關於分類</h2>
        <p className="text-muted-foreground mb-4">
          我將文章分為不同類別，包括 JavaScript、React、TypeScript、Webpack
          等，方便您按照自己的學習需求查找相關內容。
          點擊任意分類可以查看該分類下的所有文章。
        </p>
        <Link href="/posts" className={buttonVariants({ variant: "outline" })}>
          查看所有文章
        </Link>
      </section>
    </div>
  );
}
