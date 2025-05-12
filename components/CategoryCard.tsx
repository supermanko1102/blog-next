"use client";

import Link from "next/link";

export interface CategoryCardProps {
  title: string;
  count: number;
  slug: string;
}

export function CategoryCard({ title, count, slug }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <div className="bg-card rounded-lg border p-4 hover:bg-accent hover:text-accent-foreground transition-colors">
        <h3 className="font-medium">{title}</h3>
        <p className="text-muted-foreground text-sm">{count} 篇文章</p>
      </div>
    </Link>
  );
}
