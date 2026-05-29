import { Form } from "components/ResumeForm/Form";
import {
  BulletListTextarea,
  InputGroupWrapper,
} from "components/ResumeForm/Form/InputGroup";
import { FeaturedSkillInput } from "components/ResumeForm/Form/FeaturedSkillInput";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import {
  selectShowBulletPoints,
  selectSkills,
  selectThemeColor,
  useAppStore,
} from "@/features/resume/state/store";

export const SkillsForm = () => {
  const skills = useAppStore(selectSkills);
  const changeSkills = useAppStore((state) => state.changeSkills);
  const changeShowBulletPoints = useAppStore(
    (state) => state.changeShowBulletPoints,
  );
  const showBulletPoints = useAppStore(selectShowBulletPoints("skills"));
  const themeColor = useAppStore(selectThemeColor);
  const { featuredSkills, descriptions } = skills;
  const form = "skills";

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Skills List"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="List your skills"
            value={descriptions}
            onChange={(_, value) => changeSkills({ field: "descriptions", value })}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[4.5rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={(value) => changeShowBulletPoints(form, value)}
            />
          </div>
        </div>
        <div className="col-span-full mb-4 mt-6 border-t-2 border-dotted border-gray-200" />
        <InputGroupWrapper
          label="Featured Skills (Optional)"
          className="col-span-full"
        >
          <p className="mt-2 text-sm font-normal text-gray-600">
            Featured skills is optional to highlight top skills, with more
            circles mean higher proficiency.
          </p>
        </InputGroupWrapper>

        {featuredSkills.map(({ skill, rating }, idx) => (
          <FeaturedSkillInput
            key={idx}
            className="col-span-3"
            skill={skill}
            rating={rating}
            setSkillRating={(newSkill, newRating) => {
              changeSkills({
                field: "featuredSkills",
                idx,
                skill: newSkill,
                rating: newRating,
              });
            }}
            placeholder="Skill name"
            circleColor={themeColor}
          />
        ))}
      </div>
    </Form>
  );
};
