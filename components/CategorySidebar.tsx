"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRight, FolderIcon } from "lucide-react";

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
    <aside
      className={cn(
        "h-screen py-8 px-6 flex flex-col overflow-hidden bg-muted/30 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FolderIcon className="h-5 w-5 text-primary" />
          <h3 className="text-xl font-bold capitalize text-primary">
            {currentCategory}
          </h3>
        </div>
        <div className="h-0.5 w-16 bg-primary/50 rounded-full mb-4"></div>
        <p className="text-sm text-muted-foreground">
          {filteredPosts.length} 篇相關文章
        </p>
      </div>

      <nav className="flex-1 overflow-y-auto pr-2 space-y-1.5">
        {filteredPosts.map((post) => {
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
    </aside>
  );
}
