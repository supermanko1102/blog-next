"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { FileText, Bookmark, ChevronRight } from "lucide-react";

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

interface Category {
  slug: string;
  title: string;
  count: number;
}

interface AllPostsSidebarProps {
  categories: Category[];
  recentPosts: Post[];
  className?: string;
}

export function AllPostsSidebar({
  categories,
  recentPosts,
  className,
}: AllPostsSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "h-full py-8 px-6 flex flex-col overflow-y-auto bg-muted/30 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <FileText className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">文章分類</h3>
        </div>
        <div className="h-0.5 w-16 bg-primary/50 rounded-full mb-4"></div>

        <nav className="pr-2 space-y-1.5">
          {categories.map((category) => {
            const isActive = pathname === `/categories/${category.slug}`;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className={cn(
                  "flex justify-between items-center p-3 text-sm rounded-lg transition-all duration-200 hover:bg-primary/10 hover:pl-4 group",
                  isActive
                    ? "bg-primary/15 text-primary font-medium shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <span className="capitalize flex items-center gap-2">
                  <ChevronRight
                    className={cn(
                      "h-3.5 w-3.5 opacity-0 -ml-2 transition-all duration-200",
                      isActive
                        ? "opacity-100 ml-0"
                        : "group-hover:opacity-70 group-hover:ml-0"
                    )}
                  />
                  {category.title}
                </span>
                <span className="bg-muted text-muted-foreground text-xs py-0.5 px-1.5 rounded-full">
                  {category.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold">最近文章</h3>
        </div>
        <div className="h-0.5 w-16 bg-primary/50 rounded-full mb-4"></div>

        <nav className="pr-2 space-y-1.5">
          {recentPosts.map((post) => {
            const isActive = pathname === `/posts/${post.slug}`;
            return (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className={cn(
                  "flex items-center gap-2 p-3 text-sm rounded-lg transition-all duration-200 hover:bg-primary/10 hover:pl-4 group",
                  isActive
                    ? "bg-primary/15 text-primary font-medium shadow-sm"
                    : "text-muted-foreground"
                )}
              >
                <ChevronRight
                  className={cn(
                    "h-3.5 w-3.5 opacity-0 -ml-2 transition-all duration-200",
                    isActive
                      ? "opacity-100 ml-0"
                      : "group-hover:opacity-70 group-hover:ml-0"
                  )}
                />
                <span className="line-clamp-2">{post.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
