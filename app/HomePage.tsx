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
          {/* 全部 */}
          <Link
            href="/"
            tabIndex={0}
            aria-current={!categoryParam ? "page" : undefined}
          >
            <span
              className={`
                inline-block px-4 py-1.5 rounded-lg border font-medium text-sm transition
                cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                active:scale-95
                ${
                  !categoryParam
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                }
              `}
            >
              全部
            </span>
          </Link>

          {/* 其他分類 */}
          {initialCategories.map((category) => (
            <Link
              key={category}
              href={`/?category=${category}`}
              tabIndex={0}
              aria-current={category === categoryParam ? "page" : undefined}
            >
              <span
                className={`
                  inline-block px-4 py-1.5 rounded-lg border font-medium text-sm transition
                  cursor-pointer shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50
                  active:scale-95
                  ${
                    category === categoryParam
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-gray-300 text-gray-700 hover:border-primary hover:bg-primary/5 hover:text-primary"
                  }
                `}
              >
                {getCategoryTitle(category)}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 文章列表 */}
      {postsByYear.map(([year, posts]) => (
        <section key={year} className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">{year}</h2>
          <div className="space-y-6">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.category}/${post.slug}`}
                className={`
                  block rounded-xl bg-white/90 shadow-sm border border-gray-100
                  hover:shadow-lg hover:bg-primary/5 transition
                  focus:outline-none focus:ring-2 focus:ring-primary/50
                  p-5 group
                `}
              >
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("zh-TW", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <Badge
                    variant="secondary"
                    className="ml-2 px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/30"
                  >
                    {getCategoryTitle(post.category)}
                  </Badge>
                </div>
                {/* 可以加上文章摘要或icon，讓卡片更豐富 */}
              </Link>
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
