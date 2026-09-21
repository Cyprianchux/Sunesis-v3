"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "../lib/storage";

export function WorkspaceGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter(); const [ready, setReady] = useState(false);
  useEffect(() => { if (!getCurrentUser()) router.replace("/"); else setReady(true); }, [router]);
  return ready ? children : <div className="grid min-h-[70vh] place-items-center text-sm font-bold text-maroon">Loading workspace...</div>;
}
