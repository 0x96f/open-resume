"use client";

import { useState, useSyncExternalStore } from "react";
import {
  getHasUsedAppBefore,
  resetAppState,
} from "@/features/resume/state/store";
import { ResumeDropzone } from "components/ResumeDropzone";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function ImportResume() {
  const hasUsedAppBefore = useSyncExternalStore(
    () => () => {},
    getHasUsedAppBefore,
    () => false,
  );
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const router = useRouter();

  const handleStartOver = () => {
    resetAppState();
    router.push("/resume-builder");
  };

  return (
    <main>
      <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 bg-[color:var(--color-surface)] px-10 py-10 text-center shadow-md">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              Import a saved OpenResume file
            </h1>
            <ResumeDropzone
              onFileUrlChange={(fileUrl) => setHasAddedResume(Boolean(fileUrl))}
              className="mt-5"
            />
            {!hasAddedResume && (
              <>
                <OrDivider />
                <SectionWithHeadingAndCreateButton
                  heading="Don't have a resume yet?"
                  buttonText="Create from scratch"
                />
              </>
            )}
          </>
        ) : (
          <>
            {!hasAddedResume && (
              <>
                <SectionWithHeadingAndActions
                  heading="You have data saved in browser from prior session"
                  primaryButtonText="Continue where I left off"
                  primaryHref="/resume-builder"
                  secondaryButtonText="Start over"
                  onSecondaryClick={handleStartOver}
                />
                <OrDivider />
              </>
            )}
            <h1 className="font-semibold text-gray-900">
              Override data with a new JSON file
            </h1>
            <ResumeDropzone
              onFileUrlChange={(fileUrl) => setHasAddedResume(Boolean(fileUrl))}
              className="mt-5"
            />
          </>
        )}
      </div>
    </main>
  );
}

const OrDivider = () => (
  <div className="mx-[-2.5rem] flex items-center pb-6 pt-8" aria-hidden="true">
    <div className="grow border-t border-gray-200" />
    <span className="mx-2 mt-[-2px] shrink text-lg text-gray-400">or</span>
    <div className="grow border-t border-gray-200" />
  </div>
);

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => (
  <SectionWithHeadingAndActions
    heading={heading}
    primaryButtonText={buttonText}
    primaryHref="/resume-builder"
  />
);

const SectionWithHeadingAndActions = ({
  heading,
  primaryButtonText,
  primaryHref,
  secondaryButtonText,
  onSecondaryClick,
}: {
  heading: string;
  primaryButtonText: string;
  primaryHref: string;
  secondaryButtonText?: string;
  onSecondaryClick?: () => void;
}) => (
  <>
    <p className="font-semibold text-gray-900">{heading}</p>
    <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
      <Button asChild>
        <Link href={primaryHref}>{primaryButtonText}</Link>
      </Button>
      {secondaryButtonText && onSecondaryClick && (
        <Button variant="secondary" onClick={onSecondaryClick}>
          {secondaryButtonText}
        </Button>
      )}
    </div>
  </>
);
