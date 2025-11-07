// hooks/useVirtualization.ts

type VirtualizationParams = {
  dataLength: number;
  rowHeight?: number;
  containerHeight?: number;
  scrollTop?: number;
};

export function useVirtualization({
  dataLength,
  rowHeight = 32,
  containerHeight = 300,
  scrollTop = 0,
}: VirtualizationParams) {
  const visibleCount = Math.ceil(containerHeight / rowHeight) + 2;
  const startIdx = Math.max(0, Math.floor(scrollTop / rowHeight) - 1);
  const endIdx = Math.min(dataLength, startIdx + visibleCount);
  return { visibleCount, startIdx, endIdx };
}
