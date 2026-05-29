"use client";
import { useState, useSyncExternalStore } from "react";
import { getHasUsedAppBefore } from "lib/redux/local-storage";
import { resetAppState } from "lib/redux/hooks";
import { ResumeDropzone } from "components/ResumeDropzone";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ImportResume() {
  const hasUsedAppBefore = useSyncExternalStore(
    () => () => {},
    getHasUsedAppBefore,
    () => false
  );
  const [hasAddedResume, setHasAddedResume] = useState(false);
  const router = useRouter();
  const onFileUrlChange = (fileUrl: string) => {
    setHasAddedResume(Boolean(fileUrl));
  };

  const handleStartOver = () => {
    resetAppState();
    router.push("/resume-builder");
  };

  return (
    <main>
      <div className="mx-auto mt-14 max-w-3xl rounded-md border border-gray-200 px-10 py-10 text-center shadow-md">
        {!hasUsedAppBefore ? (
          <>
            <h1 className="text-lg font-semibold text-gray-900">
              Import data from an existing resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
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
              Override data with a new resume
            </h1>
            <ResumeDropzone
              onFileUrlChange={onFileUrlChange}
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
    <div className="flex-grow border-t border-gray-200" />
    <span className="mx-2 mt-[-2px] flex-shrink text-lg text-gray-400">or</span>
    <div className="flex-grow border-t border-gray-200" />
  </div>
);

const primaryButtonClassName =
  "outline-theme-blue rounded-full bg-sky-500 px-6 pb-2 pt-1.5 text-base font-semibold text-white";
const secondaryButtonClassName =
  "outline-theme-blue rounded-full border border-gray-300 bg-white px-6 pb-2 pt-1.5 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-50";

const SectionWithHeadingAndCreateButton = ({
  heading,
  buttonText,
}: {
  heading: string;
  buttonText: string;
}) => {
  return (
    <SectionWithHeadingAndActions
      heading={heading}
      primaryButtonText={buttonText}
      primaryHref="/resume-builder"
    />
  );
};

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
}) => {
  return (
    <>
      <p className="font-semibold text-gray-900">{heading}</p>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
        <Link href={primaryHref} className={primaryButtonClassName}>
          {primaryButtonText}
        </Link>
        {secondaryButtonText && onSecondaryClick && (
          <button
            type="button"
            className={secondaryButtonClassName}
            onClick={onSecondaryClick}
          >
            {secondaryButtonText}
          </button>
        )}
      </div>
    </>
  );
};
