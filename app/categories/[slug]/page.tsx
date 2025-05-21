import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getAllPosts, getAllCategories } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";
import { AllPostsSidebar } from "@/components/AllPostsSidebar";
import { notFound } from "next/navigation";

//  DON'T REMOVE!!! 為靜態站點生成添加必要的generateStaticParams函數
export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getAllPosts();
  const categories = await getAllCategories();

  // 獲取當前分類
  const currentCategory = categories.find((category) => category.slug === slug);

  if (!currentCategory) {
    notFound();
  }

  // 篩選該分類下的文章
  const filteredPosts = posts.filter(
    (post) => post.category.toLowerCase() === slug.toLowerCase()
  );

  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex">
        {/* 側邊欄 - 在移動端隱藏，在桌面端固定 */}
        <div className="hidden md:block w-72 border-r border-border/40 fixed top-0 bottom-0 pt-16">
          <AllPostsSidebar
            categories={categories}
            recentPosts={posts.slice(0, 5)}
          />
        </div>

        {/* 文章列表 */}
        <div className="flex-1 md:ml-72">
          <div className="max-w-4xl mx-auto py-10 px-6 md:px-10">
            <div className="mb-8 flex justify-between items-center">
              <h1 className="text-3xl font-bold capitalize">
                {currentCategory.title}
              </h1>
              <Link
                href="/"
                className={buttonVariants({
                  variant: "ghost",
                  size: "sm",
                  className: "transition-all hover:-translate-x-1",
                })}
              >
                <ArrowLeft className="mr-2 h-4 w-4" /> 返回首頁
              </Link>
            </div>

            <div className="grid gap-6">
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
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
                  該分類下暫無文章
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
