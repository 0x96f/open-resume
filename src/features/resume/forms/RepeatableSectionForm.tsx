"use client";

import { Form, FormSection } from "components/ResumeForm/Form";
import {
  Input,
  BulletListTextarea,
} from "components/ResumeForm/Form/InputGroup";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import type { RepeatableSectionConfig } from "@/features/resume/forms/section-configs";
import {
  selectShowBulletPoints,
  useAppStore,
  type FormWithBulletPoints,
  type ListSectionForm,
} from "@/features/resume/state/store";
import type { ShowForm } from "@/features/resume/state/types";

const FORMS_WITH_BULLET_TOGGLE = new Set<ShowForm>(["educations", "projects"]);

export function RepeatableSectionForm<T extends ListSectionForm>({
  config,
}: {
  config: RepeatableSectionConfig<T>;
}) {
  const items = useAppStore((state) => state.resume[config.form]);
  const updateListItem = useAppStore((state) => state.updateListItem);
  const changeShowBulletPoints = useAppStore(
    (state) => state.changeShowBulletPoints,
  );
  const hasBulletToggle = FORMS_WITH_BULLET_TOGGLE.has(config.form);
  const showBulletPoints = useAppStore(
    hasBulletToggle
      ? selectShowBulletPoints(config.form as FormWithBulletPoints)
      : () => true,
  );
  const showDelete = items.length > 1;

  return (
    <Form form={config.form} addButtonText={config.addButtonText}>
      {items.map((item, idx) => {
        const showMoveUp = idx !== 0;
        const showMoveDown = idx !== items.length - 1;

        return (
          <FormSection
            key={idx}
            form={config.form}
            idx={idx}
            showMoveUp={showMoveUp}
            showMoveDown={showMoveDown}
            showDelete={showDelete}
            deleteButtonTooltipText={config.deleteButtonTooltipText}
          >
            {config.fields.map((field) => {
              const value = item[field.name as keyof typeof item];

              if (field.type === "bullet-list") {
                return (
                  <div key={field.name} className="relative col-span-full">
                    <BulletListTextarea
                      label={field.label}
                      labelClassName={field.labelClassName}
                      name={field.name}
                      placeholder={field.placeholder}
                      value={value as string[]}
                      onChange={(_, nextValue) =>
                        updateListItem(
                          config.form,
                          idx,
                          field.name as never,
                          nextValue,
                        )
                      }
                      showBulletPoints={showBulletPoints}
                    />
                    {hasBulletToggle && (
                      <div className="absolute left-[15.6rem] top-[0.07rem]">
                        <BulletListIconButton
                          showBulletPoints={showBulletPoints}
                          onClick={(next) =>
                            changeShowBulletPoints(
                              config.form as FormWithBulletPoints,
                              next,
                            )
                          }
                        />
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Input
                  key={field.name}
                  label={field.label}
                  labelClassName={field.labelClassName}
                  name={field.name}
                  placeholder={field.placeholder}
                  value={value as string}
                  onChange={(_, nextValue) =>
                    updateListItem(
                      config.form,
                      idx,
                      field.name as never,
                      nextValue,
                    )
                  }
                />
              );
            })}
          </FormSection>
        );
      })}
    </Form>
  );
}
