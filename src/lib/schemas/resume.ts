import { z } from "zod";
import {
  initialResume,
  initialSettings,
} from "@/features/resume/state/defaults";

const profileSchema = z.object({
  name: z.string().default(""),
  email: z.string().default(""),
  phone: z.string().default(""),
  url: z.string().default(""),
  summary: z.string().default(""),
  location: z.string().default(""),
});

const workExperienceSchema = z.object({
  company: z.string().default(""),
  jobTitle: z.string().default(""),
  date: z.string().default(""),
  descriptions: z.array(z.string()).default([]),
});

const educationSchema = z.object({
  school: z.string().default(""),
  degree: z.string().default(""),
  gpa: z.string().default(""),
  date: z.string().default(""),
  descriptions: z.array(z.string()).default([]),
});

const projectSchema = z.object({
  project: z.string().default(""),
  date: z.string().default(""),
  descriptions: z.array(z.string()).default([]),
});

const featuredSkillSchema = z.object({
  skill: z.string().default(""),
  rating: z.number().min(1).max(5).default(4),
});

const skillsSchema = z.object({
  featuredSkills: z.array(featuredSkillSchema).default([]),
  descriptions: z.array(z.string()).default([]),
});

const descriptionsSectionSchema = z.object({
  descriptions: z.array(z.string()).default([]),
});

export const resumeSchema = z.object({
  profile: profileSchema.default(initialResume.profile),
  workExperiences: z
    .array(workExperienceSchema)
    .min(1)
    .default(initialResume.workExperiences),
  educations: z.array(educationSchema).min(1).default(initialResume.educations),
  projects: z.array(projectSchema).min(1).default(initialResume.projects),
  skills: skillsSchema.default(initialResume.skills),
  custom: descriptionsSectionSchema.default(initialResume.custom),
});

const showFormSchema = z.enum([
  "workExperiences",
  "educations",
  "projects",
  "skills",
  "custom",
]);

export const settingsSchema = z.object({
  themeColor: z.string().default(initialSettings.themeColor),
  fontFamily: z.string().default(initialSettings.fontFamily),
  fontSize: z.string().default(initialSettings.fontSize),
  documentSize: z.string().default(initialSettings.documentSize),
  formToShow: z
    .object({
      workExperiences: z.boolean().default(true),
      educations: z.boolean().default(true),
      projects: z.boolean().default(true),
      skills: z.boolean().default(true),
      custom: z.boolean().default(false),
    })
    .default(initialSettings.formToShow),
  formToHeading: z
    .object({
      workExperiences: z.string().default("WORK EXPERIENCE"),
      educations: z.string().default("EDUCATION"),
      projects: z.string().default("PROJECT"),
      skills: z.string().default("SKILLS"),
      custom: z.string().default("CUSTOM SECTION"),
    })
    .default(initialSettings.formToHeading),
  formsOrder: z.array(showFormSchema).default(initialSettings.formsOrder),
  showBulletPoints: z
    .object({
      educations: z.boolean().default(true),
      projects: z.boolean().default(true),
      skills: z.boolean().default(true),
      custom: z.boolean().default(true),
    })
    .default(initialSettings.showBulletPoints),
});

export const persistedStateSchema = z.object({
  resume: resumeSchema.optional(),
  settings: settingsSchema.optional(),
});

export function parsePersistedStateFromJson(value: unknown) {
  const result = persistedStateSchema.safeParse(value);
  if (!result.success) return null;

  const { resume, settings } = result.data;
  if (!resume && !settings) return null;

  return {
    resume: resumeSchema.parse(resume ?? initialResume),
    settings: settingsSchema.parse(settings ?? initialSettings),
  };
}
