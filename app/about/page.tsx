import { Separator } from "@/components/ui/separator";

export default function AboutPage() {
  return (
    <div className="container py-10 md:py-16 max-w-3xl mx-auto">
      <section className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">關於本站</h1>
        <p className="text-lg text-muted-foreground mb-6">
          前端技術學習筆記與心得分享
        </p>
        <Separator className="w-32 bg-primary h-0.5 my-6" />
      </section>

      <article className="prose prose-neutral dark:prose-invert mx-auto">
        <p>
          歡迎來到我的前端技術學習筆記！這個網站是我記錄自己在前端開發旅程中的所見所學、踩過的坑和解決方案的地方。
        </p>

        <h2>內容涵蓋</h2>
        <p>本站主要關注以下幾個領域的前端技術：</p>
        <ul>
          <li>
            <strong>JavaScript</strong> - 核心語言特性、ES6+、異步編程
          </li>
          <li>
            <strong>TypeScript</strong> - 類型系統、配置、最佳實踐
          </li>
          <li>
            <strong>React</strong> - 組件設計、狀態管理、性能優化
          </li>
          <li>
            <strong>Webpack</strong> - 配置、優化、擴展
          </li>
          <li>
            <strong>CSS</strong> - 現代布局技術、動畫、響應式設計
          </li>
        </ul>

        <h2>學習理念</h2>
        <p>
          我堅信，最好的學習方式是通過實踐和分享。當我嘗試解釋一個概念時，我自己對它的理解也會更加深入。這個部落格不僅是我的知識庫，也是我思考和成長的過程記錄。
        </p>

        <h2>更新頻率</h2>
        <p>看要不要面試XD</p>

        <h2>聯繫方式</h2>
        <p>如果你有任何問題、建議或者想法，歡迎通過以下方式聯繫我：</p>
        <ul>
          <li>Email: example@example.com</li>
          <li>
            GitHub:
            <a
              href="https://github.com/supermanko1102"
              target="_blank"
              rel="noopener noreferrer"
            >
              supermanko1102
            </a>
          </li>
        </ul>

        <p className="text-sm text-muted-foreground mt-12 italic">
          最後更新時間：
          {new Date().toLocaleDateString("zh-TW", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </article>
    </div>
  );
}
