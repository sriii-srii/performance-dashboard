export type DataPoint = {
  timestamp: number;
  value: number;
};

// Generates an array of starting data points
export function generateInitialDataset(length: number = 10000): DataPoint[] {
  const start = Date.now();
  const arr: DataPoint[] = [];
  for (let i = 0; i < length; i++) {
    arr.push({
      timestamp: start + i * 100,
      value: Math.floor(Math.sin(i / 100) * 50 + 50 + Math.random() * 10),
    });
  }
  return arr;
}

// Generates an array of starting data points for the stream
export function generateData(length: number = 10000): DataPoint[] {
  const start = Date.now();
  const arr: DataPoint[] = [];
  for (let i = 0; i < length; i++) {
    arr.push({
      timestamp: start + i * 100,
      value: Math.floor(Math.sin(i / 100) * 50 + 50 + Math.random() * 10),
    });
  }
  return arr;
}

// Generates the next datapoint based on the previous (streaming)
export function generateNextData(prev: DataPoint): DataPoint {
  return {
    timestamp: prev.timestamp + 100,
    value: Math.floor(Math.sin((prev.timestamp + 100) / 1000) * 50 + 50 + Math.random() * 10),
  };
}
