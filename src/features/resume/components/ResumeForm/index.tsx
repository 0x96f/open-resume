"use client";

import { useState, type ReactElement } from "react";
import { ProfileForm } from "components/ResumeForm/ProfileForm";
import { SkillsForm } from "components/ResumeForm/SkillsForm";
import { ThemeForm } from "components/ResumeForm/ThemeForm";
import { CustomForm } from "components/ResumeForm/CustomForm";
import { FlexboxSpacer } from "components/FlexboxSpacer";
import { RepeatableSectionForm } from "@/features/resume/forms/RepeatableSectionForm";
import {
  educationConfig,
  projectConfig,
  workExperienceConfig,
} from "@/features/resume/forms/section-configs";
import { selectFormsOrder, useAppStore } from "@/features/resume/state/store";
import type { ShowForm } from "@/features/resume/state/types";
import { cn } from "@/lib/utils";

const formTypeToComponent: { [type in ShowForm]: () => ReactElement } = {
  workExperiences: () => (
    <RepeatableSectionForm config={workExperienceConfig} />
  ),
  educations: () => <RepeatableSectionForm config={educationConfig} />,
  projects: () => <RepeatableSectionForm config={projectConfig} />,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  const formsOrder = useAppStore(selectFormsOrder);
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cn(
        "flex justify-center scrollbar-thin scrollbar-track-gray-100 md:h-[calc(100vh-var(--top-nav-bar-height))] md:justify-end md:overflow-y-scroll",
        isHover ? "scrollbar-thumb-gray-200" : "scrollbar-thumb-gray-100",
      )}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section className="flex max-w-2xl flex-col gap-8 p-[var(--resume-padding)]">
        <ProfileForm />
        {formsOrder.map((form) => {
          const Component = formTypeToComponent[form];
          return <Component key={form} />;
        })}
        <ThemeForm />
      </section>
      <FlexboxSpacer maxWidth={50} className="hidden md:block" />
    </div>
  );
};
