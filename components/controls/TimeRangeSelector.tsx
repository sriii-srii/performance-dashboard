"use client";
import React from "react";

export default function TimeRangeSelector({
  windowSize,
  setWindowSize,
}: {
  windowSize: number;
  setWindowSize: (n: number) => void;
}) {
  return (
    <div style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #555", borderRadius: "8px" }}>
      <label htmlFor="time-range-selector">
        <strong>Points Shown: </strong>
      </label>
      <input
        id="time-range-selector"
        type="range"
        min={100}
        max={1000}
        step={50}
        value={windowSize}
        onChange={e => setWindowSize(Number(e.target.value))}
        style={{ width: "220px", verticalAlign: "middle" }}
        title="Number of data points shown"
      />
      <span style={{ marginLeft: "1rem" }}>{windowSize}</span>
    </div>
  );
}
