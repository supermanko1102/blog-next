---
title: Next.js 如何優化瀏覽器效能
date: 2025-05-29
slug: nextjs-browser-optimization
category: frontend
---

# Next.js 如何優化瀏覽器效能

在了解了[瀏覽器工作原理](./browser.md)後，我們來看看 Next.js 這個現代 React 框架如何針對瀏覽器的特性進行深度優化，解決傳統 Web 應用的效能瓶頸。

## 傳統 SPA 的效能問題

### 典型的 React SPA 載入流程

```javascript
// 傳統 Create React App 的載入過程
// 1. 瀏覽器下載幾乎空白的 HTML
// 2. 下載大型 JavaScript bundle
// 3. 執行 JavaScript 建立 DOM 樹
// 4. 用戶才能看到內容

// index.html (傳統 SPA)
<!DOCTYPE html>
<html>
<head>
    <title>我的應用</title>
    <link rel="stylesheet" href="/static/css/main.css">
</head>
<body>
    <div id="root"></div> <!-- 空的容器 -->
    <script src="/static/js/main.js"></script> <!-- 大型 bundle -->
</body>
</html>
```

### 效能問題分析

**關鍵渲染路徑被阻塞：**

- **First Contentful Paint (FCP)** 延遲：用戶需要等待 JavaScript 執行完成
- **Largest Contentful Paint (LCP)** 緩慢：主要內容依賴 JavaScript 渲染
- **Time to Interactive (TTI)** 過長：需要下載並執行完整的 JavaScript

**SEO 和可訪問性問題：**

- 搜索引擎爬蟲看到的是空白頁面
- 網路較慢的用戶體驗極差

## Next.js 的解決方案

### 1. 服務端渲染 (SSR) 優化關鍵渲染路徑

```javascript
// pages/index.js - Next.js SSR 頁面
export default function HomePage({ posts }) {
  return (
    <div>
      <h1>我的部落格</h1>
      <div className="posts">
        {posts.map((post) => (
          <article key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.excerpt}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

// 伺服器端預先渲染
export async function getServerSideProps() {
  // 在伺服器端獲取資料
  const posts = await fetchPosts();

  return {
    props: {
      posts,
    },
  };
}
```

**SSR 帶來的效能提升：**

```html
<!-- Next.js 生成的 HTML（包含完整內容） -->
<!DOCTYPE html>
<html>
  <head>
    <title>我的部落格</title>
    <style>
      /* 關鍵 CSS 內聯 */
    </style>
  </head>
  <body>
    <div id="__next">
      <div>
        <h1>我的部落格</h1>
        <div class="posts">
          <article>
            <h2>第一篇文章</h2>
            <p>這是文章摘要...</p>
          </article>
          <!-- 完整的 HTML 內容 -->
        </div>
      </div>
    </div>
    <script src="/_next/static/chunks/main.js" defer></script>
  </body>
</html>
```

### 2. 自動程式碼分割 (Code Splitting)

```javascript
// Next.js 自動為每個頁面建立獨立的 bundle

// pages/home.js -> home.js bundle
// pages/about.js -> about.js bundle
// pages/contact.js -> contact.js bundle

// 組件級程式碼分割
import dynamic from "next/dynamic";

// 延遲載入重型組件
const HeavyChart = dynamic(() => import("../components/Chart"), {
  loading: () => <div>圖表載入中...</div>,
  ssr: false, // 只在客戶端載入
});

// 條件載入
const AdminPanel = dynamic(() => import("../components/AdminPanel"), {
  loading: () => <div>管理面板載入中...</div>,
});

export default function Dashboard({ user }) {
  return (
    <div>
      <h1>儀表板</h1>
      <HeavyChart />
      {user.isAdmin && <AdminPanel />}
    </div>
  );
}
```

**程式碼分割的效能影響：**

```javascript
// 載入時間比較
// 傳統 SPA: 下載 2MB 的 main.js
// Next.js: 下載 200KB 的頁面特定 bundle

// 網路瀑布圖優化
// 傳統方式：
// HTML (5KB) -> main.js (2MB) -> 渲染開始

// Next.js 方式：
// HTML (50KB, 包含內容) -> 立即渲染
// page.js (200KB) -> 互動功能啟用
// other-pages.js (按需載入)
```

### 3. 智慧預載入策略

```javascript
import Link from "next/link";
import { useRouter } from "next/router";

function Navigation() {
  const router = useRouter();

  return (
    <nav>
      {/* Next.js 自動預載入可見連結的頁面 */}
      <Link href="/products">
        <a>產品頁面</a> {/* 當連結進入視窗時自動預載入 */}
      </Link>

      {/* 手動控制預載入時機 */}
      <button
        onMouseEnter={() => {
          // 滑鼠懸停時預載入
          router.prefetch("/heavy-page");
        }}
        onClick={() => router.push("/heavy-page")}
      >
        重要頁面
      </button>
    </nav>
  );
}

// 程式化預載入
useEffect(() => {
  // 在適當時機預載入關鍵頁面
  if (user.isPremium) {
    router.prefetch("/premium-features");
  }
}, [user]);
```

