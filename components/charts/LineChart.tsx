"use client";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { useDataStream } from "../../hooks/useDataStream";
import type { DataPoint } from "../../lib/dataGenerator";
import Tooltip from "./Tooltip";

type FilterType = "all" | "high" | "low";

export default function LineChart({
  filter = "all",
  windowSize = 500,
  windowStart = 0,
  groupBy = "raw",
}: {
  filter?: FilterType;
  windowSize?: number;
  windowStart?: number;
  groupBy?: "raw" | "1min" | "5min" | "1hr";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; content: string } | null>(null);

  // Data stream
  const allData: DataPoint[] = useDataStream(10000);

  // Windowed data slice
  const baseWindow = useMemo(
    () => allData.slice(windowStart, windowStart + (windowSize ?? 500)),
    [allData, windowStart, windowSize]
  );

  // Group aggregated data
  const groupedData = useMemo(() => {
    if (groupBy === "raw") return baseWindow;
    const groupSizes = { "1min": 10, "5min": 50, "1hr": 200 };
    const groupSize = groupSizes[groupBy];
    const result: DataPoint[] = [];
    for (let i = 0; i < baseWindow.length; i += groupSize) {
      const group = baseWindow.slice(i, i + groupSize);
      if (!group.length) continue;
      result.push({
        timestamp: group[0].timestamp,
        value: Math.round(group.reduce((sum, d) => sum + d.value, 0) / group.length),
      });
    }
    return result;
  }, [baseWindow, groupBy]);

  // Apply filter
  const data = useMemo(() => {
    if (!groupedData.length) return groupedData;
    if (filter === "high") {
      const maxVal = Math.max(...groupedData.map((d) => d.value));
      return groupedData.filter((d) => d.value > maxVal - 10);
    }
    if (filter === "low") {
      const minVal = Math.min(...groupedData.map((d) => d.value));
      return groupedData.filter((d) => d.value < minVal + 10);
    }
    return groupedData;
  }, [groupedData, filter]);

  // Drawing logic with canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Axes
    ctx.strokeStyle = "#888";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, H - 20);
    ctx.lineTo(W - 30, H - 20);
    ctx.stroke();

    if (!data.length) return;

    const values = data.map((d) => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const span = maxVal - minVal || 1;

    const plotY = (val: number) => (H - 30) - ((val - minVal) / span) * (H - 50);
    const plotX = (i: number) => {
      const n = Math.max(1, data.length - 1);
      return 45 + (i / n) * (W - 85);
    };

    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let i = 0; i < data.length; i++) {
      const x = plotX(i);
      const y = plotY(data[i].value);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }, [data]);

  // Tooltip handlers
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Find nearest data point by x position
    const n = Math.max(1, data.length - 1);
    const pointIndex = Math.round(((mouseX - 45) / (rect.width - 85)) * n);
    if (pointIndex >= 0 && pointIndex < data.length) {
      setHoveredPoint({
        x: mouseX + 10,
        y: mouseY + 10,
        content: `Value: ${data[pointIndex].value}`,
      });
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => setHoveredPoint(null);

  return (
    <div style={{ border: "1px solid #333", padding: "1rem", marginBottom: "1rem", position: "relative" }}>
      <h3 style={{ marginBottom: 8 }}>
        Line Chart{" "}
        <small style={{ color: "#888" }}>
          (filter: {filter}, window: {windowStart}–{windowStart + (windowSize ?? 0)}, group: {groupBy})
        </small>
      </h3>
      <canvas
        ref={canvasRef}
        width={420}
        height={210}
        style={{ background: "#181818", display: "block", width: "100%", maxWidth: 540 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {hoveredPoint && (
        <Tooltip x={hoveredPoint.x} y={hoveredPoint.y} content={hoveredPoint.content} visible={true} />
      )}
    </div>
  );
}
