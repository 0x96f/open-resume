import { BaseForm } from "components/ResumeForm/Form";
import { InputGroupWrapper } from "components/ResumeForm/Form/InputGroup";
import { THEME_COLORS } from "components/ResumeForm/ThemeForm/constants";
import { InlineInput } from "components/ResumeForm/ThemeForm/InlineInput";
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from "components/ResumeForm/ThemeForm/Selection";
import {
  DEFAULT_THEME_COLOR,
  selectSettings,
  useAppStore,
} from "@/features/resume/state/store";
import type { GeneralSetting } from "@/features/resume/state/types";
import type { FontFamily } from "components/fonts/constants";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";

export const ThemeForm = () => {
  const settings = useAppStore(selectSettings);
  const changeSettings = useAppStore((state) => state.changeSettings);
  const { fontSize, fontFamily, documentSize } = settings;
  const themeColor = settings.themeColor || DEFAULT_THEME_COLOR;

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    changeSettings(field, value);
  };

  return (
    <BaseForm>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Cog6ToothIcon className="h-6 w-6 text-gray-600" aria-hidden="true" />
          <h1 className="text-lg font-semibold tracking-wide text-gray-900">
            Resume Settings
          </h1>
        </div>
        <div>
          <InlineInput
            label="Theme Color"
            name="themeColor"
            value={settings.themeColor}
            placeholder={DEFAULT_THEME_COLOR}
            onChange={handleSettingsChange}
            inputStyle={{ color: themeColor }}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {THEME_COLORS.map((color) => (
              <button
                type="button"
                key={color}
                aria-label={`Use theme color ${color}`}
                aria-pressed={settings.themeColor === color}
                className="flex h-10 w-10 items-center justify-center rounded-md text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--theme-primary)]"
                style={{ backgroundColor: color }}
                onClick={() => handleSettingsChange("themeColor", color)}
              >
                {settings.themeColor === color ? "✓" : ""}
              </button>
            ))}
          </div>
        </div>
        <div>
          <InputGroupWrapper label="Font Family" />
          <FontFamilySelectionsCSR
            selectedFontFamily={fontFamily}
            themeColor={themeColor}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InlineInput
            label="Font Size (pt)"
            name="fontSize"
            value={fontSize}
            placeholder="11"
            onChange={handleSettingsChange}
          />
          <FontSizeSelections
            fontFamily={fontFamily as FontFamily}
            themeColor={themeColor}
            selectedFontSize={fontSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
        <div>
          <InputGroupWrapper label="Document Size" />
          <DocumentSizeSelections
            themeColor={themeColor}
            selectedDocumentSize={documentSize}
            handleSettingsChange={handleSettingsChange}
          />
        </div>
      </div>
    </BaseForm>
  );
};
