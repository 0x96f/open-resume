import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import {
  initialCustom,
  initialEducation,
  initialProfile,
  initialProject,
  initialResume,
  initialSettings,
  initialSkills,
  initialWorkExperience,
} from "@/features/resume/state/defaults";
import type {
  AppState,
  FormWithBulletPoints,
  GeneralSetting,
  ListSectionForm,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeWorkExperience,
  Settings,
  ShowForm,
} from "@/features/resume/state/types";

const LEGACY_STORAGE_KEY = "open-resume-state";
export const STORAGE_KEY = "open-resume-state:v1";

type ListSection = Resume[ListSectionForm][number];

const listInitials: Record<ListSectionForm, ListSection> = {
  workExperiences: initialWorkExperience,
  educations: initialEducation,
  projects: initialProject,
};

const clearSectionData: Record<ShowForm, () => Resume[ShowForm]> = {
  workExperiences: () => [structuredClone(initialWorkExperience)],
  educations: () => [structuredClone(initialEducation)],
  projects: () => [structuredClone(initialProject)],
  skills: () => structuredClone(initialSkills),
  custom: () => structuredClone(initialCustom),
};

export interface AppStore extends AppState {
  changeProfile: (field: keyof ResumeProfile, value: string) => void;
  updateListItem: <T extends ListSectionForm>(
    form: T,
    idx: number,
    field: keyof Resume[T][number],
    value: string | string[],
  ) => void;
  changeSkills: (
    update:
      | { field: "descriptions"; value: string[] }
      | { field: "featuredSkills"; idx: number; skill: string; rating: number },
  ) => void;
  changeCustom: (value: string[]) => void;
  addSectionInForm: (form: ListSectionForm) => void;
  moveSectionInForm: (
    form: ListSectionForm,
    idx: number,
    direction: "up" | "down",
  ) => void;
  deleteSectionInFormByIdx: (form: ListSectionForm, idx: number) => void;
  clearSectionInForm: (form: ShowForm) => void;
  changeSettings: (field: GeneralSetting, value: string) => void;
  changeShowForm: (field: ShowForm, value: boolean) => void;
  changeFormHeading: (field: ShowForm, value: string) => void;
  changeFormOrder: (form: ShowForm, type: "up" | "down") => void;
  changeShowBulletPoints: (field: FormWithBulletPoints, value: boolean) => void;
  setResume: (resume: Resume) => void;
  setSettings: (settings: Settings) => void;
  resetAppState: () => void;
}

function migrateLegacyStorage() {
  if (typeof window === "undefined") return;
  try {
    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, legacy);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  } catch {
    // Ignore storage errors in private browsing
  }
}

export const useAppStore = create<AppStore>()(
  persist(
    immer((set) => ({
      resume: structuredClone(initialResume),
      settings: structuredClone(initialSettings),

      changeProfile: (field, value) =>
        set((state) => {
          state.resume.profile[field] = value;
        }),

      updateListItem: (form, idx, field, value) =>
        set((state) => {
          const section = state.resume[form][idx] as Record<
            string,
            string | string[]
          >;
          section[field as string] = value;
        }),

      changeSkills: (update) =>
        set((state) => {
          if (update.field === "descriptions") {
            state.resume.skills.descriptions = update.value;
            return;
          }
          const featuredSkill =
            state.resume.skills.featuredSkills[update.idx];
          featuredSkill.skill = update.skill;
          featuredSkill.rating = update.rating;
        }),

      changeCustom: (value) =>
        set((state) => {
          state.resume.custom.descriptions = value;
        }),

      addSectionInForm: (form) =>
        set((state) => {
          state.resume[form].push(
            structuredClone(listInitials[form]) as never,
          );
        }),

      moveSectionInForm: (form, idx, direction) =>
        set((state) => {
          const list = state.resume[form];
          const targetIdx = direction === "up" ? idx - 1 : idx + 1;
          if (targetIdx < 0 || targetIdx >= list.length) return;
          [list[idx], list[targetIdx]] = [list[targetIdx], list[idx]];
        }),

      deleteSectionInFormByIdx: (form, idx) =>
        set((state) => {
          state.resume[form].splice(idx, 1);
        }),

      clearSectionInForm: (form) =>
        set((state) => {
          state.resume[form] = clearSectionData[form]() as never;
        }),

      changeSettings: (field, value) =>
        set((state) => {
          state.settings[field] = value;
        }),

      changeShowForm: (field, value) =>
        set((state) => {
          state.settings.formToShow[field] = value;
          if (!value) {
            state.resume[field] = clearSectionData[field]() as never;
          }
        }),

      changeFormHeading: (field, value) =>
        set((state) => {
          state.settings.formToHeading[field] = value;
        }),

      changeFormOrder: (form, type) =>
        set((state) => {
          const order = state.settings.formsOrder;
          const pos = order.indexOf(form);
          const newPos = type === "up" ? pos - 1 : pos + 1;
          if (newPos < 0 || newPos >= order.length) return;
          [order[pos], order[newPos]] = [order[newPos], order[pos]];
        }),

      changeShowBulletPoints: (field, value) =>
        set((state) => {
          state.settings.showBulletPoints[field] = value;
        }),

      setResume: (resume) =>
        set((state) => {
          state.resume = resume;
        }),

      setSettings: (settings) =>
        set((state) => {
          state.settings = settings;
        }),

      resetAppState: () =>
        set((state) => {
          state.resume = structuredClone(initialResume);
          state.settings = structuredClone(initialSettings);
        }),
    })),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        resume: state.resume,
        settings: state.settings,
      }),
      onRehydrateStorage: () => () => {
        migrateLegacyStorage();
      },
      version: 1,
    },
  ),
);

