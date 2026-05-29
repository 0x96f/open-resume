"use client";

import { useState } from "react";
import { LockClosedIcon } from "@heroicons/react/24/solid";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  parsePersistedStateFromJson,
  saveStateToLocalStorage,
} from "@/features/resume/state/store";
import { useRouter } from "next/navigation";
import addPdfSrc from "public/assets/add-pdf.svg";
import Image from "next/image";
import { cn } from "@/lib/utils";

const defaultFileState = {
  name: "",
  size: 0,
  fileUrl: "",
};

const isJsonFile = (fileName: string) =>
  fileName.toLowerCase().endsWith(".json");

export const ResumeDropzone = ({
  onFileUrlChange,
  className,
}: {
  onFileUrlChange: (fileUrl: string) => void;
  className?: string;
}) => {
  const [file, setFile] = useState(defaultFileState);
  const [isHoveredOnDropzone, setIsHoveredOnDropzone] = useState(false);
  const [hasUnsupportedFile, setHasUnsupportedFile] = useState(false);
  const [hasInvalidJsonFile, setHasInvalidJsonFile] = useState(false);
  const router = useRouter();

  const hasFile = Boolean(file.name);

  const setNewFile = (newFile: File) => {
    if (file.fileUrl) {
      URL.revokeObjectURL(file.fileUrl);
    }

    if (!isJsonFile(newFile.name)) {
      setHasUnsupportedFile(true);
      setHasInvalidJsonFile(false);
      return;
    }

    setHasUnsupportedFile(false);
    setHasInvalidJsonFile(false);
    const { name, size } = newFile;
    const fileUrl = URL.createObjectURL(newFile);
    setFile({ name, size, fileUrl });
    onFileUrlChange(fileUrl);
  };

  const onDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFile = event.dataTransfer.files[0];
    setNewFile(newFile);
    setIsHoveredOnDropzone(false);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    setNewFile(files[0]);
  };

  const onRemove = () => {
    setFile(defaultFileState);
    setHasUnsupportedFile(false);
    setHasInvalidJsonFile(false);
    onFileUrlChange("");
  };

  const onImportClick = async () => {
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

  return (
    <div
      className={cn(
        "flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-12",
        isHoveredOnDropzone && "border-[color:var(--theme-primary)]",
        className,
      )}
      onDragOver={(event) => {
        event.preventDefault();
        setIsHoveredOnDropzone(true);
      }}
      onDragLeave={() => setIsHoveredOnDropzone(false)}
      onDrop={onDrop}
    >
      <div className="space-y-3 text-center">
        <Image
          src={addPdfSrc}
          className="mx-auto h-14 w-14"
          alt="Add file"
          aria-hidden="true"
          priority
        />
        {!hasFile ? (
          <>
            <p className="pt-3 text-lg font-semibold text-gray-700">
              Browse a json file or drop it here
            </p>
            <p className="flex justify-center text-sm text-gray-500">
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
              className="rounded-md p-1 text-gray-400 outline-none hover:bg-gray-100 hover:text-gray-500 focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary)]"
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
              <label className="within-outline-theme-purple btn-primary cursor-pointer rounded-full px-6 pb-2.5 pt-2 font-semibold shadow-sm">
                Browse file
                <input
                  type="file"
                  className="sr-only"
                  accept=".json"
                  onChange={onInputChange}
                />
              </label>
              {hasUnsupportedFile && (
                <p className="mt-6 text-red-400">
                  Only json files are supported
                </p>
              )}
            </>
          ) : (
            <>
              <button
                type="button"
                className="btn-primary"
                onClick={onImportClick}
              >
                Import and Continue <span aria-hidden="true">→</span>
              </button>
              {hasInvalidJsonFile && (
                <p className="mt-6 text-red-400">
                  Invalid JSON file. Use a file exported from OpenResume.
                </p>
              )}
              <p className="mt-6 text-gray-500">
                Note: JSON import restores your saved resume and settings
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
  }
  return fileSizeMB.toPrecision(3) + " MB";
};
