import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag, BookOpen } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPostBySlug, getAllPostSlugs, getAllPosts } from "@/lib/posts";
import { CategorySidebar } from "@/components/CategorySidebar";

// 為靜態站點生成添加必要的generateStaticParams函數 DON'T REMOVE!!!
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const allPosts = await getAllPosts();

  if (!post) {
    notFound();
  }

  // 計算閱讀時間（每600字約1分鐘）
  const readingTime = post.contentHtml
    ? Math.ceil(post.contentHtml.length / 600)
    : 5; // 預設5分鐘

  return (
    <div className="container mx-auto min-h-screen">
      <div className="flex">
        {/* 分類側邊欄 - 在移動端隱藏，在桌面端固定 */}
        <div className="hidden md:block w-72 border-r border-border/40 fixed top-0 bottom-0 pt-16">
          <CategorySidebar posts={allPosts} currentCategory={post.category} />
        </div>

        {/* 文章內容 - 不再獨立滾動 */}
        <div className="flex-1 md:ml-72">
          <div className="max-w-4xl mx-auto py-10 px-6 md:px-10">
            <div className="mb-10 flex justify-between items-center">
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

              <Link
                href={`/categories/${post.category}`}
                className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-1.5"
              >
                <Tag className="h-3.5 w-3.5" />
                <span className="capitalize">{post.category}</span>
              </Link>
            </div>

            <article className="prose dark:prose-invert max-w-none">
              <div className="mb-8 space-y-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight !mb-0">
                  {post.title}
                </h1>

                <div className="flex items-center text-muted-foreground text-sm">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                  <span className="mx-3">•</span>
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>閱讀時間：{readingTime} 分鐘</span>
                  </div>
                </div>
              </div>

              <div className="leading-relaxed">
                <div
                  dangerouslySetInnerHTML={{
                    __html: post.contentHtml || "",
                  }}
                  className="prose-img:rounded-lg prose-headings:scroll-mt-20"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}