### 4. 圖片優化與 Lazy Loading

```javascript
import Image from "next/image";

function ProductGallery({ products }) {
  return (
    <div className="gallery">
      {/* 首屏關鍵圖片 */}
      <Image
        src="/hero-image.jpg"
        alt="主要產品圖片"
        width={800}
        height={600}
        priority // 優先載入，不使用 lazy loading
        placeholder="blur"
        blurDataURL="data:image/jpeg;base64,..." // 避免 Layout Shift
      />

      {/* 其他圖片自動 lazy loading */}
      {products.map((product) => (
        <Image
          key={product.id}
          src={product.image}
          alt={product.name}
          width={400}
          height={300}
          loading="lazy" // 預設行為
          placeholder="blur"
        />
      ))}
    </div>
  );
}
```

**Next.js Image 組件的優化：**

```javascript
// 自動優化功能
const imageOptimizations = {
  // 1. 響應式圖片
  srcSet: [
    "/image-400w.webp 400w",
    "/image-800w.webp 800w",
    "/image-1200w.webp 1200w",
  ],

  // 2. 現代格式
  formats: ["image/avif", "image/webp", "image/jpeg"],

  // 3. 自動尺寸調整
  sizes: "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",

  // 4. 延遲載入
  loading: "lazy",

  // 5. 預留空間（避免 CLS）
  aspectRatio: "16/9",
};
```

### 5. CSS 優化策略

```javascript
// next.config.js
module.exports = {
    // 自動 CSS 優化
    experimental: {
        optimizeCss: true, // 內聯關鍵 CSS
    },

    // CSS 模組化
    cssModules: true,
};

// 組件樣式（CSS Modules）
// components/Button.module.css
.button {
    background: blue;
    color: white;
    padding: 10px 20px;
}

// components/Button.js
import styles from './Button.module.css';

export default function Button({ children }) {
    return (
        <button className={styles.button}>
            {children}
        </button>
    );
}
```

**CSS 載入優化結果：**

```html
<!-- 優化後的 HTML 輸出 -->
<head>
  <!-- 關鍵 CSS 內聯 -->
  <style data-next-hide-fouc>
    .button {
      background: blue;
      color: white;
    }
    .header {
      display: flex;
      justify-content: space-between;
    }
  </style>

  <!-- 非關鍵 CSS 延遲載入 -->
  <link
    rel="preload"
    href="/_next/static/css/non-critical.css"
    as="style"
    onload="this.onload=null;this.rel='stylesheet'"
  />
</head>
```

### 6. 靜態生成 (SSG) 的極致優化

```javascript
// pages/blog/[slug].js
export default function BlogPost({ post }) {
  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}

// 建置時預先生成所有頁面
export async function getStaticPaths() {
  const posts = await getAllPosts();
  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return {
    paths,
    fallback: "blocking", // 新文章的增量生成
  };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  return {
    props: { post },
    revalidate: 3600, // ISR: 每小時重新生成
  };
}
```

**SSG 的效能優勢：**

```javascript
// 效能比較
const performanceMetrics = {
  // 傳統 SSR
  ssr: {
    ttfb: "200-500ms", // 每次請求都需要伺服器處理
    fcp: "300-800ms",
    lcp: "500-1200ms",
  },

  // Next.js SSG
  ssg: {
    ttfb: "10-50ms", // 靜態檔案直接從 CDN 提供
    fcp: "100-300ms",
    lcp: "200-500ms",
  },
};
```

## 實際效能提升案例

### 案例 1：電商網站優化

```javascript
// 優化前的傳統 React 應用
const TraditionalApp = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 客戶端獲取資料
    fetchProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>載入中...</div>;

  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

// Next.js 優化後
export default function ProductsPage({ products }) {
  return (
    <div>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const products = await fetchProducts();

  return {
    props: { products },
    revalidate: 300, // 5分鐘重新生成
  };
}
```

**效能提升結果：**

| 指標 | 優化前 | 優化後 | 改善幅度 |
| ---- | ------ | ------ | -------- |
| FCP  | 2.1s   | 0.8s   | 62% ↑    |
| LCP  | 3.5s   | 1.2s   | 66% ↑    |
| TTI  | 4.2s   | 1.5s   | 64% ↑    |
| CLS  | 0.15   | 0.02   | 87% ↑    |

### 案例 2：部落格網站優化

