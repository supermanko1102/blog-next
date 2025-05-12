import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-xl font-bold mb-4 block">
              前端學習筆記
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              記錄前端技術學習過程中的心得與技巧，包含
              JavaScript、React、Webpack 等主題
            </p>
          </div>
          <div>
            <h3 className="font-medium mb-4">導航</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  首頁
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  文章
                </Link>
              </li>
              <li>
                <Link
                  href="/categories"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  分類
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  關於
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-4">社交媒體</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="https://github.com/supermanko1102"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 text-muted-foreground text-sm hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} 前端學習筆記. 版權所有.
          </p>
        </div>
      </div>
    </footer>
  );
}
