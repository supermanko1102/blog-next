---
title: How Browser work
date: 2025-05-29
slug: Browser Work
category: frontend
---

# 瀏覽器工作原理

影響 Web 效能的主要因素有兩個：

## 1. 網路延遲 (Network Latency)

### 什麼是網路延遲？

網路延遲是指從發送請求到接收回應所需的時間。一般來說：

- 良好的延遲：< 100ms
- 可接受的延遲：100-300ms
- 較差的延遲：> 300ms

### 延遲的組成

- DNS 查詢：20-120ms
- TCP 連接：20-100ms
- SSL 握手：50-200ms
- 資料傳輸：依檔案大小而定

### 優化方法

- 使用 CDN 減少地理距離
- 壓縮資源檔案
- 實施快取策略
- 減少 HTTP 請求

## 2. 瀏覽器單線程阻塞

大部分情況下，由於單線程的關係，瀏覽器必須等待上一個任務完成才能執行下一個任務，這會導致渲染卡頓。為了提升用戶體驗，確保單線程能夠完成任務並始終能處理用戶交互是至關重要的。

## 從 URL 輸入到 DOM 樹建立的完整流程

### 第一階段：網路請求階段

#### 1. URL 解析與 DNS 查詢

當用戶在瀏覽器輸入 URL 後：

**URL 解析**：瀏覽器解析 URL 的各個部分

- 協議 (http/https)
- 域名 (www.example.com)
- 路徑 (/page)
- 查詢參數 (?id=123)

**DNS 查詢**：將域名轉換為 IP 地址

- 檢查瀏覽器快取
- 檢查作業系統快取
- 查詢 DNS 伺服器
- 獲得目標伺服器的 IP 地址

#### 2. 建立連接

**TCP 三次握手**：與伺服器建立可靠連接

- 客戶端發送 SYN
- 伺服器回應 SYN-ACK
- 客戶端發送 ACK

**SSL/TLS 握手**（如果是 HTTPS）

- 交換憑證
- 協商加密方式
- 建立安全連接

#### 3. HTTP 請求與回應

**發送 HTTP 請求**

```
GET /index.html HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0...
Accept: text/html,application/xhtml+xml...
```

**伺服器處理請求**

- 解析請求
- 查找資源
- 生成回應

**接收 HTTP 回應**

```
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: 1234

<!DOCTYPE html>
<html>...
```

### 第二階段：瀏覽器渲染階段

#### 4. 關鍵渲染路徑 (Critical Rendering Path)

**HTML 解析**

- 瀏覽器開始解析 HTML
- 建立 DOM 樹 (Document Object Model)
- 遇到外部資源時發送額外請求

**CSS 解析**

- 解析 CSS 檔案
- 建立 CSSOM 樹 (CSS Object Model)
- CSS 是渲染阻塞的，必須完全解析後才能繼續

**JavaScript 執行**

- 下載並執行 JavaScript
- JavaScript 預設是解析器阻塞的
- 可能會修改 DOM 或 CSSOM

#### 5. 渲染樹建立與繪製

**渲染樹建立**

- 結合 DOM 樹和 CSSOM 樹
- 建立渲染樹 (Render Tree)
- 只包含可見的元素

**佈局計算 (Layout/Reflow)**

- 計算每個元素的位置和大小
- 將相對測量轉換為絕對像素

**繪製 (Paint)**

- 將像素繪製到螢幕上
- 轉換為實際的像素資料

**合成 (Composite)**

- 將不同圖層合成最終畫面
- 處理重疊元素

## 瀏覽器線程架構

### 主要線程分工

**主線程 (Main Thread)**

- 執行 JavaScript
- 樣式計算
- 佈局計算
- 部分繪製設置

**合成器線程 (Compositor Thread)**

- 處理滾動
- 合成圖層
- GPU 通信

**網路線程**

- 處理網路請求
- 下載資源

**光柵化線程 (Raster Thread)**

