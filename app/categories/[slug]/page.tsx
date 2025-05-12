import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { FeaturedPostCard } from "@/components/FeaturedPostCard";
import { getPostsByCategory, getAllCategorySlugs } from "@/lib/posts";

//  DON'T REMOVE!!! 為靜態站點生成添加必要的generateStaticParams函數
export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs;
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const posts = await getPostsByCategory(slug);

  if (!posts) {
    notFound();
  }

  const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="mb-8">
        <Link
          href="/"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> 返回首頁
        </Link>
      </div>

      <section className="mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 capitalize">
          {categoryName}
        </h1>

        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <FeaturedPostCard
                key={post.slug}
                title={post.title}
                excerpt={post.excerpt}
                date={post.date}
                category={post.category}
                slug={post.slug}
              />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground py-10 text-center">
            此分類暫無文章
          </p>
        )}
      </section>
    </div>
  );
}
