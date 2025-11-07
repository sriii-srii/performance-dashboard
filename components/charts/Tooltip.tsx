"use client";
import React from "react";

interface TooltipProps {
  x: number;
  y: number;
  content: string;
  visible: boolean;
}

export default function Tooltip({ x, y, content, visible }: TooltipProps) {
  const style: React.CSSProperties = {
    position: "absolute",
    left: x,
    top: y,
    padding: "4px 8px",
    background: "rgba(0,0,0,0.8)",
    color: "#0ff",
    fontSize: 12,
    pointerEvents: "none",
    borderRadius: 4,
    opacity: visible ? 1 : 0,
    transition: "opacity 0.2s ease-in-out",
    whiteSpace: "nowrap",
    zIndex: 1000,
  };

  return <div style={style}>{content}</div>;
}
