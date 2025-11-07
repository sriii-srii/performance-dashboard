"use client";
import React, { useRef, useState, useMemo } from "react";
import type { DataPoint } from "../../lib/dataGenerator";

type Props = {
  data: DataPoint[];
  height?: number; // px
  rowHeight?: number; // px
};

export default React.memo(function DataTable({
  data,
  height = 300,
  rowHeight = 32,
}: Props) {
  const [scrollTop, setScrollTop] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  const visibleCount = Math.ceil(height / rowHeight) + 2;
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
  const endIdx = Math.min(data.length, startIdx + visibleCount);

  const items = useMemo(() => {
    const arr = [];
    for (let i = startIdx; i < endIdx; i++) {
      arr.push(
        <div
          key={i}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: i * rowHeight,
            height: rowHeight,
            borderBottom: "1px solid #222",
            background: i % 2 ? "#191c1f" : "#131618",
            color: "#fff",
            display: "flex",
            alignItems: "center",
            fontSize: 15,
            paddingLeft: 16,
          }}
        >
          <span style={{ minWidth: 180 }}>
            {String(data[i]?.timestamp ?? "-")}
          </span>
          <span style={{ marginLeft: 48, minWidth: 60 }}>{data[i]?.value}</span>
        </div>
      );
    }
    return arr;
  }, [startIdx, endIdx, data, rowHeight]);

  return (
    <div className="virtual-table">
      <div style={{ fontWeight: "bold", color: "#0ff", margin: "0 0 4px 4px" }}>
        Virtualized Table (showing {data.length} rows, scroll me!)
      </div>
      <div
        ref={ref}
        tabIndex={0}
        style={{
          width: "100%",
          maxWidth: 500,
          height,
          overflow: "auto",
          border: "1px solid #444",
          borderRadius: 6,
          background: "#181818",
          position: "relative",
        }}
        onScroll={(e) => setScrollTop((e.target as HTMLDivElement).scrollTop)}
      >
        <div style={{ height: data.length * rowHeight, position: "relative" }}>
          {items}
        </div>
      </div>
      <div style={{ color: "#549", fontSize: 11, marginTop: 8 }}>
        Only {Math.min(visibleCount, data.length)} DOM rows rendered at a time!
      </div>
    </div>
  );
});
