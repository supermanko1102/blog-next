"use client";

import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface FeaturedPostCardProps {
  title: string;
  excerpt: string;
  date: string;
  category: string;
  slug: string;
}

export function FeaturedPostCard({
  title,
  excerpt,
  date,
  category,
  slug,
}: FeaturedPostCardProps) {
  return (
    <Link href={`/posts/${slug}`} className="group">
      <div className="bg-card rounded-lg overflow-hidden border shadow-sm h-full flex flex-col transition-all hover:shadow-md">
        <div className="p-6 flex-1">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{date}</span>
            </div>
            <Separator orientation="vertical" className="h-3" />
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="capitalize">{category}</span>
            </div>
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-3">
            {excerpt}
          </p>
        </div>
        <div className="px-6 pb-6 mt-auto">
          <span className="text-sm font-medium text-primary flex items-center">
            閱讀全文 <ArrowRight className="ml-1 h-3 w-3" />
          </span>
        </div>
      </div>
    </Link>
  );
}
