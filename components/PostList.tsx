import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { type PostMeta } from "@/lib/posts";
import { formatDate, getCategoryTitle } from "@/lib/utils";

type PostListProps = {
  posts: PostMeta[];
  showCategory?: boolean;
};

export function PostList({ posts, showCategory = true }: PostListProps) {
  // 按日期對文章進行分組
  const postsByYear = posts.reduce((acc: Record<string, PostMeta[]>, post) => {
    const year = new Date(post.date).getFullYear().toString();
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {});

  // 獲取年份並排序
  const years = Object.keys(postsByYear).sort(
    (a, b) => parseInt(b) - parseInt(a)
  );

  return (
    <section>
      {years.map((year) => (
        <div key={year} className="mb-10">
          <h2 className="text-2xl font-bold mb-4">{year} 年</h2>
          <ul className="space-y-5">
            {postsByYear[year].map((post) => (
              <li key={post.slug} className="border-b pb-5">
                <article>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-xl font-semibold">
                      <Link
                        href={`/blog/${post.category}/${post.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {formatDate(post.date)}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-muted-foreground text-sm mt-2">
                    <Link
                      href={`/blog/${post.category}/${post.slug}`}
                      className="text-primary hover:underline inline-flex items-center"
                    >
                      閱讀全文
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-1 h-3 w-3"
                      >
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                      </svg>
                    </Link>

                    {showCategory && (
                      <Badge
                        variant="secondary"
                        className="hover:bg-secondary/80 cursor-pointer"
                      >
                        <Link href={`/blog/${post.category}`}>
                          {getCategoryTitle(post.category)}
                        </Link>
                      </Badge>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {posts.length === 0 && (
        <section className="flex flex-col items-center justify-center py-16 text-center">
          <h2 className="text-2xl font-bold mb-4">目前還沒有文章</h2>
          <p className="text-muted-foreground">
            我們正在努力創作更多內容，敬請期待...
          </p>
        </section>
      )}
    </section>
  );
}
