import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";

// 為靜態站點生成添加必要的generateStaticParams函數
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

// 使用簡單的內聯類型，讓TypeScript自動推導
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
      <div className="mb-8">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回首頁
        </Link>
      </div>

      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center gap-4 text-muted-foreground mb-8">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{post.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <Link
              href={`/category/${post.category}`}
              className="hover:text-primary transition-colors capitalize"
            >
              {post.category}
            </Link>
          </div>
        </div>

        <div className="leading-relaxed">
          {/* 使用 dangerouslySetInnerHTML 渲染 Markdown 轉換後的 HTML */}
          <div
            dangerouslySetInnerHTML={{
              __html: post.contentHtml || "",
            }}
          />
        </div>
      </article>
    </div>
  );
}
