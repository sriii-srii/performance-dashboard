"use client";

import { useEffect, useRef, useState } from "react";
import { DataPoint, generateNextData, generateData } from "../lib/dataGenerator";

export function useDataStream(initialCount: number = 500) {
  const [data, setData] = useState<DataPoint[]>(() => generateData(initialCount));
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    timer.current = setInterval(() => {
      setData(prev => {
        const next = generateNextData(prev[prev.length - 1]);
        const arr = [...prev.slice(1), next];
        return arr;
      });
    }, 100);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return data;
}
