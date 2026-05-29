"use client";

import dynamic from "next/dynamic";
import { ResumeForm } from "components/ResumeForm";
import { cn } from "@/lib/utils";
import { useState } from "react";

const Resume = dynamic(
  () => import("components/Resume").then((mod) => mod.Resume),
  { ssr: false },
);

type BuilderView = "form" | "preview";

export default function ResumeBuilderPage() {
  const [mobileView, setMobileView] = useState<BuilderView>("form");

  return (
    <main className="relative h-full w-full overflow-hidden bg-gray-50">
      <div className="flex border-b border-gray-200 bg-white md:hidden">
        {(["form", "preview"] as const).map((view) => (
          <button
            key={view}
            type="button"
            className={cn(
              "flex-1 px-4 py-3 text-sm font-semibold capitalize",
              mobileView === view
                ? "border-b-2 border-[color:var(--theme-primary)] text-gray-900"
                : "text-gray-500",
            )}
            onClick={() => setMobileView(view)}
          >
            {view}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className={cn(mobileView === "preview" && "hidden md:block")}>
          <ResumeForm />
        </div>
        <div className={cn(mobileView === "form" && "hidden md:block")}>
          <Resume />
        </div>
      </div>
    </main>
  );
}
