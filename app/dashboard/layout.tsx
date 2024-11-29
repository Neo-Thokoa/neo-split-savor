export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Temporarily bypass auth check for development
  return <>{children}</>;
}