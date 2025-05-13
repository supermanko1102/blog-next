import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCardProps {
  title: string;
  date: string;
  category: string;
  excerpt: string;
  slug: string;
  className?: string;
}

export function PostCard({
  title,
  date,
  category,
  excerpt,
  slug,
  className,
}: PostCardProps) {
  return (
    <div
      className={cn(
        "group border rounded-lg p-6 transition-colors hover:bg-accent/30",
        className
      )}
    >
      <div className="space-y-2">
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <Link
              href={`/categories/${category}`}
              className="hover:text-primary capitalize transition-colors"
            >
              {category}
            </Link>
          </div>
        </div>
        <Link href={`/posts/${slug}`}>
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {title}
          </h2>
        </Link>
        <p className="text-muted-foreground line-clamp-2">{excerpt}</p>
        <Link
          href={`/posts/${slug}`}
          className="text-sm text-primary font-medium inline-block pt-2 hover:underline"
        >
          閱讀全文
        </Link>
      </div>
    </div>
  );
}