```javascript
// 混合渲染策略
// pages/blog/index.js (SSG - 文章列表)
export async function getStaticProps() {
  const posts = await getAllPosts();
  return {
    props: { posts },
    revalidate: 3600, // 每小時更新
  };
}

// pages/blog/[slug].js (SSG - 文章內容)
export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);
  return {
    props: { post },
    revalidate: 86400, // 每天更新
  };
}

// pages/admin/dashboard.js (SSR - 管理後台)
export async function getServerSideProps({ req }) {
  const user = await getUserFromSession(req);
  if (!user.isAdmin) {
    return { redirect: { destination: "/login" } };
  }

  const stats = await getAdminStats();
  return {
    props: { stats },
  };
}
```

## Web Vitals 監控與優化

```javascript
// pages/_app.js
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function reportWebVitals(metric) {
  // 收集 Web Vitals 數據
  const { name, value, id } = metric;

  // 發送到分析服務
  gtag("event", name, {
    event_category: "Web Vitals",
    event_label: id,
    value: Math.round(name === "CLS" ? value * 1000 : value),
    non_interaction: true,
  });

  // 本地開發時顯示
  if (process.env.NODE_ENV === "development") {
    console.log(`${name}: ${value}`);
  }
}

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

**Web Vitals 優化配置：**

```javascript
// next.config.js
module.exports = {
  // 自動優化配置
  swcMinify: true, // 使用 SWC 進行更快的壓縮

  images: {
    domains: ["example.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 31536000, // 1年快取
  },

  // 實驗性優化
  experimental: {
    modern: true, // 現代瀏覽器優化
    polyfillsOptimization: true, // 智慧 polyfill
    scrollRestoration: true, // 滾動位置恢復
  },

  // 壓縮設定
  compress: true,

  // 快取標頭
  async headers() {
    return [
      {
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};
```

## 進階優化技巧

### 1. 關鍵資源預載入

```javascript
import Head from "next/head";

export default function OptimizedPage() {
  return (
    <>
      <Head>
        {/* DNS 預解析 */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//api.example.com" />

        {/* 關鍵資源預載入 */}
        <link
          rel="preload"
          href="/fonts/main.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/api/critical-data"
          as="fetch"
          crossOrigin=""
        />

        {/* 預取下一頁 */}
        <link rel="prefetch" href="/next-page" />
      </Head>

      <main>{/* 頁面內容 */}</main>
    </>
  );
}
```

### 2. 服務端快取策略

```javascript
// pages/api/posts.js
export default async function handler(req, res) {
  // 設定快取標頭
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");

  const posts = await getPosts();
  res.json(posts);
}

// 使用 SWR 進行客戶端快取
import useSWR from "swr";

function PostsList() {
  const { data: posts, error } = useSWR("/api/posts", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 300000, // 5分鐘重新驗證
  });

  if (error) return <div>載入失敗</div>;
  if (!posts) return <div>載入中...</div>;

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
```

### 3. 邊緣運算優化

```javascript
// middleware.js - Edge Runtime
import { NextResponse } from "next/server";

export function middleware(request) {
  // 在邊緣節點執行邏輯
  const country = request.geo?.country || "US";
  const response = NextResponse.next();

  // 根據地理位置優化
  if (country === "TW") {
    response.headers.set("x-cdn-region", "asia");
  }

  return response;
}

export const config = {
  matcher: ["/api/:path*", "/products/:path*"],
};
```

## 總結：Next.js 的效能優勢

### 自動化優化

Next.js 將複雜的瀏覽器優化技術自動化：

1. **關鍵渲染路徑優化**：自動內聯關鍵 CSS，延遲載入非關鍵資源
2. **程式碼分割**：自動為每個頁面和組件建立最佳的 bundle
3. **圖片優化**：自動格式轉換、尺寸調整、lazy loading
4. **預載入策略**：智慧預載入可能需要的資源

### 開發者體驗

```javascript
// 開發者只需要專注於業務邏輯
export default function MyPage({ data }) {
  return (
    <div>
      <h1>{data.title}</h1>
      <Image src={data.image} alt={data.title} width={800} height={600} />
    </div>
  );
}

// Next.js 自動處理：
// ✅ SSR/SSG 渲染
// ✅ 程式碼分割
// ✅ 圖片優化
// ✅ CSS 優化
// ✅ 快取策略
// ✅ Web Vitals 優化
```

### 實際效能提升

使用 Next.js 的典型效能改善：

- **首次內容繪製 (FCP)**：改善 50-70%
- **最大內容繪製 (LCP)**：改善 60-80%
- **可互動時間 (TTI)**：改善 40-60%
- **累積佈局偏移 (CLS)**：改善 80-90%

Next.js 不只是一個 React 框架，更是一個針對現代瀏覽器特性深度優化的效能平台。它讓開發者能夠輕鬆建立高效能的 Web 應用，而不需要深入了解複雜的瀏覽器優化技術。

通過理解瀏覽器工作原理和 Next.js 的優化策略，我們可以建立更快、更好的 Web 體驗。
