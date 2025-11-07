"use client";

import React, { useEffect, useRef } from "react";
import { useDataStream } from "../../hooks/useDataStream";
import { DataPoint } from "../../lib/dataGenerator";

export default function ScatterPlot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data: DataPoint[] = useDataStream(250);

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

    const minVal = Math.min(...data.map(d => d.value));
    const maxVal = Math.max(...data.map(d => d.value));
    const plotY = (val: number) => 180 - ((val - minVal) / (maxVal - minVal)) * 160;
    const plotX = (i: number) => 45 + (i / (data.length - 1)) * 340;

    ctx.fillStyle = "#0ff";
    for (let i = 0; i < data.length; i++) {
      const x = plotX(i);
      const y = plotY(data[i].value);
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }
  }, [data]);

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Scatter Plot</h3>
      <canvas ref={canvasRef} width={420} height={210} style={{ background: "#181818", display: "block" }} />
    </div>
  );
}
