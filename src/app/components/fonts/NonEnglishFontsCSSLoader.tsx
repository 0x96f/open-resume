import dynamic from "next/dynamic";
import { getAllFontFamiliesToLoad } from "components/fonts/lib";

const FontsZhCSR = dynamic(() => import("components/fonts/FontsZh"), {
  ssr: false,
});

/**
 * Empty component to lazy load non-english fonts CSS conditionally
 *
 * Reference: https://prawira.medium.com/react-conditional-import-conditional-css-import-110cc58e0da6
 */
export const NonEnglishFontsCSSLazyLoader = () => {
  const shouldLoadFontsZh =
    getAllFontFamiliesToLoad().includes("NotoSansSC");

  return <>{shouldLoadFontsZh && <FontsZhCSR />}</>;
};
