import type { Resume, ResumeProfile, Settings } from "@/features/resume/state/types";

export const initialProfile: ResumeProfile = {
  name: "",
  summary: "",
  email: "",
  phone: "",
  url: "",
  location: "",
};

export const initialWorkExperience = {
  company: "",
  jobTitle: "",
  date: "",
  descriptions: [] as string[],
};

export const initialEducation = {
  school: "",
  degree: "",
  gpa: "",
  date: "",
  descriptions: [] as string[],
};

export const initialProject = {
  project: "",
  date: "",
  descriptions: [] as string[],
};

const initialFeaturedSkill = { skill: "", rating: 4 };
export const initialFeaturedSkills = Array.from({ length: 6 }, () => ({
  ...initialFeaturedSkill,
}));

export const initialSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [] as string[],
};

export const initialCustom = {
  descriptions: [] as string[],
};

export const initialResume: Resume = {
  profile: initialProfile,
  workExperiences: [{ ...initialWorkExperience }],
  educations: [{ ...initialEducation }],
  projects: [{ ...initialProject }],
  skills: structuredClone(initialSkills),
  custom: { ...initialCustom },
};

export const DEFAULT_THEME_COLOR = "#5d52d9";
export const DEFAULT_FONT_COLOR = "#171717";

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: "Roboto",
  fontSize: "11",
  documentSize: "Letter",
  formToShow: {
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    workExperiences: "WORK EXPERIENCE",
    educations: "EDUCATION",
    projects: "PROJECT",
    skills: "SKILLS",
    custom: "CUSTOM SECTION",
  },
  formsOrder: ["workExperiences", "educations", "projects", "skills", "custom"],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};
