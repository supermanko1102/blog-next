/** @type {import('next').NextConfig} */

import type { NextConfig } from "next";
import type { Configuration as WebpackConfig } from "webpack";

const isProduction = process.env.NODE_ENV === "production";
const repoName = "webpack-blog-next"; // 替換為您的 GitHub 倉庫名稱

const nextConfig: NextConfig = {
  output: "export", // 產生靜態 HTML 檔案
  distDir: "out", // 輸出目錄設為 'out'

  // 如果部署到 GitHub Pages，設置基本路徑
  basePath: isProduction ? `/${repoName}` : "",
  assetPrefix: isProduction ? `/${repoName}/` : "",

  // 關閉圖片優化，因為 GitHub Pages 不支持
  images: {
    unoptimized: true,
  },

  // 確保生成靜態網頁時包含客戶端路由
  trailingSlash: true,

  // 將 Node.js 原生模塊設為空模塊，使其不在客戶端運行時報錯
  webpack: (config: WebpackConfig, { isServer }: { isServer: boolean }) => {
    if (!isServer) {
      // 設置客戶端打包時模擬 node 原生模組
      config.resolve = config.resolve || {};
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };
    }
    return config;
  },
};

export default nextConfig;
