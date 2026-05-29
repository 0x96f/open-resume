import { Link } from "components/documentation";

export const Footer = () => {
  return (
    <footer
      aria-label="Site Footer"
      className="border-t-2 border-gray-100 bg-dot px-3 py-8 text-center text-sm text-gray-600 lg:px-12"
    >
      <p>
        This project is a fork of{" "}
        <Link href="https://github.com/xitanggg/open-resume">open-resume</Link>{" "}
        by <Link href="https://github.com/xitanggg">Xitang Zhao</Link>.
      </p>
    </footer>
  );
};
