"use client";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import FuzzyText from "@/components/FuzzyText/FuzzyText";

export default function NotFound() {
  const [glitchIntensity, setGlitchIntensity] = useState(0.3);
  const [stars, setStars] = useState<
    Array<{ x: number; y: number; size: number; opacity: number }>
  >([]);
  const [comets, setComets] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      tail: number;
      angle: number;
    }>
  >([]);
  const [blackHolePulse, setBlackHolePulse] = useState(0);
  const [satellite, setSatellite] = useState({ x: -10, y: 30, direction: 1 });
  const [asteroids, setAsteroids] = useState<
    Array<{
      x: number;
      y: number;
      size: number;
      rotation: number;
      speed: number;
    }>
  >([]);
  const [galaxyRotation, setGalaxyRotation] = useState(0);
  const [blackHoleRotation, setBlackHoleRotation] = useState(0);
  const [particlePositions, setParticlePositions] = useState<
    Array<{ x: number; y: number; speed: number; angle: number; size: number }>
  >([]);

  const mainContainerRef = useRef<HTMLDivElement>(null);
  const cosmosRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLDivElement>(null);
  const blackHoleRef = useRef<HTMLDivElement>(null);

  // 生成星空背景和宇宙元素
  useEffect(() => {
    // 星星效果
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 150; i++) {
        newStars.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.7 + 0.3,
        });
      }
      setStars(newStars);
    };

    // 黑洞粒子效果
    const generateParticles = () => {
      const particles = [];
      for (let i = 0; i < 50; i++) {
        particles.push({
          x: 50 + (Math.random() * 50 - 25), // 初始位置 - 围繞中心点
          y: 50 + (Math.random() * 50 - 25),
          speed: Math.random() * 0.5 + 0.1,
          angle: Math.random() * 360,
          size: Math.random() * 3 + 1,
        });
      }
      setParticlePositions(particles);
    };

    // 彗星效果
    const generateComets = () => {
      const newComets = [];
      for (let i = 0; i < 5; i++) {
        newComets.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 3 + 2,
          speed: Math.random() * 0.3 + 0.1,
          tail: Math.random() * 80 + 50,
          angle: Math.random() * 360,
        });
      }
      setComets(newComets);
    };

    // 小行星效果
    const generateAsteroids = () => {
      const newAsteroids = [];
      for (let i = 0; i < 12; i++) {
        newAsteroids.push({
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 5 + 3,
          rotation: Math.random() * 360,
          speed: Math.random() * 0.2 + 0.05,
        });
      }
      setAsteroids(newAsteroids);
    };

    generateStars();
    generateComets();
    generateAsteroids();
    generateParticles();

    // 銀河系旋轉
    const galaxyInterval = setInterval(() => {
      setGalaxyRotation((prev) => (prev + 0.1) % 360);
    }, 100);

    // 黑洞旋轉
    const blackHoleRotationInterval = setInterval(() => {
      setBlackHoleRotation((prev) => (prev + 0.3) % 360);
    }, 40);

    // 黑洞脈動效果
    const blackHoleInterval = setInterval(() => {
      setBlackHolePulse((prev) => (prev + 1) % 100);
    }, 50);

    // 粒子移動
    const particleInterval = setInterval(() => {
      setParticlePositions((prev) =>
        prev.map((particle) => {
          // 移動向黑洞中心的方向
          const distanceX = 50 - particle.x;
          const distanceY = 50 - particle.y;
          const distance = Math.sqrt(
            distanceX * distanceX + distanceY * distanceY
          );

          // 漸進加速，越接近中心速度越快
          const accelerationFactor = Math.max(0.1, 1 - distance / 50);
          const speedMultiplier = 1 + accelerationFactor * 2;

          let newX =
            particle.x +
            (distanceX / distance) * particle.speed * speedMultiplier;
          let newY =
            particle.y +
            (distanceY / distance) * particle.speed * speedMultiplier;

          // 如果粒子太接近中心，重設到外圍
          if (distance < 5) {
            const randomAngle = Math.random() * Math.PI * 2;
            const randomDistance = 25 + Math.random() * 25;
            newX = 50 + Math.cos(randomAngle) * randomDistance;
            newY = 50 + Math.sin(randomAngle) * randomDistance;
          }

          return {
            ...particle,
            x: newX,
            y: newY,
          };
        })
      );
    }, 50);

    // 衛星移動
    const satelliteInterval = setInterval(() => {
      setSatellite((prev) => {
        let newX = prev.x + 0.2 * prev.direction;
        let direction = prev.direction;

        if (newX > 110) {
          direction = -1;
          newX = 110;
        } else if (newX < -10) {
          direction = 1;
          newX = -10;
        }

        return {
          ...prev,
          x: newX,
          direction,
        };
      });
    }, 40);

    // 彗星移動
    const cometInterval = setInterval(() => {
      setComets((prev) =>
        prev.map((comet) => {
          const newX =
            comet.x + Math.cos((comet.angle * Math.PI) / 180) * comet.speed;
          const newY =
            comet.y + Math.sin((comet.angle * Math.PI) / 180) * comet.speed;

          // 如果彗星離開視窗，重新設定位置
          if (newX > 120 || newX < -20 || newY > 120 || newY < -20) {
            return {
              ...comet,
              x: Math.random() * 100,
              y: -10,
              angle: Math.random() * 60 + 30,
            };
          }

          return {
            ...comet,
            x: newX,
            y: newY,
          };
        })
      );
    }, 50);

    // 小行星移動
    const asteroidInterval = setInterval(() => {
      setAsteroids((prev) =>
        prev.map((asteroid) => {
          const newX = asteroid.x + asteroid.speed * 0.5;
          const newRotation = asteroid.rotation + asteroid.speed * 3;

          if (newX > 120) {
            return {
              ...asteroid,
              x: -10,
              y: Math.random() * 100,
            };
          }

          return {
            ...asteroid,
            x: newX,
            rotation: newRotation % 360,
          };
        })
      );
    }, 60);

    return () => {
      clearInterval(galaxyInterval);
      clearInterval(blackHoleInterval);
      clearInterval(blackHoleRotationInterval);
      clearInterval(particleInterval);
      clearInterval(satelliteInterval);
      clearInterval(cometInterval);
      clearInterval(asteroidInterval);
    };
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

        // 更宇宙感的聲音
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(180, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          350,
          audioContext.currentTime + 0.2
        );
        oscillator.frequency.exponentialRampToValueAtTime(
          80,
          audioContext.currentTime + 0.5
        );

        filter.type = "lowpass";
        filter.frequency.value = 800;

        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.warn("無法播放音效:", error);
      }
    }
  };

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden font-mono"
      style={{
        background: "#000000",
        color: "#8BE8FD",
      }}
    >
      {/* 宇宙星空背景 */}
      <div
        ref={cosmosRef}
        className="absolute inset-0"
        style={{ backgroundColor: "#000000" }}
      >
        {/* 遙遠的銀河系 */}
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            top: "60%",
            left: "15%",
            background:
              "radial-gradient(ellipse at center, rgba(255,255,255,0.2) 0%, rgba(170,140,240,0.2) 25%, rgba(80,30,120,0.1) 60%, transparent 70%)",
            transform: `rotate(${galaxyRotation}deg)`,
            boxShadow: "0 0 100px rgba(170,140,240,0.4)",
            overflow: "hidden",
          }}
        >
          <div
            className="absolute w-full h-full"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 30%, rgba(255,255,255,0.05) 45%, transparent 70%), linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)",
              transform: `rotate(${-galaxyRotation * 2}deg)`,
            }}
          ></div>
        </div>

        {/* 彩色星雲 */}
        <div
          ref={nebulaRef}
          className="absolute inset-0 opacity-25"
          style={{
            background: `
              radial-gradient(circle at 30% 20%, rgba(147, 51, 234, 0.4), transparent 25%),
              radial-gradient(circle at 70% 60%, rgba(59, 130, 246, 0.4), transparent 25%),
              radial-gradient(circle at 20% 70%, rgba(236, 72, 153, 0.4), transparent 30%)
            `,
          }}
        ></div>

        {/* 黑洞效果 */}
        <div ref={blackHoleRef} className="relative mb-12 w-80 h-80">
          {/* 外部光環 */}
          <div
            className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${blackHoleRotation}deg)`,
              background: `
                radial-gradient(ellipse at center, rgba(139, 232, 253, 0.01) 0%, rgba(139, 232, 253, 0.2) 50%, rgba(102, 51, 153, 0.3) 70%, transparent 100%)
              `,
              boxShadow: "0 0 40px rgba(139, 232, 253, 0.3)",
              animation: "cosmic-pulse 8s infinite ease-in-out",
            }}
          ></div>

          {/* 吸積盤 */}
          <div
            className="absolute top-1/2 left-1/2 w-60 h-60 rounded-full overflow-hidden"
            style={{
              transform: `translate(-50%, -50%) rotate(${
                -blackHoleRotation * 0.7
              }deg)`,
              background:
                "linear-gradient(45deg, rgba(139, 232, 253, 0.03), rgba(138, 43, 226, 0.08), rgba(59, 130, 246, 0.05))",
              boxShadow: "inset 0 0 20px rgba(139, 232, 253, 0.2)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  radial-gradient(ellipse at center, transparent 30%, rgba(59, 130, 246, 0.05) 40%, rgba(138, 43, 226, 0.1) 60%, transparent 100%),
                  linear-gradient(45deg, transparent 40%, rgba(139, 232, 253, 0.1) 50%, transparent 60%)
                `,
                transform: `rotate(${blackHoleRotation * 0.3}deg)`,
              }}
            ></div>
          </div>

          {/* 事件視界 */}
          <div
            className="absolute top-1/2 left-1/2 w-32 h-32 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
              background: "black",
              boxShadow: `0 0 ${
                30 + blackHolePulse / 8
              }px rgba(0, 0, 0, 0.9), inset 0 0 10px rgba(139, 232, 253, 0.1)`,
            }}
          ></div>

          {/* 中央藍光閃爍 */}
          <div
            className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full"
            style={{
              transform: "translate(-50%, -50%)",
              background: "rgba(139, 232, 253, 0.8)",
              boxShadow:
                "0 0 20px rgba(139, 232, 253, 0.8), 0 0 40px rgba(139, 232, 253, 0.4)",
              opacity: 0.7 + Math.sin(blackHolePulse / 10) * 0.3,
            }}
          ></div>

          {/* 引力透鏡效果 - 扭曲的光線 */}
          <div
            className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full"
            style={{
              transform: `translate(-50%, -50%) rotate(${
                blackHoleRotation * 0.5
              }deg)`,
              boxShadow: "inset 0 0 10px rgba(255, 255, 255, 0.2)",
              overflow: "hidden",
              opacity: 0.3,
            }}
          >
            <div
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#8BE8FD] to-transparent"
              style={{
                top: "30%",
                transform: `rotate(${blackHoleRotation * 0.2}deg)`,
              }}
            ></div>
            <div
              className="absolute w-full h-1 bg-gradient-to-r from-transparent via-[#8BE8FD] to-transparent"
              style={{
                top: "70%",
                transform: `rotate(${-blackHoleRotation * 0.3}deg)`,
              }}
            ></div>
            <div
              className="absolute h-full w-1 bg-gradient-to-b from-transparent via-[#8BE8FD] to-transparent"
              style={{
                left: "45%",
                transform: `rotate(${blackHoleRotation * 0.1}deg)`,
              }}
            ></div>
          </div>

          {/* 被吸入的粒子 */}
          {particlePositions.map((particle, index) => (
            <div
              key={`particle-${index}`}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor:
                  index % 3 === 0
                    ? "rgba(139, 232, 253, 0.9)"
                    : index % 2 === 0
                    ? "rgba(147, 51, 234, 0.9)"
                    : "rgba(255, 255, 255, 0.9)",
                boxShadow: `0 0 ${particle.size * 2}px ${
                  index % 3 === 0
                    ? "rgba(139, 232, 253, 0.8)"
                    : index % 2 === 0
                    ? "rgba(147, 51, 234, 0.8)"
                    : "rgba(255, 255, 255, 0.8)"
                }`,
                zIndex:
                  particle.x < 40 ||
                  particle.x > 60 ||
                  particle.y < 40 ||
                  particle.y > 60
                    ? 1
                    : -1,
                opacity: Math.min(
                  1,
                  1.5 -
                    Math.sqrt(
                      Math.pow(50 - particle.x, 2) +
                        Math.pow(50 - particle.y, 2)
                    ) /
                      30
                ),
              }}
            />
          ))}

          {/* 文字說明 */}
          <div className="absolute -bottom-10 left-0 w-full text-center">
            <span className="text-[#8BE8FD] text-lg tracking-wider">
              維度異常：時空扭曲
            </span>
          </div>
        </div>

        {/* 小行星帶 */}
        {asteroids.map((asteroid, index) => (
          <div
            key={`asteroid-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${asteroid.x}%`,
              top: `${asteroid.y}%`,
              width: `${asteroid.size}px`,
              height: `${asteroid.size * 0.8}px`,
              backgroundColor:
                index % 3 === 0
                  ? "rgba(160, 160, 160, 0.7)"
                  : index % 2 === 0
                  ? "rgba(120, 120, 120, 0.7)"
                  : "rgba(100, 100, 100, 0.7)",
              transform: `rotate(${asteroid.rotation}deg)`,
              boxShadow: "0 0 3px rgba(255,255,255,0.3)",
            }}
          >
            {index % 4 === 0 && (
              <div
                className="absolute rounded-full"
                style={{
                  width: "30%",
                  height: "30%",
                  top: "20%",
                  left: "20%",
                  backgroundColor: "rgba(80, 80, 80, 0.8)",
                }}
              ></div>
            )}
          </div>
        ))}

        {/* 衛星 */}
        <div
          className="absolute w-10 h-4"
          style={{
            top: `${satellite.y}%`,
            left: `${satellite.x}%`,
            transform: `rotate(${satellite.direction > 0 ? 45 : -45}deg)`,
            background: "linear-gradient(to right, #718096, #CBD5E0)",
            boxShadow: "0 0 10px rgba(255, 255, 255, 0.7)",
            borderRadius: "40% 40% 20% 20%",
            zIndex: 10,
          }}
        >
          <div className="absolute top-1/2 left-1/2 w-5 h-3 bg-gray-600 transform -translate-x-1/2 -translate-y-1/2 rounded-full"></div>
          <div className="absolute -top-3 left-1/2 w-6 h-1 bg-blue-400 transform -translate-x-1/2 rounded-sm"></div>
        </div>

        {/* 彗星 */}
        {comets.map((comet, index) => (
          <div
            key={`comet-${index}`}
            className="absolute"
            style={{
              left: `${comet.x}%`,
              top: `${comet.y}%`,
              width: `${comet.size}px`,
              height: `${comet.size}px`,
              background: "rgba(255, 255, 255, 0.9)",
              boxShadow: "0 0 10px rgba(255, 255, 255, 0.9)",
              borderRadius: "50%",
              zIndex: 5,
            }}
          >
            <div
              style={{
                position: "absolute",
                width: `${comet.tail}px`,
                height: "2px",
                transformOrigin: "left center",
                transform: `rotate(${comet.angle + 180}deg)`,
                background:
                  "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))",
                filter: "blur(1px)",
                left: 0,
                top: "50%",
                marginTop: "-1px",
              }}
            ></div>
          </div>
        ))}

        {/* 恆星 */}
        {stars.map((star, index) => (
          <div
            key={`star-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor:
                index % 20 === 0
                  ? "rgba(255, 204, 102, 0.9)" // 黃色恆星
                  : index % 15 === 0
                  ? "rgba(102, 204, 255, 0.9)" // 藍色恆星
                  : index % 10 === 0
                  ? "rgba(255, 102, 102, 0.9)" // 紅色恆星
                  : `rgba(255, 255, 255, ${Math.min(star.opacity * 1.2, 1)})`, // 白色恆星
              boxShadow: `0 0 ${star.size * 2.5}px ${
                index % 20 === 0
                  ? "rgba(255, 204, 102, 0.9)"
                  : index % 15 === 0
                  ? "rgba(102, 204, 255, 0.9)"
                  : index % 10 === 0
                  ? "rgba(255, 102, 102, 0.9)"
                  : "rgba(255, 255, 255, 0.9)"
              }`,
              animation:
                index % 7 === 0 ? "twinkle 4s infinite ease-in-out" : "",
            }}
          />
        ))}
      </div>

      {/* 星際浮游塵埃 */}
      <div className="absolute inset-0 bg-noise opacity-5"></div>

      {/* 404主體內容 */}
      <div
        ref={mainContainerRef}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4"
      >
        {/* 404數字效果 */}
        <div
          className="mb-8 glitch-container"
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
            color="#8BE8FD"
          >
            404
          </FuzzyText>
        </div>

        {/* 返回按鈕 */}
        <div className="cosmic-button-container mt-6">
          <Link
            href="/"
            className="cosmic-button"
            onClick={playTechSound}
            style={{
              background:
                "linear-gradient(to right, rgba(139, 232, 253, 0.15), rgba(139, 232, 253, 0.25), rgba(139, 232, 253, 0.15))",
              border: "1px solid rgba(139, 232, 253, 0.4)",
              boxShadow: "0 0 20px rgba(139, 232, 253, 0.3)",
              padding: "12px 24px",
              borderRadius: "4px",
              color: "#8BE8FD",
              textShadow: "0 0 5px rgba(139, 232, 253, 0.7)",
            }}
          >
            <span className="cosmic-button-text">返回首頁</span>
          </Link>
        </div>
      </div>

      {/* 底部裝飾元素 */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#8BE8FD]/70 to-transparent"></div>
      <div className="absolute bottom-4 left-0 w-full text-center text-xs text-[#8BE8FD]/70">
        COSMOS // SECTION-ε // ZONE-404
      </div>

      {/* 添加新動畫的樣式 */}
      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.8;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes cosmic-pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.8;
          }
          50% {
            transform: scale(1.05);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
