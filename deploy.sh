#!/bin/bash
# 部署腳本，將 Next.js 靜態網站部署到 GitHub Pages

# 確保腳本在錯誤時停止執行
set -e

# 建置專案
echo "Building project..."
npm run build

# 部署到 GitHub Pages
echo "Deploying to GitHub Pages..."
npx gh-pages -d out

echo "Deployment completed!" 