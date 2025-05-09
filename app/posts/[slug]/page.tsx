import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Post = {
  title: string;
  date: string;
  contentHtml: string;
};

// 格式化日期的函數
function formatDate(dateString: string | Date): string {
  const date = dateString instanceof Date ? dateString : new Date(dateString);
  return date.toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 新增生成靜態參數的函數
export async function generateStaticParams() {
  const filenames = fs.readdirSync(path.join(process.cwd(), "posts"));
  return filenames.map((filename) => {
    const file = fs.readFileSync(path.join("posts", filename), "utf8");
    const data = matter(file).data;
    return {
      slug: data.slug,
    };
  });
}

// 獲取文章數據的函數
async function getPost(slug: string): Promise<Post> {
  const fullPath = path.join(process.cwd(), "posts", `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");

  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  // 確保日期是字串
  const date = data.date;
  const dateString =
    date instanceof Date ? date.toISOString().split("T")[0] : date.toString();

  return {
    title: data.title,
    date: dateString,
    contentHtml,
  };
}

// 頁面組件
export default async function Post({ params }: { params: { slug: string } }) {
  const { title, date, contentHtml } = await getPost(params.slug);

  return (
    <div className="container max-w-3xl py-10 md:py-16">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="p-0 hover:bg-transparent"
        >
          <Link
            href="/"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
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
              className="mr-1 h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            回到首頁
          </Link>
        </Button>
      </div>

      <article className="prose prose-neutral dark:prose-invert mx-auto">
        <header className="mb-10 not-prose">
          <h1 className="text-4xl font-bold tracking-tight mb-2">{title}</h1>
          <Badge variant="outline" className="font-normal">
            <time dateTime={date}>{formatDate(date)}</time>
          </Badge>
          <Separator className="h-1 w-24 bg-primary mt-8 mb-10" />
        </header>

        <div
          dangerouslySetInnerHTML={{ __html: contentHtml }}
          className="prose-h2:text-2xl prose-h3:text-xl prose-headings:font-semibold prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-primary"
        />
      </article>
    </div>
  );
}
