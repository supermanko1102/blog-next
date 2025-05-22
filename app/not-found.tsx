"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import FuzzyText from "@/components/FuzzyText/FuzzyText";
import FallingText from "@/components/FallingText/FallingText";

export default function NotFound() {
  const [glitchIntensity, setGlitchIntensity] = useState(0.3);
  const [terminalText, setTerminalText] = useState("");
  const [showTerminal, setShowTerminal] = useState(false);
  const [showError, setShowError] = useState(false);
  const [scanlineOpacity, setScanlineOpacity] = useState(0.5);

  const gridRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);

  // 模擬終端機打字效果
  useEffect(() => {
    const errorMessages = [
      ">> ERROR 404: RESOURCE NOT FOUND",
      ">> SCANNING NETWORK...",
      ">> SEARCHING DATA FRAGMENTS...",
      ">> ATTEMPTING DATA RECOVERY...",
      ">> RECOVERY FAILED",
      ">> DIMENSION ACCESS DENIED",
      ">> SYSTEM RECOMMENDATION: RETURN TO HOME",
    ];

    let currentIndex = 0;
    let charIndex = 0;

    const typeNextChar = () => {
      if (currentIndex >= errorMessages.length) {
        setShowError(true);
        return;
      }

      const currentMessage = errorMessages[currentIndex];

      if (charIndex < currentMessage.length) {
        setTerminalText((prev) => prev + currentMessage.charAt(charIndex));
        charIndex++;
        setTimeout(typeNextChar, 30 + Math.random() * 50);
      } else {
        setTerminalText((prev) => prev + "\n");
        currentIndex++;
        charIndex = 0;
        setTimeout(typeNextChar, 300);
      }
    };

    setTimeout(() => {
      setShowTerminal(true);
      setTimeout(typeNextChar, 500);
    }, 800);

    // 掃描線動畫
    const scanlineInterval = setInterval(() => {
      setScanlineOpacity((prev) => (prev === 0.5 ? 0.7 : 0.5));
    }, 2000);

    return () => clearInterval(scanlineInterval);
  }, []);

  // 網格視差效果
  useEffect(() => {
    if (!gridRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!gridRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      const moveX = (clientX - innerWidth / 2) / 50;
      const moveY = (clientY - innerHeight / 2) / 50;

      gridRef.current.style.transform = `translateX(${moveX}px) translateY(${moveY}px)`;
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // 音頻互動效果
  const playTechSound = () => {
    if (typeof window !== "undefined") {
      try {
        // 類型安全的方式獲取AudioContext
        type AudioContextType = typeof AudioContext;

        // 擴展Window接口，包含標準和前綴屬性
        interface WindowWithAudioContext extends Window {
          AudioContext?: AudioContextType;
          webkitAudioContext?: AudioContextType;
        }

        const win = window as WindowWithAudioContext;
        const AudioContextClass = win.AudioContext || win.webkitAudioContext;

        if (!AudioContextClass) {
          console.warn("瀏覽器不支援AudioContext");
          return;
        }

        const audioContext = new AudioContextClass();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const filter = audioContext.createBiquadFilter();

        // 更科技感的聲音
        oscillator.type = "square";
        oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          440,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          110,
          audioContext.currentTime + 0.2
        );

        filter.type = "lowpass";
        filter.frequency.value = 1000;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.3
        );

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
      } catch (error) {
        console.warn("無法播放音效:", error);
      }
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#050508] text-[#00ffff] font-mono">
      {/* 背景網格 */}
      <div ref={gridRef} className="absolute inset-0 grid-bg"></div>

      {/* 掃描線效果 */}
      <div
        className="absolute inset-0 scanlines pointer-events-none"
        style={{ opacity: scanlineOpacity }}
      ></div>

      {/* 全息投影效果 */}
      <div className="absolute top-0 left-0 w-full h-full hologram-effect"></div>

      {/* 浮動的電路板元素 */}
      <div className="absolute top-1/4 right-1/4 w-40 h-40 circuit-element"></div>
      <div className="absolute bottom-1/4 left-1/4 w-48 h-48 circuit-element-2"></div>
      <div className="absolute top-1/3 left-1/3 w-32 h-32 tech-rings"></div>
      <div className="absolute bottom-1/3 right-1/3 w-44 h-44 tech-rings-2"></div>

      {/* 404主體內容 */}
      <div
        ref={mainContainerRef}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      >
        {/* 404數字效果 */}
        <div
          className="mb-4 glitch-container"
          onClick={() => {
            setGlitchIntensity((prev) => (prev === 0.3 ? 0.8 : 0.3));
            playTechSound();
          }}
        >
          <FuzzyText
            baseIntensity={glitchIntensity}
            hoverIntensity={0.8}
            enableHover={true}
            className="text-[12rem] font-bold tracking-tighter text-transparent bg-clip-text hologram-text cursor-pointer"
          >
            404
          </FuzzyText>

          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="cyber-box w-full -mt-6"></div>
          </div>
        </div>

        {/* 終端機顯示 */}
        <div
          ref={terminalRef}
          className={`terminal-container w-full max-w-xl mb-8 p-4 transition-all duration-1000 ${
            showTerminal
              ? "opacity-100 transform-none"
              : "opacity-0 translate-y-10"
          }`}
        >
          <div className="terminal-header flex items-center justify-between pb-2 mb-2 border-b border-[#00ffff]/30">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <div className="text-xs text-[#00ffff]/70">SYSTEM TERMINAL</div>
            <div className="text-xs text-[#00ffff]/70">v1.0.4</div>
          </div>
          <pre className="text-sm font-mono whitespace-pre-wrap terminal-text">
            {terminalText}
            <span className="terminal-cursor">_</span>
          </pre>
        </div>

        {/* 錯誤消息 */}
        <div
          className={`error-message mb-8 text-center transform transition-all duration-1000 ${
            showError
              ? "opacity-100 transform-none"
              : "opacity-0 translate-y-10"
          }`}
        >
          <FallingText
            text="維度錯誤：目標節點不存在"
            highlightWords={["維度錯誤", "節點"]}
            trigger="auto"
            backgroundColor="transparent"
            wireframes={false}
            gravity={0.5}
            fontSize="1.5rem"
            mouseConstraintStiffness={0.7}
          />
        </div>

        {/* 返回按鈕 */}
        <div
          className={`cyber-button-container mt-6 transform transition-all duration-1000 ${
            showError ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <Link href="/" className="cyber-button" onClick={playTechSound}>
            <span className="cyber-button-text">返回主系統</span>
          </Link>
        </div>
      </div>

      {/* 底部裝飾元素 */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#00ffff]/50 to-transparent"></div>
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-[#00ffff]/50">
        SYSTEM // SECURE-NODE // 2X-987D
      </div>
    </div>
  );
}
