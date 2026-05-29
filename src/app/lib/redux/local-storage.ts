import type { RootState } from "lib/redux/store";

// Reference: https://dev.to/igorovic/simplest-way-to-persist-redux-state-to-localstorage-e67

const LEGACY_LOCAL_STORAGE_KEY = "open-resume-state";
const LOCAL_STORAGE_KEY = "open-resume-state:v1";

export type PersistedState = Pick<RootState, "resume" | "settings">;

let cachedState: PersistedState | null | undefined;

const readRawFromStorage = (key: string): PersistedState | null => {
  try {
    const stringifiedState = localStorage.getItem(key);
    if (!stringifiedState) return null;
    return JSON.parse(stringifiedState) as PersistedState;
  } catch {
    return null;
  }
};

const migrateLegacyState = (): PersistedState | null => {
  const legacyState = readRawFromStorage(LEGACY_LOCAL_STORAGE_KEY);
  if (!legacyState) return null;

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(legacyState));
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    // Ignore quota / private browsing errors during migration
  }

  return legacyState;
};

const loadPersistedState = (): PersistedState | null => {
  return readRawFromStorage(LOCAL_STORAGE_KEY) ?? migrateLegacyState();
};

if (typeof window !== "undefined") {
  window.addEventListener("storage", (event) => {
    if (
      event.key === LOCAL_STORAGE_KEY ||
      event.key === LEGACY_LOCAL_STORAGE_KEY
    ) {
      cachedState = undefined;
    }
  });
}

export const loadStateFromLocalStorage = (): PersistedState | undefined => {
  if (cachedState !== undefined) {
    return cachedState ?? undefined;
  }

  const state = loadPersistedState();
  cachedState = state;
  return state ?? undefined;
};

export const saveStateToLocalStorage = (state: RootState) => {
  const persistedState: PersistedState = {
    resume: state.resume,
    settings: state.settings,
  };

  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(persistedState));
    cachedState = persistedState;
  } catch {
    // Ignore
  }
};

export const getHasUsedAppBefore = () => Boolean(loadStateFromLocalStorage());

export const clearPersistedState = () => {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    localStorage.removeItem(LEGACY_LOCAL_STORAGE_KEY);
  } catch {
    // Ignore
  }
  cachedState = null;
};

export { parsePersistedStateFromJson } from "lib/redux/parse-persisted-state";

export const downloadPersistedStateAsJson = (
  fileName: string,
  fallback?: PersistedState
) => {
  const state = loadStateFromLocalStorage() ?? fallback;
  if (!state) return;

  const blob = new Blob([JSON.stringify(state, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName.endsWith(".json") ? fileName : `${fileName}.json`;
  link.click();
  URL.revokeObjectURL(url);
};
