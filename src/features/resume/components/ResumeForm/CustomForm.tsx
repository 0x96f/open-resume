import { Form } from "components/ResumeForm/Form";
import { BulletListIconButton } from "components/ResumeForm/Form/IconButton";
import { BulletListTextarea } from "components/ResumeForm/Form/InputGroup";
import {
  selectCustom,
  selectShowBulletPoints,
  useAppStore,
} from "@/features/resume/state/store";

export const CustomForm = () => {
  const custom = useAppStore(selectCustom);
  const changeCustom = useAppStore((state) => state.changeCustom);
  const changeShowBulletPoints = useAppStore(
    (state) => state.changeShowBulletPoints,
  );
  const showBulletPoints = useAppStore(selectShowBulletPoints("custom"));
  const { descriptions } = custom;
  const form = "custom";

  return (
    <Form form={form}>
      <div className="col-span-full grid grid-cols-6 gap-3">
        <div className="relative col-span-full">
          <BulletListTextarea
            label="Custom Textbox"
            labelClassName="col-span-full"
            name="descriptions"
            placeholder="Enter custom content"
            value={descriptions}
            onChange={(_, value) => changeCustom(value)}
            showBulletPoints={showBulletPoints}
          />
          <div className="absolute left-[7.7rem] top-[0.07rem]">
            <BulletListIconButton
              showBulletPoints={showBulletPoints}
              onClick={(value) => changeShowBulletPoints(form, value)}
            />
          </div>
        </div>
      </div>
    </Form>
  );
};
