"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { sessionHelper } from "@/lib/session";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = sessionHelper.getAccessToken();

    if (!token) {
      router.replace("/");
      return;
    }

    setIsReady(true);
  }, [router]);

  if (!isReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