export const selectResume = (state: AppStore) => state.resume;
export const selectSettings = (state: AppStore) => state.settings;
export const selectProfile = (state: AppStore) => state.resume.profile;
export const selectWorkExperiences = (state: AppStore) =>
  state.resume.workExperiences;
export const selectEducations = (state: AppStore) => state.resume.educations;
export const selectProjects = (state: AppStore) => state.resume.projects;
export const selectSkills = (state: AppStore) => state.resume.skills;
export const selectCustom = (state: AppStore) => state.resume.custom;
export const selectFormsOrder = (state: AppStore) => state.settings.formsOrder;
export const selectThemeColor = (state: AppStore) => state.settings.themeColor;

export const selectShowByForm = (form: ShowForm) => (state: AppStore) =>
  state.settings.formToShow[form];

export const selectHeadingByForm = (form: ShowForm) => (state: AppStore) =>
  state.settings.formToHeading[form];

export const selectIsFirstForm = (form: ShowForm) => (state: AppStore) =>
  state.settings.formsOrder[0] === form;

export const selectIsLastForm = (form: ShowForm) => (state: AppStore) =>
  state.settings.formsOrder[state.settings.formsOrder.length - 1] === form;

export const selectShowBulletPoints =
  (form: FormWithBulletPoints) => (state: AppStore) =>
    state.settings.showBulletPoints[form];

export function resetAppState() {
  useAppStore.getState().resetAppState();
  useAppStore.persist.clearStorage();
}

export function getHasUsedAppBefore() {
  migrateLegacyStorage();
  if (typeof window === "undefined") return false;
  return Boolean(
    localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY),
  );
}

export type PersistedState = Pick<AppState, "resume" | "settings">;

export function saveStateToLocalStorage(state: PersistedState) {
  useAppStore.setState(state);
}

export function loadStateFromLocalStorage(): PersistedState | undefined {
  const state = useAppStore.getState();
  return { resume: state.resume, settings: state.settings };
}

export { parsePersistedStateFromJson } from "@/lib/schemas/resume";

export function downloadPersistedStateAsJson(
  fileName: string,
  fallback?: PersistedState,
) {
  const state = fallback ?? loadStateFromLocalStorage();
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
}

// Backward-compatible exports used across the app
export const initialResumeState = initialResume;
export { initialSettings, DEFAULT_THEME_COLOR, DEFAULT_FONT_COLOR } from "@/features/resume/state/defaults";
export type {
  Resume,
  ResumeProfile,
  ResumeWorkExperience,
  ResumeEducation,
  ResumeProject,
  ResumeSkills,
  ResumeCustom,
  Settings,
  ShowForm,
  FormWithBulletPoints,
  GeneralSetting,
  ListSectionForm,
} from "@/features/resume/state/types";
