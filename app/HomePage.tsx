"use client";

import Link from "next/link";
import { PostMeta } from "@/lib/posts";
import { Badge } from "@/components/ui/badge";
import { getCategoryTitle } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface HomePageProps {
  initialPosts: PostMeta[];
  initialCategories: string[];
  initialCategory: string | null;
}

export default function HomePage({
  initialPosts,
  initialCategories,
}: HomePageProps) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");

  // 在客戶端過濾文章
  const filteredPosts = useMemo(() => {
    return categoryParam
      ? initialPosts.filter(
          (post) => post.category?.toLowerCase() === categoryParam.toLowerCase()
        )
      : initialPosts;
  }, [initialPosts, categoryParam]);

  // 按年份分組文章
  const postsByYear = useMemo(() => {
    const groups: { [key: string]: PostMeta[] } = {};
    filteredPosts.forEach((post) => {
      const year = new Date(post.date).getFullYear();
      if (!groups[year]) {
        groups[year] = [];
      }
      groups[year].push(post);
    });
    return Object.entries(groups).sort(([a], [b]) => Number(b) - Number(a));
  }, [filteredPosts]);

  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      {/* 頁面標題 */}
      <h1 className="text-4xl font-bold tracking-tight mb-8">
        {categoryParam
          ? `${getCategoryTitle(categoryParam)} 學習筆記`
          : "前端技術學習筆記"}
      </h1>

      {/* 分類過濾器 */}
      <section className="mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={!categoryParam ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm"
          >
            <Link href="/" className="w-full h-full block">
              全部
            </Link>
          </Badge>

          {initialCategories.map((category) => (
            <Badge
              key={category}
              variant={category === categoryParam ? "default" : "outline"}
              className="cursor-pointer px-3 py-1 text-sm"
            >
              <Link
                href={`/?category=${category}`}
                className="w-full h-full block"
              >
                {getCategoryTitle(category)}
              </Link>
            </Badge>
          ))}
        </div>
      </section>

      {/* 文章列表 */}
      {postsByYear.map(([year, posts]) => (
        <section key={year} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{year}</h2>
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug} className="group">
                <Link
                  href={`/blog/${post.category}/${post.slug}`}
                  className="block"
                >
                  <h3 className="text-xl font-medium mb-2 group-hover:text-primary transition-colors">
                    {post.title}
                  </h3>
                  <div className="flex items-center gap-4 text-muted-foreground">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("zh-TW", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <Badge variant="secondary">
                      {getCategoryTitle(post.category)}
                    </Badge>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      ))}

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">沒有找到相關文章</p>
        </div>
      )}
    </div>
  );
}
