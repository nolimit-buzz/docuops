import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { DocumentEditor } from "@/views/DocumentEditor";

export default function DocumentEditorPage() {
  return (
    <ProtectedRoute>
      <DocumentEditor />
    </ProtectedRoute>
  );
}
