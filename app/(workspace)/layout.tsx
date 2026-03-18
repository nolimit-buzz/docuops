import { Layout } from "@/components/Layout";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

export default function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  );
}
