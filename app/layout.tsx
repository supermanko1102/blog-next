import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-TW" suppressHydrationWarning>
      <head>
        <title>前端技術學習筆記</title>
        <meta
          name="description"
          content="記錄前端技術學習過程中的心得與技巧，包含 JavaScript、React、Webpack 等主題"
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body
        className={`${inter.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
            <div className="container flex h-16 items-center">
              <div className="mr-4 flex">
                <Link href="/" className="flex items-center">
                  <svg
                    viewBox="0 0 900 900"
                    className="h-8 w-8 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                  >
                    <path d="M821.146 870.85L571.547 500l249.599-370.85L500 258.193 178.854 29.15 428.453 400 178.854 770.85 500 641.807z" />
                  </svg>
                  <span className="font-bold text-xl">學習筆記</span>
                </Link>
              </div>
              <nav className="ml-auto flex space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/?category=javascript" scroll={false}>
                    JavaScript
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/?category=react" scroll={false}>
                    React
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/?category=webpack" scroll={false}>
                    Webpack
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/about">關於</Link>
                </Button>
              </nav>
            </div>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="border-t py-6 md:py-8">
            <div className="container flex flex-col items-center justify-center gap-4 md:flex-row">
              <p className="text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} 前端技術學習筆記.
                保留所有權利.
              </p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
