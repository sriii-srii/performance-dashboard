"use client";

import React, { useEffect, useRef } from "react";
import { useDataStream } from "../../hooks/useDataStream";
import { DataPoint } from "../../lib/dataGenerator";

const GRID_COLS = 20;
const GRID_ROWS = 8;

export default function Heatmap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const data: DataPoint[] = useDataStream(GRID_COLS * GRID_ROWS);
  const grid = Array.from({ length: GRID_ROWS }, (_, row) =>
    data.slice(row * GRID_COLS, (row + 1) * GRID_COLS)
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const flatVals = data.map(d => d.value);
    const minVal = Math.min(...flatVals);
    const maxVal = Math.max(...flatVals);

    const cellW = 340 / GRID_COLS;
    const cellH = 160 / GRID_ROWS;

    ctx.strokeStyle = "#888";
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, 190);
    ctx.lineTo(390, 190);
    ctx.stroke();

    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const val = grid[row][col].value;
        const ratio = (val - minVal) / (maxVal - minVal);
        ctx.fillStyle = `rgb(${50 + ratio * 100},${200 + ratio * 55},${255})`;
        ctx.fillRect(45 + col * cellW, 20 + row * cellH, cellW - 2, cellH - 2);
      }
    }
  }, [data]);

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem" }}>
      <h3>Heatmap</h3>
      <canvas ref={canvasRef} width={420} height={210} style={{ background: "#181818", display: "block" }} />
    </div>
  );
}
