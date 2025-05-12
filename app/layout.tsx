import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