- 將繪製指令轉換為像素

### 線程間的協作

```javascript
// 示範瀏覽器渲染流程的簡化模型
class BrowserRenderingPipeline {
  constructor() {
    this.domTree = null;
    this.cssomTree = null;
    this.renderTree = null;
  }

  // 1. 解析 HTML 建立 DOM 樹
  parseHTML(htmlContent) {
    console.log("🔍 開始解析 HTML...");
    this.domTree = this.buildDOMTree(htmlContent);
    console.log("✅ DOM 樹建立完成");
    return this.domTree;
  }

  // 2. 解析 CSS 建立 CSSOM 樹
  parseCSS(cssContent) {
    console.log("🎨 開始解析 CSS...");
    this.cssomTree = this.buildCSSOMTree(cssContent);
    console.log("✅ CSSOM 樹建立完成");
    return this.cssomTree;
  }

  // 3. 建立渲染樹
  buildRenderTree() {
    console.log("🌳 開始建立渲染樹...");
    this.renderTree = this.combineTreesAndFilter(this.domTree, this.cssomTree);
    console.log("✅ 渲染樹建立完成");
    return this.renderTree;
  }

  // 4. 佈局計算
  layout() {
    console.log("📐 開始佈局計算...");
    this.calculatePositionsAndSizes(this.renderTree);
    console.log("✅ 佈局計算完成");
  }

  // 5. 繪製
  paint() {
    console.log("🖌️ 開始繪製...");
    this.paintToScreen(this.renderTree);
    console.log("✅ 繪製完成");
  }

  // 輔助方法
  buildDOMTree(html) {
    // 簡化的 DOM 樹建立邏輯
    return { type: "document", children: [] };
  }

  buildCSSOMTree(css) {
    // 簡化的 CSSOM 樹建立邏輯
    return { rules: [] };
  }

  combineTreesAndFilter(dom, cssom) {
    // 結合 DOM 和 CSSOM，過濾不可見元素
    return { visibleNodes: [] };
  }

  calculatePositionsAndSizes(renderTree) {
    // 計算每個元素的位置和大小
    renderTree.visibleNodes.forEach((node) => {
      node.layout = { x: 0, y: 0, width: 0, height: 0 };
    });
  }

  paintToScreen(renderTree) {
    // 將元素繪製到螢幕
    console.log("繪製", renderTree.visibleNodes.length, "個可見元素");
  }
}
```

## 效能優化策略

### 1. 關鍵渲染路徑優化

**減少阻塞資源**

```html
<!-- 優化前：阻塞渲染 -->
<link rel="stylesheet" href="styles.css" />

<!-- 優化後：非阻塞載入 -->
<link
  rel="stylesheet"
  href="styles.css"
  media="print"
  onload="this.media='all'"
/>
```

**JavaScript 優化**

```html
<!-- 優化前：阻塞解析 -->
<script src="app.js"></script>

<!-- 優化後：非阻塞載入 -->
<script src="app.js" async></script>
<script src="app.js" defer></script>
```

### 2. 避免佈局抖動 (Layout Thrashing)

**錯誤做法**

```javascript
// 會導致多次佈局計算
for (let i = 0; i < elements.length; i++) {
  elements[i].style.left = elements[i].offsetLeft + 10 + "px";
}
```

**正確做法**

```javascript
// 批次處理，減少佈局計算
const positions = [];
// 先讀取所有位置
for (let i = 0; i < elements.length; i++) {
  positions[i] = elements[i].offsetLeft;
}
// 再批次更新
for (let i = 0; i < elements.length; i++) {
  elements[i].style.left = positions[i] + 10 + "px";
}
```

### 3. 使用 CSS 變換優化動畫

**低效能動畫**

```css
/* 會觸發佈局和繪製 */
.element {
  transition: left 0.3s;
}
.element:hover {
  left: 100px;
}
```

**高效能動畫**

```css
/* 只觸發合成 */
.element {
  transition: transform 0.3s;
}
.element:hover {
  transform: translateX(100px);
}
```

