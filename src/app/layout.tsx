import "globals.css";
import { Footer } from "components/Footer";
import { TopNavBar } from "components/TopNavBar";

export const metadata = {
  title: "OpenResume - Free Open-source Resume Builder",
  description:
    "OpenResume is a free, open-source, and powerful resume builder that allows anyone to create a modern professional resume in 3 simple steps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TopNavBar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
