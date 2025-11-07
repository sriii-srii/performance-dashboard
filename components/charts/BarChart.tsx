"use client";

import React, { useEffect, useRef } from "react";
import { useDataStream } from "../../hooks/useDataStream";
import { DataPoint } from "../../lib/dataGenerator";

export default function BarChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rawData: DataPoint[] = useDataStream(500);
  const bucketSize = 10;
  const barData = Array.from({ length: 50 }, (_, i) =>
    Math.round(
      rawData.slice(i * bucketSize, (i + 1) * bucketSize).reduce((sum, d) => sum + d.value, 0) / bucketSize
    )
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#888";
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 190);
    ctx.lineTo(390, 190);
    ctx.stroke();

    const minVal = Math.min(...barData);
    const maxVal = Math.max(...barData);
    const barWidth = 340 / barData.length;

    for (let i = 0; i < barData.length; i++) {
      const x = 45 + i * barWidth;
      const y = 180 - ((barData[i] - minVal) / (maxVal - minVal)) * 160;
      const height = 180 - y;

      ctx.fillStyle = "#0ff";
      ctx.fillRect(x, y, barWidth - 1, height);
      ctx.strokeStyle = "#333";
      ctx.strokeRect(x, y, barWidth - 1, height);
    }
  }, [barData]);

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Bar Chart</h3>
      <canvas ref={canvasRef} width={420} height={210} style={{ background: "#181818", display: "block" }} />
    </div>
  );
}
