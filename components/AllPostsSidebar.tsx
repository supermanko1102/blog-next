"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

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
    <aside className={cn("w-64 shrink-0 border-r h-full py-6 px-4", className)}>
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">文章分類</h3>
        <nav className="space-y-1">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/categories/${category.slug}`}
              className={cn(
                "flex justify-between items-center py-2 px-3 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === `/categories/${category.slug}`
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <span className="capitalize">{category.title}</span>
              <span className="bg-muted text-muted-foreground text-xs py-0.5 px-1.5 rounded-full">
                {category.count}
              </span>
            </Link>
          ))}
        </nav>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-2">最近文章</h3>
        <nav className="space-y-1">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/posts/${post.slug}`}
              className={cn(
                "block py-2 px-3 text-sm rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === `/posts/${post.slug}`
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              {post.title}
            </Link>
          ))}
        </nav>
      </div>
    </aside>
  );
}
