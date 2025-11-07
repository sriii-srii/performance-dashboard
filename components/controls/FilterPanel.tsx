"use client";
import React from "react";

type FilterType = "all" | "high" | "low";

export default function FilterPanel({
  filter,
  setFilter,
}: {
  filter: FilterType;
  setFilter: (f: FilterType) => void;
}) {
  return (
    <div style={{ marginBottom: "1rem", padding: "0.5rem", border: "1px solid #555", borderRadius: "8px" }}>
      <label>
        <strong>Filter: </strong>
        <select value={filter} onChange={(e) => setFilter(e.target.value as FilterType)}>
          <option value="all">All</option>
          <option value="high">High Only</option>
          <option value="low">Low Only</option>
        </select>
      </label>
    </div>
  );
}
