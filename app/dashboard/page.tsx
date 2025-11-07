import ClientDashboard from "./client-dashboard";

export default async function DashboardPage() {
  // Replace with your prod URL on deployment if needed
  const res = await fetch("http://localhost:3000/api/data", { cache: "no-store" });
  const initialData = await res.json();

  return (
    <ClientDashboard initialData={initialData} />
  );
}
