export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // BottomNav is rendered inside each dashboard page to keep
  // it scoped within the max-w-md mobile-first container.
  return <>{children}</>;
}
