"use client";

import { useEffect } from "react";
import { useAppStore } from "@/features/resume/state/store";

export function BuilderStoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return children;
}
