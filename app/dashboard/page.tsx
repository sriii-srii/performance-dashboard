import ClientDashboard from "./client-dashboard";

export default async function DashboardPage() {
  // Get the correct base URL depending on environment
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/data`, { cache: "no-store" });
  const initialData = await res.json();

  return (
    <ClientDashboard initialData={initialData} />
  );
}
