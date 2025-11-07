// hooks/usePerformanceMonitor.ts
"use client";


import { useEffect, useRef, useState } from "react";

export function usePerformanceMonitor() {
  const [fps, setFps] = useState(0);
  const [memory, setMemory] = useState<number | null>(null);
  const lastFrame = useRef(performance.now());
  const frameCount = useRef(0);

  useEffect(() => {
    let running = true;
    function tick() {
      frameCount.current++;
      const now = performance.now();
      if (now - lastFrame.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastFrame.current = now;
        if ((window as any).performance?.memory)
          setMemory(
            Math.round(
              ((window as any).performance.memory.usedJSHeapSize / (1024 * 1024)) * 10
            ) / 10
          );
      }
      if (running) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    return () => {
      running = false;
    };
  }, []);

  return { fps, memory };
}
