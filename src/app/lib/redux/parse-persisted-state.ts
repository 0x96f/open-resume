import { initialResumeState } from "lib/redux/resumeSlice";
import {
  initialSettings,
  type Settings,
  type ShowForm,
} from "lib/redux/settingsSlice";
import type { RootState } from "lib/redux/store";

type PersistedState = Pick<RootState, "resume" | "settings">;
import type {
  FeaturedSkill,
  Resume,
  ResumeCustom,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from "lib/redux/types";

const SHOW_FORMS: readonly ShowForm[] = [
  "workExperiences",
  "educations",
  "projects",
  "skills",
  "custom",
];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const parseString = (value: unknown, fallback = ""): string =>
  typeof value === "string" ? value : fallback;

const parseBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

const parseStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
};

const parseRating = (value: unknown, fallback: number): number => {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(5, Math.max(1, Math.round(value)));
};

const parseDescriptionsSection = (
  value: unknown,
  fallback: { descriptions: string[] }
): { descriptions: string[] } => {
  if (!isRecord(value)) return fallback;
  return { descriptions: parseStringArray(value.descriptions) };
};

const parseProfile = (
  value: unknown,
  fallback: ResumeProfile
): ResumeProfile => {
  if (!isRecord(value)) return fallback;
  return {
    name: parseString(value.name, fallback.name),
    email: parseString(value.email, fallback.email),
    phone: parseString(value.phone, fallback.phone),
    url: parseString(value.url, fallback.url),
    summary: parseString(value.summary, fallback.summary),
    location: parseString(value.location, fallback.location),
  };
};

const parseWorkExperience = (
  value: unknown,
  fallback: ResumeWorkExperience
): ResumeWorkExperience => {
  if (!isRecord(value)) return fallback;
  return {
    company: parseString(value.company, fallback.company),
    jobTitle: parseString(value.jobTitle, fallback.jobTitle),
    date: parseString(value.date, fallback.date),
    descriptions: parseStringArray(value.descriptions),
  };
};

const parseEducation = (
  value: unknown,
  fallback: ResumeEducation
): ResumeEducation => {
  if (!isRecord(value)) return fallback;
  return {
    school: parseString(value.school, fallback.school),
    degree: parseString(value.degree, fallback.degree),
    gpa: parseString(value.gpa, fallback.gpa),
    date: parseString(value.date, fallback.date),
    descriptions: parseStringArray(value.descriptions),
  };
};

const parseProject = (
  value: unknown,
  fallback: ResumeProject
): ResumeProject => {
  if (!isRecord(value)) return fallback;
  return {
    project: parseString(value.project, fallback.project),
    date: parseString(value.date, fallback.date),
    descriptions: parseStringArray(value.descriptions),
  };
};

const parseFeaturedSkill = (
  value: unknown,
  fallback: FeaturedSkill
): FeaturedSkill => {
  if (!isRecord(value)) return fallback;
  return {
    skill: parseString(value.skill, fallback.skill),
    rating: parseRating(value.rating, fallback.rating),
  };
};

const parseSkills = (value: unknown, fallback: ResumeSkills): ResumeSkills => {
  if (!isRecord(value)) return fallback;

  const featuredSkills = Array.isArray(value.featuredSkills)
    ? value.featuredSkills.map((item, index) =>
        parseFeaturedSkill(item, fallback.featuredSkills[index] ?? fallback.featuredSkills[0])
      )
    : fallback.featuredSkills;

  return {
    featuredSkills,
    descriptions: parseStringArray(value.descriptions),
  };
};

const parseObjectArray = <T>(
  value: unknown,
  fallbackItem: T,
  parseItem: (item: unknown, fallback: T) => T
): T[] => {
  if (!Array.isArray(value)) return [fallbackItem];
  const parsed = value.map((item) => parseItem(item, fallbackItem));
  return parsed.length > 0 ? parsed : [fallbackItem];
};

const parseResume = (value: unknown): Resume => {
  if (!isRecord(value)) return initialResumeState;

  return {
    profile: parseProfile(value.profile, initialResumeState.profile),
    workExperiences: parseObjectArray(
      value.workExperiences,
      initialResumeState.workExperiences[0],
      parseWorkExperience
    ),
    educations: parseObjectArray(
      value.educations,
      initialResumeState.educations[0],
      parseEducation
    ),
    projects: parseObjectArray(
      value.projects,
      initialResumeState.projects[0],
      parseProject
    ),
    skills: parseSkills(value.skills, initialResumeState.skills),
    custom: parseDescriptionsSection(value.custom, initialResumeState.custom),
  };
};

const parseBooleanRecord = <K extends string>(
  value: unknown,
  keys: readonly K[],
  fallback: Record<K, boolean>
): Record<K, boolean> => {
  if (!isRecord(value)) return fallback;

  const result = { ...fallback };
  for (const key of keys) {
    result[key] = parseBoolean(value[key], fallback[key]);
  }
  return result;
};

const parseStringRecord = <K extends string>(
  value: unknown,
  keys: readonly K[],
  fallback: Record<K, string>
): Record<K, string> => {
  if (!isRecord(value)) return fallback;

  const result = { ...fallback };
  for (const key of keys) {
    result[key] = parseString(value[key], fallback[key]);
  }
  return result;
};

const parseFormsOrder = (value: unknown, fallback: ShowForm[]): ShowForm[] => {
  if (!Array.isArray(value)) return fallback;

  const parsed = value.filter(
    (item): item is ShowForm =>
      typeof item === "string" && SHOW_FORMS.includes(item as ShowForm)
  );

  const unique = parsed.filter(
    (form, index) => parsed.indexOf(form) === index
  );

  const missing = SHOW_FORMS.filter((form) => !unique.includes(form));
  return unique.length > 0 ? [...unique, ...missing] : fallback;
};

const parseSettings = (value: unknown): Settings => {
  if (!isRecord(value)) return initialSettings;

  return {
    themeColor: parseString(value.themeColor, initialSettings.themeColor),
    fontFamily: parseString(value.fontFamily, initialSettings.fontFamily),
    fontSize: parseString(value.fontSize, initialSettings.fontSize),
    documentSize: parseString(
      value.documentSize,
      initialSettings.documentSize
    ),
    formToShow: parseBooleanRecord(
      value.formToShow,
      SHOW_FORMS,
      initialSettings.formToShow
    ),
    formToHeading: parseStringRecord(
      value.formToHeading,
      SHOW_FORMS,
      initialSettings.formToHeading
    ),
    formsOrder: parseFormsOrder(value.formsOrder, initialSettings.formsOrder),
    showBulletPoints: parseBooleanRecord(
      value.showBulletPoints,
      ["educations", "projects", "skills", "custom"],
      initialSettings.showBulletPoints
    ),
  };
};

export const parsePersistedStateFromJson = (
  value: unknown
): PersistedState | null => {
  if (!isRecord(value)) return null;

  const hasResume = "resume" in value;
  const hasSettings = "settings" in value;
  if (!hasResume && !hasSettings) return null;

  return {
    resume: hasResume ? parseResume(value.resume) : initialResumeState,
    settings: hasSettings ? parseSettings(value.settings) : initialSettings,
  };
};