## 現代瀏覽器的進階優化

### 1. 圖層合成 (Layer Compositing)

瀏覽器會將某些元素提升到獨立的合成圖層：

```css
/* 觸發圖層提升的屬性 */
.gpu-accelerated {
  transform: translateZ(0); /* 或 translate3d(0,0,0) */
  will-change: transform;
  opacity: 0.99;
}
```

### 2. 增量渲染

瀏覽器不會等待所有資源載入完成才開始渲染：

```html
<!-- 瀏覽器會逐步渲染可用內容 -->
<!DOCTYPE html>
<html>
  <head>
    <title>頁面標題</title>
    <!-- 關鍵 CSS 內聯 -->
    <style>
      body {
        font-family: Arial;
      }
      .header {
        background: blue;
      }
    </style>
  </head>
  <body>
    <header class="header">
      <h1>網站標題</h1>
    </header>
    <!-- 內容會逐步顯示 -->
    <main>...</main>
  </body>
</html>
```

### 3. 預載入優化

```html
<!-- DNS 預解析 -->
<link rel="dns-prefetch" href="//example.com" />

<!-- 預載入關鍵資源 -->
<link rel="preload" href="critical.css" as="style" />
<link rel="preload" href="hero-image.jpg" as="image" />

<!-- 預取下一頁資源 -->
<link rel="prefetch" href="next-page.html" />
```

## 效能測量工具

### 1. 瀏覽器開發者工具

**Performance 面板**

- 記錄渲染時間線
- 分析 FPS 和幀時間
- 識別效能瓶頸

**Network 面板**

- 監控資源載入時間
- 分析關鍵渲染路徑
- 檢查快取效果

### 2. Web Vitals 指標

**Core Web Vitals**

- **LCP (Largest Contentful Paint)**：最大內容繪製時間
- **FID (First Input Delay)**：首次輸入延遲
- **CLS (Cumulative Layout Shift)**：累積佈局偏移

**其他重要指標**

- **FCP (First Contentful Paint)**：首次內容繪製
- **TTI (Time to Interactive)**：可交互時間
- **TTFB (Time to First Byte)**：首位元組時間

## 實際應用建議

### 1. 關鍵資源優先載入

```html
<!-- 關鍵 CSS 內聯 -->
<style>
  /* 首屏關鍵樣式 */
  .hero {
    background: url(hero.jpg);
  }
</style>

<!-- 非關鍵 CSS 延遲載入 -->
<link
  rel="preload"
  href="non-critical.css"
  as="style"
  onload="this.onload=null;this.rel='stylesheet'"
/>
```

### 2. JavaScript 載入策略

```html
<!-- 關鍵 JavaScript -->
<script src="critical.js"></script>

<!-- 非關鍵 JavaScript 延遲載入 -->
<script src="analytics.js" async></script>
<script src="widgets.js" defer></script>
```

### 3. 圖片優化

```html
<!-- 響應式圖片 -->
<picture>
  <source media="(min-width: 800px)" srcset="large.webp" type="image/webp" />
  <source media="(min-width: 800px)" srcset="large.jpg" />
  <source srcset="small.webp" type="image/webp" />
  <img src="small.jpg" alt="描述" loading="lazy" />
</picture>
```

## 總結

瀏覽器的工作原理涉及複雜的渲染管線，從網路請求到最終的像素繪製。理解這個過程有助於：

1. **識別效能瓶頸**：知道哪些操作會觸發昂貴的重新計算
2. **優化載入策略**：合理安排資源載入順序
3. **改善用戶體驗**：減少載入時間和渲染阻塞
4. **編寫高效程式碼**：避免不必要的 DOM 操作和樣式變更

記住，現代 Web 開發的目標是在保持功能完整性的同時，提供流暢、快速的用戶體驗。通過深入理解瀏覽器的工作原理，我們可以做出更明智的技術決策。
