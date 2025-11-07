import { NextResponse } from "next/server";
import { generateInitialDataset } from "../../../lib/dataGenerator";

export async function GET() {
  const initialData = generateInitialDataset(10000);
  return NextResponse.json(initialData);
}
