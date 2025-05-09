import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getAllCategories } from "@/lib/posts";
import { getCategoryTitle } from "@/lib/utils";

type CategoryFilterProps = {
  currentCategory?: string;
};

export function CategoryFilter({ currentCategory }: CategoryFilterProps) {
  const categories = getAllCategories();

  return (
    <section className="mb-10">
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={!currentCategory ? "default" : "outline"}
          className="cursor-pointer px-3 py-1 text-sm"
        >
          <Link href="/blog" className="w-full h-full block">
            全部
          </Link>
        </Badge>

        {categories.map((category) => (
          <Badge
            key={category}
            variant={currentCategory === category ? "default" : "outline"}
            className="cursor-pointer px-3 py-1 text-sm"
          >
            <Link href={`/blog/${category}`} className="w-full h-full block">
              {getCategoryTitle(category)}
            </Link>
          </Badge>
        ))}
      </div>
    </section>
  );
}
