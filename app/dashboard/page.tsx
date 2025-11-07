import ClientDashboard from "./client-dashboard";

export default async function DashboardPage() {
  // Use the Vercel-provided URL for both local and production
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/data`, { cache: "no-store" });
  const initialData = await res.json();

  return (
    <ClientDashboard initialData={initialData} />
  );
}