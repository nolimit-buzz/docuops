"use client";

import { useEffect } from "react";
import { useStore } from "@/hooks/useStore";

function StoreHydrator() {
  const initFromSession = useStore((s) => s.initFromSession);

  useEffect(() => {
    initFromSession();
  }, [initFromSession]);

  return null;
}

function DocumentsHydrator() {
  const userId = useStore((s) => s.user.id);
  const loadDocuments = useStore((s) => s.loadDocuments);

  useEffect(() => {
    if (userId && userId !== 'u-1') {
      loadDocuments();
    }
  }, [userId, loadDocuments]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHydrator />
      <DocumentsHydrator />
      {children}
    </>
  );
}
