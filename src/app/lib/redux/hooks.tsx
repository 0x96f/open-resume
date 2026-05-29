import { useEffect } from "react";
import {
  useDispatch,
  useSelector,
  type TypedUseSelectorHook,
} from "react-redux";
import { store, type RootState, type AppDispatch } from "lib/redux/store";
import {
  clearPersistedState,
  loadStateFromLocalStorage,
  saveStateToLocalStorage,
} from "lib/redux/local-storage";
import { initialResumeState, setResume } from "lib/redux/resumeSlice";
import {
  initialSettings,
  setSettings,
  type Settings,
} from "lib/redux/settingsSlice";
import { deepMerge } from "lib/deep-merge";
import type { Resume } from "lib/redux/types";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

function scheduleIdleWork(callback: () => void): number {
  if (typeof window !== "undefined" && "requestIdleCallback" in window) {
    return window.requestIdleCallback(callback, { timeout: 2000 });
  }
  return setTimeout(callback, 500) as unknown as number;
}

function cancelIdleWork(id: number) {
  if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
    window.cancelIdleCallback(id);
  } else {
    clearTimeout(id);
  }
}

/**
 * Hook to save store to local storage on store change
 */
export const useSaveStateToLocalStorageOnChange = () => {
  useEffect(() => {
    let idleCallbackId: number | undefined;

    const unsubscribe = store.subscribe(() => {
      if (idleCallbackId !== undefined) {
        cancelIdleWork(idleCallbackId);
      }

      idleCallbackId = scheduleIdleWork(() => {
        saveStateToLocalStorage(store.getState());
        idleCallbackId = undefined;
      });
    });

    return () => {
      unsubscribe();
      if (idleCallbackId !== undefined) {
        cancelIdleWork(idleCallbackId);
      }
    };
  }, []);
};

export const resetAppState = () => {
  clearPersistedState();
  store.dispatch(setResume(initialResumeState));
  store.dispatch(setSettings(initialSettings));
};

export const useSetInitialStore = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const state = loadStateFromLocalStorage();
    if (!state) return;
    if (state.resume) {
      // We merge the initial state with the stored state to ensure
      // backward compatibility, since new fields might be added to
      // the initial state over time.
      const mergedResumeState = deepMerge(
        initialResumeState,
        state.resume
      ) as Resume;
      dispatch(setResume(mergedResumeState));
    }
    if (state.settings) {
      const mergedSettingsState = deepMerge(
        initialSettings,
        state.settings
      ) as Settings;
      dispatch(setSettings(mergedSettingsState));
    }
  }, [dispatch]);
};
