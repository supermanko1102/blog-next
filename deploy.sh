#!/bin/bash
# 部署腳本，將 Next.js 靜態網站部署到 GitHub Pages

# 確保腳本在錯誤時停止執行
set -e

# 清除先前的構建
rm -rf out
rm -rf .next

# 構建靜態站點
echo "Starting build process..."
npm run build

# 進入輸出目錄
cd out

# 新增一個 .nojekyll 文件，避免 GitHub Pages 使用 Jekyll 處理
touch .nojekyll

# 如果需要自定義域名，可以添加 CNAME 文件
# echo "your-custom-domain.com" > CNAME

# 初始化 Git 並提交
git init
git add .
git commit -m "Deploy to GitHub Pages"

# 推送到 gh-pages 分支
# 注意：將 USER/REPO 替換為您的 GitHub 用戶名和倉庫名
echo "Pushing to GitHub Pages..."
git push -f git@github.com:USER/webpack-blog-next.git master:gh-pages

cd ..
echo "Deployment complete!" 