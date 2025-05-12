import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="space-y-5">
        {/* 404數字動畫效果 */}
        <h1 className="text-9xl font-extrabold tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse">
          404
        </h1>

        {/* 主標題 */}
        <h2 className="text-3xl md:text-4xl font-bold mt-8 mb-4">
          糟糕！頁面迷路了
        </h2>

        {/* 副標題 */}
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          看起來你正在尋找的頁面已經消失在數位宇宙中，或者它從未存在過。
        </p>

        {/* 返回首頁按鈕 */}
        <div className="mt-8">
          <Link
            href="/"
            className={buttonVariants({
              size: "lg",
              className:
                "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white",
            })}
          >
            返回首頁
          </Link>
        </div>

        {/* 有趣的404動畫 */}
        <div className="mt-16 max-w-md mx-auto">
          <div className="w-full h-24 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center relative overflow-hidden">
            <div className="absolute w-8 h-8 bg-purple-500 rounded-full left-0 animate-bounce-horizontal"></div>
            <p className="text-muted-foreground">正在搜尋您的頁面...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
