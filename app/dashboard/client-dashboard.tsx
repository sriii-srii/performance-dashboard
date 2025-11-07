"use client";
import { useState } from "react";
import LineChart from "../../components/charts/LineChart";
import BarChart from "../../components/charts/BarChart";
import ScatterPlot from "../../components/charts/ScatterPlot";
import Heatmap from "../../components/charts/Heatmap";
import PerformanceMonitor from "../../components/PerformanceMonitor";
import FilterPanel from "../../components/controls/FilterPanel";
import TimeRangeSelector from "../../components/controls/TimeRangeSelector";
import DataTable from "../../components/ui/DataTableNoSSR";
import { useDataStream } from "../../hooks/useDataStream";
import type { DataPoint } from "../../lib/dataGenerator";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import LoadingFallback from "../../components/ui/LoadingFallback";
import React, { Suspense } from "react";

export default function ClientDashboard({ initialData }: { initialData: DataPoint[] }) {
  const [stress, setStress] = useState(false);
  const [pointCount, setPointCount] = useState(10000);

  const handleStressToggle = () => {
    setStress((prev) => {
      const next = !prev;
      setPointCount(next ? 50000 : 10000);
      return next;
    });
  };

  const [useLiveStream, setUseLiveStream] = useState(true);
  const liveData = useDataStream(pointCount);

  const [filter, setFilter] = useState<"all" | "high" | "low">("all");
  const [windowSize, setWindowSize] = useState<number>(500);
  const [windowStart, setWindowStart] = useState<number>(0);
  const [groupBy, setGroupBy] = useState<"raw" | "1min" | "5min" | "1hr">("raw");

  const zoomIn = () => setWindowSize(w => Math.max(100, w - 100));
  const zoomOut = () => setWindowSize(w => Math.min(1000, w + 100));

  const allData = useLiveStream ? liveData : initialData.slice(0, pointCount);

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingFallback />}>
        <main style={{ padding: "2rem" }}>
          <h1>Performance Dashboard</h1>
          <PerformanceMonitor />
          {/* Stress Mode Button */}
          <div style={{ margin: "1rem 0" }}>
            <button
              onClick={handleStressToggle}
              aria-label="Toggle stress mode on or off"
              style={{
                padding: "0.5rem 1.2rem",
                borderRadius: "7px",
                border: stress ? "2px solid #f22" : "2px solid #0ff",
                background: "#1a1a1a",
                color: stress ? "#f22" : "#0ff",
                fontWeight: "bold",
                fontSize: "1rem",
                boxShadow: "0 2px 6px #222"
              }}
            >
              {stress ? "Disable Stress Mode (10k points)" : "Enable Stress Mode (50k points)"}
            </button>
            <span style={{ marginLeft: 12, color: "#ccc" }}>
              Points: <strong>{pointCount}</strong>
            </span>
          </div>
          <button
            style={{ marginBottom: "1rem", fontSize: "1rem" }}
            onClick={() => setUseLiveStream((old) => !old)}
            aria-label="Toggle live streaming data on or off"
          >
            Toggle: {useLiveStream ? "Streaming (Live)" : "SSR (Static)"} Data
          </button>
          <FilterPanel filter={filter} setFilter={setFilter} />
          <TimeRangeSelector windowSize={windowSize} setWindowSize={setWindowSize} />
          <div style={{ marginBottom: "1rem" }}>
            <button onClick={zoomIn} aria-label="Zoom in on chart" style={{ marginRight: "0.5rem" }}>Zoom In</button>
            <button onClick={zoomOut} aria-label="Zoom out on chart">Zoom Out</button>
          </div>
          <button onClick={() => setWindowStart(ws => Math.max(0, ws - 50))} aria-label="Pan chart left" style={{ marginRight: "0.5rem" }}>Pan Left</button>
          <button onClick={() => setWindowStart(ws => ws + 50)} aria-label="Pan chart right">Pan Right</button>
          <div style={{ marginBottom: "1rem" }}>
            <label htmlFor="groupBySelect">
              <strong>Group By: </strong>
            </label>
            <select
              id="groupBySelect"
              value={groupBy}
              onChange={e => setGroupBy(e.target.value as "raw" | "1min" | "5min" | "1hr")}
              aria-label="Group data by time period"
            >
              <option value="raw">Raw</option>
              <option value="1min">1min</option>
              <option value="5min">5min</option>
              <option value="1hr">1hr</option>
            </select>
          </div>
          <LineChart filter={filter} windowSize={windowSize} windowStart={windowStart} groupBy={groupBy} />
          <BarChart />
          <ScatterPlot />
          <Heatmap />
          <div style={{ marginTop: 32, marginBottom: 16 }}>
            <DataTable data={allData} height={320} rowHeight={32} />
          </div>
        </main>
      </Suspense>
    </ErrorBoundary>
  );
}
