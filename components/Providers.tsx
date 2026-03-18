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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <StoreHydrator />
      {children}
    </>
  );
}
