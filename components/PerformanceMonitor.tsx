// components/PerformanceMonitor.tsx
"use client";


import { usePerformanceMonitor } from "../hooks/usePerformanceMonitor";

export default function PerformanceMonitor() {
  const { fps, memory } = usePerformanceMonitor();
  return (
    <div style={{
      padding: "0.5rem", 
      background: "#222", 
      color: "#6ff", 
      borderRadius: "8px", 
      marginBottom: "1rem", 
      fontSize: "1rem"
    }}>
      <span>FPS: {fps}</span>
      {memory !== null && <span> | Memory: {memory} MB</span>}
    </div>
  );
}
