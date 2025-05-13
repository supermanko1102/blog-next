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

interface CategorySidebarProps {
  posts: Post[];
  currentCategory: string;
  className?: string;
}

export function CategorySidebar({
  posts,
  currentCategory,
  className,
}: CategorySidebarProps) {
  const pathname = usePathname();

  // 篩選出當前分類下的所有文章
  const filteredPosts = posts.filter(
    (post) => post.category.toLowerCase() === currentCategory.toLowerCase()
  );

  return (
    <aside className={cn("w-64 shrink-0 border-r h-full py-6 px-4", className)}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold capitalize mb-2">
          {currentCategory}
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          {filteredPosts.length} 篇相關文章
        </p>
      </div>
      <nav className="space-y-1">
        {filteredPosts.map((post) => (
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
    </aside>
  );
}
