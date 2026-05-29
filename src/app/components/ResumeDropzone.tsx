import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { parseResumeFromPdf } from "lib/parse-resume-from-pdf";
import {
  getHasUsedAppBefore,
  parsePersistedStateFromJson,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { type ShowForm, initialSettings } from "lib/redux/settingsSlice";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cx } from "lib/cx";
import { deepClone } from "lib/deep-clone";

type FileType = "pdf" | "json";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
  type: null as FileType | null,
};

const getFileType = (fileName: string): FileType | null => {
  const lowerName = fileName.toLowerCase();
  if (lowerName.endsWith(".pdf")) return "pdf";
  if (lowerName.endsWith(".json")) return "json";
  return null;
};

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
  playgroundView = false,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
  playgroundView?: boolean;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasUnsupportedFile, setHasUnsupportedFile] = useState(false);
  const [hasInvalidJsonFile, setHasInvalidJsonFile] = useState(false);
  const router = useRouter();

  const hasFile = Boolean(file.name);
  const acceptsJson = !playgroundView;

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    const fileType = getFileType(newFile.name);
    if (!fileType || (fileType === "json" && !acceptsJson)) {
      setHasUnsupportedFile(true);
      setHasInvalidJsonFile(false);
      return;
    }

    setHasUnsupportedFile(false);
    setHasInvalidJsonFile(false);
    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl, type: fileType });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    setNewFile(newFile);
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newFile = files[0];
    setNewFile(newFile);
  };

  const onRemove = () => {
    setFile(defaultFileState);
    setHasUnsupportedFile(false);
    setHasInvalidJsonFile(false);
    onFileUrlChange("");
  };

  const onImportPdfClick = async () => {
    const resume = await parseResumeFromPdf(file.fileUrl);
    const settings = deepClone(initialSettings);

    // Set formToShow settings based on uploaded resume if users have used the app before
    if (getHasUsedAppBefore()) {
      const sections = Object.keys(settings.formToShow) as ShowForm[];
      const sectionToFormToShow: Record<ShowForm, boolean> = {
        workExperiences: resume.workExperiences.length > 0,
        educations: resume.educations.length > 0,
        projects: resume.projects.length > 0,
        skills: resume.skills.descriptions.length > 0,
        custom: resume.custom.descriptions.length > 0,
      };
      for (const section of sections) {
        settings.formToShow[section] = sectionToFormToShow[section];
      }
    }

    saveStateToLocalStorage({ resume, settings });
    router.push("/resume-builder");
  };

  const onImportJsonClick = async () => {
    try {
      const response = await fetch(file.fileUrl);
      const parsedJson: unknown = await response.json();
      const persistedState = parsePersistedStateFromJson(parsedJson);

      if (!persistedState) {
        setHasInvalidJsonFile(true);
        return;
      }

      saveStateToLocalStorage(persistedState);
      router.push("/resume-builder");
    } catch {
      setHasInvalidJsonFile(true);
    }
  };

  const onImportClick = async () => {
    if (file.type === "json") {
      await onImportJsonClick();
    } else {
      await onImportPdfClick();
    }
  };

  return (
    <div
      className={cx(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 ",
        isHoveredOnDropzone && "border-sky-400",
        playgroundView ? "pb-6 pt-4" : "py-12",
        className
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div
        className={cx(
          "text-center",
          playgroundView ? "space-y-2" : "space-y-3"
        )}
      >
        {!playgroundView && (
          <Image
            src={addPdfSrc}
            className="mx-auto h-14 w-14"
            alt="Add pdf"
            aria-hidden="true"
            priority
          />
        )}
        {!hasFile ? (
          <>
            <p
              className={cx(
                "pt-3 text-gray-700",
                !playgroundView && "text-lg font-semibold"
              )}
            >
              {acceptsJson
                ? "Browse a pdf or json file or drop it here"
                : "Browse a pdf file or drop it here"}
            </p>
            <p className="flex text-sm text-gray-500">
              <LockClosedIcon className="mr-1 mt-1 h-3 w-3 text-gray-400" />
              File data is used locally and never leaves your browser
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-3 pt-3">
            <div className="pl-7 font-semibold text-gray-900">
              {file.name} - {getFileSizeString(file.size)}
            </div>
            <button
              type="button"
              className="outline-theme-blue rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              title="Remove file"
              onClick={onRemove}
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        )}
        <div className="pt-4">
          {!hasFile ? (
            <>
              <label
                className={cx(
                  "within-outline-theme-purple cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm",
                  playgroundView ? "border" : "bg-primary"
                )}
              >
                Browse file
                <input
                  type="file"
                  className="sr-only"
                  accept={acceptsJson ? ".pdf,.json" : ".pdf"}
                  onChange={onInputChange}
                />
              </label>
              {hasUnsupportedFile && (
                <p className="mt-6 text-red-400">
                  {acceptsJson
                    ? "Only pdf and json files are supported"
                    : "Only pdf file is supported"}
                </p>
              )}
            </>
          ) : (
            <>
              {!playgroundView && (
                <button
                  type="button"
                  className="btn-primary"
                  onClick={onImportClick}
                >
                  Import and Continue <span aria-hidden="true">→</span>
                </button>
              )}
              {hasInvalidJsonFile && (
                <p className="mt-6 text-red-400">
                  Invalid JSON file. Use a file exported from OpenResume.
                </p>
              )}
              <p className={cx(" text-gray-500", !playgroundView && "mt-6")}>
                {file.type === "json" ? (
                  <>Note: JSON import restores your saved resume and settings</>
                ) : (
                  <>
                    Note: {!playgroundView ? "Import" : "Parser"} works best on
                    single column resume
                  </>
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const getFileSizeString = (fileSizeB: number) => {
  const fileSizeKB = fileSizeB / 1024;
  const fileSizeMB = fileSizeKB / 1024;
  if (fileSizeKB < 1000) {
    return fileSizeKB.toPrecision(3) + " KB";
  } else {
    return fileSizeMB.toPrecision(3) + " MB";
  }
};
