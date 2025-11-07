"use client";
import dynamic from "next/dynamic";

const DataTable = dynamic(() => import("./DataTable"), { ssr: false });

export default DataTable;
