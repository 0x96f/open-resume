import type {
  ListSectionForm,
  ResumeEducation,
  ResumeProject,
  ResumeWorkExperience,
} from "@/features/resume/state/types";

type FieldConfig = {
  name: string;
  label: string;
  placeholder: string;
  labelClassName: string;
  type?: "text" | "bullet-list";
};

export type RepeatableSectionConfig<T extends ListSectionForm> = {
  form: T;
  addButtonText: string;
  deleteButtonTooltipText: string;
  bulletListField?: keyof ResumeWorkExperience &
    keyof ResumeEducation &
    keyof ResumeProject;
  fields: FieldConfig[];
};

export const workExperienceConfig: RepeatableSectionConfig<"workExperiences"> = {
  form: "workExperiences",
  addButtonText: "Add Job",
  deleteButtonTooltipText: "Delete job",
  bulletListField: "descriptions",
  fields: [
    {
      name: "company",
      label: "Company",
      placeholder: "Company name",
      labelClassName: "col-span-full",
    },
    {
      name: "jobTitle",
      label: "Job Title",
      placeholder: "Job title",
      labelClassName: "col-span-4",
    },
    {
      name: "date",
      label: "Date",
      placeholder: "Start date - End date",
      labelClassName: "col-span-2",
    },
    {
      name: "descriptions",
      label: "Description",
      placeholder: "Responsibilities and achievements",
      labelClassName: "col-span-full",
      type: "bullet-list",
    },
  ],
};

export const educationConfig: RepeatableSectionConfig<"educations"> = {
  form: "educations",
  addButtonText: "Add School",
  deleteButtonTooltipText: "Delete school",
  bulletListField: "descriptions",
  fields: [
    {
      name: "school",
      label: "School",
      placeholder: "School name",
      labelClassName: "col-span-4",
    },
    {
      name: "date",
      label: "Date",
      placeholder: "Graduation date",
      labelClassName: "col-span-2",
    },
    {
      name: "degree",
      label: "Degree & Major",
      placeholder: "Degree and major",
      labelClassName: "col-span-4",
    },
    {
      name: "gpa",
      label: "GPA",
      placeholder: "GPA",
      labelClassName: "col-span-2",
    },
    {
      name: "descriptions",
      label: "Additional Information (Optional)",
      placeholder: "Activities, courses, awards, etc.",
      labelClassName: "col-span-full",
      type: "bullet-list",
    },
  ],
};

export const projectConfig: RepeatableSectionConfig<"projects"> = {
  form: "projects",
  addButtonText: "Add Project",
  deleteButtonTooltipText: "Delete project",
  bulletListField: "descriptions",
  fields: [
    {
      name: "project",
      label: "Project Name",
      placeholder: "Project name",
      labelClassName: "col-span-4",
    },
    {
      name: "date",
      label: "Date",
      placeholder: "Date",
      labelClassName: "col-span-2",
    },
    {
      name: "descriptions",
      label: "Description",
      placeholder: "Project description and contributions",
      labelClassName: "col-span-full",
      type: "bullet-list",
    },
  ],
};
