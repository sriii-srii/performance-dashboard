import React, { ReactNode } from "react";

interface DataProviderProps {
  initialData: any[];  // type as needed
  children: ReactNode;
}

export default function DataProvider({ initialData, children }: DataProviderProps) {
  // We just pass the data down via React context or props
  // For simplicity, just render children for now

  return <>{children}</>;
}
