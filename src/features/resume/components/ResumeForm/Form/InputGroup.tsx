import { useAutosizeTextareaHeight } from "@/lib/hooks/useAutosizeTextareaHeight";

interface InputProps<K extends string, V extends string | string[]> {
  label: string;
  labelClassName?: string;
  name: K;
  value?: V;
  placeholder: string;
  onChange: (name: K, value: V) => void;
}

export const InputGroupWrapper = ({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children?: React.ReactNode;
}) => (
  <label className={`text-base font-medium text-gray-700 ${className}`}>
    {label}
    {children}
  </label>
);

export const INPUT_CLASS_NAME =
  "mt-1 px-3 py-2 block w-full rounded-md border border-gray-300 text-gray-900 shadow-sm outline-none font-normal text-base focus-visible:border-[color:var(--theme-primary)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[color:var(--theme-primary)]";

export const Input = <K extends string>({
  name,
  value = "",
  placeholder,
  onChange,
  label,
  labelClassName,
}: InputProps<K, string>) => (
  <InputGroupWrapper label={label} className={labelClassName}>
    <input
      type="text"
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(name, e.target.value)}
      className={INPUT_CLASS_NAME}
    />
  </InputGroupWrapper>
);

export const Textarea = <T extends string>({
  label,
  labelClassName: wrapperClassName,
  name,
  value = "",
  placeholder,
  onChange,
}: InputProps<T, string>) => {
  const textareaRef = useAutosizeTextareaHeight({ value });

  return (
    <InputGroupWrapper label={label} className={wrapperClassName}>
      <textarea
        ref={textareaRef}
        name={name}
        className={`${INPUT_CLASS_NAME} resize-none overflow-hidden`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
      />
    </InputGroupWrapper>
  );
};

export const BulletListTextarea = <T extends string>({
  label,
  labelClassName,
  name,
  value: bulletListStrings = [],
  placeholder,
  onChange,
  showBulletPoints = true,
}: InputProps<T, string[]> & { showBulletPoints?: boolean }) => {
  const textareaValue = getTextareaValueFromBulletListStrings(
    bulletListStrings,
    showBulletPoints,
  );

  return (
    <Textarea
      label={label}
      labelClassName={labelClassName}
      name={name}
      value={textareaValue}
      placeholder={placeholder}
      onChange={(fieldName, value) =>
        onChange(
          fieldName,
          getBulletListStringsFromTextareaValue(value, showBulletPoints),
        )
      }
    />
  );
};

const NORMALIZED_LINE_BREAK = "\n";
const normalizeLineBreak = (str: string) =>
  str.replace(/\r?\n/g, NORMALIZED_LINE_BREAK);

const getStringsByLineBreak = (str: string) => str.split(NORMALIZED_LINE_BREAK);

const getTextareaValueFromBulletListStrings = (
  bulletListStrings: string[],
  showBulletPoints: boolean,
) => {
  const prefix = showBulletPoints ? "• " : "";
  if (bulletListStrings.length === 0) return prefix;

  return bulletListStrings
    .map((string, index) => {
      const isLastItem = index === bulletListStrings.length - 1;
      return `${prefix}${string}${isLastItem ? "" : "\r\n"}`;
    })
    .join("");
};

const getBulletListStringsFromTextareaValue = (
  textareaValue: string,
  showBulletPoints: boolean,
) => {
  const strings = getStringsByLineBreak(normalizeLineBreak(textareaValue));

  if (!showBulletPoints) return strings;

  const nonEmptyStrings = strings.filter((s) => s !== "•");
  const newStrings: string[] = [];

  for (const string of nonEmptyStrings) {
    if (string.startsWith("• ")) {
      newStrings.push(string.slice(2));
    } else if (string.startsWith("•")) {
      const lastItemIdx = newStrings.length - 1;
      if (lastItemIdx >= 0) {
        newStrings[lastItemIdx] =
          `${newStrings[lastItemIdx]}${string.slice(1)}`;
      } else {
        newStrings.push(string.slice(1));
      }
    } else {
      newStrings.push(string);
    }
  }

  return newStrings;
};
